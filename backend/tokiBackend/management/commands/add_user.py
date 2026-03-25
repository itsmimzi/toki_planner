# from django.core.management.base import BaseCommand
# from django.contrib.auth import get_user_model

# class Command(BaseCommand):
#     help = 'Adds a new user to the system'

#     def add_arguments(self, parser):
#         parser.add_argument('username', type=str, help='The username for the new user')
#         parser.add_argument('email', type=str, help='The email for the new user')
#         parser.add_argument('password', type=str, help='The password for the new user')

#     def handle(self, *args, **options):
#         User = get_user_model()
#         username = options['username']
#         email = options['email']
#         password = options['password']
        
#         if not User.objects.filter(username=username).exists():
#             User.objects.create_user(username=username, email=email, password=password)
#             self.stdout.write(self.style.SUCCESS(f'Successfully added user {username}'))
#         else:
#             self.stdout.write(self.style.WARNING(f'User {username} already exists.'))
