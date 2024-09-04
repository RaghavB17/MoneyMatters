// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Logout, Home, ViewList, WbSunnyRounded, ModeNightRounded, BarChart } from '@mui/icons-material'; // Import icons
import { useDispatch, useSelector } from 'react-redux'; // Import hooks from react-redux
import { toggleTheme } from '../redux/slices/themeSlice'; // Import the toggleTheme action

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'hsl(220, 33%, 100%)' : 'hsl(220, 33%, 0%)',
  boxShadow: 'none',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'hsl(220, 33%, 100%)' : 'hsl(220, 33%, 0%)',
  color: theme.palette.mode === 'dark' ? 'hsl(220, 30%, 10%)' : 'hsl(210, 100%, 97%)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'hsl(220, 33%, 0%)' : 'hsl(220, 33%, 100%)',
    color: theme.palette.mode === 'dark' ? 'hsl(210, 100%, 97%)' : 'hsl(220, 30%, 10%)',
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use the useDispatch hook
  const themeMode = useSelector((state) => state.theme.mode); // Use the useSelector hook to get the current theme mode

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  const handleRedirectHome = () => {
    const authToken = localStorage.getItem('authToken');
    navigate(authToken ? '/dashboard' : '/signin');
  };

  const handleVisualizeData = () => {
    return navigate('/visualize');
  };

  const handleManageTransactions = () => {
    return navigate('/transactions');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme()); // Dispatch the toggleTheme action
  };

  return (
    <CustomAppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 0.8 }}>
          <CustomButton startIcon={<Home />} onClick={handleRedirectHome}>
            Dashboard
          </CustomButton>
        </Box>
        <Typography
          variant="h3"
          sx={{
            flexGrow: 0.45,
            fontFamily: '"Notable", sans-serif', // Replace with "Poppins" or "Montserrat" or "Stalinist One" if preferred
            textTransform: 'uppercase',
            paddingBottom: '8px'
          }}
        >
          MONEY MATTE₹S
        </Typography>
        <Box sx={{ padding: '0px 5px 0px 0px' }}>
          {window.location.pathname != '/visualize' &&
            <CustomButton startIcon={<BarChart />} color="secondary" onClick={handleVisualizeData}>
              Visualize Data
            </CustomButton>
          }
        </Box>
        <Box sx={{ padding: '0px 5px 0px 0px' }}>
          {window.location.pathname != '/transactions' &&
            <CustomButton startIcon={<ViewList />} color="secondary" onClick={handleManageTransactions}>
              Manage Transactions
            </CustomButton>
          }
        </Box>
        <Box sx={{ padding: '0px 5px 0px 0px' }}>
          <CustomButton startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </CustomButton>
        </Box>
        <CustomButton startIcon={themeMode === 'dark' ? (
          <WbSunnyRounded fontSize="small" />
        ) : (
          <ModeNightRounded fontSize="small" />
        )} color="secondary" onClick={handleToggleTheme}>Theme</CustomButton>
      </Toolbar>
    </CustomAppBar>
  );
};

export default Navbar;
