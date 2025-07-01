from rest_framework import serializers
from .models import Category, Product, Order, OrderItem, UserProfile
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'specs', 'category', 'category_id']

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'total_price', 'items']
        read_only_fields = ['total_price', 'user']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        total_price = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            price_at_order = product.price
            OrderItem.objects.create(order=order, product=product, quantity=quantity, price=price_at_order)
            total_price += price_at_order * quantity
        
        order.total_price = total_price
        order.save()
        return order

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source='user.email')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'phone_number', 'email', 'username']
        read_only_fields = ['email', 'username']