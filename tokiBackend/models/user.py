from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator


class User(AbstractUser):
    """
    Custom User model that extends AbstractUser. 
    Email field is added as a unique attribute and added EmailValidator 
    ensures the input is a valid email address.
    """
    email = models.EmailField(
        _('email address'), 
        unique=True, 
        blank=False, 
        validators=[EmailValidator()], 
        help_text="Enter a valid email address."
        )
    
    # Set the email as the username field
    USERNAME_FIELD = 'email'
    # Removes email from REQUIRED_FIELDS if it's the USERNAME_FIELD
    REQUIRED_FIELDS = []  

    def __str__(self):
        return self.email
