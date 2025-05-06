const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const startWeeklySummaryCron = require('./weeklySummaryJob'); // 

dotenv.config();

const transactionRoutes = require('./routes/transaction.route'); 

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    startWeeklySummaryCron(); 
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/', transactionRoutes);

app.use('/test', (req, res) => {
  res.json({ message: 'ML Server is working!' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
