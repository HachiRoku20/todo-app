from core.models import BaseModel, User
from django.db import models


class Todo(BaseModel):
    title = models.CharField(max_length=120)
    text = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')

    def __str__(self):
        return self.title
