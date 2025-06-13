import React from 'react';
import { Navigate } from 'react-router-dom';

function isTokenValid() {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now(); // exp in seconds → ms
  } catch (e) {
    return false;
  }
}

const Auth = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
};

export default Auth;
