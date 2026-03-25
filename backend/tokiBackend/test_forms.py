from django.test import TestCase
from django.contrib.auth import get_user_model
from .forms import UserSignUpForm, UserLogInForm
from django.contrib.auth.models import User

User = get_user_model()

class UserSignUpFormTest(TestCase):
    """
    Test cases for the UserSignUpForm which includes validations for user registration.
    """

    @classmethod
    def test_valid_password(self):
        form = UserSignUpForm(data={
            "username": "testuser",
            "email": "user@example.com",
            "password1": "Complex@123",
            "password2": "Complex@123",
        })
        self.assertTrue(form.is_valid(), msg=form.errors.as_text())
        # if not form.is_valid():
        #     print(form.errors)
        # self.assertTrue(form.is_valid())

    def test_password_missing_number(self):
        form = UserSignUpForm(data={
            "username": "testuser",
            "email": "user@example.com",
            "password1": "Complex@abc",
            "password2": "Complex@abc",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("The password must include a number.", form.errors['password2'])

    def test_password_missing_uppercase(self):
        form = UserSignUpForm(data={
            "username": "testuser",
            "email": "user@example.com",
            "password1": "complex@123",
            "password2": "complex@123",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("The password must include an uppercase letter.", form.errors['password2'])

    def test_password_missing_lowercase(self):
        form = UserSignUpForm(data={
            "username": "testuser",
            "email": "user@example.com",
            "password1": "COMPLEX@123",
            "password2": "COMPLEX@123",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("The password must include a lowercase letter.", form.errors['password2'])

    def test_password_missing_special_char(self):
        form = UserSignUpForm(data={
            "username": "testuser",
            "email": "user@example.com",
            "password1": "Complex123",
            "password2": "Complex123",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("The password must include one of these special characters: .@$!%*#?", form.errors['password2'])

    def test_password_length_too_short(self):
        form = UserSignUpForm(data={
            "username": "testuser",
            "email": "user@example.com",
            "password1": "C@1a",
            "password2": "C@1a",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("The password must be between 8 and 15 characters.", form.errors["password2"])

    def test_password_length_too_long(self):
        form = UserSignUpForm(data={
            "username": "testuser",
            "email": "user@example.com",
            "password1": "C@1alalalalalalal",
            "password2": "C@1alalalalalalal",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("The password must be between 8 and 15 characters.", form.errors["password2"])



class UserLogInFormTest(TestCase):
    """
    Test cases for the UserLogInForm which handles user authentication.
    """

    @classmethod
    def setUpTestData(cls):
        """ Create a user object for testing the login."""
        cls.user = User.objects.create_user('testuser', 'user@example.com', 'Complex@123')

    def test_valid_login(self):
        form = UserLogInForm(data={
            "username": "user@example.com",
            "password": "Complex@123",
        }, request=None)
        self.assertTrue(form.is_valid(), msg=form.errors.as_text())

    def test_invalid_login(self):
        form = UserLogInForm(data={
            "username": "user@example.com",
            "password": "WrongPassword123",
        }, request=None)
        self.assertFalse(form.is_valid())
        self.assertIn("Please enter a correct email and password. Note that both fields may be case-sensitive.", form.errors.get('__all__', []), "Expected validation error not found") 


    # def test_inactive_user(self):
    #     self.user.is_active = False
    #     self.user.save()
    #     form = UserLogInForm(data={
    #         "username": "user@example.com",
    #         "password": "Complex@123",
    #     }, request=None)
    #     self.assertFalse(form.is_valid())
    #     self.assertIn("This account is inactive.", form.errors.get('__all__', []))

