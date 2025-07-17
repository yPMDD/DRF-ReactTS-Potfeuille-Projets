from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import logout, authenticate, login
from .permissions import IsManager
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from .models import User, Division, Secteur, Manager, Projet
from django.shortcuts import get_object_or_404
from django.urls import path
from django.contrib import admin


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out successfully."})

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        username = get_object_or_404(User, email=email).username
        print(username)
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:

            login(request, user)
            
            user_data = {
                "role": user.role,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "id": user.id,
                "localisation": user.localisation if user.localisation else None,
                "poste": user.poste if user.poste else None,
                "biography": user.biography if user.biography else None,
                "phone": user.phone if user.phone else None,
                "date_joined": user.date_joined,
            }

            if user.role == "supervisor" and hasattr(user, "supervisor_profile"):
                supervisor = user.supervisor_profile
                user_data["division"] = supervisor.division.name if supervisor.division else None

            if user.role == "manager" and hasattr(user, "manager_profile"):
                manager = user.manager_profile
                user_data["division"] = manager.division.name if manager.division else None
                user_data["secteur"] = manager.secteur.name if manager.secteur else None

            return Response(user_data)
        else:
            return Response({"detail": "Invalid credentials."}, status=401)


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


class DivisionsAndSecteursView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        divisions = Division.objects.all().values('id', 'name') # type: ignore
        secteurs = Secteur.objects.all().values('id', 'name', 'division_id') # type: ignore
        return Response({
            'divisions': list(divisions),
            'secteurs': list(secteurs)
        })


class ManagersListView(APIView):
    def get(self, request):
        managers = Manager.objects.select_related('user').all() # type: ignore
        
        data = [
            {
                "id": manager.id,
                "user_id": manager.user.id,
                "username": manager.user.username,
                "first_name": manager.user.first_name,
                "last_name": manager.user.last_name,
                "email": manager.user.email,
                "division": manager.division.name if manager.division else None,
                "secteur": manager.secteur.name if manager.secteur else None,
                "numProj": Projet.objects.filter(manager=manager.id).count() # type: ignore
            }
            for manager in managers
        ]
        return Response(data)

