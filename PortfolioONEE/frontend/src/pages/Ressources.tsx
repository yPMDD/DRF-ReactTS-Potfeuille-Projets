import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Users, Clock, Award, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Ressources() {
  const [isNewResourceOpen, setIsNewResourceOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<typeof resources[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const resources = [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@company.com",
      competence: "Développement",
      level: "Senior",
      availability: "Disponible",
      projects: 2,
      department: "IT"
    },
    {
      id: 2,
      name: "Marie Martin",
      email: "marie.martin@company.com",
      competence: "Chef de projet",
      level: "Expert",
      availability: "Occupé",
      projects: 3,
      department: "IT"
    },
    {
      id: 3,
      name: "Pierre Durand",
      email: "pierre.durand@company.com",
      competence: "Infrastructure",
      level: "Senior",
      availability: "Disponible",
      projects: 1,
      department: "IT"
    },
    {
      id: 4,
      name: "Sophie Leclerc",
      email: "sophie.leclerc@company.com",
      competence: "Sécurité",
      level: "Expert",
      availability: "Partiellement disponible",
      projects: 2,
      department: "IT"
    },
    {
      id: 5,
      name: "Alex Martin",
      email: "alex.martin@company.com",
      competence: "Développement",
      level: "Junior",
      availability: "Disponible",
      projects: 1,
      department: "IT"
    }
  ];

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'Disponible':
        return <Badge className="bg-success text-success-foreground">Disponible</Badge>;
      case 'Occupé':
        return <Badge className="bg-destructive text-destructive-foreground">Occupé</Badge>;
      case 'Partiellement disponible':
        return <Badge className="bg-warning text-warning-foreground">Partiellement</Badge>;
      default:
        return <Badge variant="secondary">{availability}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Expert':
        return <Badge className="bg-primary text-primary-foreground">Expert</Badge>;
      case 'Senior':
        return <Badge className="bg-info text-info-foreground">Senior</Badge>;
      case 'Junior':
        return <Badge variant="outline">Junior</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const handleEditResource = (resource: typeof resources[0]) => {
    setEditingResource(resource);
  };

  const handleDeleteResource = (resourceId: number) => {
    toast({
      title: "Ressource supprimée",
      description: "La ressource a été supprimée avec succès",
    });
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.competence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ressources</h1>
          <p className="text-muted-foreground">Gestion des ressources et compétences</p>
        </div>
        <Dialog open={isNewResourceOpen} onOpenChange={setIsNewResourceOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Ressource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une ressource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="resourceName">Nom de la ressource</Label>
                <Input id="resourceName" placeholder="Jean Dupont" />
              </div>
              <div>
                <Label htmlFor="competence">Compétence principale</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Développement</SelectItem>
                    <SelectItem value="infra">Infrastructure</SelectItem>
                    <SelectItem value="security">Sécurité</SelectItem>
                    <SelectItem value="pm">Chef de projet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="level">Niveau</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewResourceOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => { setIsNewResourceOpen(false); toast({ title: "Ressource ajoutée", description: "La nouvelle ressource a été créée" }); }}>
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ressources Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">+5 ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.filter(r => r.availability === 'Disponible').length}</div>
            <p className="text-xs text-muted-foreground">{Math.round((resources.filter(r => r.availability === 'Disponible').length / resources.length) * 100)}% du total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experts</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.filter(r => r.level === 'Expert' || r.level === 'Senior').length}</div>
            <p className="text-xs text-muted-foreground">Niveau senior+</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, email, compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Ressources ({filteredResources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Compétence</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Disponibilité</TableHead>
                <TableHead>Projets</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="font-medium">{resource.name}</div>
                  </TableCell>
                  <TableCell>{resource.email}</TableCell>
                  <TableCell>{resource.competence}</TableCell>
                  <TableCell>{getLevelBadge(resource.level)}</TableCell>
                  <TableCell>{getAvailabilityBadge(resource.availability)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{resource.projects} projets</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={!!editingResource && editingResource.id === resource.id} onOpenChange={(open) => !open && setEditingResource(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEditResource(resource)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier la ressource - {resource.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="editName">Nom</Label>
                              <Input id="editName" defaultValue={resource.name} />
                            </div>
                            <div>
                              <Label htmlFor="editEmail">Email</Label>
                              <Input id="editEmail" type="email" defaultValue={resource.email} />
                            </div>
                            <div>
                              <Label htmlFor="editCompetence">Compétence</Label>
                              <Select defaultValue={resource.competence}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Développement">Développement</SelectItem>
                                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                  <SelectItem value="Sécurité">Sécurité</SelectItem>
                                  <SelectItem value="Chef de projet">Chef de projet</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="editLevel">Niveau</Label>
                              <Select defaultValue={resource.level}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Junior">Junior</SelectItem>
                                  <SelectItem value="Senior">Senior</SelectItem>
                                  <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="editAvailability">Disponibilité</Label>
                              <Select defaultValue={resource.availability}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Disponible">Disponible</SelectItem>
                                  <SelectItem value="Occupé">Occupé</SelectItem>
                                  <SelectItem value="Partiellement disponible">Partiellement disponible</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingResource(null)}>
                              Annuler
                            </Button>
                            <Button onClick={() => {
                              setEditingResource(null);
                              toast({ title: "Ressource modifiée", description: "Les modifications ont été enregistrées" });
                            }}>
                              Enregistrer
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la ressource</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer "{resource.name}" ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteResource(resource.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}