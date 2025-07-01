import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Tabs, Tab, Box, Alert } from '@mui/material';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = React.useState(0);

  // Пример проверки: имя пользователя admin (можно заменить на is_staff/is_superuser)
  if (user !== 'admin') {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Доступ разрешён только администраторам!</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Кабинет администратора</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Товары" />
        <Tab label="Заказы" />
        <Tab label="Пользователи" />
      </Tabs>
      <Box hidden={tab !== 0}>
        <AdminProducts />
      </Box>
      <Box hidden={tab !== 1}>
        <AdminOrders />
      </Box>
      <Box hidden={tab !== 2}>
        <Typography>Здесь будет управление пользователями</Typography>
      </Box>
    </Container>
  );
}

export default AdminPanel; 