import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder } from '../api/api';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  pending: 'В обработке',
  paid: 'Оплачен',
  shipped: 'Отправлен',
  completed: 'Завершён',
  canceled: 'Отменён',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'В обработке' },
  { value: 'paid', label: 'Оплачен' },
  { value: 'shipped', label: 'Отправлен' },
  { value: 'completed', label: 'Завершён' },
  { value: 'canceled', label: 'Отменён' },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useAuth();
  const [status, setStatus] = useState('pending');
  const [saving, setSaving] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getOrders(token)
      .then(data => setOrders(data.results || data))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setSaving(true);
    // Here you would typically send a request to update the order status
    setSaving(false);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      await updateOrder(selectedOrder.id, { status }, token);
      setSelectedOrder({ ...selectedOrder, status });
      fetchOrders();
    } catch (e) {
      alert('Ошибка при обновлении статуса заказа');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <Box sx={{ pb: 12 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Список заказов</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell>{STATUS_LABELS[order.status] || order.status}</TableCell>
                  <TableCell>{order.total_price} ₽</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => setSelectedOrder(order)}>Детали</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Модальное окно с деталями заказа */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        <DialogTitle>Детали заказа #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography>Пользователь: {selectedOrder.user}</Typography>
              <Typography>Дата: {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel id="status-label">Статус</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Статус"
                  onChange={handleStatusChange}
                  disabled={saving}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography>Сумма: {selectedOrder.total_price} ₽</Typography>
              <Typography sx={{ mt: 2, mb: 1 }}>Товары:</Typography>
              <List>
                {selectedOrder.items && selectedOrder.items.map(item => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={`${item.product_name || (item.product && item.product.name) || ''} x${item.quantity}`}
                      secondary={`Цена: ${item.price} ₽`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)} disabled={saving}>Закрыть</Button>
          <Button onClick={handleSaveStatus} variant="contained" disabled={saving || !selectedOrder || status === selectedOrder.status}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminOrders; 