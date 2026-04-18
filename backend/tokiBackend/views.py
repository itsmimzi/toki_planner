import os
from django.http import HttpResponse
from django.core.mail import send_mail
from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from tokiBackend.forms import UserLogInForm, UserSignUpForm, createTaskForm
from .serializers import CategorySerializer, PrioritySerializer, TaskSerializer, Category, Priority, Task
import logging
# model_predicting_v2 is imported lazily inside predict_task_details to avoid
# loading TensorFlow at worker startup (saves ~30s cold-boot time)
from datetime import datetime





logger = logging.getLogger(__name__)

def base_view(request):
    return HttpResponse("Welcome to the Toki Backend!")



"""
---------------------------------------------- USER VIEWS ----------------------------------------------------
--------------------------------------------------------------------------------------------------------------
"""

@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([JSONParser])
def login_view(request):
    form = UserLogInForm(data=request.data, request=request)
    if form.is_valid():
        user = form.get_user()
        if user:
            django_login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
            }, status=status.HTTP_200_OK)
        return Response({'ERROR': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
    error_msg = form.errors.get('__all__', ['Invalid credentials'])[0] if form.errors.get('__all__') else 'Invalid credentials'
    return Response({'ERROR': error_msg}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    django_logout(request)
    return Response({'success': 'Logged out'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([JSONParser])
def signup_view(request):
    form = UserSignUpForm(data=request.data)
    if form.is_valid():
        user = form.save()
        if user:
            django_login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
            }, status=status.HTTP_201_CREATED)
        return Response({'error': 'User could not be created'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
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
            recipient_list=[os.environ.get('EMAIL_HOST_USER', 'itsmimzi@gmail.com')],
            fail_silently=False,
        )
        logger.info("Email sent successfully")
        return Response({'success': 'Email sent successfully'},status=status.HTTP_200_OK )
    except Exception as e :
        logger.error(f"Failed to send email: {str(e)}")
        return Response({'error' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



"""
---------------------------------------------- LABEL VIEWS ----------------------------------------------------
--------------------------------------------------------------------------------------------------------------
"""

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    return Response(CategorySerializer(categories, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def priority_list(request):
    priorities = Priority.objects.all()
    return Response(PrioritySerializer(priorities, many=True).data)



"""
---------------------------------------------- CRUD VIEWS ----------------------------------------------------
--------------------------------------------------------------------------------------------------------------
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createTask_view(request):
    data = dict(request.data)

    # Focus blocks: auto-fill title / category / priority so DB constraints are met
    if data.get('is_focus_block') in (True, 'true', 'True'):
        if not data.get('title'):
            data['title'] = 'Focus Block'
        if not data.get('category'):
            default_cat = (
                Category.objects.filter(label__iexact='personal').first()
                or Category.objects.first()
            )
            if default_cat:
                data['category'] = default_cat.id
        if not data.get('priority'):
            default_pri = (
                Priority.objects.filter(label__iexact='medium').first()
                or Priority.objects.first()
            )
            if default_pri:
                data['priority'] = default_pri.id

    form = createTaskForm(data=data)
    if form.is_valid():
        task = form.save(commit=False)
        task.user = request.user
        task.save()
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(form.errors)
        return Response({'error': form.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_tasks(request):
    try:
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logging.error(f"Failed to fetch tasks: {str(e)}")
        return Response({'error': 'Failed to fetch tasks'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    try:
        task = Task.objects.get(pk=task_id, user=request.user)
        serializer = TaskSerializer(task, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    try:
        task = Task.objects.get(pk=task_id, user=request.user)
        task.delete()
        return Response({'success': 'Task deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)



"""
---------------------------------------------- MLP VIEWS ----------------------------------------------------
--------------------------------------------------------------------------------------------------------------
"""


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_task_details(request):
    from tokiBackend.toki_NN.model_predicting_v2 import predict_task, format_predictions
    try:
        start_time_raw = request.data.get('start_time', '')
        dt = datetime.fromisoformat(start_time_raw.replace('Z', '+00:00'))
        start_time_str = dt.strftime('%H:%M')

        day_of_week_data = request.data.get('day_of_week', {})
        if isinstance(day_of_week_data, dict):
            day_of_week_str = day_of_week_data.get('day', 'Monday')
        else:
            day_of_week_str = str(day_of_week_data)

        task_data = {
            'Task Type': [request.data.get('task_type', '')],
            'Day of Week': [day_of_week_str],
            'has Description': [request.data.get('has_description', False)],
            'has Address': [request.data.get('has_address', False)],
            'has URL': [request.data.get('has_url', False)],
            'is Complete': [request.data.get('is_complete', False)],
            'Start Time': [start_time_str],
            'Priority': [''],
        }
        predictions = predict_task(task_data)
        duration_label, priority_label = format_predictions(predictions)
        return Response({'duration': str(duration_label), 'priority': str(priority_label)}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)








