# Generated by Django 5.0.2 on 2024-04-21 06:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tokiBackend", "0002_task_created_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
