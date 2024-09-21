import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Menu, Logout, Home, ViewList, WbSunnyRounded, ModeNightRounded, BarChart } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';

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
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    dispatch(toggleTheme());
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={handleRedirectHome}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={handleVisualizeData}>
          <ListItemIcon><BarChart /></ListItemIcon>
          <ListItemText primary="Visualize Data" />
        </ListItem>
        <ListItem button onClick={handleManageTransactions}>
          <ListItemIcon><ViewList /></ListItemIcon>
          <ListItemText primary="Manage Transactions" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <CustomAppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 0.55 }}>
        <CustomButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <Menu />
        </CustomButton>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {menuList()}
        </Drawer>
        </Box>
        <Typography
          variant="h3"
          sx={{
            flexGrow: 0.55,
            fontFamily: '"Notable", sans-serif', // Replace with "Poppins" or "Montserrat" or "Stalinist One" if preferred
            textTransform: 'uppercase',
            paddingBottom: '8px',
            color: themeMode === 'dark' ? 'hsl(220, 30%, 10%)' : 'hsl(210, 100%, 97%)'
          }}
        >
          MONEY MATTE₹S
        </Typography>
        <CustomButton onClick={handleToggleTheme} color="inherit">
          {themeMode === 'dark' ? (
            <WbSunnyRounded fontSize="small" />
          ) : (
            <ModeNightRounded fontSize="small" />
          )}
        </CustomButton>
      </Toolbar>
    </CustomAppBar>
  );
};

export default Navbar;
