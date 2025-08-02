import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem('user'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  const loginUser = (user, token, isAdminUser = false) => {
    setUser(user);
    setToken(token);
    setIsAdmin(isAdminUser);
    localStorage.setItem('user', user);
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', isAdminUser.toString());
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};