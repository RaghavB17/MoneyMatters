const categoryColors = {
  Housing: '#00bfa5',
  Travel: '#42a5f5',
  Food: '#00796b',
  Shopping: '#9c27b0',
  Groceries: '#303f9f',
  EMI: '#1a237e',
  'Credit Cards': '#f50057',
  Utilities: '#0288d1',
  Health: '#d500f9',
  Investment: '#512ea8',
};


export const getIncome = (transactions) =>
  transactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);

export const getExpenses = (transactions) =>
  transactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

export const getExpenseByCategory = (transactions) =>
  transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => {
      const existing = acc.find((item) => item.label === tx.category);
      if (existing) {
        existing.value += tx.amount;
      } else {
        acc.push({ id: acc.length, value: tx.amount, label: tx.category, color: categoryColors[tx.category] });
      }
      return acc;
    }, []);

export const getTransactionsByMonth = (transactions, type) =>
  transactions
    .filter((tx) => tx.type === type)
    .reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = acc[month] ? acc[month] + tx.amount : tx.amount;
      return acc;
    }, {});

export const getExpensesByCategoryAndMonth = (transactions) =>
  transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });

      // Initialize the category in the accumulator if not present
      if (!acc[tx.category]) {
        acc[tx.category] = {
          color: categoryColors[tx.category], // Assign color to the category
          data: {} // For storing expenses by month
        };
      }

      // Initialize the month for this category if not present
      if (!acc[tx.category].data[month]) {
        acc[tx.category].data[month] = 0;
      }

      // Add the amount to the appropriate month and category
      acc[tx.category].data[month] += tx.amount;
      return acc;
    }, {});

