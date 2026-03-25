from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate


class UserLogInForm(AuthenticationForm):
    """
    A form for logging in users. Overrides the default AuthenticationForm
    to use email as the username field.
    """

    def clean(self):
        """
        Form for logging in users.
        Overrides the default form cleaning process to authenticate the user 
        based on email and password.
        """
        email = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        if email is not None and password:
            self.user_cache = authenticate(self.request, username=email, password=password)
            if self.user_cache is None:
                raise forms.ValidationError(
                    "Invalid email or password", code="invalid_login")
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data


    def confirm_login_allowed(self, user):
        """
        Ensures the user account is active. If the user's account is inactive,
        raises a ValidationError.
        """
        if not user.is_active:
            raise forms.ValidationError("This account is inactive.", code="inactive")