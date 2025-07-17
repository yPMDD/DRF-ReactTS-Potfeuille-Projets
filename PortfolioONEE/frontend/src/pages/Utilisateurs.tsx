import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, Shield, User, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Utilisateurs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: ""
  });
  const { toast } = useToast();

  const users = [
    { id: 1, name: "Marie Dubois", email: "marie.dubois@dsi.gouv.fr", role: "admin", active: true, lastLogin: "2024-07-14" },
    { id: 2, name: "Pierre Martin", email: "pierre.martin@dsi.gouv.fr", role: "power_user", active: true, lastLogin: "2024-07-13" },
    { id: 3, name: "Sophie Leclerc", email: "sophie.leclerc@dsi.gouv.fr", role: "simple_user", active: true, lastLogin: "2024-07-12" },
  ];

  const handleEditUser = (user: typeof users[0]) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const handleSaveUser = () => {
    toast({
      title: "Utilisateur mis à jour",
      description: "Les informations ont été enregistrées avec succès",
    });
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé du système",
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'power_user': return <UserCog className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gestion des utilisateurs et leurs permissions</p>
        </div>
        <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newName">Nom complet</Label>
                <Input id="newName" placeholder="Jean Dupont" />
              </div>
              <div>
                <Label htmlFor="newEmail">Email</Label>
                <Input id="newEmail" type="email" placeholder="jean.dupont@dsi.gouv.fr" />
              </div>
              <div>
                <Label htmlFor="newRole">Rôle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple_user">Utilisateur simple</SelectItem>
                    <SelectItem value="power_user">Utilisateur expert</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewUserOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsNewUserOpen(false)}>
                Créer l'utilisateur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/api/placeholder/40/40`} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        {getRoleIcon(user.role)}
                        <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'power_user' ? 'secondary' : 'outline'}>
                          {user.role === 'admin' ? 'Admin' : user.role === 'power_user' ? 'Expert' : 'Utilisateur'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                   <div className="flex items-center gap-2">
                     <Dialog open={!!editingUser && editingUser.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                       <DialogTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                           <Edit className="w-4 h-4" />
                         </Button>
                       </DialogTrigger>
                       <DialogContent>
                         <DialogHeader>
                           <DialogTitle>Modifier l'utilisateur</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4">
                           <div>
                             <Label htmlFor="editName">Nom complet</Label>
                             <Input
                               id="editName"
                               value={editForm.name}
                               onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                             />
                           </div>
                           <div>
                             <Label htmlFor="editEmail">Email</Label>
                             <Input
                               id="editEmail"
                               type="email"
                               value={editForm.email}
                               onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                             />
                           </div>
                           <div>
                             <Label htmlFor="editRole">Rôle</Label>
                             <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                               <SelectTrigger>
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="simple_user">Utilisateur simple</SelectItem>
                                 <SelectItem value="power_user">Utilisateur expert</SelectItem>
                                 <SelectItem value="admin">Administrateur</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                         </div>
                         <div className="flex justify-end gap-2">
                           <Button variant="outline" onClick={() => setEditingUser(null)}>
                             Annuler
                           </Button>
                           <Button onClick={handleSaveUser}>
                             Enregistrer
                           </Button>
                         </div>
                       </DialogContent>
                     </Dialog>
                     
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="text-destructive">
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                           <AlertDialogDescription>
                             Êtes-vous sûr de vouloir supprimer l'utilisateur "{user.name}" ? Cette action est irréversible.
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>Annuler</AlertDialogCancel>
                           <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                             Supprimer
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}