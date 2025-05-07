from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd
import torch
from torch import nn
from transformers import BertTokenizer

# Define model class again to load from torch
class BERTRegressor(nn.Module):
    def __init__(self):
        super().__init__()
        from transformers import BertModel
        self.bert = BertModel.from_pretrained('bert-base-uncased')
        self.regressor = nn.Linear(self.bert.config.hidden_size, 1)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_output = outputs.last_hidden_state[:, 0, :]
        return self.regressor(cls_output).squeeze()


def create_app():
    app = Flask(__name__)

    # Paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    TAG_MODEL_PATH = os.path.join(BASE_DIR, "models", "random_forest_model.joblib")
    SCORE_MODEL_PATH = os.path.join(BASE_DIR, "models", "linear_regression_model.joblib")
    ENCODER_PATH = os.path.join(BASE_DIR, "utils", "label_encoder.joblib")
    TRANSFORMER_MODEL_PATH = os.path.join(BASE_DIR, "models", "transformer_model.pt")

    # Load sklearn models
    try:
        tag_model = joblib.load(TAG_MODEL_PATH)
        score_model = joblib.load(SCORE_MODEL_PATH)
        label_encoder = joblib.load(ENCODER_PATH)
    except FileNotFoundError as e:
        raise RuntimeError(f"Model or encoder not found: {e}")

    # Load transformer model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    import torch.serialization as torch_serialization
    torch_serialization.add_safe_globals({'BERTRegressor': BERTRegressor})

    reward_model = torch.load(TRANSFORMER_MODEL_PATH, map_location=device, weights_only=False)

    reward_model.to(device)
    reward_model.eval()

    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    @app.route('/')
    def home():
        return "Welcome to the Flask server!"

    @app.route('/predict', methods=['POST'])
    def predict():
        try:
            data = request.get_json()

            expected_fields = [
                'totalIncome', 'totalExpense', 'savings', 'noOfTransactions',
                'avgTransactionAmount', 'donatedAmount', 'foodSpend', 'educationSpend',
                'entertainmentSpend', 'luxurySpend', 'otherSpend', 'topCategory'
            ]

            if not all(field in data for field in expected_fields):
                return jsonify({"error": "Missing one or more required fields."}), 400

            input_df = pd.DataFrame([data])

            # Predict tag
            tag_pred_encoded = tag_model.predict(input_df)[0]
            tag_pred_label = label_encoder.inverse_transform([tag_pred_encoded])[0]

            # Predict credit score
            input_df_with_tag = input_df.copy()
            input_df_with_tag["tag"] = tag_pred_encoded
            credit_score_pred = score_model.predict(input_df_with_tag)[0]

            return jsonify({
                "predicted_tag": tag_pred_label,
                "predicted_credit_score": round(credit_score_pred, 2)
            })

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/reward', methods=['POST'])
    def reward():
        try:
            data = request.get_json()
            activity = data.get("activity")

            if not activity:
                return jsonify({"error": "Missing 'activity' in request body."}), 400

            tokens = tokenizer(activity, return_tensors="pt", padding=True, truncation=True)
            input_ids = tokens["input_ids"].to(device)
            attention_mask = tokens["attention_mask"].to(device)

            with torch.no_grad():
                reward_output = reward_model(input_ids=input_ids, attention_mask=attention_mask)
                predicted_reward = reward_output.item()

            return jsonify({
                "activity": activity,
                "predicted_reward": round(predicted_reward, 2)
            })

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app


if __name__ == '__main__':
    app = create_app()
    host = '0.0.0.0'
    port = int(os.environ.get('PORT', 5003))
    app.run(debug=True, host=host, port=port)
