import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUser } from '../api/api';
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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const { token, user } = useAuth();

  const fetchUsers = () => {
    setLoading(true);
    getUsers(token)
      .then(data => setUsers(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этого пользователя?')) return;
    setSaving(true);
    try {
      await deleteUser(id, token);
      fetchUsers();
    } catch (e) {
      alert('Ошибка при удалении пользователя');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRole = async (u) => {
    setSaving(true);
    try {
      await updateUser(u.id, { is_superuser: !u.is_superuser }, token);
      fetchUsers();
    } catch (e) {
      alert('Ошибка при смене роли пользователя');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 12 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Список пользователей</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Логин</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Дата регистрации</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.is_superuser ? 'Администратор' : 'Пользователь'}</TableCell>
                  <TableCell>{new Date(u.date_joined).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => setSelectedUser(u)}>Детали</Button>
                    <IconButton size="small" color="error" onClick={() => handleDelete(u.id)} disabled={saving || u.username === user} title="Удалить пользователя">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Модальное окно с деталями пользователя */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <DialogTitle>Пользователь #{selectedUser?.id}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <Typography>Логин: {selectedUser.username}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Роль: {selectedUser.is_superuser ? 'Администратор' : 'Пользователь'}</Typography>
              <Typography>Дата регистрации: {new Date(selectedUser.date_joined).toLocaleString()}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminUsers; 