from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('supervisor', 'Supervisor'),
        ('manager', 'Manager'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='manager')
    localisation = models.CharField(max_length=255, null=True, blank=True)
    poste = models.CharField(max_length=255, null=True, blank=True)
    biography = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    
    

class Division(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Secteur(models.Model):
    name = models.CharField(max_length=255)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='secteurs')

    def __str__(self):
        return self.name


class Projet(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50)
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    progress = models.IntegerField(default=0)  # type: ignore
    budget = models.DecimalField(max_digits=10, decimal_places=2 , null=True, blank=True)
    budget_used = models.DecimalField(max_digits=10, decimal_places=2 , null=True, blank=True)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='projets', null=True, blank=True)
    secteur = models.ForeignKey(Secteur, on_delete=models.CASCADE, related_name='projets', null=True, blank=True)
    
    

    def __str__(self):
        return self.name

class Rapport(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='rapports', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rapports', null=True, blank=True)
    file = models.FileField(upload_to='rapports/', null=True, blank=True)

    def __str__(self):
        return self.title

class Ressource(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    project = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='ressources')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='ressources')

    def __str__(self):
        return self.name


class Manager(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='manager_profile')
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='managers', null=True, blank=True)
    secteur = models.ForeignKey(Secteur, on_delete=models.CASCADE, related_name='managers', null=True, blank=True)
    
    def __str__(self):
        return f"Manager: {self.user.username}"  # type: ignore

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor_profile')
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='supervisors', null=True, blank=True)
    
    def __str__(self):
        return f"Supervisor: {self.user.username}"  # type: ignore


class miseAjour(models.Model):
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, related_name='mise_a_jour', null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField(null=True, blank=True)
    project = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='mise_a_jour', null=True, blank=True)

    
    def __str__(self):
        return f"Mise à jour: {self.content}"  # type: ignore
