// i created this utility to automatically detect environment and use appropriate api endpoints
// it seamlessly switches between local development server and vercel production apis

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// i determine if we're running locally vs on vercel
const isLocal = isDevelopment && isLocalhost;

// i set the base url based on environment
const getApiBaseUrl = () => {
  if (isLocal) {
    // i use the local development server when running locally
    return `http://localhost:${process.env.REACT_APP_LOCAL_API_PORT || 3001}`;
  }
  // i use relative paths for vercel deployment (same domain)
  return '';
};

const API_BASE_URL = getApiBaseUrl();

// i create a unified fetch wrapper that handles both environments
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
};

// i export the configuration and utilities
export {
  isLocal,
  isDevelopment,
  API_BASE_URL,
  apiRequest
};

// i log the current configuration for debugging
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    environment: process.env.NODE_ENV,
    isLocal,
    baseUrl: API_BASE_URL
  });
}