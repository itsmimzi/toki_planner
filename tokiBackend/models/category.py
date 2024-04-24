


from django.db import models
from django.utils.translation import gettext_lazy as _

class Category(models.Model):
    """
    Model to store categories.
    """
    CATEGORY_CHOICES = [
        ('work', _('work')),
        ('personal', _('personal')),
        ('coding', _('coding')),
        ('workout', _('workout')),
        ('meeting', _('meeting'))
    ]    
    label = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='Personal', db_index=True)
    def __str__(self):
        return self.label