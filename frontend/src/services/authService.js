import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - User data with token
 */
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  
  if (response.data.success) {
    storeUserData(response.data.data);
  }
  
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} - User data with token
 */
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  
  if (response.data.success) {
    storeUserData(response.data.data);
  }
  
  return response.data;
};


export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user profile
 * @returns {Promise<Object>} - User profile data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  
  if (response.data.success) {
    storeUserData(response.data.data);
  }
  
  return response.data;
};

/**
 * Store user data in local storage
 * @param {Object} userData - User data with token
 */
const storeUserData = (userData) => {
  console.log('Storing user data:', userData);
  if (!userData.token) {
    console.error('No token in user data!');
  }
  
  localStorage.setItem('token', userData.token);
  localStorage.setItem('user', JSON.stringify({
    id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role
  }));
  
  console.log('Stored token:', localStorage.getItem('token'));
  console.log('Stored user:', localStorage.getItem('user'));
};

/**
 * Get stored user data
 * @returns {Object|null} - Stored user data or null
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};