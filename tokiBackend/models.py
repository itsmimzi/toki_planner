# from django.db import models
# from django.contrib.auth.models import AbstractUser
# from django.utils.translation import gettext_lazy as _
# from django.core.validators import EmailValidator
# from django.conf import settings


# class User(AbstractUser):
#     """
#     Custom User model that extends AbstractUser. 
#     Email field is added as a unique attribute and added EmailValidator 
#     ensures the input is a valid email address.
#     """
#     email = models.EmailField(_('email address'), unique=True, blank=False, validators=[EmailValidator()], help_text="Enter a valid email address.")


# class WeekDays(models.Model):
#     """
#     Model to store week days.
#     """
#     DAYS_OF_WEEK = [
#         ('Monday', _('Monday')),
#         ('Tuesday', _('Tuesday')),
#         ('Wednesday', _('Wednesday')),
#         ('Thursday', _('Thursday')),
#         ('Friday', _('Friday')),
#     ]
#     day = models.CharField(max_length=9, choices=DAYS_OF_WEEK, db_index=True)
#     def __str__(self):
#         return self.day

# class Category(models.Model):
#     """
#     Model to store categories.
#     """
#     CATEGORY_CHOICES = [
#         ('Work', _('Work')),
#         ('Personal', _('Personal')),
#         ('Coding', _('Coding')),
#         ('Meeting', _('Meeting')),
#         ('Workout', _('Workout')),
#     ]    
#     label = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='Personal', db_index=True)
#     def __str__(self):
#         return self.label


# class Priority(models.Model):
#     """
#     Model to store priority levels.
#     """
#     PRIORITY_CHOICES = [
#         ('Low', _('Low')),
#         ('Medium', _('Medium')),
#         ('High', _('High')),
#         ('ASAP', _('ASAP')),
#     ]
#     label = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default = 'Low', db_index=True)
#     def __str__(self):
#         return self.label


# class Task(models.Model):
#     """
#     Model to store tasks, which are associated with categories and priorities.
#     """
#     task_id = models.CharField(max_length=100, unique=True, primary_key=True, default=0)
#     title = models.CharField(max_length=255)
#     description = models.TextField(blank=True)
#     hasDescription = models.BooleanField(default=False)
#     category = models.ForeignKey(Category, related_name='tasks', on_delete=models.CASCADE)
#     priority = models.ForeignKey(Priority, related_name='tasks', on_delete=models.CASCADE)
#     day = models.ForeignKey(WeekDays, related_name='tasks', on_delete=models.CASCADE)
#     url = models.URLField(blank=True)
#     hasUrl = models.BooleanField(default=False)
#     address = models.TextField(blank=True)
#     hasAddress = models.BooleanField(default=False)
#     start_time = models.DateTimeField(null=True, blank=True)
#     duration = models.DurationField()
#     end_time = models.DateTimeField(null=True, blank=True)
#     isComplete = models.BooleanField(default=False)
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

#     def __str__(self):
#         return self.title

#     def save(self, *args, **kwargs):
#         self.hasDescription = bool(self.description)
#         self.hasUrl = bool(self.url)
#         self.hasAddress = bool(self.address)
#         super(Task, self).save(*args, **kwargs)



