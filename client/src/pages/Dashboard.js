import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { Typography, Card as MuiCard, Stack, createTheme, ThemeProvider, Grid } from '@mui/material';
import { styled } from '@mui/system';
import getSignInTheme from '../components/sign-in/theme/getSignInTheme';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch from react-redux
import { fetchTransactions, addTransaction } from '../redux/slices/transactionSlice'; // Import the fetchTransactions thunk

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '100%', // Adjusted to take full width of the Grid item
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const DashboardContainer = styled(Stack)(({ theme }) => ({
  height: 'auto',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('sm')]: {
    height: '100dvh',
  },
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const themeMode = useSelector((state) => state.theme.mode); // Get the theme mode from Redux store
  const transactions = useSelector((state) => state.transactions.transactions); // Get transactions from Redux store
  const loading = useSelector((state) => state.transactions.loading); // Loading state for transactions
  const user = useSelector((state) => state.user.user); // Get user information from Redux store

  useEffect(() => {
    if (user && (user.userId || user.id) && user.email) {
      dispatch(fetchTransactions({ userId: user.userId ?? user.id, email: user.email }));
    } else {
      // If user data is missing, navigate to login page
      navigate('/signin');
    }
  }, [dispatch, user, navigate]);

  const handleAddTransaction = (transaction) => {
    dispatch(addTransaction(transaction)); // Add new transaction to Redux state
  };

  const SignInTheme = createTheme(getSignInTheme(themeMode)); // Use Redux state for theme mode

  return (
    <ThemeProvider theme={SignInTheme}>
      <Navbar />
      <DashboardContainer>
        <Grid container spacing={2} sx={{ p: 0, height: '100dvh' }} alignItems="flex-start">
          <Grid item xs={12} sm={12} display="flex">
            <Card>
              <TransactionForm onAdd={handleAddTransaction} />
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ p: 0, height: '100dvh' }} alignItems="flex-start">
          <Grid item xs={12} sm={12} display="flex">
            <Card>
              {loading ? (
                <Typography variant="h6" gutterBottom>
                  Recent Transactions
                </Typography>
              ) : (
                <TransactionList transactions={transactions} />
              )}
            </Card>
          </Grid>
        </Grid>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
