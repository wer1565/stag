# myshop/scraper.py

import os
import django
import requests
from bs4 import BeautifulSoup
from decimal import Decimal
import re
from urllib.parse import urljoin
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

# Инициализация Django-окружения
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myshop.settings')
django.setup()

from shop.models import Category, Product

def parse_and_save_products():
    base_url = "https://7745.by"
    catalog_url = urljoin(base_url, "/catalog/noutbuki")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(catalog_url, headers=headers)
        response.raise_for_status()  # Вызовет исключение для ошибок HTTP (4xx или 5xx)
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при запросе к сайту: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # Создадим или получим категорию "Ноутбуки"
    notebook_category, created = Category.objects.get_or_create(
        name="Ноутбуки",
        defaults={'description': "Все ноутбуки из магазина 7745.by"}
    )
    if created:
        print(f"Категория 'Ноутбуки' создана.")

    # Находим все карточки товаров
    products_divs = soup.find_all('div', class_='catalog-item__wrapper')

    if not products_divs:
        print("Карточки товаров не найдены. Проверьте правильность селекторов или структуру сайта.")
        return

    for product_div in products_divs:
        # Название товара
        name_tag = product_div.select_one('.catalog-item__row-block-info > div > a')
        name = name_tag.get_text(strip=True) if name_tag else "N/A"

        # Ссылка на карточку товара
        product_url = None
        if name_tag and name_tag.has_attr('href'):
            product_url = urljoin(base_url, name_tag['href'])

        # Цена товара (извлекаем из data-price атрибута)
        price_div = product_div.find('div', class_='item-block_main-price')
        price = Decimal('0.00')
        if price_div and 'data-price' in price_div.attrs:
            try:
                price = Decimal(price_div['data-price'])
            except Exception:
                pass # Оставляем 0.00 если не удалось преобразовать

        # Изображение
        image_tag = product_div.find('img') # Предполагаем, что это первая img в карточке
        image_path = None
        if image_tag and 'src' in image_tag.attrs:
            relative_image_url = image_tag['src']
            image_url = urljoin(base_url, relative_image_url)
            try:
                image_response = requests.get(image_url, stream=True) # Использование stream=True для больших файлов
                image_response.raise_for_status()
                file_name = os.path.basename(image_url).split('?')[0]
                full_path = os.path.join('products', file_name)
                if not default_storage.exists(full_path):
                    img_content = ContentFile(image_response.content)
                    image_path = default_storage.save(full_path, img_content)
                    print(f"Изображение сохранено: {image_path}")
                else:
                    image_path = full_path
                    print(f"Изображение уже существует: {image_path}")
            except requests.exceptions.RequestException as e:
                print(f"Ошибка при скачивании изображения {image_url}: {e}")
            except Exception as e:
                print(f"Неожиданная ошибка при сохранении изображения: {e}")

        # --- Новый код: парсинг описания и характеристик товара ---
        description = "Описание будет добавлено позже."
        specs = {}
        if product_url:
            try:
                print(f"Парсим карточку товара: {product_url}")
                product_resp = requests.get(product_url, headers=headers)
                print(f"Статус ответа карточки: {product_resp.status_code}")
                product_resp.raise_for_status()
                product_soup = BeautifulSoup(product_resp.text, 'html.parser')
                # Описание
                desc_tag = product_soup.select_one(
                    '#content > div.product > div.product_card.js-product-control-root > div.product_card__center-info-block > div.preview-characteristics'
                )
                if desc_tag:
                    description = desc_tag.get_text(strip=True)
                    print(f"Описание найдено: {description[:60]}...")
                # Характеристики
                specs_ul = product_soup.select_one('ul.preview-characteristics_wrapper')
                if specs_ul:
                    for li in specs_ul.select('li.preview-characteristics_item'):
                        key_div = li.select_one('.dot-leaders_prop')
                        value_div = li.select_one('.dot-leaders_value')
                        key = key_div.get_text(strip=True) if key_div else ''
                        value = value_div.get_text(strip=True) if value_div else ''
                        if key and value:
                            specs[key] = value
                        print(f"key: {key}, value: {value}")
                    print(f"Характеристик собрано: {len(specs)}")
                else:
                    print("НЕ нашли ul.preview-characteristics_wrapper")
            except Exception as e:
                print(f'Ошибка при парсинге описания/характеристик товара: {e}')
        # --- Конец нового кода ---

        # Создаем или обновляем продукт
        product, created = Product.objects.get_or_create(
            name=name,
            defaults={
                'category': notebook_category,
                'description': description,
                'price': price,
                'image': image_path, # Теперь это путь к локальному файлу
                'specs': specs
            }
        )
        if not created:
            if image_path and product.image != image_path:
                product.image = image_path
            product.price = price
            product.specs = specs  # теперь обновляем характеристики
            product.save()
            print(f"Обновлен товар: {name} - {price} BYN")
        else:
            print(f"Добавлен новый товар: {name} - {price} BYN")

    print("Парсинг завершен.")

if __name__ == '__main__':
    parse_and_save_products()