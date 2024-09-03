import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const TransactionList = ({ transactions }) => {
    const columns = [
        { field: 'date', headerName: 'Date', width: 250 },
        { field: 'name', headerName: 'Transaction Name', width: 350 },
        { field: 'category', headerName: 'Category', width: 250 },
        { field: 'type', headerName: 'Type', width: 250 },
        { field: 'amount', headerName: 'Amount (Rs.)', width: 250, type: 'number' },        
    ];

    const rows = transactions.map((transaction, index) => ({
        id: transaction._id, // Use the transaction ID as the unique identifier
        date: transaction.date.split('T')[0],
        name: transaction.name,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
    }));

    return (
        <Box sx={{ height: 300, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Recent Transactions
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 3, // This is where the default page size is set
                      },
                    },
                  }}
                  pageSizeOptions={[3]}
                //   rowsPerPageOptions={[3, 6, 9]}
                disableSelectionOnClick
            />
        </Box>
    );
};

export default TransactionList;
