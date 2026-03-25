from django.urls import path
from tokiBackend.views import *

urlpatterns = [

    path('login/', login_view, name='login-view'),
    path('logout/', logout_view, name='logout-view'),
    path('signup/', signup_view, name='signup-view'),
    path('contact/', contact_view, name='contact'),
    path('categories/', category_list, name='category-list'),
    path('priorities/', priority_list, name='priority-list'),
    path('tasks/create/', createTask_view, name='createTask-view'),
    path('tasks/', fetch_tasks, name='fetch-tasks'),
    path('tasks/<int:task_id>/update/', update_task, name='update-task'),
    path('tasks/<int:task_id>/delete/', delete_task, name='delete-task'),
    path('predict/', predict_task_details, name='predict-task'),
    path('', base_view, name='base-view'),

]











