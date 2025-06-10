import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Pagination,
  Stack,
  Modal,
  Box,
  Button,
} from '@mui/material';
import { useCart } from '../context/CartContext';

const ProductList = ({ category, search }) => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  // Для модального окна
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const params = { page };
    if (category) params.category = category;
    if (search) params.search = search;
    getProducts(params).then(data => {
      setProducts(data.results || []);
      setCount(data.count || 0);
    });
  }, [category, search, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const pageSize = 8; // должно совпадать с PAGE_SIZE в DRF

  return (
    <>
      <Grid container spacing={2}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
          </Grid>
        ))}
      </Grid>
      {count > pageSize && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(count / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
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