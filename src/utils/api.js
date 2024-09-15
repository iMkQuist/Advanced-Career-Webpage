// src/utils/api.js

import axios from 'axios';

// Function to set the Authorization header for Axios requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Global Axios error handler
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made, but the server responded with an error status
    console.error('API Error:', error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error: No response from server.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error:', error.message);
  }
};
