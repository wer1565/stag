from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, OrderViewSet, register, UserProfileView, UserOrderList, UserViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('register/', register, name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('orders/me/', UserOrderList.as_view(), name='user-orders'),
]
urlpatterns += router.urls