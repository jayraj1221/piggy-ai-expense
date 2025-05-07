# train_transformer.py
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset
from transformers import BertTokenizer, BertModel
from torch.optim import AdamW
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
import os

# Define constants
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "activity_reward_dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "transformer_model.pt")

# Load dataset
df = pd.read_csv(DATA_PATH)
sentences = df['activity'].tolist()
rewards = df['reward'].tolist()

train_texts, test_texts, train_labels, test_labels = train_test_split(sentences, rewards, test_size=0.2, random_state=42)

# Tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

class RewardDataset(Dataset):
    def __init__(self, texts, labels):
        self.encodings = tokenizer(texts, truncation=True, padding=True, return_tensors='pt')
        self.labels = torch.tensor(labels, dtype=torch.float32)

    def __getitem__(self, idx):
        return {
            'input_ids': self.encodings['input_ids'][idx],
            'attention_mask': self.encodings['attention_mask'][idx],
            'labels': self.labels[idx]
        }

    def __len__(self):
        return len(self.labels)

train_dataset = RewardDataset(train_texts, train_labels)
test_dataset = RewardDataset(test_texts, test_labels)

class BERTRegressor(nn.Module):
    def __init__(self):
        super().__init__()
        self.bert = BertModel.from_pretrained('bert-base-uncased')
        self.regressor = nn.Linear(self.bert.config.hidden_size, 1)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_output = outputs.last_hidden_state[:, 0, :]
        return self.regressor(cls_output).squeeze()

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = BERTRegressor().to(device)

train_loader = DataLoader(train_dataset, batch_size=4, shuffle=True)
optimizer = AdamW(model.parameters(), lr=2e-5)
loss_fn = nn.MSELoss()

# Training loop
model.train()
for epoch in range(5):
    total_loss = 0
    for batch in train_loader:
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels'].to(device)

        optimizer.zero_grad()
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        loss = loss_fn(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(f"Epoch {epoch+1}: Loss = {total_loss / len(train_loader):.4f}")

# Save model
torch.save(model, MODEL_PATH)

print("✅ Model saved successfully.")
