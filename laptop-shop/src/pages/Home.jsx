import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import CategoryList from '../components/CategoryList';
import { Container, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth={false} disableGutters sx={{ mt: 4 }}>
        <Alert severity="info">
          Пожалуйста, войдите в систему, чтобы просмотреть каталог товаров.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Интернет-магазин ноутбуков
      </Typography>
      <CategoryList onSelect={setSelectedCategory} selected={selectedCategory} />
      <TextField
        fullWidth
        label="Поиск..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />
      <ProductList category={selectedCategory} search={search} />
    </Container>
  );
};

export default Home;
