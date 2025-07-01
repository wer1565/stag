import React, { useEffect, useState } from 'react';
import { getCategories } from '../api/api';
import { Stack, Button } from '@mui/material';
import './CategoryList.css';

const CategoryList = ({ onSelect, selected }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(data => setCategories(data.results || data));
  }, []);

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button
        variant={!selected ? "contained" : "outlined"}
        onClick={() => onSelect(null)}
      >
        Все категории
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selected === category.id ? "contained" : "outlined"}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </Stack>
  );
};

export default CategoryList;