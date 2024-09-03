const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  category: { type: String, enum: ['Salary', 'EMI', 'Investment', 'Credit Cards', 'Utilities', 'Housing', 'Travel', 'Groceries', 'Food', 'Health', 'Other Income'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense'], required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);