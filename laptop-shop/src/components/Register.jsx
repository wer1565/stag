import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { register } from '../api/api';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!captchaToken) {
      setError('Подтвердите, что вы не робот!');
      return;
    }
    try {
      await register(username, password, email, captchaToken);
      setSuccess('Регистрация успешна! Перенаправляем на страницу входа...');
      // Перенаправляем на страницу входа через 2 секунды
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch {
      setError('Ошибка регистрации');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
      <TextField
        label="Логин"
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
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
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        onChange={setCaptchaToken}
        style={{ marginBottom: 16 }}
      />
      <Button type="submit" variant="contained" fullWidth>Зарегистрироваться</Button>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default Register;