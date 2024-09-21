import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Save as SaveIcon, Close as CancelIcon } from '@mui/icons-material';
import { Typography, CircularProgress, Grid, ThemeProvider, Card as MuiCard, Stack } from '@mui/material';
import { fetchTransactions, updateTransaction, deleteTransaction } from '../redux/slices/transactionSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import getSignInTheme from '../components/sign-in/theme/getSignInTheme';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { width: '100%' },
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const TransactionsContainer = styled(Stack)(({ theme }) => ({
  height: 'auto',
  backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('sm')]: { height: '100dvh' },
  ...theme.applyStyles('dark', {
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

const ManageTransactions = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const transactions = useSelector((state) => state.transactions.transactions);
  const loading = useSelector((state) => state.transactions.loading);
  const SignInTheme = createTheme(getSignInTheme(themeMode));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  // Memoize rows to avoid unnecessary recalculation
  const rows = useMemo(
    () =>
      transactions.map((transaction) => ({
        id: transaction._id,
        date: transaction.date.split('T')[0],
        name: transaction.name,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
      })),
    [transactions]
  );

  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    if (user?.email && (user.userId || user.id)) {
      dispatch(fetchTransactions({ userId: user.userId ?? user.id, email: user.email }));
    } else {
      navigate('/signin');
    }
  }, [dispatch, user, navigate]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === 'rowFocusOut') {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit } }));
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } }));
  };

  const handleDeleteClick = (id) => () => {
    dispatch(deleteTransaction(id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

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

  const columns = useMemo(
    () => [
      { field: 'date', headerName: 'Date', width: 250, editable: true },
      { field: 'name', headerName: 'Transaction Name', width: 350, editable: true },
      { field: 'category', headerName: 'Category', width: 200, editable: true },
      { field: 'type', headerName: 'Type', width: 200, editable: true },
      { field: 'amount', headerName: 'Amount (Rs.)', width: 200, type: 'number', editable: true },
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
    ],
    [rowModesModel, handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick]
  );

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
                        paginationModel: { pageSize: 15 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 15, 20]}
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
