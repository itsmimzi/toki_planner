from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from tokiBackend.forms import createTaskForm
from tokiBackend.serializers import CategorySerializer, PrioritySerializer, TaskSerializer, Category, Priority, Task
import logging


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