"""
URL configuration for portfolio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import AddMiseAjourView, deleteProjectView, ProjectsListView, CreateProjectView, UpdateUserPasswordView
from .views import DivisionsAndSecteursView, ManagersListView, UsersListView ,CreateUserView, DeleteUserView , UpdateProjectView
from .views import LoginView, LogoutView, get_csrf_token ,UpdateUserView ,GetMiseAjourView,markProjetAsCompleted, GenerateRapportView, DownloadRapportView, GetRapportsHistoryView
from .views import RegisterRessourceView, RessourcesListView, DeleteRessourceView, getRessourceUtiliseeView, ModifyRessourceView
from .views import AddRessourceUtiliseeView, DeleteRessourceUtiliseeView, ModifyRessourceUtiliseeView

urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('csrf/', get_csrf_token),
    path('divisions-secteurs/', DivisionsAndSecteursView.as_view(), name='divisions-secteurs'),
    path('managers/', ManagersListView.as_view(), name='managers-list'),
    path('users/', UsersListView.as_view(), name='users-list'),
    path('users/create/', CreateUserView.as_view(), name='create-user'),
    path('users/delete/<int:user_id>/', DeleteUserView.as_view(), name='delete-user'),
    path('users/update/<int:user_id>/', UpdateUserView.as_view(), name='update-user'),
    path('users/update-password/<int:user_id>/', UpdateUserPasswordView.as_view(), name='update-password'),
    path('projects/', ProjectsListView.as_view(), name='projects-list'),
    path('projects/create/', CreateProjectView.as_view(), name='create-project'),
    path('projects/delete/<int:project_id>/', deleteProjectView.as_view(), name='delete-project'),
    path('projects/update/<int:project_id>/', UpdateProjectView.as_view(), name='update-project'),
    path('projects/mark-as-completed/<int:project_id>/' , markProjetAsCompleted.as_view() , name='mark-project-as-completed'),
    path('mise-ajour/create/', AddMiseAjourView.as_view(), name='create-mise-ajour'),
    path('mise-ajour/get/', GetMiseAjourView.as_view(), name='get-mise-ajour'),
    path('ressources/create/', RegisterRessourceView.as_view(), name='create-ressource'),
    path('ressources/get/', RessourcesListView.as_view(), name='get-ressources'),
    path('ressources/update/<int:ressource_id>/', ModifyRessourceView.as_view(), name='update-ressource'),
    path('ressources/delete/<int:ressource_id>/', DeleteRessourceView.as_view(), name='delete-ressource'),
    path('ressources/get-utilisee/', getRessourceUtiliseeView.as_view(), name='get-ressource-utilisee'),
    path('ressources/add-utilisee/', AddRessourceUtiliseeView.as_view(), name='add-ressource-utilisee'),
    path('ressources/delete-utilisee/<int:ressource_utilisee_id>/', DeleteRessourceUtiliseeView.as_view(), name='delete-ressource-utilisee'),
    path('ressources/modify-utilisee/<int:ressource_utilisee_id>/', ModifyRessourceUtiliseeView.as_view(), name='modify-ressource-utilisee'),
    path('rapports/generate/', GenerateRapportView.as_view(), name='generate-rapport'),
    path('rapports/download/<int:rapport_id>/', DownloadRapportView.as_view(), name='download-rapport'),
    path('rapports/history/', GetRapportsHistoryView.as_view(), name='rapports-history'),
    
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
