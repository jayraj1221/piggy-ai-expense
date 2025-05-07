# 💸 Piggy AI

An AI-powered smart expense management system for kids, designed to teach financial literacy through behavior analysis and credit simulation.

---

## 🚀 Overview

**SmartSpend AI** helps parents track, assign, and analyze their children's spending behavior. Using machine learning, it classifies each child's financial habits based on weekly summaries into tags like:

- 🟢 Top Saver
- 🟡 Average Saver
- 🔴 Balanced
- 🔵 Big Spender
- ⚠️ Over Spender

---

## ✨ Features

- 👨‍👩‍👧‍👦 Parent & Child dashboards
- 💳 Assign pocket money to children
- 🧾 Track and categorize expenses
- 📊 Weekly behavioral analysis with ML
- 🔐 Secure authentication system
- 🧠 AI-driven credit scoring & tagging
- ⚙️ Microservices architecture

---

## 🧠 Machine Learning Models

The ML service uses the following models:

- **Linear Regression**: Predicts a simulated credit score based on weekly spending patterns.
- **Random Forest Classifier**: Tags user behavior (`Top Saver`, `Balanced`, etc.)

> Input: `weeklySummary` document  
> Output: `{ creditScore: Number, tag: String }`

Models are trained using realistic synthetic data representing children aged 10–18.

---

## 🛠️ Tech Stack

**Frontend**:
- React
- Tailwind CSS
- Context API

**Backend**:
- Node.js
- Express.js
- MongoDB
- JWT Auth

**ML Server**:
- Python
- Flask
- Scikit-learn
- Joblib

**Architecture**:
- Microservices
- REST APIs
- API Gateway pattern

---

## 📁 Project Structure
├── client/ # React frontend<br/>
├── server/<br/>
│ ├── Authentication Server/ # User auth logic<br/>
│ ├── ML Server/ # Transactions & summaries<br/>
│ ├── Flask server/ # ML model predictions<br/>
│ └── Gateway/ # API routing<br/>

## Steps to run this project on local machine
### 1. Clone the repository
```bash
git clone https://github.com/jayraj1221/piggy-ai-expense.git
cd piggy-ai-expense
```
### 2. Start Frontend
```bash
cd client
npm install
npm start
```
### 3. Start Authenthication Server
```bash
cd server/Authentication\ Server
npm install
node index.js
```
.env file <br/>
```bash
MONGO_URI=mongodb://localhost:27017/piggy-ai
JWT_SECRET=Piggy.ai-secret-key
PORT=5000
```
### 4. Start ML Server (Node.js)
```bash
cd server/ML\ Server
npm install
node index.js
```
.env file <br/>
```bash
MONGO_URI=mongodb://localhost:27017/piggy-ai
JWT_SECRET=Piggy.ai-secret-key
PORT=5002
```
### 5. Start Gateway Server
```bash
cd server/Gateway
npm install
node index.js
```
.env file <br/>
```bash
AUTH_SERVER=http://localhost:5000
ML_SERVER=http://localhost:5002
PORT=5001
```
### 6. Start Flask ML Model Server
```bash
cd server/Flask\ server
pip install -r requirements.txt
python app.py
```


