from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserChangeForm, UserSignUpForm
from .models import User, Priority, Category, Task


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserSignUpForm
    model = User
    list_display = ['email', 'username', 'is_staff','is_active', 'is_superuser']

    fieldsets =  (
        (None, {'fields': ('username', 'password', 'email')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )


admin.site.register(User, UserAdmin)
admin.site.register(Priority)
admin.site.register(Category)
admin.site.register(Task)