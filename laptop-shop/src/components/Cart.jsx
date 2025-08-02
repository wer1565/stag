import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, List, ListItem, ListItemText, Alert, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createOrder } from '../api/api';
import '../css/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user, token } = useAuth();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!user || !token) {
      setOrderError('Только зарегистрированные пользователи могут оформить заказ.');
      setOrderSuccess(false);
      return;
    }
    try {
      const items = cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      }));
      await createOrder(items, token);
      setOrderSuccess(true);
      setOrderError('');
      clearCart();
    } catch (error) {
      setOrderError('Ошибка при оформлении заказа');
      setOrderSuccess(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Корзина</Typography>
      <List>
        {cart.length === 0 && (
          <ListItem>
            <ListItemText primary="Корзина пуста" />
          </ListItem>
        )}
        {cart.map(item => (
          <ListItem key={item.id} secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                {item.quantity}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <AddIcon />
              </IconButton>
              <Button color="error" onClick={() => removeFromCart(item.id)}>
                Удалить
              </Button>
            </Box>
          }>
            <ListItemText
              primary={item.name}
              secondary={`${item.price} ₽ за шт.`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" sx={{ mt: 2 }}>Итого: {total} ₽</Typography>
      <Button variant="contained" color="secondary" onClick={clearCart} sx={{ mt: 2 }}>
        Очистить корзину
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleOrder}
        sx={{ mt: 2, ml: 2 }}
        disabled={cart.length === 0}
      >
        Оформить заказ
      </Button>
      {orderSuccess && <Alert severity="success" sx={{ mt: 2 }}>Заказ успешно оформлен!</Alert>}
      {orderError && <Alert severity="error" sx={{ mt: 2 }}>{orderError}</Alert>}
    </Box>
  );
};

export default Cart;