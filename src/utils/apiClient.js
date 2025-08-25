import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/ijaa/api/v1/user";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and user context
apiClient.interceptors.request.use(
  (config) => {
    // Get user data from localStorage
    const userData = localStorage.getItem('alumni_user');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        
        // Add Authorization header
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        
        // Add X-USER_ID header for backend compatibility
        // The backend expects a Base64-encoded JSON string
        const userContext = { username: user.username || user.email };
        config.headers['X-USER_ID'] = btoa(JSON.stringify(userContext));
        
        console.log('API Request Headers:', {
          Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : 'None',
          'X-USER_ID': config.headers['X-USER_ID'],
          url: config.url
        });
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    } else {
      console.log('No user data found in localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // Check if the error is due to authentication issues
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear user data from localStorage
      localStorage.removeItem('alumni_user');
      
      // Dispatch a custom event to notify the app about logout
      window.dispatchEvent(new CustomEvent('auth:logout', {
        detail: { reason: 'token_expired' }
      }));
      
      // Redirect to login page
      window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

// User password change function
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient; 