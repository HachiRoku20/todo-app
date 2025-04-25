from django.contrib import admin
from django.urls import path, include, re_path
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('core.urls')),
    path('api/', include('api.api_urls.urls')),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

]
