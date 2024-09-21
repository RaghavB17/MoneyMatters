import React, { useState } from 'react';
import { LineChart, PieChart, BarChart, Gauge, gaugeClasses } from '@mui/x-charts';
import { Box, Card, Stack, Typography, ToggleButton, ToggleButtonGroup, createTheme, ThemeProvider, CircularProgress } from '@mui/material';
import getSignInTheme from '../components/sign-in/theme/getSignInTheme';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux

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

    // Calculate income and expenses
    const income = transactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

    // Pie chart data structure (updated for highlighting)
    const pieData = [
        { id: 0, value: income, label: 'Income' },
        { id: 1, value: expense, label: 'Expense' },
    ];

    // Group expenses by category for the new pie chart
    const expenseByCategory = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => {
        const existing = acc.find((item) => item.label === tx.category);
        if (existing) {
          existing.value += tx.amount;
          } else {
            acc.push({ id: acc.length, value: tx.amount, label: tx.category });
          }
          return acc;
      }, []);

    const expensesByMonth = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => {
        const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (acc[month]) {
          acc[month] += tx.amount;
        } else {
          acc[month] = tx.amount;
        }
        return acc;
      }, {});

    const incomeByMonth = transactions
      .filter(tx => tx.type === 'income')
      .reduce((acc, tx) => {
        const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (acc[month]) {
          acc[month] += tx.amount;
        } else {
          acc[month] = tx.amount;
        }
        return acc;
      }, {});

    const months = Object.keys(expensesByMonth).sort();
    const expenses = months.map(month => expensesByMonth[month]);
    const monthIncome = months.map(month => incomeByMonth[month]);

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
                    <ToggleButton value="monthlyExpenses">Monthly Expenses</ToggleButton> {/* New Toggle Button */}
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
                ) : (
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
                                Monthly Expenses
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
                                        width={600}
                                        height={300}
                                    />
                                </ErrorBoundary>
                            ) : (
                                <Typography>No data available</Typography>
                            )}
                        </Card>
                        {/* <Card sx={{ p: 3, width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h6" component="h3">
                                Expenses vs Income
                            </Typography>
                            {!loading ? (
                                <ErrorBoundary>
                                    <Box
                                        sx={{
                                            width: '100%', // Adjust the width as needed
                                            height: '300px', // Set a fixed height
                                            overflow: 'hidden', // Prevent overflow
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Gauge
                                            value={expenses}
                                            startAngle={-110}
                                            endAngle={110}
                                            text={({ expense, income }) => `${expenses} / ${monthIncome}`}
                                            sx={{
                                                maxWidth: '100%', // Prevent Gauge from exceeding its container's width
                                                maxHeight: '100%', // Prevent Gauge from exceeding its container's height
                                                [`& .${gaugeClasses.valueText}`]: {
                                                    fontSize: 38,
                                                    transform: 'translate(0px, 0px)',
                                                },
                                            }}
                                            valueMax={monthIncome}
                                        />
                                    </Box>
                                </ErrorBoundary>
                            ) : (
                                    <CircularProgress disableShrink />
                            )}
                        </Card> */}
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
