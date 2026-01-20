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

    def __str__(self):
        return f" id : {self.id} , {self.first_name} {self.last_name}"



class Division(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Secteur(models.Model):
    name = models.CharField(max_length=255)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='secteurs')

    def __str__(self):
        return self.name 

class Manager(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='manager_profile')
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='managers', null=True, blank=True)
    secteur = models.ForeignKey(Secteur, on_delete=models.CASCADE, related_name='managers', null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"  # type: ignore

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor_profile')
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='supervisors', null=True, blank=True) 

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"  # type: ignore


class Projet(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255 , null=True, blank=True)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50 , default="Planifié")
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE, related_name='projects', null=True, blank=True)
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, related_name='projects', null=True, blank=True) # type: ignore
    budget = models.DecimalField(max_digits=10, decimal_places=2 , null=True, blank=True)
    budget_used = models.DecimalField(max_digits=10, decimal_places=2 , null=True, blank=True , default=0)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='projects', null=True, blank=True)
    secteur = models.ForeignKey(Secteur, on_delete=models.CASCADE, related_name='projects', null=True, blank=True)
    
    def __str__(self):
        return f" name : {self.name} , id : {self.id}"
    

    

class Rapport(models.Model):
    title = models.CharField(max_length=255)
    periode = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rapports', null=True, blank=True)
    file = models.FileField(upload_to='rapports/', null=True, blank=True)

    def __str__(self):
        return self.title

class Ressource(models.Model):
    TYPE_CHOICES = [
        ('materielles', 'materielles'),
        ('logicielles', 'logicielles'),
        ('informationnelles', 'informationnelles'),
    ]
    quantity = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100 ,  choices=TYPE_CHOICES , default='')
    

    def __str__(self):
        return self.name

class RessourceUtilisee(models.Model):
    ressource = models.ForeignKey(Ressource, on_delete=models.CASCADE, related_name='ressources_utilisees', null=True, blank=True)
    project = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='ressources_utilisees', null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"Ressource: {self.ressource.name} - Projet: {self.project.name} - Quantité: {self.quantity}"

class miseAjour(models.Model):
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, related_name='mise_a_jour', null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField(null=True, blank=True)
    project = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='mise_a_jour', null=True, blank=True)

    
    def __str__(self):
        return f"Mise à jour: {self.content}"  # type: ignore
