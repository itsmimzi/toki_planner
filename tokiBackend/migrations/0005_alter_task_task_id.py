# Generated by Django 5.0.2 on 2024-04-21 15:40

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tokiBackend", "0004_alter_category_label_alter_priority_label"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="task_id",
            field=models.AutoField(primary_key=True, serialize=False, unique=True),
        ),
    ]
