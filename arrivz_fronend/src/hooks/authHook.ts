// store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store/index';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  forgotPassword, 
  resetPassword,
  clearError,
  clearLockout 
} from '../store/slices/authSlice';
import type { 
  LoginCredentials, 
  RegisterData, 
  ForgotPasswordData, 
  ResetPasswordData 
} from '../store/types/authType';

// Basic hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth-specific hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const login = useCallback(
    (credentials: LoginCredentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData: RegisterData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const logout = useCallback(
    () => dispatch(logoutUser()),
    [dispatch]
  );

  const forgotPasswordAction = useCallback(
    (data: ForgotPasswordData) => dispatch(forgotPassword(data)),
    [dispatch]
  );

  const resetPasswordAction = useCallback(
    (data: ResetPasswordData) => dispatch(resetPassword(data)),
    [dispatch]
  );

  const clearAuthError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const clearAuthLockout = useCallback(
    () => dispatch(clearLockout()),
    [dispatch]
  );

  return {
    // State
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    error: authState.error,
    isAuthenticated: !!authState.user?.isAuthenticated,
    isHydrated: authState.isHydrated,
    loginAttempts: authState.loginAttempts,
    lockoutUntil: authState.lockoutUntil,
    
    // Actions
    login,
    register,
    logout,
    forgotPassword: forgotPasswordAction,
    resetPassword: resetPasswordAction,
    clearError: clearAuthError,
    clearLockout: clearAuthLockout,
  };
};

// Selector hooks for specific auth data
export const useAuthUser = () => useAppSelector((state) => state.auth.user);
export const useAuthToken = () => useAppSelector((state) => state.auth.token);
export const useAuthLoading = () => useAppSelector((state) => state.auth.isLoading);
export const useAuthError = () => useAppSelector((state) => state.auth.error);
export const useIsAuthenticated = () => useAppSelector((state) => !!state.auth.user?.isAuthenticated);
export const useIsHydrated = () => useAppSelector((state) => state.auth.isHydrated);