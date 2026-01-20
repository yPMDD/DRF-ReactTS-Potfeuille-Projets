import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
	Filter,
	Eye,
	Edit,
	Trash2,
	FileText,
	Calendar,
	Users,
	DollarSign,
	CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchManagers } from "@/services/fetchData";
import { Manager } from "@/types/Manager";
import { fetchDivisionsAndSecteurs } from "@/services/fetchData";
import { Division } from "@/types/Division";
import { Secteur } from "@/types/Secteur";
import axios from "axios";
import AuthService from "@/services/auth"; // If you use a getCsrfToken utility
import { Projet } from "@/types/Projet";
import { deleteProject } from "@/services/deleteData";
import { markProjectAsCompleted } from "@/services/updateData";
import { MiseAjour } from "@/types/miseAjour";
import { fetchMiseAjour } from "@/services/fetchData";
import { updateProject } from "@/services/updateData";
import { fetchRessources } from "@/services/fetchData";
import { fetchRessourceUtilisee } from "@/services/fetchData";
import { Ressource } from "@/types/Ressource";
import { RessourceUtilisee } from "@/types/RessourceUtilisee";
import { addRessourceUtilisee } from "@/services/sendData";

import { Checkbox } from "@/components/ui/checkbox";
const API_URL = "http://localhost:8000";

export async function createProject(data: {
	name: string;
	category: string;
	division: string;
	secteur: string;
	description: string;
	manager: string;
	budget: number;
	date_debut: string;
	date_fin: string;
	ressources?: string[];
}) {
	const csrfToken = await AuthService.getCsrfToken();
	const response = await axios.post(`${API_URL}/projects/create/`, data, {
		withCredentials: true,
		headers: { "X-CSRFToken": csrfToken },
	});
	return response.data;
}

async function fetchProjects() {
	const response = await axios.get(`${API_URL}/projects/`, {
		withCredentials: true,
	});
	return response.data;
}

function calculateProgress(project: Projet): number {
	// If project is completed, return 100%
	if (project.status === "termine") {
		return 100;
	}

	// Budget progress
	const budgetProgress =
		project.budget && project.budget_used
			? (project.budget_used / project.budget) * 100
			: 0;

	// Time progress
	let timeProgress = 0;
	if (project.date_debut && project.date_fin) {
		const start = new Date(project.date_debut).getTime();
		const end = new Date(project.date_fin).getTime();
		const now = Date.now();
		if (end > start) {
			timeProgress = ((now - start) / (end - start)) * 100;
			timeProgress = Math.max(0, Math.min(100, timeProgress));
		}
	}

	return Math.round((budgetProgress + timeProgress) / 2);
}

function formatDate(dateStr?: string) {
	if (!dateStr) return "—";
	let date = new Date(dateStr);
	if (!isNaN(date.getTime())) return date.toLocaleDateString("fr-FR");
	// Try DD/MM/YYYY
	const parts = dateStr.split("/");
	if (parts.length === 3) {
		date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
		if (!isNaN(date.getTime())) return date.toLocaleDateString("fr-FR");
	}
	return "—";
}

export default function Projets() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<
		(typeof projects)[0] | null
	>(null);
	const [viewingProject, setViewingProject] = useState<
		(typeof projects)[0] | null
	>(null);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [editForm, setEditForm] = useState({
		name: "",
		description: "",
		budget: 0,
		budgetUsed: 0,
		startDate: "",
		endDate: "",
		manager: "",
		category: "",
		division: "",
		section: "",
		ressources: [] as string[],
	});
	const { toast } = useToast();
	const [managers, setManagers] = useState<Manager[]>([]);
	const [selectedManager, setSelectedManager] = useState<string>("");

	const [divisions, setDivisions] = useState<{ id: number; name: string }[]>(
		[]
	);
	const [secteurs, setSecteurs] = useState<
		{ id: number; name: string; division_id: number }[]
	>([]);
	const [selectedDivision, setSelectedDivision] = useState<string>(""); // store division id as string
	const [selectedSecteur, setSelectedSecteur] = useState<string>("");
	const [newProjectForm, setNewProjectForm] = useState({
		name: "",
		category: "",
		division: "",
		secteur: "",
		description: "",
		manager: "",
		budget: 0,
		date_debut: "",
		date_fin: "",
		ressources: [] as string[],
	});

	const [projects, setProjects] = useState<Projet[]>([]);
	const [miseAjours, setMiseAjours] = useState<MiseAjour[]>([]);
	const [availableResources, setAvailableResources] = useState<Ressource[]>([]);
	const [ressourceUtilisee, setRessourceUtilisee] = useState<
		RessourceUtilisee[]
	>([]);

	useEffect(() => {
		async function loadManagers() {
			const managersData: Manager[] = await fetchManagers();
			setManagers(managersData);
		}
		loadManagers();
	}, []);

	useEffect(() => {
		async function loadDivisionsAndSecteurs() {
			const data = await fetchDivisionsAndSecteurs();
			setDivisions(data.divisions);
			setSecteurs(data.secteurs);
		}
		loadDivisionsAndSecteurs();
	}, []);
	useEffect(() => {
		async function loadData() {
			const [projectsData, miseAjoursData, ressourceUtiliseeData] =
				await Promise.all([
					fetchProjects(),
					fetchMiseAjour(),
					fetchRessourceUtilisee(),
				]);
			// Map dates and assign mises à jour to each project
			const projectsWithMiseAjour: Projet[] = (projectsData as Projet[]).map(
				(
					p: Projet & {
						start_date?: string;
						end_date?: string;
						progress?: number;
					}
				) => ({
					...p,
					date_debut: p.start_date,
					date_fin: p.end_date,
					mise_a_jour: miseAjoursData.filter(
						(maj: MiseAjour) => maj.project === p.id
					),
					// Ensure completed projects show 100% progress
					progress: p.status === "termine" ? 100 : p.progress || 0,
				})
			);
			setProjects(projectsWithMiseAjour);
			setMiseAjours(miseAjoursData);
			setRessourceUtilisee(ressourceUtiliseeData);
			console.log(
				"Initial ressourceUtilisee data in Projets:",
				ressourceUtiliseeData
			);
		}
		loadData();
	}, []);

	useEffect(() => {
		async function loadAvailableResources() {
			const resources = await fetchRessources();
			setAvailableResources(resources);
		}
		loadAvailableResources();
	}, []);

	const handleCreateProject = async () => {
		try {
			// Create the project first
			const createdProject = await createProject(newProjectForm);

			// Add selected resources to the project
			if (newProjectForm.ressources.length > 0) {
				for (const resourceId of newProjectForm.ressources) {
					await addRessourceUtilisee(
						parseInt(resourceId),
						createdProject.id,
						1 // Default quantity of 1, you might want to add quantity selection
					);
				}
			}

			setIsNewProjectOpen(false);
			// Reset the form
			setNewProjectForm({
				name: "",
				category: "",
				division: "",
				secteur: "",
				description: "",
				manager: "",
				budget: 0,
				date_debut: "",
				date_fin: "",
				ressources: [],
			});
			// Add a small delay to ensure the API has processed the changes
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Refresh the projects and resources data
			const [projectsData, ressourceUtiliseeData] = await Promise.all([
				fetchProjects(),
				fetchRessourceUtilisee(),
			]);
			const mappedProjects: Projet[] = (projectsData as Projet[]).map(
				(p: Projet & { start_date?: string; end_date?: string }) => ({
					...p,
					date_debut: p.start_date,
					date_fin: p.end_date,
					mise_a_jour: miseAjours.filter(
						(maj: MiseAjour) => maj.project === p.id
					),
				})
			);
			setProjects(mappedProjects);
			setRessourceUtilisee(ressourceUtiliseeData);

			toast({
				title: "Projet créé",
				description: "Le projet a été ajouté avec succès.",
			});
		} catch (error) {
			console.error("Error creating project:", error);
			toast({
				title: "Erreur",
				description: "Impossible de créer le projet.",
				variant: "destructive",
			});
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "en_cours":
				return <Badge className="bg-info text-info-foreground">En cours</Badge>;
			case "planifie":
				return <Badge variant="outline">Planifié</Badge>;
			case "termine": {
				return (
					<Badge className="bg-success text-success-foreground">Terminé</Badge>
				);
			}
			case "en_retard":
				return (
					<Badge className="bg-destructive text-destructive-foreground">
						En retard
					</Badge>
				);
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const getRiskBadge = (risk: string) => {
		switch (risk) {
			case "low":
				return (
					<Badge className="bg-success/20 text-success-foreground border-success/30">
						Faible
					</Badge>
				);
			case "medium":
				return (
					<Badge className="bg-warning/20 text-warning-foreground border-warning/30">
						Moyen
					</Badge>
				);
			case "high":
				return (
					<Badge className="bg-destructive/20 text-destructive-foreground border-destructive/30">
						Élevé
					</Badge>
				);
			default:
				return <Badge variant="outline">{risk}</Badge>;
		}
	};

	const getProjectResources = (projectId: number) => {
		const resources = ressourceUtilisee.filter(
			(ru) => ru.project.id === projectId
		);
		console.log(`Resources for project ${projectId}:`, resources);
		console.log("All ressourceUtilisee:", ressourceUtilisee);
		return resources;
	};

	const handleEditProject = (project: (typeof projects)[0]) => {
		console.log("Project data:", project);
		console.log("Divisions:", divisions);
		console.log("Secteurs:", secteurs);

		// Find the division ID by name
		const divisionObj = divisions.find((d) => d.name === project.division);
		const divisionId = divisionObj ? divisionObj.id.toString() : "";

		// Find the secteur by name
		const secteurObj = secteurs.find((s) => s.name === project.secteur);
		const secteurName = secteurObj ? secteurObj.name : project.secteur;

		console.log("Found division ID:", divisionId);
		console.log("Found secteur name:", secteurName);

		// Get current project resources
		const currentResources = getProjectResources(project.id);
		const currentResourceIds = currentResources.map((cr) =>
			cr.ressource.id.toString()
		);

		setEditingProject(project);
		setEditForm({
			name: project.name,
			description: project.description,
			budget: project.budget,
			budgetUsed: project.budget_used ?? 0,
			startDate: project.date_debut,
			endDate: project.date_fin,
			manager: project.manager,
			category: project.category,
			division: divisionId,
			section: secteurName,
			ressources: currentResourceIds,
		});
	};

	const handleSaveProject = async () => {
		if (!editingProject) return;

		try {
			// Prepare the data for the API
			const updateData = {
				name: editForm.name,
				description: editForm.description,
				budget: editForm.budget,
				budget_used: editForm.budgetUsed,
				date_debut: editForm.startDate,
				date_fin: editForm.endDate,
				manager: editForm.manager,
				category: editForm.category,
				division: editForm.division,
				secteur: editForm.section,
			};

			// Call the update API
			await updateProject(editingProject.id, updateData);

			// Handle resource updates
			if (editForm.ressources.length > 0) {
				// Get current project resources
				const currentResources = getProjectResources(editingProject.id);

				// Remove existing resources that are not in the new selection
				for (const currentResource of currentResources) {
					if (
						!editForm.ressources.includes(
							currentResource.ressource.id.toString()
						)
					) {
						// You might want to add a deleteRessourceUtilisee function here
						// For now, we'll just add the new ones
					}
				}

				// Add new resources
				for (const resourceId of editForm.ressources) {
					// Check if this resource is already assigned to the project
					const isAlreadyAssigned = currentResources.some(
						(cr) => cr.ressource.id.toString() === resourceId
					);

					if (!isAlreadyAssigned) {
						await addRessourceUtilisee(
							parseInt(resourceId),
							editingProject.id,
							1 // Default quantity of 1
						);
					}
				}
			}

			// Add a small delay to ensure the API has processed the changes
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Refresh the projects and resources data
			const [updatedProjectsData, ressourceUtiliseeData] = await Promise.all([
				fetchProjects(),
				fetchRessourceUtilisee(),
			]);
			const mappedProjects: Projet[] = (updatedProjectsData as Projet[]).map(
				(p: Projet & { start_date?: string; end_date?: string }) => ({
					...p,
					date_debut: p.start_date,
					date_fin: p.end_date,
					mise_a_jour: miseAjours.filter(
						(maj: MiseAjour) => maj.project === p.id
					),
				})
			);
			setProjects(mappedProjects);
			setRessourceUtilisee(ressourceUtiliseeData);

			// Show success message
			toast({
				title: "Projet mis à jour",
				description: "Les modifications ont été enregistrées avec succès",
			});

			// Close the edit modal
			setEditingProject(null);
		} catch (error) {
			console.error("Erreur lors de la mise à jour du projet :", error);
			toast({
				title: "Erreur",
				description: "Impossible de mettre à jour le projet.",
				variant: "destructive",
			});
		}
	};

	const handleDeleteProject = async (projectId: number) => {
		try {
			await deleteProject(projectId); // Wait for the delete to finish
			toast({
				title: "Projet supprimé",
				description: "Le projet a été supprimé définitivement",
			});
			// Fetch the updated list and map the dates
			fetchProjects().then((data) => {
				const mappedProjects: Projet[] = (data as Projet[]).map(
					(p: Projet & { start_date?: string; end_date?: string }) => ({
						...p,
						date_debut: p.start_date,
						date_fin: p.end_date,
						mise_a_jour: miseAjours.filter(
							(maj: MiseAjour) => maj.project === p.id
						),
					})
				);
				setProjects(mappedProjects);
			});
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible de supprimer le projet.",
				variant: "destructive",
			});
		}
	};

	const handleMarkAsDone = async (projectId: number) => {
		console.log(`handleMarkAsDone called with projectId: ${projectId}`);
		try {
			console.log(`Calling markProjectAsCompleted API...`);
			await markProjectAsCompleted(projectId);
			console.log(`API call successful, updating local state...`);

			// Update the local state with 100% progress for completed projects
			const updatedProjects = projects.map((p) =>
				p.id === projectId ? { ...p, status: "termine", progress: 100 } : p
			);
			setProjects(updatedProjects);
			console.log(`Local state updated successfully`);

			toast({
				title: "Projet marqué comme terminé",
				description: "Le projet a été marqué comme terminé avec succès",
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour du projet :", error);
			toast({
				title: "Erreur",
				description: "Impossible de marquer le projet comme terminé.",
				variant: "destructive",
			});
		}
	};

	const filteredProjects = projects.filter((project) => {
		const matchesSearch =
			project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.category.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || project.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Gestion des Projets
					</h1>
					<p className="text-muted-foreground">
						Suivi et administration de tous vos projets DSI
					</p>
				</div>

				<Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="w-4 h-4" />
							Nouveau Projet
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Nouveau Projet</DialogTitle>
							<DialogDescription>
								Créer un nouveau projet DSI avec les informations de base
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Nom du projet</label>
									<Input
										value={newProjectForm.name}
										onChange={(e) =>
											setNewProjectForm({
												...newProjectForm,
												name: e.target.value,
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Catégorie</label>
									<Select
										value={newProjectForm.category}
										onValueChange={(value) =>
											setNewProjectForm({ ...newProjectForm, category: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sélectionner..." />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="infrastructure">
												Infrastructure
											</SelectItem>
											<SelectItem value="web">Web</SelectItem>
											<SelectItem value="erp">ERP</SelectItem>
											<SelectItem value="securite">Sécurité</SelectItem>
											<SelectItem value="autre">Autre</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Description</label>
								<Input
									value={newProjectForm.description}
									onChange={(e) =>
										setNewProjectForm({
											...newProjectForm,
											description: e.target.value,
										})
									}
								/>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Budget (€)</label>
									<Input
										type="number"
										value={newProjectForm.budget}
										onChange={(e) =>
											setNewProjectForm({
												...newProjectForm,
												budget: Number(e.target.value),
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Date début</label>
									<Input
										type="date"
										value={newProjectForm.date_debut}
										onChange={(e) =>
											setNewProjectForm({
												...newProjectForm,
												date_debut: e.target.value,
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Date fin</label>
									<Input
										type="date"
										value={newProjectForm.date_fin}
										onChange={(e) =>
											setNewProjectForm({
												...newProjectForm,
												date_fin: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Manager</label>
									<Select
										value={newProjectForm.manager}
										onValueChange={(value) =>
											setNewProjectForm({ ...newProjectForm, manager: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sélectionner..." />
										</SelectTrigger>
										<SelectContent>
											{managers.map((manager) => (
												<SelectItem
													key={manager.user_id}
													value={manager.user_id.toString()}
												>
													{manager.first_name} {manager.last_name} (
													{manager.numProj} projets)
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Division</label>
									<Select
										value={newProjectForm.division}
										onValueChange={(value) =>
											setNewProjectForm({
												...newProjectForm,
												division: value,
												secteur: "",
											})
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sélectionner une division..." />
										</SelectTrigger>
										<SelectContent>
											{divisions.map((division) => (
												<SelectItem
													key={division.id}
													value={division.id.toString()}
												>
													{division.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Section</label>
								<Select
									value={newProjectForm.secteur}
									onValueChange={(value) =>
										setNewProjectForm({ ...newProjectForm, secteur: value })
									}
									disabled={!newProjectForm.division}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionner une section..." />
									</SelectTrigger>
									<SelectContent>
										{secteurs
											.filter(
												(secteur) =>
													secteur.division_id ===
													Number(newProjectForm.division)
											)
											.map((secteur) => (
												<SelectItem key={secteur.id} value={secteur.name}>
													{secteur.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Ressources</label>
								<div className="border rounded-md p-3 max-h-32 overflow-y-auto">
									{availableResources.map((resource) => (
										<div
											key={resource.id}
											className="flex items-center space-x-2 py-1"
										>
											<Checkbox
												id={`resource-${resource.id}`}
												checked={newProjectForm.ressources.includes(
													resource.id.toString()
												)}
												onCheckedChange={(checked) => {
													if (checked) {
														setNewProjectForm({
															...newProjectForm,
															ressources: [
																...newProjectForm.ressources,
																resource.id.toString(),
															],
														});
													} else {
														setNewProjectForm({
															...newProjectForm,
															ressources: newProjectForm.ressources.filter(
																(id) => id !== resource.id.toString()
															),
														});
													}
												}}
											/>
											<label
												htmlFor={`resource-${resource.id}`}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{resource.name} ({resource.type})
											</label>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setIsNewProjectOpen(false)}
							>
								Annuler
							</Button>
							<Button onClick={handleCreateProject}>Créer le projet</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filtres et Recherche</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4 items-end">
						<div className="flex-1 space-y-2">
							<label className="text-sm font-medium">Recherche</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Rechercher par nom, manager, catégorie..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Statut</label>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-48">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tous les statuts</SelectItem>
									<SelectItem value="planifie">Planifié</SelectItem>
									<SelectItem value="en_cours">En cours</SelectItem>
									<SelectItem value="termine">Terminé</SelectItem>
									<SelectItem value="en_retard">En retard</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
							<DialogTrigger asChild>
								<Button variant="outline" className="gap-2">
									<Filter className="w-4 h-4" />
									Plus de filtres
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Filtres avancés</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<Label>Budget minimum</Label>
										<Input type="number" placeholder="100000" />
									</div>
									<div>
										<Label>Catégorie</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Toutes les catégories" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="infrastructure">
													Infrastructure
												</SelectItem>
												<SelectItem value="web">Web</SelectItem>
												<SelectItem value="erp">ERP</SelectItem>
												<SelectItem value="securite">Sécurité</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Division</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Toutes les divisions" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="IT">IT</SelectItem>
												<SelectItem value="Marketing">Marketing</SelectItem>
												<SelectItem value="Finance">Finance</SelectItem>
												<SelectItem value="RH">RH</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										onClick={() => setIsFiltersOpen(false)}
									>
										Annuler
									</Button>
									<Button onClick={() => setIsFiltersOpen(false)}>
										Appliquer les filtres
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>

			{/* Projects Table */}
			<Card>
				<CardHeader>
					<CardTitle>Liste des Projets ({filteredProjects.length})</CardTitle>
					<CardDescription>
						Vue détaillée de tous vos projets avec leur statut et avancement
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Projet</TableHead>
								<TableHead>Manager</TableHead>
								<TableHead>Division/Section</TableHead>
								<TableHead>Statut</TableHead>
								<TableHead>Avancement</TableHead>
								<TableHead>Budget</TableHead>
								<TableHead>Ressources</TableHead>
								<TableHead>Échéance</TableHead>
								<TableHead>Mises à jour</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProjects.map(
								(project) => (
									console.log(project),
									(
										<TableRow key={project.id}>
											<TableCell>
												<div>
													<div className="font-medium">{project.name}</div>
													<div className="text-sm text-muted-foreground">
														{project.category}
													</div>
												</div>
											</TableCell>

											<TableCell>
												<div className="font-medium">{project.manager}</div>
											</TableCell>

											<TableCell>
												<div>
													<div className="font-medium">{project.division}</div>
													<div className="text-sm text-muted-foreground">
														{project.secteur}
													</div>
												</div>
											</TableCell>

											<TableCell>
												{getStatusBadge(project.status ?? "")}
											</TableCell>

											<TableCell>
												<div className="space-y-1">
													<div className="flex justify-between text-sm">
														<span>Avancement</span>
														<span>{calculateProgress(project)}%</span>
													</div>
													<Progress
														value={calculateProgress(project)}
														className="h-2 w-24"
													/>
												</div>
											</TableCell>

											<TableCell>
												<div className="text-sm">
													<div className="font-medium">
														{project.budget_used
															? project.budget_used / 1000
															: 0}
														k€ / {project.budget / 1000}k€
													</div>
													<div className="text-muted-foreground">
														{project.budget_used && project.budget
															? Math.round(
																	(project.budget_used / project.budget) * 100
															  )
															: 0}
														% utilisé
													</div>
												</div>
											</TableCell>

											<TableCell>
												<div className="text-sm">
													<div className="flex items-center gap-1">
														<Users className="w-3 h-3" />
														{(() => {
															const projectResources = getProjectResources(
																project.id
															);
															if (projectResources.length === 0) {
																return (
																	<span className="text-muted-foreground">
																		Aucune ressource
																	</span>
																);
															}
															return (
																<Dialog>
																	<DialogTrigger asChild>
																		<Button variant="outline" size="sm">
																			Voir ({projectResources.length})
																		</Button>
																	</DialogTrigger>
																	<DialogContent>
																		<DialogHeader>
																			<DialogTitle>
																				Ressources du projet - {project.name}
																			</DialogTitle>
																		</DialogHeader>
																		<div className="space-y-4">
																			{projectResources.length === 0 ? (
																				<p className="text-muted-foreground">
																					Aucune ressource assignée à ce projet
																				</p>
																			) : (
																				<div className="grid gap-3">
																					{projectResources.map((ru) => (
																						<div
																							key={ru.id}
																							className="flex items-center justify-between p-3 border rounded-lg"
																						>
																							<div>
																								<h4 className="font-medium">
																									{ru.ressource.name}
																								</h4>
																								<p className="text-sm text-muted-foreground">
																									{ru.ressource.type}
																								</p>
																							</div>
																							<div className="text-right">
																								<p className="font-medium">
																									Qté: {ru.quantity}
																								</p>
																							</div>
																						</div>
																					))}
																				</div>
																			)}
																		</div>
																	</DialogContent>
																</Dialog>
															);
														})()}
													</div>
												</div>
											</TableCell>

											<TableCell>
												<div className="text-sm">
													<div className="flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														{formatDate(project.date_fin)}
													</div>
												</div>
											</TableCell>

											<TableCell>
												<Dialog>
													<DialogTrigger asChild>
														<Button variant="outline" size="sm">
															Voir ({project.mise_a_jour?.length ?? 0})
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Mises à jour du projet</DialogTitle>
														</DialogHeader>
														<div className="space-y-2">
															{(!project.mise_a_jour ||
																project.mise_a_jour.length === 0) && (
																<div>Aucune mise à jour.</div>
															)}
															{project.mise_a_jour?.map((maj) => (
																<div
																	key={maj.id}
																	className="border-b pb-2 mb-2"
																>
																	<div className="text-xs text-muted-foreground mb-1 mt-5">
																		{/* Auteur */}
																		<span className="font-semibold ">
																			{project.manager}
																		</span>
																		{/* Date et heure */}
																		{maj.date && (
																			<>
																				{"  "} — {"  "}
																				{new Date(
																					maj.date
																				).toLocaleDateString()}
																				{"  "}
																				{new Date(
																					maj.date
																				).toLocaleTimeString()}
																			</>
																		)}
																	</div>
																	<div>{maj.content}</div>
																</div>
															))}
														</div>
													</DialogContent>
												</Dialog>
											</TableCell>

											<TableCell>
												<div className="flex gap-2">
													<Dialog>
														<DialogTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => setViewingProject(project)}
															>
																<Eye className="w-4 h-4" />
															</Button>
														</DialogTrigger>
														<DialogContent className="max-w-4xl">
															<DialogHeader>
																<DialogTitle>
																	Détails du projet - {project.name}
																</DialogTitle>
															</DialogHeader>
															<div className="space-y-6">
																<div className="grid grid-cols-2 gap-6">
																	<div>
																		<h4 className="font-medium mb-2">
																			Informations générales
																		</h4>
																		<div className="space-y-2 text-sm">
																			<div>
																				<span className="font-medium">
																					Description:
																				</span>{" "}
																				{project.description}
																			</div>
																			<div>
																				<span className="font-medium">
																					Catégorie:
																				</span>{" "}
																				{project.category}
																			</div>
																			<div>
																				<span className="font-medium">
																					Manager:
																				</span>{" "}
																				{project.manager}
																			</div>
																			<div>
																				<span className="font-medium">
																					Statut:
																				</span>{" "}
																				{getStatusBadge(project.status ?? "")}
																			</div>
																			<div>
																				<span className="font-medium">
																					Division:
																				</span>{" "}
																				{project.division}
																			</div>
																			<div>
																				<span className="font-medium">
																					Section:
																				</span>{" "}
																				{project.secteur}
																			</div>
																		</div>
																	</div>
																	<div>
																		<h4 className="font-medium mb-2">
																			Budget et planning
																		</h4>
																		<div className="space-y-2 text-sm">
																			<div>
																				<span className="font-medium">
																					Budget total:
																				</span>{" "}
																				{project.budget.toLocaleString()}€
																			</div>
																			<div>
																				<span className="font-medium">
																					Budget utilisé:
																				</span>{" "}
																				{project.budget_used?.toLocaleString() ??
																					0}
																				€
																			</div>
																			<div>
																				<span className="font-medium">
																					Avancement:
																				</span>{" "}
																				{calculateProgress(project)}%
																			</div>
																			<div>
																				<span className="font-medium">
																					Date début:
																				</span>{" "}
																				{formatDate(project.date_debut)}
																			</div>
																			<div>
																				<span className="font-medium">
																					Date fin:
																				</span>{" "}
																				{formatDate(project.date_fin)}
																			</div>
																		</div>
																	</div>
																</div>
																<div>
																	<h4 className="font-medium mb-2">
																		Ressources (
																		{getProjectResources(project.id).length})
																	</h4>
																	<div className="flex flex-wrap gap-2">
																		{getProjectResources(project.id).length ===
																		0 ? (
																			<span className="text-muted-foreground">
																				Aucune ressource assignée
																			</span>
																		) : (
																			getProjectResources(project.id).map(
																				(ru) => (
																					<Badge key={ru.id} variant="outline">
																						{ru.ressource.name} (
																						{ru.ressource.type}) - Qté:{" "}
																						{ru.quantity}
																					</Badge>
																				)
																			)
																		)}
																	</div>
																</div>
															</div>
														</DialogContent>
													</Dialog>

													<Dialog
														open={
															!!editingProject &&
															editingProject.id === project.id
														}
														onOpenChange={(open) =>
															!open && setEditingProject(null)
														}
													>
														<DialogTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleEditProject(project)}
															>
																<Edit className="w-4 h-4" />
															</Button>
														</DialogTrigger>
														<DialogContent className="max-w-3xl">
															<DialogHeader>
																<DialogTitle>
																	Modifier le projet - {project.name}
																</DialogTitle>
															</DialogHeader>
															<div className="space-y-4">
																<div className="grid grid-cols-2 gap-4">
																	<div>
																		<Label htmlFor="name">Nom du projet</Label>
																		<Input
																			id="name"
																			value={editForm.name}
																			onChange={(e) =>
																				setEditForm({
																					...editForm,
																					name: e.target.value,
																				})
																			}
																		/>
																	</div>
																	<div>
																		<Label htmlFor="category">Catégorie</Label>
																		<Select
																			value={editForm.category}
																			onValueChange={(value) =>
																				setEditForm({
																					...editForm,
																					category: value,
																				})
																			}
																		>
																			<SelectTrigger>
																				<SelectValue />
																			</SelectTrigger>
																			<SelectContent>
																				<SelectItem value="Infrastructure">
																					Infrastructure
																				</SelectItem>
																				<SelectItem value="Web">Web</SelectItem>
																				<SelectItem value="ERP">ERP</SelectItem>
																				<SelectItem value="Sécurité">
																					Sécurité
																				</SelectItem>
																			</SelectContent>
																		</Select>
																	</div>
																</div>

																<div>
																	<Label htmlFor="description">
																		Description
																	</Label>
																	<Textarea
																		id="description"
																		value={editForm.description}
																		onChange={(e) =>
																			setEditForm({
																				...editForm,
																				description: e.target.value,
																			})
																		}
																	/>
																</div>

																<div className="grid grid-cols-3 gap-4">
																	<div>
																		<Label htmlFor="budget">
																			Budget total (€)
																		</Label>
																		<Input
																			id="budget"
																			type="number"
																			value={editForm.budget}
																			onChange={(e) =>
																				setEditForm({
																					...editForm,
																					budget: Number(e.target.value),
																				})
																			}
																		/>
																	</div>
																	<div>
																		<Label htmlFor="budgetUsed">
																			Budget utilisé (€)
																		</Label>
																		<Input
																			id="budgetUsed"
																			type="number"
																			value={editForm.budgetUsed}
																			onChange={(e) =>
																				setEditForm({
																					...editForm,
																					budgetUsed: Number(e.target.value),
																				})
																			}
																		/>
																	</div>
																</div>

																<div className="grid grid-cols-2 gap-4">
																	<div>
																		<Label htmlFor="startDate">
																			Date début
																		</Label>
																		<Input
																			id="startDate"
																			type="date"
																			value={editForm.startDate}
																			onChange={(e) =>
																				setEditForm({
																					...editForm,
																					startDate: e.target.value,
																				})
																			}
																		/>
																	</div>
																	<div>
																		<Label htmlFor="endDate">Date fin</Label>
																		<Input
																			id="endDate"
																			type="date"
																			value={editForm.endDate}
																			onChange={(e) =>
																				setEditForm({
																					...editForm,
																					endDate: e.target.value,
																				})
																			}
																		/>
																	</div>
																</div>

																<div className="grid grid-cols-2 gap-4">
																	<div>
																		<Label htmlFor="division">Division</Label>
																		<Select
																			value={editForm.division}
																			onValueChange={(value) =>
																				setEditForm({
																					...editForm,
																					division: value,
																					section: "",
																				})
																			}
																		>
																			<SelectTrigger>
																				<SelectValue placeholder="Sélectionner une division..." />
																			</SelectTrigger>
																			<SelectContent>
																				{divisions.map((division) => (
																					<SelectItem
																						key={division.id}
																						value={division.id.toString()}
																					>
																						{division.name}
																					</SelectItem>
																				))}
																			</SelectContent>
																		</Select>
																	</div>
																	<div>
																		<Label htmlFor="section">Section</Label>
																		<Select
																			value={editForm.section}
																			onValueChange={(value) =>
																				setEditForm({
																					...editForm,
																					section: value,
																				})
																			}
																			disabled={!editForm.division}
																		>
																			<SelectTrigger>
																				<SelectValue placeholder="Sélectionner une section..." />
																			</SelectTrigger>
																			<SelectContent>
																				{secteurs
																					.filter(
																						(secteur) =>
																							secteur.division_id ===
																							Number(editForm.division)
																					)
																					.map((secteur) => (
																						<SelectItem
																							key={secteur.id}
																							value={secteur.name}
																						>
																							{secteur.name}
																						</SelectItem>
																					))}
																			</SelectContent>
																		</Select>
																	</div>
																</div>

																<div className="space-y-2">
																	<label className="text-sm font-medium">
																		Ressources
																	</label>
																	<div className="border rounded-md p-3 max-h-32 overflow-y-auto">
																		{availableResources.map((resource) => (
																			<div
																				key={resource.id}
																				className="flex items-center space-x-2 py-1"
																			>
																				<Checkbox
																					id={`edit-resource-${resource.id}`}
																					checked={editForm.ressources.includes(
																						resource.id.toString()
																					)}
																					onCheckedChange={(checked) => {
																						if (checked) {
																							setEditForm({
																								...editForm,
																								ressources: [
																									...editForm.ressources,
																									resource.id.toString(),
																								],
																							});
																						} else {
																							setEditForm({
																								...editForm,
																								ressources:
																									editForm.ressources.filter(
																										(id) =>
																											id !==
																											resource.id.toString()
																									),
																							});
																						}
																					}}
																				/>
																				<label
																					htmlFor={`edit-resource-${resource.id}`}
																					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
																				>
																					{resource.name} ({resource.type})
																				</label>
																			</div>
																		))}
																	</div>
																</div>
															</div>

															<div className="flex justify-end gap-2">
																<Button
																	variant="outline"
																	onClick={() => setEditingProject(null)}
																>
																	Annuler
																</Button>
																<Button onClick={handleSaveProject}>
																	Enregistrer les modifications
																</Button>
															</div>
														</DialogContent>
													</Dialog>

													{project.status !== "termine" && (
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleMarkAsDone(project.id)}
															className="text-success hover:text-success"
														>
															<CheckCircle2 className="w-4 h-4" />
														</Button>
													)}

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
																	Supprimer le projet
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Êtes-vous sûr de vouloir supprimer le projet "
																	{project.name}" ? Cette action est
																	irréversible.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Annuler</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		handleDeleteProject(project.id)
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
									)
								)
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
