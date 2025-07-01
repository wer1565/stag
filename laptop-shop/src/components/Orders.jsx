import React, { useEffect, useState } from 'react';
import { getOrders } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Typography, List, ListItem, ListItemText, Alert, Box } from '@mui/material';
import '../css/Orders.css';

const Orders = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('Только авторизованные пользователи могут просматривать заказы.');
        return;
      }
      try {
        const data = await getOrders(token);
        setOrders(data.results || data);
      } catch (e) {
        setError('Ошибка при получении заказов');
      }
    };
    fetchOrders();
  }, [token]);

  if (!user) {
    return <Alert severity="warning">Войдите, чтобы просмотреть свои заказы.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Мои заказы</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {orders.length === 0 && !error && (
        <Alert severity="info">У вас пока нет заказов.</Alert>
      )}
      <List>
        {orders.map(order => (
          <ListItem key={order.id} alignItems="flex-start">
            <ListItemText
              primary={`Заказ #${order.id} — ${order.status} — ${order.total_price} ₽`}
              secondary={
                <>
                  <div>Дата: {new Date(order.created_at).toLocaleString()}</div>
                  <div>
                    Товары:
                    <ul>
                      {order.items && order.items.map(item => (
                        <li key={item.id}>{item.product.name} x{item.quantity} — {item.price} ₽</li>
                      ))}
                    </ul>
                  </div>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Orders; 