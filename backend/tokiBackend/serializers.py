




from rest_framework import serializers
from tokiBackend.models import Task, Category, Priority, WeekDays



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'label']

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = ['id', 'label']

class WeekDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeekDays
        fields = ['id', 'day']

class TaskSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    priority = PrioritySerializer(read_only=True)
    day_of_week = WeekDaysSerializer(read_only=True)

    class Meta:
        model = Task
        # fields = '__all__'
        fields = [
            'task_id', 'title', 'description', 'priority', 'category', 
            'start_time', 'duration', 'url', 'address', 'isComplete', 
            'end_time', 'created_at', 'day_of_week'
        ]