export const validateEmail = (email) => {
    if (!email) {
      return { valid: false, message: 'Email is required.' };
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }
    return { valid: true, message: '' };
  };
  
  export const validatePassword = (password) => {
    if (!password) {
      return { valid: false, message: 'Password is required.' };
    } else if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long.' };
    }
    return { valid: true, message: '' };
  };
  
  export const validateUsername = (username) => {
    if (!username) {
      return { valid: false, message: 'Username is required.' };
    } else if (username.length < 1) {
      return { valid: false, message: 'Username cannot be empty.' };
    }
    return { valid: true, message: '' };
  };
  