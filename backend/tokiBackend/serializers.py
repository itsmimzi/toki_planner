




from rest_framework import serializers
from tokiBackend.models import Task, Category, Priority, WeekDays
from django.utils import timezone
import math


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

PRIORITY_WEIGHTS = {'low': 1, 'medium': 2, 'high': 3, 'ASAP': 4}

class TaskSerializer(serializers.ModelSerializer):
    category    = CategorySerializer(read_only=True)
    priority    = PrioritySerializer(read_only=True)
    day_of_week = WeekDaysSerializer(read_only=True)
    urgency_score = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'task_id', 'title', 'description', 'priority', 'category',
            'start_time', 'duration', 'url', 'address', 'isComplete',
            'end_time', 'created_at', 'day_of_week', 'due_date',
            'urgency_score', 'is_focus_block',
        ]

    def get_urgency_score(self, obj):
        """
        Urgency = priority_weight × log(duration_minutes + 1) / max(hours_until_due, 0.5)
        Normalized to 0–100. Returns None when no due_date or task is complete.
        """
        if not obj.due_date or obj.isComplete:
            return None
        now = timezone.now()
        hours_until_due = max((obj.due_date - now).total_seconds() / 3600, 0.5)
        priority_weight = PRIORITY_WEIGHTS.get(obj.priority.label if obj.priority else 'low', 1)
        duration_minutes = obj.duration.total_seconds() / 60 if obj.duration else 30
        raw = priority_weight * math.log(duration_minutes + 1) / hours_until_due
        # Cap at 100: raw score of ~8 maps to 100 (ASAP, 8h task, due in 1h)
        score = min(round((raw / 8) * 100), 100)
        return max(score, 1)