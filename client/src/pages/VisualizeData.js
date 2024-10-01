import React, { useState } from 'react';
import { LineChart, PieChart, BarChart } from '@mui/x-charts';
import { Box, Card, Stack, Typography, ToggleButton, ToggleButtonGroup, createTheme, ThemeProvider, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import getSignInTheme from '../components/sign-in/theme/getSignInTheme';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux'; 
import { getExpenses, getIncome, getExpenseByCategory, getTransactionsByMonth, getExpensesByCategoryAndMonth } from '../redux/selectors/transactionSelectors';

const VisualizeData = () => {
    const transactions = useSelector((state) => state.transactions.transactions); 
    const loading = useSelector((state) => state.transactions.loading); 
    const themeMode = useSelector((state) => state.theme.mode); 

    const [view, setView] = useState('incomeExpense'); 
    const [selectedCategory, setSelectedCategory] = useState("All"); // New state for category selection

    // Handle toggle change
    const handleViewChange = (event, newView) => {
        if (newView) {
            setView(newView);
        }
    };

    // Handle category change
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // Get calculated data from selectors
    const income = getIncome(transactions);
    const expense = getExpenses(transactions);
    const expenseByCategory = getExpenseByCategory(transactions);
    const expensesByMonth = getTransactionsByMonth(transactions, 'expense');
    const expensesByCategoryAndMonth = getExpensesByCategoryAndMonth(transactions);

    // Pie chart data structure
    const pieData = [
        { id: 0, value: income, label: 'Income' },
        { id: 1, value: expense, label: 'Expense' },
    ];

    const months = Object.keys(expensesByMonth)
        .sort((a, b) => {
            const dateA = new Date(a); 
            const dateB = new Date(b);
            return dateA - dateB; 
        });

    const expenses = months.map(month => expensesByMonth[month]);

    // Filter the line chart series based on the selected category
    const lineChartSeries = selectedCategory === "All"
        ? Object.entries(expensesByCategoryAndMonth).map(([category, categoryData]) => ({
            data: months.map(month => categoryData.data[month] || 0),
            label: category,
            color: categoryData.color || 'black'
        }))
        : [{
            data: months.map(month => expensesByCategoryAndMonth[selectedCategory]?.data[month] || 0),
            label: selectedCategory,
            color: expensesByCategoryAndMonth[selectedCategory]?.color || 'black'
        }];

    // Bar chart data structure
    const barData = [income, expense]; 
    const xLabels = ['Income', 'Expense']; 

    const SignInTheme = createTheme(getSignInTheme(themeMode)); 

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
                                        series={[{
                                            data: pieData,
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        }]}
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
                                        series={[{ data: barData, label: 'Amount', id: 'amountId' }]}
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
                                        series={[{
                                            data: expenseByCategory,
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        }]}
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
                            flexDirection: 'column',
                            justifyContent: 'center',
                            width: '80%',
                            gap: 4,
                        }}
                    >
                        {/* Dropdown for selecting a category */}
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Category"
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="All">All</MenuItem>
                                {Object.keys(expensesByCategoryAndMonth).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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
                                        series={[{
                                            data: expenses,
                                            label: 'Expenses',
                                            id: 'expensesId',
                                        }]}
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
