// src/utils/validation.js

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  export const validatePassword = (password) => {
    // Password must be at least 6 characters
    return password.length >= 6;
  };
  
  export const validateForm = (formData) => {
    const { email, password } = formData;
    let errors = {};
  
    if (!validateEmail(email)) {
      errors.email = 'Invalid email address';
    }
  
    if (!validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters';
    }
  
    return errors;
  };
  