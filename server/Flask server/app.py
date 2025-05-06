from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd

def create_app():
    app = Flask(__name__)

    # Define model and encoder paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, "models", "random_forest_model.joblib")
    ENCODER_PATH = os.path.join(BASE_DIR, "utils", "label_encoder.joblib")

    # Load model and label encoder once
    try:
        model = joblib.load(MODEL_PATH)
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
            pred_encoded = model.predict(input_df)[0]
            pred_label = label_encoder.inverse_transform([pred_encoded])[0]

            return jsonify({"predicted_tag": pred_label})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()

    host = '0.0.0.0'
    port = int(os.environ.get('PORT', 5003))

    app.run(debug=True, host=host, port=port)
