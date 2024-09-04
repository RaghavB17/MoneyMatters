import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Grid, FormControl, FormLabel, TextField, Select, MenuItem, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import { addTransaction } from '../redux/slices/transactionSlice'; // Import the addTransaction action

const categories = ["Salary", "EMI", "Investment", "Credit Cards", "Utilities", "Housing", "Travel", "Groceries", "Food", "Health", "Other Income"];

// Custom button styling with updated colors
const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'hsl(220, 33%, 100%)' : 'hsl(220, 33%, 0%)',
  color: theme.palette.mode === 'dark' ? 'hsl(220, 30%, 10%)' : 'hsl(210, 100%, 97%)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'hsl(220, 33%, 0%)' : 'hsl(220, 33%, 100%)',
    color: theme.palette.mode === 'dark' ? 'hsl(210, 100%, 97%)' : 'hsl(220, 30%, 10%)',
  },
}));

const TransactionForm = ({ location }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const themeMode = useSelector((state) => state.theme.mode);

  const user = useSelector((state) => state.user.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(addTransaction({ name, category, amount, type, userId: user.userId, email: user.email }));
    setLoading(false);
    setName('');
    setCategory('');
    setAmount('');
    setType('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
      }}
    >
      <Typography
        variant="h6"
        color={themeMode === 'light' ? 'hsl(220, 30%, 10%)' : 'hsl(210, 100%, 97%)'}
        gutterBottom
      >
        Add a new transaction
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel htmlFor="transactionName">Transaction Name</FormLabel>
            <TextField
              autoComplete="transactionName"
              name="transactionName"
              required
              id="transactionName"
              placeholder="Enter transaction name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel htmlFor="transactionType">Type</FormLabel>
            <Select
              labelId="Type-select-label"
              id="Type-simple-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel htmlFor="transactionCategory">Category</FormLabel>
            <Select
              labelId="Category-select-label"
              id="Category-simple-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="outlined"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel htmlFor="transactionAmount">Amount</FormLabel>
            <TextField
              name="Amount"
              required
              id="Amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              variant="outlined"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center" paddingTop="5px">
        <LoadingButton
            variant="outlined"
            type="submit"
            loading={loading} // Set the loading state for Verify OTP button
          >
            Add Transaction
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionForm;
