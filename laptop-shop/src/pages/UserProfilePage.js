import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './UserProfilePage.css';

function UserProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  const STATUS_LABELS = {
    pending: 'В обработке',
    paid: 'Оплачен',
    shipped: 'Отправлен',
    completed: 'Завершён',
    canceled: 'Отменён',
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const profileResponse = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(profileResponse.data);
        setFormData({
          first_name: profileResponse.data.first_name || '',
          last_name: profileResponse.data.last_name || '',
          phone_number: profileResponse.data.phone_number || '',
        });

        // Fetch user orders
        const ordersResponse = await axios.get('http://localhost:8000/api/orders/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(ordersResponse.data.results);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Не удалось загрузить данные пользователя.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put('http://localhost:8000/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile({ ...profile, ...formData });
      setEditMode(false);
      alert('Профиль успешно обновлен!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Не удалось обновить профиль.');
    }
  };

  if (loading) {
    return <Container><CircularProgress /></Container>;
  }

  if (error) {
    return <Container><Alert severity="error">{error}</Alert></Container>;
  }

  if (!user) {
    return <Container><Alert severity="warning">Пожалуйста, войдите в систему, чтобы просмотреть личный кабинет.</Alert></Container>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Личный кабинет
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>Мой профиль</Typography>
          {profile && (
            <>
              <Typography><strong>Имя пользователя:</strong> {profile.username}</Typography>
              <Typography><strong>Email:</strong> {profile.email}</Typography>
              
              {editMode ? (
                <Box component="form" sx={{ mt: 2 }}>
                  <TextField
                    label="Имя"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Фамилия"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Номер телефона"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <Button variant="contained" onClick={handleUpdateProfile} sx={{ mt: 2, mr: 1 }}>
                    Сохранить
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)} sx={{ mt: 2 }}>
                    Отмена
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography><strong>Имя:</strong> {profile.first_name || 'Не указано'}</Typography>
                  <Typography><strong>Фамилия:</strong> {profile.last_name || 'Не указана'}</Typography>
                  <Typography><strong>Номер телефона:</strong> {profile.phone_number || 'Не указан'}</Typography>
                  <Button variant="outlined" onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
                    Редактировать профиль
                  </Button>
                </>
              )}
            </>
          )}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>История заказов</Typography>
          {orders.length === 0 ? (
            <Typography>У вас пока нет заказов.</Typography>
          ) : (
            <List>
              {orders.map((order) => (
                <ListItem key={order.id} divider>
                  <ListItemText
                    primary={`Заказ #${order.id} - ${new Date(order.created_at).toLocaleDateString()}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Статус: {STATUS_LABELS[order.status] || order.status}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Общая сумма: {order.total_price}
                        </Typography>
                        {order.items && order.items.length > 0 && (
                          <Box sx={{ pl: 2, mt: 1 }}>
                            <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>
                              Товары:
                            </Typography>
                            <List dense>
                              {order.items.map((item) => (
                                <ListItem key={item.id}>
                                  <ListItemText primary={`- ${item.product_name} x ${item.quantity} (${item.price} за шт.)`} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default UserProfilePage; 