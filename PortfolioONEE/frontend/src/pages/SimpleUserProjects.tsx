import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Euro, Wrench, MessageSquare, Calendar, Edit, Plus, CheckCircle2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const assignedProjects = [
  {
    id: 1,
    name: "Migration ERP",
    description: "Migration du système ERP vers la nouvelle version",
    status: "En cours",
    progress: 65,
    budget: { allocated: 150000, spent: 97500 },
    deadline: "2024-12-15",
    resourcesUsed: ["Serveurs: 3", "Licences: 15", "Stockage: 2TB"],
    lastUpdate: "2024-01-10",
    updates: [
      { date: "2024-01-10", author: "Jean Martin", content: "Tests d'intégration terminés avec succès" },
      { date: "2024-01-08", author: "Jean Martin", content: "Migration des données en cours" }
    ]
  },
  {
    id: 2,
    name: "Sécurisation réseau",
    description: "Mise en place des nouvelles mesures de sécurité",
    status: "En cours",
    progress: 40,
    budget: { allocated: 80000, spent: 32000 },
    deadline: "2024-11-30",
    resourcesUsed: ["Pare-feu: 2", "Certificats SSL: 10"],
    lastUpdate: "2024-01-09",
    updates: [
      { date: "2024-01-09", author: "Jean Martin", content: "Audit de sécurité en cours" }
    ]
  }
];

export default function SimpleUserProjects() {
  const [projects, setProjects] = useState(assignedProjects);
  const [selectedProject, setSelectedProject] = useState<typeof assignedProjects[0] | null>(null);
  const [newUpdate, setNewUpdate] = useState("");
  const [editingProject, setEditingProject] = useState<typeof assignedProjects[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editForm, setEditForm] = useState({
    spent: 0,
    progress: 0,
    resources: ""
  });
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "terminé": return "bg-success text-success-foreground";
      case "en cours": return "bg-warning text-warning-foreground";
      case "en attente": return "bg-secondary text-secondary-foreground";
      case "bloqué": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };


  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddUpdate = () => {
    if (!newUpdate.trim()) return;
    
    toast({
      title: "Mise à jour ajoutée",
      description: "Votre mise à jour a été enregistrée avec succès",
    });
    
    setNewUpdate("");
  };

  const handleEditProject = (project: typeof assignedProjects[0]) => {
    setEditingProject(project);
    setEditForm({
      spent: project.budget.spent,
      progress: project.progress,
      resources: project.resourcesUsed.join(", ")
    });
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    
    const updatedProjects = projects.map(p => 
      p.id === editingProject.id 
        ? {
            ...p,
            budget: { ...p.budget, spent: editForm.spent },
            progress: editForm.progress,
            resources: editForm.resources.split(", ").filter(r => r.trim())
          }
        : p
    );
    
    setProjects(updatedProjects);
    setEditingProject(null);
    
    toast({
      title: "Projet mis à jour",
      description: "Les informations du projet ont été enregistrées",
    });
  };

  const handleMarkAsDone = (projectId: number) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, status: "Terminé", progress: 100 }
        : p
    );
    
    setProjects(updatedProjects);
    
    toast({
      title: "Projet marqué comme terminé",
      description: "Le projet a été marqué comme terminé avec succès",
    });
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes Projets</h1>
        <p className="text-muted-foreground">Projets qui vous sont assignés</p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher dans mes projets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => {
          const daysLeft = calculateDaysLeft(project.deadline);
          const budgetPercentage = (project.budget.spent / project.budget.allocated) * 100;

          return (
            <Card key={project.id} className="shadow-card">
              <CardHeader>
                 <div className="flex items-start justify-between">
                   <div>
                      <CardTitle className="flex items-center gap-2">
                        {project.name}
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </CardTitle>
                     <p className="text-muted-foreground mt-1">{project.description}</p>
                   </div>
                    <div className="flex gap-2">
                      {project.status !== "Terminé" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsDone(project.id)}
                          className="bg-success/10 text-success border-success/30 hover:bg-success/20"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Marquer comme terminé
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier le projet
                          </Button>
                        </DialogTrigger>
                       <DialogContent className="max-w-2xl">
                         <DialogHeader>
                           <DialogTitle>Modifier le projet - {project.name}</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <Label htmlFor="spent">Budget utilisé (€)</Label>
                               <Input
                                 id="spent"
                                 type="number"
                                 value={editForm.spent}
                                 onChange={(e) => setEditForm({...editForm, spent: Number(e.target.value)})}
                                 max={editingProject?.budget.allocated}
                               />
                             </div>
                             <div>
                               <Label htmlFor="progress">Avancement (%)</Label>
                               <Input
                                 id="progress"
                                 type="number"
                                 value={editForm.progress}
                                 onChange={(e) => setEditForm({...editForm, progress: Number(e.target.value)})}
                                 min={0}
                                 max={100}
                               />
                             </div>
                           </div>
                            <div>
                              <Label htmlFor="resources">Ressources utilisées (séparées par des virgules)</Label>
                              <Input
                                id="resources"
                                value={editForm.resources}
                                onChange={(e) => setEditForm({...editForm, resources: e.target.value})}
                                placeholder="Serveurs: 3, Licences: 15, Stockage: 2TB"
                              />
                            </div>
                           <div className="flex justify-end">
                             <Button onClick={handleSaveProject}>
                               Enregistrer les modifications
                             </Button>
                           </div>
                         </div>
                       </DialogContent>
                     </Dialog>
                     <Dialog>
                       <DialogTrigger asChild>
                         <Button 
                           variant="outline" 
                           onClick={() => setSelectedProject(project)}
                         >
                           <MessageSquare className="w-4 h-4 mr-2" />
                           Ajouter une mise à jour
                         </Button>
                       </DialogTrigger>
                       <DialogContent className="max-w-2xl">
                         <DialogHeader>
                           <DialogTitle>Ajouter une mise à jour - {project.name}</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4">
                           <div>
                             <label className="text-sm font-medium">Nouvelle mise à jour</label>
                             <Textarea
                               value={newUpdate}
                               onChange={(e) => setNewUpdate(e.target.value)}
                               placeholder="Décrivez l'avancement du projet..."
                               className="mt-1"
                             />
                           </div>
                           <div className="flex justify-end">
                             <Button onClick={handleAddUpdate}>
                               Enregistrer la mise à jour
                             </Button>
                           </div>
                         </div>
                       </DialogContent>
                     </Dialog>
                   </div>
                 </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Avancement</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Budget */}
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Euro className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-semibold">
                        {project.budget.spent.toLocaleString()}€ / {project.budget.allocated.toLocaleString()}€
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={budgetPercentage} className="h-1 flex-1" />
                        <span className="text-xs">{budgetPercentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Échéance</p>
                      <p className="font-semibold">
                        {new Date(project.deadline).toLocaleDateString('fr-FR')}
                      </p>
                      <p className={`text-xs ${daysLeft < 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {daysLeft > 0 ? `${daysLeft} jours restants` : `En retard de ${Math.abs(daysLeft)} jours`}
                      </p>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Wrench className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ressources utilisées</p>
                      <p className="font-semibold">{project.resourcesUsed.length} ressources</p>
                      <p className="text-xs text-muted-foreground">
                        {project.resourcesUsed.slice(0, 2).join(", ")}
                        {project.resourcesUsed.length > 2 && "..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Updates */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Dernières mises à jour
                  </h4>
                  <div className="space-y-2">
                    {project.updates.slice(0, 2).map((update, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(update.date).toLocaleDateString('fr-FR')} - {update.author}
                        </div>
                        <p className="text-sm">{update.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}