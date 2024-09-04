// src/pages/ManageTransactions.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  Typography,
  Card as MuiCard,
  Stack,
  createTheme,
  ThemeProvider,
  Grid,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import getSignInTheme from '../components/sign-in/theme/getSignInTheme';
import { useSelector, useDispatch } from 'react-redux';
import {
  DataGrid,
  GridRowModes,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { fetchTransactions, updateTransaction, deleteTransaction } from '../redux/slices/transactionSlice';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const TransactionsContainer = styled(Stack)(({ theme }) => ({
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

const ManageTransactions = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const transactions = useSelector((state) => state.transactions.transactions);
  const loading = useSelector((state) => state.transactions.loading);
  const SignInTheme = createTheme(getSignInTheme(themeMode));
  const dispatch = useDispatch(); // Add useDispatch hook

  const [rows, setRows] = useState(
    transactions.map((transaction) => ({
      id: transaction._id,
      date: transaction.date.split('T')[0],
      name: transaction.name,
      category: transaction.category,
      type: transaction.type,
      amount: transaction.amount,
    }))
  );

  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === 'rowFocusOut') {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    dispatch(deleteTransaction(id)); // Dispatch delete action
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    // Dispatch update action to update the transaction in the database
    dispatch(
      updateTransaction({
        id: newRow.id,
        name: newRow.name,
        category: newRow.category,
        amount: newRow.amount,
        type: newRow.type,
        date: newRow.date,
      })
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'date', headerName: 'Date', width: 250, editable: true },
    { field: 'name', headerName: 'Transaction Name', width: 350, editable: true },
    { field: 'category', headerName: 'Category', width: 200, editable: true },
    { field: 'type', headerName: 'Type', width: 200, editable: true },
    {
      field: 'amount',
      headerName: 'Amount (Rs.)',
      width: 200,
      type: 'number',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon sx={{ width: '20px', height: '20px' }} />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon sx={{ width: '20px', height: '20px' }} />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon sx={{ width: '20px', height: '20px' }} />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ width: '20px', height: '20px' }} />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <ThemeProvider theme={SignInTheme}>
      <Navbar />
      <TransactionsContainer>
        <Grid container spacing={2} sx={{ p: 0, height: '100dvh' }} alignItems="flex-start">
          <Grid item xs={12} sm={12} display="flex">
            <Card>
              {!loading ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Transactions List
                  </Typography>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 15, // This is where the default page size is set
                        },
                      },
                    }}
                    pageSizeOptions={[5, 10, 15, 20]} // Add 15 to this array
                    rowsPerPageOptions={[5, 10, 15, 20]} 
                    disableSelectionOnClick
                  />
                </>
              ) : (
                <CircularProgress disableShrink />
              )}
            </Card>
          </Grid>
        </Grid>
      </TransactionsContainer>
    </ThemeProvider>
  );
};

export default ManageTransactions;
