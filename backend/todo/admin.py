from django.contrib import admin
from .models import Todo


class TodoAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'completed']
    list_filter = ['completed', 'user']
    search_fields = ['title', 'text', 'user__email']


admin.site.register(Todo, TodoAdmin)
