from django import forms
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth import get_user_model


User = get_user_model()

class UserChangeForm(UserChangeForm):
    """
    A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    class Meta(UserChangeForm.Meta):
        model = User
        fields = "__all__"                  
                                    