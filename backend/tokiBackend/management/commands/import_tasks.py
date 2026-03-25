# from django.core.management.base import BaseCommand
# import os
# from django.conf import settings
# from django.utils.dateparse import parse_datetime
# from tokiBackend.models import Task, Category, Priority, WeekDays, User
# from datetime import datetime, timedelta
# from django.utils.timezone import make_aware
# import csv

# class Command(BaseCommand):
#     help = 'Loads data from CSV file into the Task model.'

#     def add_arguments(self, parser):
#         parser.add_argument('csv_file_path', type=str, help='The CSV file path')
#         parser.add_argument('user_email', type=str, help='Username of the user to whom tasks will be assigned')

#     def handle(self, *args, **options):
#         csv_file_path = os.path.join(settings.BASE_DIR, options['csv_file_path'])
#         email = options['user_email']

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             self.stdout.write(self.style.ERROR('User not found!'))
#             return

#         if not os.path.exists(csv_file_path):
#             self.stdout.write(self.style.ERROR(f"File not found: {csv_file_path}"))
#             return        

#         with open(csv_file_path, mode='r', encoding='utf-8') as file:
#             reader = csv.DictReader(file)

#             tasks_created = 0

#             for row in reader:

#                 # if not row['start_time'] or not row['end_time']:
#                 #     self.stdout.write(self.style.WARNING(f"Skipping task with ID {row['task_id']} due to missing start or end time."))
#                 #     continue

#                 day, _ = WeekDays.objects.get_or_create(day=row['day_of_week'])
#                 priority, _ = Priority.objects.get_or_create(label=row['priority'])
#                 category, _ = Category.objects.get_or_create(label=row['task_type'])

#                 start_time_str = row.get('Start Time', '').strip()
#                 end_time_str = row.get('End Time', '').strip()
#                 task_date_str = row.get('Task Date', '').strip()

#                 start_datetime = None
#                 end_datetime = None

#                 try :
#                     if start_time_str: 
#                         start_datetime = make_aware(datetime.strptime(f"{task_date_str} {start_time_str}", '%Y-%m-%d %H:%M'))  #else None
#                     if end_time_str :
#                         end_datetime = make_aware(datetime.strptime(f"{task_date_str} {end_time_str}", '%Y-%m-%d %H:%M')) #if  else None
#                 except ValueError as e:
#                     self.stdout.write(self.style.ERROR(f"Error parsing datetime for task ID {row['task_id']}: {str(e)}"))
#                     continue                    

#                 # if (end_datetime!=None):
#                 #     if (end_datetime <= start_datetime) :
#                 #         end_datetime += timedelta(days=1) 

#                 duration = timedelta(minutes=int(row['duration_in_min']))
#                 description = row['task_description'] if row['has_description'] == 'True' else ""
#                 address = row['address'] if row['has_address'] == 'True' else ""
#                 url = row['url'] if row['has_url'] == 'True' else ""

#                 task = Task(
#                     task_id=row['task_id'],
#                     title=row['task_title'], 
#                     description=description,
#                     category=category,
#                     priority=priority,
#                     day=day,
#                     start_time=start_datetime,
#                     end_time=end_datetime,
#                     duration=duration,
#                     isComplete=row['is_complete'] == 'True',
#                     address=address,
#                     url=url,
#                     user=user
#                 )
#                 task.save()
#                 tasks_created += 1

#         self.stdout.write(self.style.SUCCESS(f'Successfully imported {tasks_created} tasks for user with email {email} from {csv_file_path}'))

