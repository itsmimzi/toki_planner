from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from tokiBackend.forms import UserSignUpForm

class UserViewsTests(TestCase):
    def setUp(self):
        # Create a user for authentication tests
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.client.login(username='testuser', password='testpassword123')

    def test_base_view(self):
        response = self.client.get(reverse('base_view'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Welcome to the Toki Backend!', response.content.decode())

    def test_login_view(self):
        response = self.client.post(reverse('login_view'), {'username': 'testuser', 'password': 'testpassword123'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {'success': 'User logged in successfully'})

    def test_logout_view(self):
        # Ensure the user is logged in
        self.client.login(username='testuser', password='testpassword123')
        response = self.client.post(reverse('logout_view'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {'success': 'User logged out successfully'})

    def test_signup_view(self):
        response = self.client.post(reverse('signup_view'), {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'newpassword123',
            'password2': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"success": "User signed up and logged in successfully"})



class TaskViewsTests(TestCase):

    def setUp(self):
        # Set up a user and login
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.client.login(username='testuser', password='testpassword123')
        # # Assuming a task creation for the user
        # self.task = Task.objects.create(user=self.user, title='Test Task', description='Test Description')

    def test_create_task_view(self):
        response = self.client.post(reverse('createTask_view'), {'title': 'new_task', 'description': 'Do Task'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('New Task', response.content.decode())

    def test_fetch_tasks(self):
        response = self.client.get(reverse('fetch_tasks'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Test Task', response.content.decode())

    def test_update_task(self):
        response = self.client.patch(reverse('update_task', args=[self.task.id]), {'title': 'Updated Task'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Updated Task', response.content.decode())

    def test_delete_task(self):
        response = self.client.delete(reverse('delete_task', args=[self.task.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

