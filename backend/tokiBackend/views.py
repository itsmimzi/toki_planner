from django.http import HttpResponse
from django.core.mail import send_mail
from django.contrib.auth import login as django_login, logout as django_logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from tokiBackend.forms import UserLogInForm, UserSignUpForm, createTaskForm
from .serializers import CategorySerializer, PrioritySerializer, TaskSerializer, Category, Priority, Task
import logging
from tokiBackend.toki_NN.model_predicting_v2 import predict_task, format_predictions
from datetime import datetime





logger = logging.getLogger(__name__)

def base_view(request):
    return HttpResponse("Welcome to the Toki Backend!")



"""
---------------------------------------------- USER VIEWS ----------------------------------------------------
--------------------------------------------------------------------------------------------------------------
"""

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



"""
---------------------------------------------- LABEL VIEWS ----------------------------------------------------
--------------------------------------------------------------------------------------------------------------
"""

@api_view(['GET'])
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def priority_list(request):
    if request.method == 'GET':
        priorities = Priority.objects.all()
        serializer = PrioritySerializer(priorities, many=True)
        return Response(serializer.data)



"""
---------------------------------------------- CRUD VIEWS ----------------------------------------------------
--------------------------------------------------------------------------------------------------------------
"""

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createTask_view(request):
    form = createTaskForm(data=request.data)
    if form.is_valid():
        task = form.save(commit=False)  # Prepare but don't commit to database
        task.user = request.user        # Set the user first
        task.save()                     # then save everything to database
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


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_task_details(request):
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








