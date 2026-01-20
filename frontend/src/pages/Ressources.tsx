import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { Plus, Users, Clock, Award, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchRessources } from "@/services/fetchData";
import { createRessource } from "@/services/sendData";
import { deleteRessource } from "@/services/deleteData";
import { Ressource } from "@/types/Ressource";
import { fetchRessourceUtilisee } from "@/services/fetchData";
import { RessourceUtilisee } from "@/types/RessourceUtilisee";
import { updateRessource } from "@/services/updateData";

export default function Ressources() {
	const [isNewResourceOpen, setIsNewResourceOpen] = useState(false);
	const [editingResource, setEditingResource] = useState<Ressource | null>(
		null
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [resources, setResources] = useState<Ressource[]>([]);
	const [ressourceUtilisee, setRessourceUtilisee] = useState<
		RessourceUtilisee[]
	>([]);
	const [selectedResource, setSelectedResource] = useState<Ressource | null>(
		null
	);
	const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
	const [newResourceForm, setNewResourceForm] = useState({
		name: "",
		type: "",
		quantity: 1,
	});
	const [editResourceForm, setEditResourceForm] = useState({
		name: "",
		type: "",
		quantity: 1,
	});
	const { toast } = useToast();

	// Fetch resources and resource usage data
	useEffect(() => {
		async function loadData() {
			try {
				const [resourcesData, ressourceUtiliseeData] = await Promise.all([
					fetchRessources(),
					fetchRessourceUtilisee(),
				]);
				console.log("Initial resources loaded:", resourcesData);
				console.log(
					"Resource types on load:",
					resourcesData.map((r) => r.type)
				);
				setResources(resourcesData);
				setRessourceUtilisee(ressourceUtiliseeData);
			} catch (error) {
				console.error("Erreur lors du chargement des données:", error);
				toast({
					title: "Erreur",
					description: "Impossible de charger les ressources.",
					variant: "destructive",
				});
			}
		}
		loadData();
	}, [toast]);

	const getAvailabilityBadge = (availability: string) => {
		switch (availability) {
			case "Disponible":
				return (
					<Badge className="bg-success text-success-foreground">
						Disponible
					</Badge>
				);
			case "Occupé":
				return (
					<Badge className="bg-destructive text-destructive-foreground">
						Occupé
					</Badge>
				);
			case "Partiellement disponible":
				return (
					<Badge className="bg-warning text-warning-foreground">
						Partiellement
					</Badge>
				);
			default:
				return <Badge variant="secondary">{availability}</Badge>;
		}
	};

	const getLevelBadge = (level: string) => {
		switch (level) {
			case "Expert":
				return (
					<Badge className="bg-primary text-primary-foreground">Expert</Badge>
				);
			case "Senior":
				return <Badge className="bg-info text-info-foreground">Senior</Badge>;
			case "Junior":
				return <Badge variant="outline">Junior</Badge>;
			default:
				return <Badge variant="secondary">{level}</Badge>;
		}
	};

	const handleEditResource = (resource: Ressource) => {
		setEditingResource(resource);
		setEditResourceForm({
			name: resource.name,
			type: resource.type,
			quantity: resource.quantity,
		});
	};

	const handleCreateResource = async () => {
		try {
			if (
				!newResourceForm.name ||
				!newResourceForm.type ||
				newResourceForm.quantity < 1
			) {
				toast({
					title: "Erreur",
					description: "Veuillez remplir tous les champs correctement.",
					variant: "destructive",
				});
				return;
			}

			await createRessource(
				newResourceForm.name,
				newResourceForm.type,
				newResourceForm.quantity
			);

			// Refresh the resources list
			const updatedResources = await fetchRessources();
			console.log("Updated resources:", updatedResources);
			console.log(
				"Resource types:",
				updatedResources.map((r) => r.type)
			);

			// Remove duplicates based on ID and ensure unique types
			const uniqueResources = updatedResources.filter(
				(resource, index, self) =>
					index === self.findIndex((r) => r.id === resource.id)
			);
			console.log("Unique resources after deduplication:", uniqueResources);

			setResources(uniqueResources);

			// Reset form and close modal
			setNewResourceForm({ name: "", type: "", quantity: 1 });
			setIsNewResourceOpen(false);

			toast({
				title: "Ressource créée",
				description: "La nouvelle ressource a été ajoutée avec succès",
			});
		} catch (error) {
			console.error("Erreur lors de la création de la ressource:", error);
			toast({
				title: "Erreur",
				description: "Impossible de créer la ressource.",
				variant: "destructive",
			});
		}
	};

	const handleUpdateResource = async () => {
		if (!editingResource) return;

		try {
			if (
				!editResourceForm.name ||
				!editResourceForm.type ||
				editResourceForm.quantity < 1
			) {
				toast({
					title: "Erreur",
					description: "Veuillez remplir tous les champs correctement.",
					variant: "destructive",
				});
				return;
			}

			await updateRessource(editingResource.id, {
				name: editResourceForm.name,
				type: editResourceForm.type,
				quantity: editResourceForm.quantity,
			});

			// Refresh the resources list
			const updatedResources = await fetchRessources();
			setResources(updatedResources);

			// Close modal and reset form
			setEditingResource(null);
			setEditResourceForm({ name: "", type: "", quantity: 1 });

			toast({
				title: "Ressource mise à jour",
				description: "La ressource a été modifiée avec succès",
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour de la ressource:", error);
			toast({
				title: "Erreur",
				description: "Impossible de mettre à jour la ressource.",
				variant: "destructive",
			});
		}
	};

	const handleDeleteResource = async (resourceId: number) => {
		try {
			await deleteRessource(resourceId);

			// Refresh the resources list
			const updatedResources = await fetchRessources();
			setResources(updatedResources);

			toast({
				title: "Ressource supprimée",
				description: "La ressource a été supprimée avec succès",
			});
		} catch (error) {
			console.error("Erreur lors de la suppression de la ressource:", error);
			toast({
				title: "Erreur",
				description: "Impossible de supprimer la ressource.",
				variant: "destructive",
			});
		}
	};

	const filteredResources = resources.filter(
		(resource) =>
			resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			resource.type.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Function to get projects using a specific resource
	const getProjectsUsingResource = (resourceId: number) => {
		return ressourceUtilisee.filter((ru) => ru.ressource.id === resourceId);
	};

	// Function to handle showing projects for a resource
	const handleShowProjects = (resource: Ressource) => {
		setSelectedResource(resource);
		setIsProjectsModalOpen(true);
	};

	// Function to calculate available units for a resource
	const getAvailableUnits = (resourceId: number) => {
		const resource = resources.find((r) => r.id === resourceId);
		if (!resource) return 0;

		const usedUnits = ressourceUtilisee
			.filter((ru) => ru.ressource.id === resourceId)
			.reduce((total, ru) => total + ru.quantity, 0);

		return Math.max(0, resource.quantity - usedUnits);
	};

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Ressources</h1>
					<p className="text-muted-foreground">
						Gestion des ressources et compétences
					</p>
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
								<Input
									id="resourceName"
									placeholder="Nom de la ressource"
									value={newResourceForm.name}
									onChange={(e) =>
										setNewResourceForm({
											...newResourceForm,
											name: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor="resourceType">Type de ressource</Label>
								<Select
									value={newResourceForm.type}
									onValueChange={(value) =>
										setNewResourceForm({
											...newResourceForm,
											type: value,
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionner un type..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="materielles">Matérielles</SelectItem>
										<SelectItem value="logicielles">Logicielles</SelectItem>
										<SelectItem value="informationnelles">
											Informationnelles
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="quantity">Quantité</Label>
								<Input
									id="quantity"
									type="number"
									placeholder="1"
									min="1"
									value={newResourceForm.quantity}
									onChange={(e) =>
										setNewResourceForm({
											...newResourceForm,
											quantity: Number(e.target.value),
										})
									}
								/>
							</div>
						</div>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => {
									setIsNewResourceOpen(false);
									setNewResourceForm({ name: "", type: "", quantity: 1 });
								}}
							>
								Annuler
							</Button>
							<Button onClick={handleCreateResource}>Ajouter</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Dynamic resource stats cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{resources.length}</div>
						<p className="text-xs text-muted-foreground">
							Toutes les ressources
						</p>
					</CardContent>
				</Card>
				{(() => {
					// Ensure we have unique resources first
					const uniqueResources = resources.filter(
						(resource, index, self) =>
							index === self.findIndex((r) => r.id === resource.id)
					);

					const uniqueTypes = Array.from(
						new Set(uniqueResources.map((r) => r.type))
					).sort();

					console.log("Current resources:", uniqueResources);
					console.log("Unique types:", uniqueTypes);

					return uniqueTypes.map((type) => {
						const count = uniqueResources.filter((r) => r.type === type).length;
						console.log(`Type ${type}: ${count} resources`);
						return (
							<Card key={type}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</CardTitle>
									<Award className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{count}</div>
									<p className="text-xs text-muted-foreground">
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</p>
								</CardContent>
							</Card>
						);
					});
				})()}
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
					<CardTitle>
						Liste des Ressources ({filteredResources.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nom</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Quantité</TableHead>
								<TableHead>Disponible</TableHead>
								<TableHead>Projets utilisant</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredResources.map((resource) => {
								const projectsUsingResource = getProjectsUsingResource(
									resource.id
								);
								return (
									<TableRow key={resource.id}>
										<TableCell>
											<div className="font-medium">{resource.name}</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">{resource.type}</Badge>
										</TableCell>
										<TableCell>
											<div className="font-medium">{resource.quantity}</div>
										</TableCell>
										<TableCell>
											<div className="font-medium">
												{getAvailableUnits(resource.id)}
											</div>
											<div className="text-xs text-muted-foreground">
												disponibles
											</div>
										</TableCell>
										<TableCell>
											{projectsUsingResource.length > 0 ? (
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleShowProjects(resource)}
												>
													Voir ({projectsUsingResource.length})
												</Button>
											) : (
												<span className="text-muted-foreground">
													Aucun projet
												</span>
											)}
										</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Dialog
													open={
														!!editingResource &&
														editingResource.id === resource.id
													}
													onOpenChange={(open) =>
														!open && setEditingResource(null)
													}
												>
													<DialogTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleEditResource(resource)}
														>
															<Edit className="w-4 h-4" />
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>
																Modifier la ressource - {resource.name}
															</DialogTitle>
														</DialogHeader>
														<div className="space-y-4">
															<div>
																<Label htmlFor="editName">Nom</Label>
																<Input
																	id="editName"
																	value={editResourceForm.name}
																	onChange={(e) =>
																		setEditResourceForm({
																			...editResourceForm,
																			name: e.target.value,
																		})
																	}
																/>
															</div>
															<div>
																<Label htmlFor="editType">Type</Label>
																<Select
																	value={editResourceForm.type}
																	onValueChange={(value) =>
																		setEditResourceForm({
																			...editResourceForm,
																			type: value,
																		})
																	}
																>
																	<SelectTrigger>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="materielles">
																			Matérielles
																		</SelectItem>
																		<SelectItem value="logicielles">
																			Logicielles
																		</SelectItem>
																		<SelectItem value="informationnelles">
																			Informationnelles
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>
															<div>
																<Label htmlFor="editQuantity">Quantité</Label>
																<Input
																	id="editQuantity"
																	type="number"
																	value={editResourceForm.quantity}
																	onChange={(e) =>
																		setEditResourceForm({
																			...editResourceForm,
																			quantity: Number(e.target.value),
																		})
																	}
																	min="1"
																/>
															</div>
														</div>
														<div className="flex justify-end gap-2">
															<Button
																variant="outline"
																onClick={() => {
																	setEditingResource(null);
																	setEditResourceForm({
																		name: "",
																		type: "",
																		quantity: 1,
																	});
																}}
															>
																Annuler
															</Button>
															<Button onClick={handleUpdateResource}>
																Enregistrer
															</Button>
														</div>
													</DialogContent>
												</Dialog>

												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Supprimer la ressource
															</AlertDialogTitle>
															<AlertDialogDescription>
																Êtes-vous sûr de vouloir supprimer "
																{resource.name}" ? Cette action est
																irréversible.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Annuler</AlertDialogCancel>
															<AlertDialogAction
																onClick={() =>
																	handleDeleteResource(resource.id)
																}
																className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
															>
																Supprimer
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Modal to show projects using a resource */}
			<Dialog open={isProjectsModalOpen} onOpenChange={setIsProjectsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Projets utilisant {selectedResource?.name}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						{selectedResource &&
						getProjectsUsingResource(selectedResource.id).length > 0 ? (
							getProjectsUsingResource(selectedResource.id).map((ru) => (
								<div key={ru.id} className="border-b pb-3">
									<div className="flex justify-between items-start">
										<div>
											<h4 className="font-medium">{ru.project.name}</h4>
											<p className="text-sm text-muted-foreground">
												Manager: {ru.project.manager}
											</p>
											<p className="text-sm text-muted-foreground">
												Quantité utilisée: {ru.quantity}
											</p>
										</div>
										<Badge variant="outline">{ru.project.status}</Badge>
									</div>
								</div>
							))
						) : (
							<div className="text-center text-muted-foreground py-4">
								Aucun projet n'utilise cette ressource
							</div>
						)}
					</div>
					<div className="flex justify-end">
						<Button
							variant="outline"
							onClick={() => setIsProjectsModalOpen(false)}
						>
							Fermer
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
