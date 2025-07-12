// store/slices/authSlice.ts - Refactored without separate service layer
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ForgotPasswordData, 
  ResetPasswordData,
  AuthApiError 
} from '../../types/authType';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Helper function to get token from localStorage
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('arrivz_token');
};

// Helper function to get refresh token from localStorage
const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('arrivz_refresh_token');
};

// Helper function to store tokens
const storeTokens = (token: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('arrivz_token', token);
    localStorage.setItem('arrivz_refresh_token', refreshToken);
  }
};

// Helper function to clear tokens
const clearStoredTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('arrivz_token');
    localStorage.removeItem('arrivz_refresh_token');
  }
};

// Async thunks
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: AuthApiError }
>(
  'auth/login',
  async (credentials, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      
      // Check lockout
      if (state.auth.lockoutUntil && Date.now() < state.auth.lockoutUntil) {
        return rejectWithValue({
          message: 'Account temporarily locked. Please try again later.',
          code: 'ACCOUNT_LOCKED',
        });
      }

      console.log('📡 Logging in user:', credentials.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.rememberMe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message: errorData.message || errorData.detail || 'Login failed',
          code: errorData.code || 'LOGIN_FAILED',
        } as AuthApiError;
      }

      const data = await response.json();
      console.log('✅ Login successful');
      
      // Store tokens
      storeTokens(data.token, data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      return rejectWithValue(error as AuthApiError);
    }
  }
);

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: AuthApiError }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('📡 Registering user:', {
        ...userData,
        password: '[REDACTED]',
        confirmPassword: '[REDACTED]'
      });

      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          password: userData.password,
          confirm_password: userData.confirmPassword,
          agree_to_terms: userData.agreeToTerms,
          country_of_origin: userData.countryOfOrigin,
          current_country: userData.currentCountry,
          community: userData.community || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message: errorData.message || errorData.detail || 'Registration failed',
          code: errorData.code || 'REGISTRATION_FAILED',
          errors: errorData.errors,
        } as AuthApiError;
      }

      const data = await response.json();
      console.log('✅ Registration successful');
      
      // Store tokens
      storeTokens(data.token, data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return rejectWithValue(error as AuthApiError);
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: AuthApiError }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📡 Logging out user');
      
      const refreshToken = getStoredRefreshToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getStoredToken() && { 'Authorization': `Bearer ${getStoredToken()}` }),
        },
        credentials: 'include',
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      // Clear tokens regardless of API response
      clearStoredTokens();
      
      if (!response.ok) {
        console.warn('⚠️ Logout API call failed, but tokens cleared locally');
      } else {
        console.log('✅ Logout successful');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear tokens even if API call fails
      clearStoredTokens();
      return rejectWithValue(error as AuthApiError);
    }
  }
);

export const refreshToken = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: AuthApiError }
>(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const storedRefreshToken = getStoredRefreshToken();
      
      if (!state.auth.refreshToken && !storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('📡 Refreshing token');
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          refresh: state.auth.refreshToken || storedRefreshToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        clearStoredTokens(); // Clear invalid tokens
        throw {
          message: errorData.message || errorData.detail || 'Token refresh failed',
          code: errorData.code || 'TOKEN_REFRESH_FAILED',
        } as AuthApiError;
      }

      const data = await response.json();
      console.log('✅ Token refresh successful');
      
      // Update stored tokens
      storeTokens(data.token, data.refreshToken || storedRefreshToken);
      
      return data;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      clearStoredTokens();
      return rejectWithValue(error as AuthApiError);
    }
  }
);

export const forgotPassword = createAsyncThunk<
  { message: string },
  ForgotPasswordData,
  { rejectValue: AuthApiError }
>(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      console.log('📡 Sending forgot password request for:', data.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message: errorData.message || errorData.detail || 'Failed to send reset email',
          code: errorData.code || 'FORGOT_PASSWORD_FAILED',
        } as AuthApiError;
      }

      const result = await response.json();
      console.log('✅ Forgot password email sent');
      return result;
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      return rejectWithValue(error as AuthApiError);
    }
  }
);

export const resetPassword = createAsyncThunk<
  { message: string },
  ResetPasswordData,
  { rejectValue: AuthApiError }
>(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      console.log('📡 Resetting password with token');
      
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token: data.token,
          password: data.password,
          confirm_password: data.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message: errorData.message || errorData.detail || 'Failed to reset password',
          code: errorData.code || 'RESET_PASSWORD_FAILED',
        } as AuthApiError;
      }

      const result = await response.json();
      console.log('✅ Password reset successful');
      return result;
    } catch (error) {
      console.error('❌ Reset password error:', error);
      return rejectWithValue(error as AuthApiError);
    }
  }
);

export const getUserProfile = createAsyncThunk<
  { user: any },
  void,
  { rejectValue: AuthApiError }
>(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching user profile');
      
      const token = getStoredToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile/detail/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          clearStoredTokens();
        }
        throw {
          message: errorData.message || errorData.detail || 'Failed to fetch profile',
          code: errorData.code || 'PROFILE_FETCH_FAILED',
        } as AuthApiError;
      }

      const data = await response.json();
      console.log('✅ Profile fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      return rejectWithValue(error as AuthApiError);
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  { message: string; user: any },
  any,
  { rejectValue: AuthApiError }
>(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      console.log('📡 Updating user profile');
      
      const token = getStoredToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const formData = new FormData();
      
      // Handle form data
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          if (key === 'avatar' && profileData[key] instanceof File) {
            formData.append(key, profileData[key]);
          } else {
            formData.append(key, profileData[key]);
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message: errorData.message || errorData.detail || 'Failed to update profile',
          code: errorData.code || 'PROFILE_UPDATE_FAILED',
        } as AuthApiError;
      }

      const data = await response.json();
      console.log('✅ Profile updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return rejectWithValue(error as AuthApiError);
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isHydrated: false,
  loginAttempts: 0,
  lockoutUntil: null,
};

// Create the slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setHydrated: (state) => {
      state.isHydrated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLockout: (state) => {
      state.loginAttempts = 0;
      state.lockoutUntil = null;
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = { ...action.payload.user, isAuthenticated: true };
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutUntil = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutUntil = null;
      clearStoredTokens();
    },
    updateUser: (state, action: PayloadAction<Partial<typeof state.user>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    hydrateFromStorage: (state) => {
      const token = getStoredToken();
      const refreshToken = getStoredRefreshToken();
      
      if (token && refreshToken) {
        state.token = token;
        state.refreshToken = refreshToken;
        // Note: User data should be fetched separately
      }
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...action.payload.user, isAuthenticated: true };
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
        state.loginAttempts = 0;
        state.lockoutUntil = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        
        // Handle failed login attempts
        if (action.payload?.code !== 'ACCOUNT_LOCKED') {
          state.loginAttempts += 1;
          if (state.loginAttempts >= 5) {
            state.lockoutUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
          }
        }
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...action.payload.user, isAuthenticated: true };
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
        state.isLoading = false;
        state.loginAttempts = 0;
        state.lockoutUntil = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails on server, clear local state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isLoading = false;
      })
      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = { ...action.payload.user, isAuthenticated: true };
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        // Clear credentials if refresh fails
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send reset email';
      })
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to reset password';
      })
      // Get profile cases
      .addCase(getUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...action.payload.user, isAuthenticated: true };
        }
      })
      .addCase(getUserProfile.rejected, (state) => {
        // If profile fetch fails, user might not be authenticated
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      // Update profile cases
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...action.payload.user, isAuthenticated: true };
        }
      });
  },
});

// Export actions
export const { 
  setHydrated, 
  clearError, 
  clearLockout, 
  setCredentials, 
  clearCredentials, 
  updateUser,
  hydrateFromStorage 
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;