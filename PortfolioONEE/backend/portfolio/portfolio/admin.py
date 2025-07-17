from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from django.contrib import admin
from .models import Projet, Rapport, Ressource, Division, Secteur, Manager, Supervisor, miseAjour

admin.site.register(Projet)
admin.site.register(Rapport)
admin.site.register(Ressource)
admin.site.register(User)
admin.site.register(Division)
admin.site.register(Secteur)
admin.site.register(Manager)
admin.site.register(Supervisor)
admin.site.register(miseAjour)