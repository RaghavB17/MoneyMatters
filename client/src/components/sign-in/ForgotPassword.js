import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Box, InputAdornment, OutlinedInput, IconButton, Alert } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import axios from 'axios'; // Ensure axios is installed and imported

const steps = [
  'Verify details',
  'Choose method',
  'Reset Password',
];

function ForgotPassword({ open, handleClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    currPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const totalSteps = () => steps.length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const handleNext = async () => {
    if (isLastStep()) {
      await handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      email: '',
      currPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setError('');
    setSuccess('');
    handleClose();
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    const { email, currPassword, newPassword, confirmNewPassword } = formData;

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      // Validate the current password
      const validateResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/validate-password`, {
        email,
        currPassword
      });

      if (!validateResponse.data.valid) {
        setError('Current password is incorrect.');
        return;
      }

      // Update the password in the database
      const updateResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/update-password`, {
        email,
        newPassword
      });

      if (updateResponse.status === 200) {
        setSuccess('Password updated successfully.');
        handleReset();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while updating the password.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          handleNext();
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogTitle>
      {activeStep === 0 && (
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <DialogContentText>Enter your account's email address</DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="your@email.com"
            type="email"
            fullWidth
            onChange={handleChange}
            value={formData.email}
          />
        </DialogContent>
      )}
      {activeStep === 1 && (
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <DialogContentText>Choose verification method</DialogContentText>
          <FormControl>
            <RadioGroup aria-labelledby="verification-method" defaultValue="currPassword" name="verification-method">
              <FormControlLabel value="email-otp" control={<Radio />} label="Get code on email address" />
              <FormControlLabel value="currPassword" control={<Radio />} label="Verify with current password" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
      )}
      {activeStep === 2 && (
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <DialogContentText>Current Password</DialogContentText>
          <OutlinedInput
            required
            fullWidth
            id="currPassword"
            name="currPassword"
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange}
            value={formData.currPassword}
            placeholder="Enter your current password"
            autoComplete="current-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <DialogContentText>New Password</DialogContentText>
          <OutlinedInput
            required
            fullWidth
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            onChange={handleChange}
            value={formData.newPassword}
            placeholder="Enter new password"
            autoComplete="new-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowNewPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <DialogContentText>Confirm New Password</DialogContentText>
          <OutlinedInput
            required
            fullWidth
            id="confirmNewPassword"
            name="confirmNewPassword"
            type={showConfirmNewPassword ? 'text' : 'password'}
            onChange={handleChange}
            value={formData.confirmNewPassword}
            placeholder="Confirm new password"
            autoComplete="new-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmNewPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </DialogContent>
      )}
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleReset}>Cancel</Button>
        {isLastStep() ? (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
