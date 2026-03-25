
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model


User = get_user_model()  


class UserSignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)                                 # Required email field to ensure it is captured and validated

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "password1", "password2")           # Form fields to include

    def clean_password2(self):
        """
        Validates that the two password entries match and meet the validation requirements.
        """
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password2 is None:
            raise ValidationError("This field is required.")

        if password1 and password2 and password1 != password2:              # Check if passwords are provided and match
            raise ValidationError("Passwords don't match.")

        errors = []                                                         # Initialize a list to collect error messages
                                                                            # Validate the password against various criteria
        if not any(char.isdigit() for char in password2):
            errors.append("The password must include a number.")
        if not any(char.isupper() for char in password2):
            errors.append("The password must include an uppercase letter.")
        if not any(char.islower() for char in password2):
            errors.append("The password must include a lowercase letter.")
        if not any(char in ".@$!%*#?" for char in password2):
            errors.append("The password must include one of these special characters: .@$!%*#?")
        if not (8 <= len(password2) <= 100):
            errors.append("The password must be between 8 and 100 characters.")
        
        if errors:
            raise ValidationError(errors)                                   # Raise all validation errors

        return password2






