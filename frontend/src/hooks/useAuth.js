import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { register, login, logout, updateProfile } from '../services/authService';


const useAuth = () => {
  const { 
    user, 
    isAuth, 
    loading, 
    loginUser, 
    logoutUser, 
    updateUser 
  } = useContext(AuthContext);
  
  const navigate = useNavigate();

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration result
   */
  const registerUser = async (userData) => {
    try {
      const response = await register(userData);
      
      if (response.success) {
        loginUser(response.data);
        navigate('/dashboard');
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  /**
   * Login a user
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} - Login result
   */
  const loginUserWithCredentials = async (credentials) => {
    try {
      const response = await login(credentials);
      
      if (response.success) {
        loginUser(response.data);
        navigate('/dashboard');
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  /**
   * Logout current user
   */
  const logoutCurrentUser = () => {
    logoutUser();
    navigate('/login');
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Update result
   */
  const updateUserProfile = async (userData) => {
    try {
      const response = await updateProfile(userData);
      
      if (response.success) {
        updateUser(response.data);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  return {
    user,
    isAuth,
    loading,
    registerUser,
    loginUserWithCredentials,
    logoutCurrentUser,
    updateUserProfile
  };
};

export default useAuth;