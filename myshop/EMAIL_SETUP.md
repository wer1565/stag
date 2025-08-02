# Настройка Email уведомлений

## Для отправки email уведомлений при изменении статуса заказа необходимо настроить SMTP сервер.

### Настройка Gmail (рекомендуется):

1. **Включите двухфакторную аутентификацию** в вашем Google аккаунте
2. **Создайте пароль приложения:**
   - Перейдите в настройки безопасности Google
   - Выберите "Пароли приложений"
   - Создайте новый пароль для "Почта"
   - Скопируйте сгенерированный пароль

3. **Обновите файл `myshop/myshop/config_secrets.py`:**
   ```python
   EMAIL_HOST_USER = 'your-email@gmail.com'  # Ваш Gmail адрес
   EMAIL_HOST_PASSWORD = 'your-app-password'  # Пароль приложения
   ```

### Альтернативные SMTP серверы:

#### Yandex:
```python
EMAIL_HOST = 'smtp.yandex.ru'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@yandex.ru'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

#### Mail.ru:
```python
EMAIL_HOST = 'smtp.mail.ru'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@mail.ru'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

### Тестирование настроек:

После настройки выполните команду:
```bash
python manage.py test_email your-email@example.com
```

### Функциональность:

1. **Автоматические уведомления** - при изменении статуса заказа пользователь получает email
2. **HTML письма** - красивое оформление с информацией о заказе
3. **Асинхронная отправка** - не блокирует основной поток
4. **Ручная отправка** - администратор может отправить уведомление вручную через API

### API для ручной отправки:

```
POST /api/orders/{order_id}/send-notification/
Authorization: Bearer {admin_token}
```

### Пример email уведомления:

```
Тема: Статус заказа #123 изменен

Здравствуйте, username!

Статус вашего заказа #123 был изменен на: Оплачен
Сумма заказа: 1500.00 ₽
Дата создания: 15.12.2024 14:30

Спасибо за ваш заказ!
``` 