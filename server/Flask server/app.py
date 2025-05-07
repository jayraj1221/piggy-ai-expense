from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd

def create_app():
    app = Flask(__name__)

    # Paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    TAG_MODEL_PATH = os.path.join(BASE_DIR, "models", "random_forest_model.joblib")
    SCORE_MODEL_PATH = os.path.join(BASE_DIR, "models", "linear_regression_model.joblib")
    ENCODER_PATH = os.path.join(BASE_DIR, "utils", "label_encoder.joblib")

    # Load models
    try:
        tag_model = joblib.load(TAG_MODEL_PATH)
        score_model = joblib.load(SCORE_MODEL_PATH)
        label_encoder = joblib.load(ENCODER_PATH)
    except FileNotFoundError as e:
        raise RuntimeError(f"Model or encoder not found: {e}")

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

            # Add predicted tag to input for credit score
            input_df_with_tag = input_df.copy()
            input_df_with_tag["tag"] = tag_pred_encoded

            # Predict credit score using updated input
            credit_score_pred = score_model.predict(input_df_with_tag)[0]
            
            print("Predicted tag:", tag_pred_label)
            print("Predicted credit score:", credit_score_pred)

            return jsonify({
                "predicted_tag": tag_pred_label,
                "predicted_credit_score": round(credit_score_pred, 2)
            })

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()

    host = '0.0.0.0'
    port = int(os.environ.get('PORT', 5003))

    app.run(debug=True, host=host, port=port)
