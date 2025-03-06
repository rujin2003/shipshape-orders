
// Authentication utilities for managing user login state

export interface AuthUser {
  username: string;
  token: string;
  expiry: number;
}

// Save the user auth info to localStorage with expiry
export const loginUser = (username: string, token: string): void => {
  // Set expiry to 24 hours from now
  const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
  
  const userData: AuthUser = {
    username,
    token,
    expiry
  };
  
  localStorage.setItem('authUser', JSON.stringify(userData));
};

// Check if the user is logged in and the session is valid
export const isLoggedIn = (): boolean => {
  const authData = localStorage.getItem('authUser');
  if (!authData) return false;
  
  try {
    const user: AuthUser = JSON.parse(authData);
    // Check if the token is still valid (not expired)
    return user.expiry > new Date().getTime();
  } catch (error) {
    console.error('Error parsing auth data', error);
    return false;
  }
};

// Get the current user's auth token
export const getAuthToken = (): string | null => {
  const authData = localStorage.getItem('authUser');
  if (!authData) return null;
  
  try {
    const user: AuthUser = JSON.parse(authData);
    if (user.expiry > new Date().getTime()) {
      return user.token;
    } else {
      // Clear expired token
      logoutUser();
      return null;
    }
  } catch (error) {
    console.error('Error getting auth token', error);
    return null;
  }
};

// Logout user by removing auth data
export const logoutUser = (): void => {
  localStorage.removeItem('authUser');
};
