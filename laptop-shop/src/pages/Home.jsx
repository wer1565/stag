import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import CategoryList from '../components/CategoryList';
import { Container, TextField, Typography } from '@mui/material';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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
