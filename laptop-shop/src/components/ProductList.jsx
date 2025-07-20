import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getProducts } from '../api/api';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Modal,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { useCart } from '../context/CartContext';
import '../css/ProductList.css';

const ProductList = ({ category, search }) => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Для модального окна
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const { addToCart } = useCart();
  const observer = useRef();
  const pageSize = 8; // должно совпадать с PAGE_SIZE в DRF

  // Сброс при смене фильтра/поиска
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [category, search]);

  // Загрузка товаров
  useEffect(() => {
    let ignore = false;
    const params = { page };
    if (category) params.category = category;
    if (search) params.search = search;
    setLoading(true);
    getProducts(params)
      .then(data => {
        if (ignore) return;
        setProducts(prev => page === 1 ? (data.results || []) : [...prev, ...(data.results || [])]);
        setCount(data.count || 0);
        setHasMore((data.results || []).length === pageSize);
        setLoading(false);
      })
      .catch(() => {
        setHasMore(false);
        setLoading(false);
      });
    return () => { ignore = true; };
  }, [category, search, page]);

  // Intersection Observer для бесконечной прокрутки
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Masonry columns={2} spacing={2}>
        {products.map((product, idx) => (
          <div key={product.id} ref={products.length - 1 === idx ? lastProductRef : undefined}>
            <Card>
              <CardActionArea onClick={() => handleOpen(product)}>
                {product.image && (
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{ height: 160, objectFit: 'contain' }}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {product.price} ₽
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </Masonry>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {/* Модальное окно с кнопкой "В корзину" */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedProduct && (
            <>
              {selectedProduct.image && (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ width: '100%', marginBottom: 16, borderRadius: 8 }}
                />
              )}
              <Typography variant="h6" gutterBottom>
                {selectedProduct.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedProduct.description}
              </Typography>
              {/* Таблица характеристик */}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Основные характеристики:</Typography>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
              <Typography variant="subtitle1" color="primary" gutterBottom>
                {selectedProduct.price} ₽
              </Typography>
              <Button
                onClick={() => {
                  addToCart(selectedProduct);
                  handleClose();
                }}
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
              >
                В корзину
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                fullWidth
                sx={{ mt: 1 }}
              >
                Закрыть
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ProductList;