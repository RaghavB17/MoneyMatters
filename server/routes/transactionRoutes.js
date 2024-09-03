const express = require('express');
const router = express.Router();
const { 
  addTransaction, 
  getTransactions, 
  updateTransaction, 
  deleteTransaction 
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addTransaction);
router.get('/', authMiddleware, getTransactions);
router.put('/:id', authMiddleware, updateTransaction); // Update transaction route
router.delete('/:id', authMiddleware, deleteTransaction); // Delete transaction route

module.exports = router;
