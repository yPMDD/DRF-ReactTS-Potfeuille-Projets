from rest_framework import serializers
from .models import Projet, miseAjour, Ressource, RessourceUtilisee, Rapport

class ProjetSerializer(serializers.ModelSerializer):
    manager = serializers.SerializerMethodField()
    division = serializers.SerializerMethodField()
    secteur = serializers.SerializerMethodField()
    supervisor = serializers.SerializerMethodField()

    class Meta:
        model = Projet
        fields = '__all__'

    def get_manager(self, obj):
        # If manager is a string (full name), just return it
        # If it's a related object, return its name or full name
        return obj.manager if isinstance(obj.manager, str) else str(obj.manager)

    def get_division(self, obj):
        return obj.division.name if obj.division else None

    def get_secteur(self, obj):
        return obj.secteur.name if obj.secteur else None
    
    def get_supervisor(self, obj):
        return obj.supervisor.user.first_name + " " + obj.supervisor.user.last_name if obj.supervisor else None


class MiseAjourSerializer(serializers.ModelSerializer):
    manager = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = miseAjour
        fields = ['id', 'manager', 'project', 'content', 'date']

    def get_manager(self, obj):
        if obj.manager and obj.manager.user:
            return {
                'id': obj.manager.id,
                'user': {
                    'first_name': obj.manager.user.first_name,
                    'last_name': obj.manager.user.last_name
                }
            }
        return None

    def get_date(self, obj):
        return obj.date.isoformat() if obj.date else None

class RessourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ressource
        fields = '__all__'

class RessourceUtiliseeSerializer(serializers.ModelSerializer):
    ressource = RessourceSerializer(read_only=True)
    project = ProjetSerializer(read_only=True)
    
    class Meta:
        model = RessourceUtilisee
        fields = ['id', 'ressource', 'project', 'quantity']

class RapportSerializer(serializers.ModelSerializer):
    requested_by = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    
    class Meta:
        model = Rapport
        fields = ['id', 'title', 'periode', 'created_at', 'requested_by', 'file']
    
    def get_requested_by(self, obj):
        if obj.requested_by:
            return {
                'id': obj.requested_by.id,
                'first_name': obj.requested_by.first_name,
                'last_name': obj.requested_by.last_name,
                'email': obj.requested_by.email
            }
        return None
    
    def get_created_at(self, obj):
        return obj.created_at.isoformat() if obj.created_at else None