import React, { useState } from 'react';
import { LineChart, PieChart, BarChart } from '@mui/x-charts';
import { Box, Card, Stack, Typography, ToggleButton, ToggleButtonGroup, createTheme, ThemeProvider, CircularProgress } from '@mui/material';
import getSignInTheme from '../components/sign-in/theme/getSignInTheme';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import { getExpenses, getIncome, getExpenseByCategory, getTransactionsByMonth, getExpensesByCategoryAndMonth } from '../redux/selectors/transactionSelectors';

const VisualizeData = () => {
    const transactions = useSelector((state) => state.transactions.transactions); // Get transactions from Redux store
    const loading = useSelector((state) => state.transactions.loading); // Loading state for transactions 
    const themeMode = useSelector((state) => state.theme.mode); // Get the theme mode from Redux store

    const [view, setView] = useState('incomeExpense'); // Toggle state for switching views

    // Handle toggle change
    const handleViewChange = (event, newView) => {
        if (newView) {
            setView(newView);
        }
    };

    // Get calculated data from selectors
  const income = getIncome(transactions);
  const expense = getExpenses(transactions);
  const expenseByCategory = getExpenseByCategory(transactions);
  const expensesByMonth = getTransactionsByMonth(transactions, 'expense');
  const expensesByCategoryAndMonth = getExpensesByCategoryAndMonth(transactions);

    // Pie chart data structure (updated for highlighting)
    const pieData = [
        { id: 0, value: income, label: 'Income' },
        { id: 1, value: expense, label: 'Expense' },
    ];

    const months = Object.keys(expensesByMonth).sort();
    const expenses = months.map(month => expensesByMonth[month]);

    const lineChartSeries = Object.entries(expensesByCategoryAndMonth).map(([category, categoryData]) => ({
        data: months.map(month => categoryData.data[month] || 0),  // Safely access the data for each month or default to 0
        label: category,
        color: categoryData.color   // Assign a unique color or default to black if not defined
      }));

    // Bar chart data structure
    const barData = [income, expense]; // Data for BarChart series
    const xLabels = ['Income', 'Expense']; // Categories for x-axis

    const SignInTheme = createTheme(getSignInTheme(themeMode)); // Use Redux state for theme mode

    return (
        <ThemeProvider theme={SignInTheme}>
            <Navbar />
            <Stack
                sx={{
                    display: 'flex',
                    height: '100dvh',
                    p: 2,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage:
                        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                }}
            >
                {/* Toggle Button Group */}
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    sx={{ mb: 4 }}
                >
                    <ToggleButton value="incomeExpense">Income vs Expense</ToggleButton>
                    <ToggleButton value="expenseCategory">Expenses by Category</ToggleButton>
                    <ToggleButton value="monthlyExpenses">Monthly Expenses</ToggleButton>
                    <ToggleButton value="categoryVsMonth">Category vs Month</ToggleButton>
                </ToggleButtonGroup>

                {/* Conditionally Render Based on Toggle Selection */}
                {view === 'incomeExpense' ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            width: '80%',
                            gap: 4,
                        }}
                    >
                        <Card sx={{ p: 3, width: '45%' }}>
                            <Typography variant="h6" component="h3">
                                Highlighted Pie Chart
                            </Typography>
                            {!loading ? (pieData.length > 0 ? (
                                <ErrorBoundary>
                                    <PieChart
                                        series={[
                                            {
                                                data: pieData,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                            },
                                        ]}
                                        height={300}
                                    />
                                </ErrorBoundary>
                            ) : (
                                <Typography>No data available</Typography>
                            )) : (
                                <CircularProgress disableShrink />
                            )}
                        </Card>

                        <Card sx={{ p: 3, width: '45%' }}>
                            <Typography variant="h6" component="h3">
                                Bar Chart
                            </Typography>
                            {!loading ? (barData.length > 0 ? (
                                <ErrorBoundary>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        series={[
                                            { data: barData, label: 'Amount', id: 'amountId' },
                                        ]}
                                        xAxis={[{ data: xLabels, scaleType: 'band' }]}
                                    />
                                </ErrorBoundary>
                            ) : (
                                <Typography>No data available</Typography>
                            )) : (
                                <CircularProgress disableShrink />
                            )}
                        </Card>
                    </Box>
                ) : view === 'expenseCategory' ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '80%',
                            gap: 4,
                        }}
                    >
                        <Card sx={{ p: 3, width: '80%' }}>
                            <Typography variant="h6" component="h3">
                                Expenses by Category
                            </Typography>
                            {!loading ? (expenseByCategory.length > 0 ? (
                                <ErrorBoundary>
                                    <PieChart
                                        series={[
                                            {
                                                data: expenseByCategory,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                            },
                                        ]}
                                        height={300}
                                    />
                                </ErrorBoundary>
                            ) : (
                                <Typography>No data available</Typography>
                            )) : (
                                <CircularProgress disableShrink />
                            )}
                        </Card>
                    </Box>
                ) : view === 'categoryVsMonth' ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '80%',
                            gap: 4,
                        }}
                    >
                        <Card elevation={3} sx={{ p: 3, width: '100%' }}>
                            <Typography variant="h6" component="h3">
                                Expenses by Category vs Month
                            </Typography>
                            {lineChartSeries.length > 0 ? (
                                <ErrorBoundary>
                                    <LineChart
                                        xAxis={[{ data: months, scaleType: 'band' }]}
                                        series={lineChartSeries}
                                        height={400}
                                    />
                                </ErrorBoundary>
                            ) : (
                                <Typography>No data available</Typography>
                            )}
                        </Card>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '80%',
                            gap: 4,
                        }}
                    >
                        <Card sx={{ p: 3, width: '80%' }}>
                            <Typography variant="h6" component="h3">
                                Monthly Income vs Expenses
                            </Typography>
                            {months.length > 0 ? (
                                <ErrorBoundary>
                                    <LineChart
                                        xAxis={[{ data: months, scaleType: 'band' }]}
                                        series={[
                                            {
                                                data: expenses,
                                                label: 'Expenses',
                                                id: 'expensesId',
                                            },
                                        ]}
                                        height={300}
                                    />
                                </ErrorBoundary>
                            ) : (
                                <Typography>No data available</Typography>
                            )}
                        </Card>
                    </Box>
                )}
            </Stack>
        </ThemeProvider>
    );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error occurred in Chart Component:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <Typography variant="body1">Something went wrong.</Typography>;
        }

        return this.props.children; 
    }
}

export default VisualizeData;
