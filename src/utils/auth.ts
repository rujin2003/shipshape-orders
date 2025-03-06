
const TOKEN_KEY = 'auth_token';
const TOKEN_TIMESTAMP_KEY = 'auth_timestamp';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
};

export const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  
  if (!token || !timestamp) return null;
  
  // Check if token is less than 24 hours old
  const tokenAge = Date.now() - parseInt(timestamp);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  if (tokenAge > twentyFourHours) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    return null;
  }
  
  return token;
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
