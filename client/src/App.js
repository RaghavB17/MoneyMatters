import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from './pages/Dashboard';
import SignIn from './components/sign-in/SignIn';
import theme from './theme';
import VisualizeData from './pages/VisualizeData';
import ManageTransactions from './pages/ManageTransactions';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/visualize" element={<VisualizeData />} />
          <Route path="/transactions" element={<ManageTransactions />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
