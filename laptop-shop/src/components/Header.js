import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container as MuiContainer, Badge, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../css/Header.css';

function Header() {
  const { user, logoutUser, isAdmin } = useAuth();
  const { getTotalQuantity } = useCart();
  const totalQuantity = getTotalQuantity();

  return (
    <AppBar position="fixed" sx={{ zIndex: 1000 }}>
      <Toolbar>
        {/* Левая часть - навигация */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && <Button color="inherit" component={Link} to="/">Каталог</Button>}
          {!user && <Button color="inherit" component={Link} to="/login">Вход</Button>}
          {!user && <Button color="inherit" component={Link} to="/register">Регистрация</Button>}
          <Button color="inherit" component={Link} to="/about">О нас</Button>
        </Box>

        {/* Центральная часть - контактные телефоны */}
        <Box sx={{ display: 'flex', alignItems: 'center', mx: 'auto' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            📞 +375 (29) 123-45-67
          </Typography>
          <Typography variant="body2">
            📞 +375 (33) 987-65-43
          </Typography>
        </Box>

        {/* Правая часть - пользователь и корзина */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <>
              <Button color="inherit" component={Link} to={isAdmin ? "/admin" : "/profile"}>
                {isAdmin ? "Кабинет администратора" : "Личный кабинет"}
              </Button>
              <Typography sx={{ ml: 2, mr: 2 }}>Привет, {user}!</Typography>
              <Button color="inherit" onClick={logoutUser}>Выйти</Button>
            </>
          )}
          {user && (
            <Badge badgeContent={totalQuantity} color="error" sx={{ ml: 2 }}>
              <Button color="inherit" component={Link} to="/cart">
                Корзина
              </Button>
            </Badge>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 