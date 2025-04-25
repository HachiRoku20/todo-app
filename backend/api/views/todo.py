from rest_framework import viewsets
from todo.models import Todo
from todo.serializers import TodoSerializer
from api.permissions import IsOwnerOrSuperAdmin
from rest_framework.permissions import IsAuthenticated
from api.pagination import CustomPagination


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrSuperAdmin]
    pagination_class = CustomPagination

    def get_queryset(self):
        return self.queryset.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(is_active=True, created_by=self.request.user, updated_by=self.request.user, user=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
