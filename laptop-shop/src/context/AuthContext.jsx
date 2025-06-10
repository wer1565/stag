import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem('user'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const loginUser = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', user);
    localStorage.setItem('token', token);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};