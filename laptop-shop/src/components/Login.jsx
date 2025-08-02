import React, { useState } from 'react';
import { login, getProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

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
      const profile = await getProfile(data.access);
      console.log('PROFILE:', profile);
      loginUser(username, data.access, profile.is_superuser);
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
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={value => setCaptcha(value)}
        />
      </Box>
      <Button type="submit" variant="contained" fullWidth>Войти</Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default Login;