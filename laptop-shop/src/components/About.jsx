import React from 'react';
import { Box, Typography, Paper, Grid, Container } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        О нас
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Наша компания
            </Typography>
            <Typography variant="body1" paragraph>
              Мы являемся ведущим поставщиком качественных ноутбуков и компьютерной техники в Беларуси. 
              Наша миссия - предоставить нашим клиентам лучшие продукты по доступным ценам.
            </Typography>
            <Typography variant="body1" paragraph>
              Мы работаем с 2010 года и за это время помогли тысячам клиентов найти идеальное решение 
              для их потребностей в компьютерной технике.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Наши преимущества
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>✅ Широкий ассортимент ноутбуков</li>
                <li>✅ Гарантия качества на все товары</li>
                <li>✅ Быстрая доставка по всей Беларуси</li>
                <li>✅ Профессиональная консультация</li>
                <li>✅ Сервисное обслуживание</li>
                <li>✅ Гибкая система оплаты</li>
              </ul>
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Контактная информация
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  📞 Телефоны
                </Typography>
                <Typography variant="body1">
                  +375 (29) 123-45-67<br />
                  +375 (33) 987-65-43
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  📧 Email
                </Typography>
                <Typography variant="body1">
                  info@laptop-shop.by<br />
                  support@laptop-shop.by
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  🏢 Адрес
                </Typography>
                <Typography variant="body1">
                  г. Минск, ул. Примерная, 123<br />
                  Пн-Пт: 9:00-18:00
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 