from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from .models import Category, Product, Order, UserProfile
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, UserProfileSerializer, UserSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
import requests
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .utils import send_order_status_notification

def verify_captcha(token):
    secret = settings.RECAPTCHA_SECRET_KEY  # теперь берём из настроек
    url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': secret,
        'response': token
    }
    r = requests.post(url, data=data)
    result = r.json()
    return result.get('success', False)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        captcha_token = self.context['request'].data.get('recaptcha')
        if not captcha_token or not verify_captcha(captcha_token):
            raise serializers.ValidationError({'error': 'Капча не пройдена'})
        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
def register(request):
    captcha_token = request.data.get('recaptcha')
    if not captcha_token or not verify_captcha(captcha_token):
        return Response({'error': 'Капча не пройдена'}, status=status.HTTP_400_BAD_REQUEST)
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    if not username or not password:
        return Response({'error': 'Необходимо указать имя пользователя и пароль.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Пользователь с таким именем уже существует.'}, status=status.HTTP_400_BAD_REQUEST)
    if email and User.objects.filter(email=email).exists():
        return Response({'error': 'Пользователь с таким email уже существует.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'Пользователь успешно зарегистрирован.'}, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class UserOrderList(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

@api_view(['POST'])
def send_order_notification(request, order_id):
    """
    Отправляет email уведомление для заказа (только для администраторов)
    """
    if not request.user.is_staff:
        return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        order = Order.objects.get(id=order_id)
        send_order_status_notification(order)
        return Response({'message': f'Email уведомление отправлено для заказа #{order_id}'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Ошибка отправки email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)