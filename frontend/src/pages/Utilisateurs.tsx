import { useEffect, useState } from "react";
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
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Shield,
	User,
	UserCog,
	Briefcase,
	Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchUsers } from "@/services/fetchData";
import { createUser } from "@/services/sendData";
import { deleteUser } from "@/services/deleteData";
import { updateUser } from "@/services/updateData"; // or fetchData if you put it there

export default function Utilisateurs() {
	const [searchTerm, setSearchTerm] = useState("");
	const [isNewUserOpen, setIsNewUserOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<(typeof users)[0] | null>(
		null
	);
	const [editForm, setEditForm] = useState({
		full_name: "",
		email: "",
		role: "",
	});
	const { toast } = useToast();

	const [users, setUsers] = useState<
		{ id: number; full_name: string; role: string; email: string }[]
	>([]);

	const [newUserForm, setNewUserForm] = useState({
		full_name: "",
		email: "",
		role: "",
	});

	useEffect(() => {
		fetchUsers().then(setUsers);
	}, []);

	const handleEditUser = (user: (typeof users)[0]) => {
		setEditingUser(user);
		setEditForm({
			full_name: user.full_name,
			email: user.email,
			role: user.role,
		});
	};

	const handleSaveUser = async () => {
		if (!editingUser) return;
		try {
			await updateUser(editingUser.id, editForm);
			// Optionally, refresh the users list:
			fetchUsers().then(setUsers);
			toast({
				title: "Utilisateur mis à jour",
				description: "Les informations ont été enregistrées avec succès",
			});
			setEditingUser(null);
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible de mettre à jour l'utilisateur.",
				variant: "destructive",
			});
		}
	};

	const handleDeleteUser = async (userId: number) => {
		try {
			await deleteUser(userId);
			setUsers(users.filter((user) => user.id !== userId));
			toast({
				title: "Utilisateur supprimé",
				description: "L'utilisateur a été supprimé du système",
			});
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible de supprimer l'utilisateur.",
				variant: "destructive",
			});
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getRoleIcon = (role: string) => {
		switch (role) {
			case "admin":
				return <Shield className="w-4 h-4 text-red-500" />;
			case "supervisor":
				return <Briefcase className="w-4 h-4 text-grey-500" />;
			case "manager":
				return <Users className="w-4 h-4 text-grey-500" />;
			default:
				return <User className="w-4 h-4 text-grey-500" />;
		}
	};

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
					<p className="text-muted-foreground">
						Gestion des utilisateurs et leurs permissions
					</p>
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
								<Input
									id="newName"
									placeholder="Jean Dupont"
									value={newUserForm.full_name}
									onChange={(e) =>
										setNewUserForm({
											...newUserForm,
											full_name: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor="newEmail">Email</Label>
								<Input
									id="newEmail"
									type="email"
									placeholder="jean.dupont@dsi.gouv.fr"
									value={newUserForm.email}
									onChange={(e) =>
										setNewUserForm({ ...newUserForm, email: e.target.value })
									}
								/>
							</div>
							<div>
								<Label htmlFor="newRole">Rôle</Label>
								<Select
									value={newUserForm.role}
									onValueChange={(value) =>
										setNewUserForm({ ...newUserForm, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionner un rôle" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">Administrateur</SelectItem>
										<SelectItem value="manager">Manager</SelectItem>
										<SelectItem value="supervisor">Superviseur</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsNewUserOpen(false)}>
								Annuler
							</Button>
							<Button
								onClick={async () => {
									try {
										await createUser(
											newUserForm.full_name,
											newUserForm.email,
											newUserForm.role
										);
										setIsNewUserOpen(false);
										// Optionally, refresh the users list:
										fetchUsers().then(setUsers);
										toast({
											title: "Utilisateur créé",
											description: "Un email de bienvenue a été envoyé.",
										});
									} catch (error) {
										toast({
											title: "Erreur",
											description: "Impossible de créer l'utilisateur.",
											variant: "destructive",
										});
									}
								}}
							>
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
								<div
									key={user.id}
									className="flex items-center justify-between p-4 border rounded-lg"
								>
									<div className="flex items-center gap-4">
										<Avatar>
											<AvatarImage src={`/api/placeholder/40/40`} />
											<AvatarFallback>
												{user.full_name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="flex items-center gap-2">
												<span className="font-medium">{user.full_name}</span>
												{getRoleIcon(user.role)}
												<Badge
													variant={
														user.role === "admin"
															? "destructive"
															: user.role === "manager"
															? "secondary"
															: user.role === "supervisor"
															? "secondary"
															: "outline"
													}
												>
													{user.role === "admin"
														? "Administrateur"
														: user.role === "manager"
														? "Manager"
														: user.role === "supervisor"
														? "Superviseur"
														: "Utilisateur"}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground">
												{user.email}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Dialog
											open={!!editingUser && editingUser.id === user.id}
											onOpenChange={(open) => !open && setEditingUser(null)}
										>
											<DialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleEditUser(user)}
												>
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
															value={editForm.full_name}
															onChange={(e) =>
																setEditForm({
																	...editForm,
																	full_name: e.target.value,
																})
															}
														/>
													</div>
													<div>
														<Label htmlFor="editEmail">Email</Label>
														<Input
															id="editEmail"
															type="email"
															value={editForm.email}
															onChange={(e) =>
																setEditForm({
																	...editForm,
																	email: e.target.value,
																})
															}
														/>
													</div>
													<div>
														<Label htmlFor="editRole">Rôle</Label>
														<Select
															value={editForm.role}
															onValueChange={(value) =>
																setEditForm({ ...editForm, role: value })
															}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="admin">
																	Administrateur
																</SelectItem>
																<SelectItem value="manager">Manager</SelectItem>
																<SelectItem value="supervisor">
																	Superviseur
																</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														onClick={() => setEditingUser(null)}
													>
														Annuler
													</Button>
													<Button onClick={handleSaveUser}>Enregistrer</Button>
												</div>
											</DialogContent>
										</Dialog>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Supprimer l'utilisateur
													</AlertDialogTitle>
													<AlertDialogDescription>
														Êtes-vous sûr de vouloir supprimer l'utilisateur "
														{user.full_name}" ? Cette action est irréversible.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Annuler</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleDeleteUser(user.id)}
														className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
													>
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
