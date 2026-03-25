from django.http import HttpResponse
from django.core.mail import send_mail
from django.contrib.auth import login as django_login, logout as django_logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from tokiBackend.forms import UserLogInForm, UserSignUpForm
import logging



logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@parser_classes([JSONParser])
def login_view(request):
    form = UserLogInForm(data=request.data, request=request)
    if form.is_valid():
        user = form.get_user()
        if user :
            django_login(request, user)
            return Response({'success": "User logged in successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error' : 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        error_msg = form.errors.get('__all__', ['Invalid request'])[0] if form.errors.get('__all__') else 'Invalid request'
        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
def logout_view(request):
    django_logout(request)
    return Response({'success' : 'User logged out successfully'}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@parser_classes([JSONParser])
def signup_view(request):
    form = UserSignUpForm(data=request.data)
    if form.is_valid():
        user = form.save()
        if user :
            django_login(request, user) 
            return Response({"success": "User signed up and logged in successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error:' "User could not be created"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        print("Failed to create user:", form.errors)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@parser_classes([JSONParser])
def contact_view(request):
    email = request.data.get('email')
    message = request.data.get('message')
    logger.info(f'Attempting to send email from {email}')

    try :
        send_mail(
            subject=f'Message from {email}',
            message=message,
            from_email=email,
            recipient_list=['rachelfauves@gmail.com'],
            fail_silently=False,
        )
        logger.info("Email sent successfully")
        return Response({'success': 'Email sent successfully'},status=status.HTTP_200_OK )
    except Exception as e :
        logger.error(f"Failed to send email: {str(e)}")
        return Response({'error' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



