from django import forms
from tokiBackend.models import Task, Category, Priority, WeekDays
import calendar

class createTaskForm(forms.ModelForm):
    category = forms.ModelChoiceField(queryset=Category.objects.all(), to_field_name="id")
    priority = forms.ModelChoiceField(queryset=Priority.objects.all(), to_field_name="id")
    start_time = forms.DateTimeField(input_formats=['%Y-%m-%dT%H:%M:%S.%fZ'])

    class Meta:
        model = Task
        fields = [
                
                'title',
                'description', 
                'priority',
                'category',
                'start_time',
                'duration',
                'url',
                'address',
                'isComplete',
                'end_time',
        ]

    def __init__(self, *args, **kwargs):
        super(createTaskForm, self).__init__(*args, **kwargs)

    def clean_start_time(self):
        start_time = self.cleaned_data.get('start_time')
        if start_time:
            weekday = calendar.day_name[start_time.weekday()]
            self.instance.day_of_week, created = WeekDays.objects.get_or_create(day=weekday)
            self.instance.month = start_time.month
            self.instance.day = start_time.day
            self.instance.hour = start_time.hour
            self.instance.minute = start_time.minute

        return start_time
