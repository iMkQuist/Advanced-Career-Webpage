// src/services/userService.js

import axios from 'axios';

const API_BASE_URL = '/api/users';

// User Login
export const loginUser = async ({ email, password, rememberMe }: { email: string, password: string, rememberMe: boolean }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password, rememberMe });
    return response.data;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};


// User Signup
export const signupUser = async (userData: { username: string; email: string; password: string; }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to sign up');
  }
};

// Fetch the logged-in user's profile
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};

// Update the user's profile
export const updateUserProfile = async (updatedProfileData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/profile`, updatedProfileData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update profile');
  }
};

// User Logout
export const logoutUser = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`);
  } catch (error) {
    throw new Error('Failed to logout');
  }
};
