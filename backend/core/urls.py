from django.urls import path
from .views import CustomTokenObtainPairView, TokenRefreshView


app_name = 'core'

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
