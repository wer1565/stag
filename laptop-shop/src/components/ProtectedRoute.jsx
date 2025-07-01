import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
        <Alert severity="warning">
          Пожалуйста, войдите в систему, чтобы получить доступ к этой странице.
        </Alert>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute; 