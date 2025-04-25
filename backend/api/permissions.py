from rest_framework import permissions


class IsOwnerOrSuperAdmin(permissions.BasePermission):
    """
    Custom permission to allow only the owner of the todo to view, edit, or delete it,
    unless the user is a superadmin.
    """

    def has_object_permission(self, request, view, obj):
        # Allow superusers to access any todo
        if request.user.is_superuser:
            return True

        # Only allow access if the current user is the owner of the todo
        return obj.user == request.user
