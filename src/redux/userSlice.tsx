import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web

// Define the initial state interface for user slice
interface UserState {
  user: { username: string; email: string } | null;
  token: string | null; // JWT token for authentication
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: any; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    updateUser(state, action: PayloadAction<Partial<UserState['user']>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = userSlice.actions;

// Async thunk for login
export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart());
    // Replace this with an actual API call to authenticate
    const { user, token } = await fakeAuthApi(email, password);

    // Store the token and user in localStorage/sessionStorage if needed
    localStorage.setItem('token', token); // Store token
    localStorage.setItem('user', JSON.stringify(user)); // Store user data

    dispatch(loginSuccess({ user, token }));
  } catch (error) {
    dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
  }
};

// Async thunk for logout
export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(logout());
};

// Fake API to simulate login (replace with actual API call)
const fakeAuthApi = async (email: string, password: string) => {
  return new Promise<{ user: any; token: string }>((resolve, reject) => {
    setTimeout(() => {
      if (email === 'user@example.com' && password === 'password') {
        resolve({
          user: { username: 'user', email: 'user@example.com' },
          token: 'fake-jwt-token',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

// Persist configuration to store user data in local storage
const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'token'], // Persist only the user and token
};

// Export the persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userSlice.reducer);
export default persistedUserReducer;
