from django.db import models
from django.contrib.auth.models import User
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Категория")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, verbose_name="Категория")
    name = models.CharField(max_length=200, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    image = models.ImageField(blank=True, null=True, upload_to='products/', verbose_name="Изображение")
    specs = models.JSONField(blank=True, null=True, verbose_name="Характеристики")  # для хранения характеристик ноутбука

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs) # Сначала сохраняем, чтобы получить путь к файлу

        if self.image:
            img = Image.open(self.image.path)

            # Определяем максимальный размер (например, 400px по ширине)
            max_width = 400
            max_height = 400 # Или можно сохранить пропорции, если одна сторона будет больше

            if img.width > max_width or img.height > max_height:
                output_size = (max_width, max_height)
                img.thumbnail(output_size, Image.LANCZOS) # Изменение размера с сохранением пропорций

                # Сохраняем измененное изображение
                output = BytesIO()
                # Определяем формат исходя из расширения файла
                file_extension = self.image.name.split('.')[-1].lower()
                if file_extension == 'jpg' or file_extension == 'jpeg':
                    img.save(output, format='JPEG', quality=90)
                elif file_extension == 'png':
                    img.save(output, format='PNG', optimize=True)
                else:
                    # По умолчанию сохраняем в JPEG
                    img.save(output, format='JPEG', quality=90)

                output.seek(0)
                self.image = InMemoryUploadedFile(
                    output,
                    'ImageField',
                    self.image.name,
                    'image/jpeg', # Можно улучшить определение MIME-типа
                    len(output.getvalue()),
                    None
                )
                super().save(update_fields=['image']) # Сохраняем еще раз с новым изображением

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'В обработке'),
        ('paid', 'Оплачен'),
        ('shipped', 'Отправлен'),
        ('completed', 'Завершён'),
        ('canceled', 'Отменён'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Статус")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Сумма заказа")

    def __str__(self):
        return f"Заказ #{self.id} от {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE, verbose_name="Заказ")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена за единицу")

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


