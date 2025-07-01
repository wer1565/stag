import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../api/api';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', category_id: '' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { token } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    let allProducts = [];
    let page = 1;
    let total = 0;
    let pageSize = 100;
    do {
      const data = await getProducts({ page, page_size: pageSize });
      allProducts = allProducts.concat(data.results || []);
      total = data.count || 0;
      page++;
    } while (allProducts.length < total);
    setProducts(allProducts);
    setLoading(false);
  };

  const fetchCategories = () => {
    getCategories().then(data => setCategories(data.results || data));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditProduct(null);
    setForm({ name: '', price: '', description: '', category_id: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category_id: product.category || product.category_id || '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setForm({ name: '', price: '', description: '', category_id: '' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setForm({ ...form, category_id: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, category_id: Number(form.category_id) };
      if (editProduct) {
        await updateProduct(editProduct.id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      handleCloseModal();
      fetchProducts();
    } catch (e) {
      alert('Ошибка при сохранении товара');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот товар?')) return;
    setSaving(true);
    try {
      await deleteProduct(id, token);
      fetchProducts();
    } catch (e) {
      alert('Ошибка при удалении товара');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 12 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Список товаров</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>Добавить товар</Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price} ₽</TableCell>
                  <TableCell>
                    {product.category_name ||
                     (typeof product.category === 'object' && product.category !== null
                       ? product.category.name
                       : product.category)}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(product)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(product.id)} disabled={saving}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Модальное окно для добавления/редактирования товара */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{editProduct ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Название"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Цена"
            name="price"
            value={form.price}
            onChange={handleFormChange}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-label">Категория</InputLabel>
            <Select
              labelId="category-label"
              name="category_id"
              value={form.category_id}
              label="Категория"
              onChange={handleCategoryChange}
            >
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Описание"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={saving}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>{editProduct ? 'Сохранить' : 'Добавить'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminProducts; 