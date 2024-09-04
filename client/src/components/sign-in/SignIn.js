// SignIn.js
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Link, Snackbar, Alert, Box, Checkbox, CssBaseline,
  FormControl, FormControlLabel, FormLabel, InputAdornment, OutlinedInput, IconButton,
  Grid
} from '@mui/material';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import getSignInTheme from './theme/getSignInTheme';
import ToggleColorMode from './ToggleColorMode';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../../redux/slices/authSlice';
import { setUser } from '../../redux/slices/userSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation';
import OtpLogin from './OtpLogin';
import MMHand from "../../assets/images/MMHand.png";
import MMGrow2 from "../../assets/images/MMGrow2.png";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn() {
  const [mode, setMode] = useState('light');
  const [isLogin, setIsLogin] = useState(window.location.pathname === "/register" ? false : true);
  const SignInTheme = createTheme(getSignInTheme(mode));
  const [openDialog, setOpenDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChangeSignMethod = (event) => {
    event.preventDefault();
    setErrors({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    });
    setIsLogin(!isLogin);
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    setErrors({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    validateField(e.target.name, e.target.value);
  };

  const validateField = (name, value) => {
    let errorMessage = '';

    if (name === 'email') {
      const { valid, message } = validateEmail(value);
      errorMessage = valid ? '' : message;
    } else if (name === 'password') {
      const { valid, message } = validatePassword(value);
      errorMessage = valid ? '' : message;
    } else if (name === 'username') {
      const { valid, message } = validateUsername(value);
      errorMessage = valid ? '' : message;
    }

    setErrors({
      ...errors,
      [name]: errorMessage
    });
  };

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
  };

  const handleOtpLoginDialogOpen = () => {
    setOpenOtpDialog(true);
  };

  const handleOtpLoginDialogClose = () => {
    setOpenOtpDialog(false);
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLogin && validateForm()) {
      dispatch(loginUser({ email: formData.email, password: formData.password }))
        .unwrap()
        .then((userData) => {
          setTimeout(() => {
            setAlert({ open: true, severity: 'success', message: 'Login successful!' });
            dispatch(setUser({
              userId: userData.user.id,
              email: userData.user.email,
              firstName: userData.user.firstName,
              lastName: userData.user.lastName,
              phoneNumber: userData.user.phoneNumber,
              userName: userData.user.name
            }));
          }, 2000);
          navigate('/dashboard');
        })
        .catch((error) => {
          setAlert({ open: true, severity: 'error', message: error });
        });
    } else if (validateForm()) {
      dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      }))
        .unwrap()
        .then(() => {
          setAlert({ open: true, severity: 'success', message: 'Registration successful! Please log in.' });
          setIsLogin(true);
          window.location.assign('/signin');
        })
        .catch((error) => {
          setAlert({ open: true, severity: 'error', message: error });
        });
    }
  };

  const validateForm = () => {
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const usernameValidation = isLogin ? { valid: true } : validateUsername(formData.username);

    setErrors({
      email: emailValidation.message,
      password: passwordValidation.message,
      username: usernameValidation.message
    });

    return emailValidation.valid && passwordValidation.valid && usernameValidation.valid;
  };

  return (
    <ThemeProvider theme={SignInTheme}>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="space-between">
        <Stack
          sx={{
            justifyContent: 'center',
            height: '100dvh',
            p: 0,
          }}
        >
          <Card variant="outlined">
            <Grid item xs={12} display="flex" justifyContent="center">
              <img src={MMHand} width='220px' height='130px' />
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                component="h1"
                variant="h5"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                {isLogin ? 'Sign in' : 'Sign Up'}
              </Typography>
              <ToggleColorMode
                data-screenshot="toggle-mode"
                mode={mode}
                toggleColorMode={toggleColorMode}
              />
            </Box>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              {!isLogin && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormControl>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <TextField
                        autoComplete="firstName"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        placeholder="Enter your first name"
                        error={Boolean(errors.firstName)}
                        helperText={errors.firstName}
                        color={Boolean(errors.firstName) ? 'error' : 'primary'}
                        onChange={handleChange}
                        value={formData.firstName}
                        sx={{ padding: '0px 10px 0px 0px' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel htmlFor="lastName" sx={{ padding: '0px 0px 0px 10px' }}>Last Name</FormLabel>
                      <TextField
                        autoComplete="lastName"
                        name="lastName"
                        required
                        fullWidth
                        id="lastName"
                        placeholder="Enter your last name"
                        error={Boolean(errors.lastName)}
                        helperText={errors.lastName}
                        color={Boolean(errors.lastName) ? 'error' : 'primary'}
                        onChange={handleChange}
                        value={formData.lastName}
                        sx={{ padding: '0px 0px 0px 10px' }}
                      />
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormControl>
                      <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                      <TextField
                        autoComplete="phoneNumber"
                        name="phoneNumber"
                        required
                        fullWidth
                        id="phoneNumber"
                        placeholder="Enter phone number"
                        error={Boolean(errors.phoneNumber)}
                        helperText={errors.phoneNumber}
                        color={Boolean(errors.phoneNumber) ? 'error' : 'primary'}
                        onChange={handleChange}
                        value={formData.phoneNumber}
                        sx={{ padding: '0px 10px 0px 0px' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="username" sx={{ padding: '0px 0px 0px 10px' }}>Username</FormLabel>
                      <TextField
                        autoComplete="username"
                        name="username"
                        required
                        fullWidth
                        id="username"
                        placeholder="Enter username"
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        color={Boolean(errors.username) ? 'error' : 'primary'}
                        onChange={handleChange}
                        value={formData.username}
                        sx={{ padding: '0px 0px 0px 10px' }}
                      />
                    </FormControl>
                  </Box>
                </>
              )}

              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  placeholder="Enter your email address"
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  color={Boolean(errors.email) ? 'error' : 'primary'}
                  onChange={handleChange}
                  value={formData.email}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <OutlinedInput
                  required
                  fullWidth
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  error={Boolean(errors.password)}
                  color={Boolean(errors.password) ? 'error' : 'primary'}
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Enter your password"
                  autoComplete="password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              {isLogin && <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
              {isLogin && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link href="#" onClick={handleClickOpen} variant="body2">
                  Forgot password?
                </Link>
                <Link href="#" onClick={handleOtpLoginDialogOpen} variant="body2">
                  Login Via OTP
                </Link>
              </Box>}
              <Link
                component="button"
                variant="body2"
                onClick={handleChangeSignMethod}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </Link>
            </Box>
          </Card>
        </Stack>
      </SignInContainer>
      <ForgotPassword open={openDialog} handleClose={handleClickClose} />
      <OtpLogin open={openOtpDialog} handleClose={handleOtpLoginDialogClose} />
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
