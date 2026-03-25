


from django.db import models
from django.utils.translation import gettext_lazy as _

class Priority(models.Model):
    """
    Model to store priority levels.
    """
    PRIORITY_CHOICES = [
        ('low', _('low')),
        ('medium', _('medium')),
        ('high', _('high')),
        ('ASAP', _('ASAP')),
    ]
    label = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default = 'Low', db_index=True)
    def __str__(self):
        return self.label