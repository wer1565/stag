import React from 'react';
import './Header.css'; // Предполагается, что вы создадите этот файл для стилей

function Header() {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><a href="/">Главная</a></li>
          <li><a href="/products">Продукты</a></li>
          <li><a href="/about">О нас</a></li>
          <li><a href="/contact">Контакты</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header; 