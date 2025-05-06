import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "random_forest_model.joblib")
ENCODER_PATH = os.path.join(BASE_DIR, "utils", "label_encoder.joblib")

df = pd.read_csv(DATA_PATH)

df = df.drop(columns=["childId", "weekStart", "creditScore"], errors='ignore')

X = df.drop(columns=["tag"])
y = df["tag"]

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

numerical_features = X.select_dtypes(include=[np.number]).columns.tolist()
categorical_features = ["topCategory"]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(random_state=42))
])

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")


joblib.dump(pipeline, MODEL_PATH)
joblib.dump(label_encoder, ENCODER_PATH)
