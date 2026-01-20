from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Manager, Supervisor

@receiver(post_save, sender=User)
def create_role_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'manager':
            Manager.objects.create(user=instance)  # type: ignore
        elif instance.role == 'supervisor':
            Supervisor.objects.create(user=instance)  # type: ignore
