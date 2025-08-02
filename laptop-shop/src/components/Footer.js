import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Footer() {
  return (
    <AppBar position="static" sx={{ mt: 'auto' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="body2" color="inherit">
          &copy; 2025 Ваш магазин. Все права защищены.
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer; 