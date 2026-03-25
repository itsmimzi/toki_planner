from django.db import models
from django.conf import settings
from .category import Category
from .priority import Priority
from .weekdays import WeekDays
from django.utils.dateparse import parse_datetime
import calendar
import datetime


class Task(models.Model):
    """
    Model to store tasks, which are associated with categories and priorities.
    """
    task_id = models.AutoField(unique=True, primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, related_name='tasks', on_delete=models.CASCADE)
    priority = models.ForeignKey(Priority, related_name='tasks', on_delete=models.CASCADE)
    url = models.URLField(blank=True)    
    address = models.TextField(blank=True)
    start_time = models.DateTimeField(null=True, blank=True) 
    duration = models.DurationField()
    created_at = models.DateTimeField(auto_now_add=True, )
    end_time = models.DateTimeField(null=True, blank=True)       
    year = models.IntegerField(null=True, blank=True)
    month = models.IntegerField(null=True, blank=True)
    day = models.IntegerField(null=True, blank=True)
    hour = models.IntegerField(null=True, blank=True)
    minute = models.IntegerField(null=True, blank=True)
    day_of_week = models.ForeignKey(WeekDays, on_delete=models.SET_NULL, null=True, blank=True)

    hasAddress = models.BooleanField(default=False) 
    hasDescription = models.BooleanField(default=False)
    hasUrl = models.BooleanField(default=False)
    isComplete = models.BooleanField(default=False)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    def save(self, *args, **kwargs):
        self.hasDescription = bool(self.description)
        self.hasUrl = bool(self.url)
        self.hasAddress = bool(self.address)
        
        if self.start_time :
            weekday_index = self.start_time.weekday()
            weekday = calendar.day_name[weekday_index]  
            weekday_obj, created = WeekDays.objects.get_or_create(day=weekday)
            self.day_of_week = weekday_obj
            self.year = self.start_time.year
            self.month = self.start_time.month
            self.day = self.start_time.day
            self.hour = self.start_time.hour
            self.minute = self.start_time.minute

        super(Task, self).save(*args, **kwargs)


    def __str__(self):
        return self.title









