


from django.db import models
from django.utils.translation import gettext_lazy as _


class WeekDays(models.Model):
    """
    Model to store week days.
    """
    # DAY_CHOICES = [
    #     (0, _('Monday')),
    #     (1, _('Tuesday')),
    #     (2, _('Wednesday')),
    #     (3, _('Thursday')),
    #     (4, _('Friday')),
    #     (5, _('Saturday')),
    #     (6, _('Sunday')),
    # ]
    DAY_CHOICES = [
        ('Monday', _('Monday')),
        ('Tuesday', _('Tuesday')),
        ('Wednesday', _('Wednesday')),
        ('Thursday', _('Thursday')),
        ('Friday', _('Friday')),
        ('Saturday', _('Saturday')),
        ('Sunday', _('Sunday')),
    ]

    day = models.CharField(max_length=10, choices=DAY_CHOICES, unique=True, db_index=True)

    def __str__(self):
        return self.day