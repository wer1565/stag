import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Header from './components/Header';
import Footer from './components/Footer';
import { AppBar, Toolbar, Button, Container, Dialog, Typography } from '@mui/material';
import { useAuth } from './context/AuthContext';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  return (
    <Router>
      <Header />
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Каталог</Button>
          {!user && <Button color="inherit" component={Link} to="/login">Вход</Button>}
          {!user && <Button color="inherit" component={Link} to="/register">Регистрация</Button>}
          {user && (
            <>
              <Button color="inherit" component={Link} to="/orders">Мои заказы</Button>
              <Typography sx={{ ml: 2, mr: 2 }}>Привет, {user}!</Typography>
              <Button color="inherit" onClick={logoutUser}>Выйти</Button>
            </>
          )}
          <Button color="inherit" onClick={() => setCartOpen(true)} sx={{ ml: 'auto' }}>
            Корзина
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
        <Dialog open={cartOpen} onClose={() => setCartOpen(false)} maxWidth="sm" fullWidth>
          <Cart />
          <Button onClick={() => setCartOpen(false)} sx={{ m: 2 }}>
            Закрыть
          </Button>
        </Dialog>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;