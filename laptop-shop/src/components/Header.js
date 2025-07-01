import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container as MuiContainer } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import '../css/Header.css';

function Header() {
  const { user, logoutUser } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: 1000 }}>
      <Toolbar>
        {user && <Button color="inherit" component={Link} to="/">Каталог</Button>}
        {!user && <Button color="inherit" component={Link} to="/login">Вход</Button>}
        {!user && <Button color="inherit" component={Link} to="/register">Регистрация</Button>}
        {user && (
          <>
            {/* <Button color="inherit" component={Link} to="/orders">Мои заказы</Button> */}
            <Button color="inherit" component={Link} to="/profile">Личный кабинет</Button>
            <Typography sx={{ ml: 2, mr: 2 }}>Привет, {user}!</Typography>
            <Button color="inherit" onClick={logoutUser}>Выйти</Button>
          </>
        )}
        {user && (
          <Button color="inherit" component={Link} to="/cart" sx={{ ml: 'auto' }}>
            Корзина
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header; 