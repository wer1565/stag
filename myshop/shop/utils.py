from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_order_status_notification(order):
    """
    Отправляет email уведомление пользователю об изменении статуса заказа
    """
    subject = f'Статус заказа #{order.id} изменен'
    
    # Получаем русское название статуса
    status_names = {
        'pending': 'В обработке',
        'paid': 'Оплачен',
        'shipped': 'Отправлен',
        'completed': 'Завершён',
        'canceled': 'Отменён',
    }
    
    status_name = status_names.get(order.status, order.status)
    
    # HTML версия письма
    html_message = f"""
    <html>
    <body>
        <h2>Уведомление о заказе</h2>
        <p>Здравствуйте, {order.user.username}!</p>
        <p>Статус вашего заказа <strong>#{order.id}</strong> был изменен на: <strong>{status_name}</strong></p>
        <p>Сумма заказа: {order.total_price} ₽</p>
        <p>Дата создания: {order.created_at.strftime('%d.%m.%Y %H:%M')}</p>
        <br>
        <p>Спасибо за ваш заказ!</p>
    </body>
    </html>
    """
    
    # Текстовая версия письма
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Email уведомление отправлено для заказа #{order.id}")
    except Exception as e:
        print(f"Ошибка отправки email для заказа #{order.id}: {e}") 