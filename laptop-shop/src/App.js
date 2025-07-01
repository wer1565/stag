import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Header from './components/Header';
import Footer from './components/Footer';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { Container } from '@mui/material';
import { useAuth } from './context/AuthContext';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  return (
    <Router>
      <Header />
      <Container sx={{ mt: 10, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;