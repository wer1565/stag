import React, { useState } from 'react';
import { login, getProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const { loginUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!captcha) {
      setError('Подтвердите, что вы не робот');
      return;
    }
    try {
      const data = await login(username, password, captcha);
      loginUser(username, data.access);
      const profile = await getProfile(data.access);
      if (profile.is_superuser) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Вход</Typography>
      <TextField
        label="Логин"
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Пароль"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <ReCAPTCHA
          sitekey="6Lc2gXgrAAAAAPClux4GkAys6h2-ptlOzTWvVB2G"
          onChange={value => setCaptcha(value)}
        />
      </Box>
      <Button type="submit" variant="contained" fullWidth>Войти</Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default Login;