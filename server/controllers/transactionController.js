const Transaction = require('../models/Transaction');

// Add Transaction
exports.addTransaction = async (req, res) => {
    const { name, category, amount, type, userId, email } = req.body;

    try {
        const transaction = new Transaction({
            user: userId,
            name,
            category,
            amount,
            type,
            email: email,
        });

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Get Transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ email: req.header('email') }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(404).json({ error: 'No Transactions Found' });
    }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { name, category, amount, type } = req.body;

    try {
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update fields
        transaction.name = name || transaction.name;
        transaction.category = category || transaction.category;
        transaction.amount = amount || transaction.amount;
        transaction.type = type || transaction.type;

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update transaction' });
    }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findByIdAndDelete(id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.log('err: '+err);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
};
