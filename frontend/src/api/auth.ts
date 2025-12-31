// API Base Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Auth token management
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('access_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// API request helper with auth headers
const apiRequest = async (endpoint, options = {}, throwError = true) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if(!throwError)
      return response;

    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/auth';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API calls
export const loginUser = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  const data = await response.json();
  setAuthToken(data.access_token);
  return data;
};

export const registerUser = async (userData) => {
  console.log(userData);
  console.log(JSON.stringify(userData));
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }

  return await response.json();
};

export const verifyEmail = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Email verification failed');
  }

  return await response.json();
};

export const changePassword = async (oldPassword: string, newPassword: string, isSheet: boolean = false) => {
  return await apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
      is_sheet: isSheet,
    }),
  });
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Password reset request failed');
  }

  return await response.json();
};

export const validateResetToken = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/account/users/_self_`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if(response.status == 401) {
    throw new Error('The email address was not recognized.')
  }
}

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_password: newPassword, token: token }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Password reset failed');
  }

  return await response.json();
};

// Problem API calls
export const getMySheet = async () => {
  return await apiRequest('/problemset/mySheet');
};

export const viewSheet = async (username, accessCode) => {
  return await apiRequest(`/problemset/viewSheet/${username}/${accessCode}/`);
};

export const createProblem = async (problemData) => {
  return await apiRequest('/problemset/create', {
    method: 'POST',
    body: JSON.stringify(problemData),
  });
};

export const addProblem = async (problemId) => {
  return await apiRequest(`/problemset/add/${problemId}`, {
    method: 'POST',
  });
};

export const updateProblemStatus = async (problemId) => {
  return await apiRequest(`/problemset/status_update/${problemId}`, {
    method: 'PATCH',
  });
};

export const deleteProblem = async (problemId) => {
  return await apiRequest(`/problemset/delete/${problemId}`, {
    method: 'DELETE',
  });
};

// Logout utility
export const logout = () => {
  removeAuthToken();
  window.location.href = '/auth';
};
