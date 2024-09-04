// OtpLogin.js
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from "react";
import { auth, setupRecaptcha, signInWithPhoneNumber } from "../../firebase";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  Snackbar,
  Alert,
  Button
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginWithOtp } from "../../redux/slices/authSlice";
import { setUser } from '../../redux/slices/userSlice';
import axios from "axios";

function OtpLogin({ open, handleClose }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for buttons
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const validatePhoneNumber = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/validate-phone`, {
        phoneNumber: phoneNumber,
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage("Phone number not registered. Redirecting to registration...");
        setTimeout(() => {
          window.location.assign("/register");
        }, 2000);
      } else {
        setMessage("Error validating phone number.");
      }
      return false;
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when sending OTP

    const isRegistered = await validatePhoneNumber();
    if (!isRegistered) {
      setLoading(false);
      return;
    }

    setupRecaptcha("recaptcha-container");
    const appVerifier = window.recaptchaVerifier;
    const phoneNoWithCode = `+91${phoneNumber}`;

    signInWithPhoneNumber(auth, phoneNoWithCode, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setAlert({ open: true, severity: 'success', message: 'OTP sent successfully!' });
        setOtpSent(true);
        setLoading(false); // Stop loading after successful OTP send
      })
      .catch((error) => {
        setAlert({ open: true, severity: 'error', message: `Error sending OTP: ${error.message}` });
        setLoading(false); // Stop loading after error
      });
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when verifying OTP

    const credential = PhoneAuthProvider.credential(verificationId, otp);

    signInWithCredential(auth, credential)
      .then(() => {
        setMessage("OTP verified successfully!");
        dispatch(loginWithOtp({ phoneNumber }))
          .unwrap()
          .then((userData) => {
            setAlert({ open: true, severity: 'success', message: 'Login successful!' });
            dispatch(setUser({
              userId: userData.user.id,
              email: userData.user.email,
              firstName: userData.user.firstName,
              lastName: userData.user.lastName,
              phoneNumber: userData.user.phoneNumber,
              userName: userData.user.name
            }));
            setLoading(false); // Stop loading after successful login
            navigate('/dashboard');
          })
          .catch(() => {
            setLoading(false); // Stop loading on error
          });
      })
      .catch((error) => {
        setAlert({ open: true, severity: 'error', message: 'Error: Please enter correct OTP' });
        setLoading(false); // Stop loading after error
      });
  };

  const resetState = () => {
    setPhoneNumber("");
    setOtp("");
    setOtpSent(false);
    setVerificationId(null);
    setMessage("");
    setLoading(false);
  };

  const handleCloseWithReset = () => {
    resetState();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseWithReset}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          if (!otpSent) {
            sendOTP(event);
          } else {
            verifyOTP(event);
          }
        },
      }}
    >
      <DialogTitle>OTP Login</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your mobile number to receive OTP for verification
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="mobilenumber"
          name="mobilenumber"
          label="Mobile Number"
          placeholder="Enter mobile number"
          type="number"
          fullWidth
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={otpSent}
        />
        <div id="recaptcha-container"></div>
        {otpSent && (
          <OutlinedInput
            required
            margin="dense"
            id="otp"
            name="otp"
            label="OTP"
            placeholder="Enter OTP"
            type="number"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
        <div>
          {message && <p>{message}</p>}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseWithReset}>Cancel</Button>
        {!otpSent ? (
          <LoadingButton
            loading={loading} // Use loading state to indicate button status
            disabled={!phoneNumber}
            onClick={sendOTP}
          >
            Send OTP
          </LoadingButton>
        ) : (
          <LoadingButton
            loading={loading} // Use loading state to indicate button status
            disabled={!otp}
            onClick={verifyOTP}
          >
            Verify OTP
          </LoadingButton>
        )}
      </DialogActions>
      <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

OtpLogin.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default OtpLogin;
