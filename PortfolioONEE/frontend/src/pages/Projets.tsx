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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchManagers } from "@/services/fetchData";
import { Manager } from "@/types/Manager";
import { fetchDivisionsAndSecteurs } from "@/services/fetchData";
import { Division } from "@/types/Division";
import { Secteur } from "@/types/Secteur";

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
		progress: 0,
		startDate: "",
		endDate: "",
		manager: "",
		status: "",
		category: "",
		division: "",
		section: "",
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
	useEffect(() => {
		async function loadManagers() {
			const managersData: Manager[] = await fetchManagers();
			setManagers(managersData);
		}
		loadManagers();
	}, []);
	useEffect(() => {
		async function loadData() {
			const data = await fetchDivisionsAndSecteurs();
			setDivisions(data.divisions);
			setSecteurs(data.secteurs);
		}
		loadData();
	}, []);

	const projects = [
		{
			id: 1,
			name: "Migration CRM",
			description: "Migration vers nouveau système CRM",
			status: "en_cours",
			progress: 75,
			budget: 450000,
			budgetUsed: 337500,
			manager: "Sophie Martin",
			resourcesUsed: 4,
			startDate: "2024-06-01",
			endDate: "2024-08-15",
			category: "Infrastructure",
			division: "IT",
			section: "Infrastructure",
		},
		{
			id: 2,
			name: "Refonte Site Web",
			description: "Nouvelle version du site institutionnel",
			status: "en_cours",
			progress: 40,
			budget: 120000,
			budgetUsed: 48000,
			manager: "Pierre Durand",
			resourcesUsed: 3,
			startDate: "2024-07-01",
			endDate: "2024-09-30",
			category: "Web",
			division: "Marketing",
			section: "Digital",
		},
		{
			id: 3,
			name: "ERP Comptabilité",
			description: "Implémentation ERP pour la comptabilité",
			status: "planifie",
			progress: 10,
			budget: 800000,
			budgetUsed: 80000,
			manager: "Marie Leclerc",
			resourcesUsed: 5,
			startDate: "2024-09-01",
			endDate: "2024-12-01",
			category: "ERP",
			division: "Finance",
			section: "Comptabilité",
		},
		{
			id: 4,
			name: "Infrastructure Cloud",
			description: "Migration vers infrastructure cloud",
			status: "termine",
			progress: 100,
			budget: 300000,
			budgetUsed: 285000,
			manager: "Jean Dubois",
			resourcesUsed: 3,
			startDate: "2024-04-01",
			endDate: "2024-07-01",
			category: "Infrastructure",
			division: "IT",
			section: "Cloud",
		},
		{
			id: 5,
			name: "Sécurité Réseau",
			description: "Renforcement de la sécurité réseau",
			status: "en_retard",
			progress: 60,
			budget: 200000,
			budgetUsed: 140000,
			manager: "Alex Martin",
			resourcesUsed: 3,
			startDate: "2024-05-01",
			endDate: "2024-07-30",
			category: "Sécurité",
			division: "IT",
			section: "Sécurité",
		},
	];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "en_cours":
				return <Badge className="bg-info text-info-foreground">En cours</Badge>;
			case "planifie":
				return <Badge variant="outline">Planifié</Badge>;
			case "termine":
				return (
					<Badge className="bg-success text-success-foreground">Terminé</Badge>
				);
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

	const handleEditProject = (project: (typeof projects)[0]) => {
		setEditingProject(project);
		setEditForm({
			name: project.name,
			description: project.description,
			budget: project.budget,
			budgetUsed: project.budgetUsed,
			progress: project.progress,
			startDate: project.startDate,
			endDate: project.endDate,
			manager: project.manager,
			status: project.status,
			category: project.category,
			division: project.division,
			section: project.section,
		});
	};

	const handleSaveProject = () => {
		toast({
			title: "Projet mis à jour",
			description: "Les modifications ont été enregistrées avec succès",
		});
		setEditingProject(null);
	};

	const handleDeleteProject = (projectId: number) => {
		toast({
			title: "Projet supprimé",
			description: "Le projet a été supprimé définitivement",
		});
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

	const NewProjectModal = () => (
		<Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
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
							<Input placeholder="Ex: Migration ERP" />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Catégorie</label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Sélectionner..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="infrastructure">Infrastructure</SelectItem>
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
						<Input placeholder="Description détaillée du projet" />
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Budget (€)</label>
							<Input type="number" placeholder="450000" />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Date début</label>
							<Input type="date" />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Date fin</label>
							<Input type="date" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Manager</label>
							<Select
								value={selectedManager}
								onValueChange={setSelectedManager}
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
								value={selectedDivision}
								onValueChange={setSelectedDivision}
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
							value={selectedSecteur}
							onValueChange={setSelectedSecteur}
							disabled={!selectedDivision}
						>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionner une section..." />
							</SelectTrigger>
							<SelectContent>
								{secteurs
									.filter(
										(secteur) =>
											secteur.division_id === Number(selectedDivision)
									)
									.map((secteur) => (
										<SelectItem key={secteur.id} value={secteur.name}>
											{secteur.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>
						Annuler
					</Button>
					<Button onClick={() => setIsNewProjectOpen(false)}>
						Créer le projet
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);

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
					<NewProjectModal />
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
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProjects.map((project) => (
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
												{project.section}
											</div>
										</div>
									</TableCell>

									<TableCell>{getStatusBadge(project.status)}</TableCell>

									<TableCell>
										<div className="space-y-1">
											<div className="flex justify-between text-sm">
												<span>Avancement</span>
												<span>{project.progress}%</span>
											</div>
											<Progress value={project.progress} className="h-2 w-24" />
										</div>
									</TableCell>

									<TableCell>
										<div className="text-sm">
											<div className="font-medium">
												{project.budgetUsed / 1000}k€ / {project.budget / 1000}
												k€
											</div>
											<div className="text-muted-foreground">
												{Math.round(
													(project.budgetUsed / project.budget) * 100
												)}
												% utilisé
											</div>
										</div>
									</TableCell>

									<TableCell>
										<div className="text-sm">
											<div className="font-medium flex items-center gap-1">
												<Users className="w-3 h-3" />
												{project.resourcesUsed} ressources
											</div>
										</div>
									</TableCell>

									<TableCell>
										<div className="text-sm">
											<div className="flex items-center gap-1">
												<Calendar className="w-3 h-3" />
												{new Date(project.endDate).toLocaleDateString("fr-FR")}
											</div>
										</div>
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
																		<span className="font-medium">Statut:</span>{" "}
																		{getStatusBadge(project.status)}
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
																		{project.section}
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
																		{project.budgetUsed.toLocaleString()}€
																	</div>
																	<div>
																		<span className="font-medium">
																			Avancement:
																		</span>{" "}
																		{project.progress}%
																	</div>
																	<div>
																		<span className="font-medium">
																			Date début:
																		</span>{" "}
																		{new Date(
																			project.startDate
																		).toLocaleDateString("fr-FR")}
																	</div>
																	<div>
																		<span className="font-medium">
																			Date fin:
																		</span>{" "}
																		{new Date(
																			project.endDate
																		).toLocaleDateString("fr-FR")}
																	</div>
																</div>
															</div>
														</div>
														<div>
															<h4 className="font-medium mb-2">
																Ressources ({project.resourcesUsed} ressources
																utilisées)
															</h4>
															<div className="flex flex-wrap gap-2">
																<Badge variant="outline">
																	{project.resourcesUsed} ressources actives
																</Badge>
															</div>
														</div>
													</div>
												</DialogContent>
											</Dialog>

											<Dialog
												open={
													!!editingProject && editingProject.id === project.id
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
															<Label htmlFor="description">Description</Label>
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
																<Label htmlFor="budget">Budget total (€)</Label>
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
															<div>
																<Label htmlFor="progress">Avancement (%)</Label>
																<Input
																	id="progress"
																	type="number"
																	min="0"
																	max="100"
																	value={editForm.progress}
																	onChange={(e) =>
																		setEditForm({
																			...editForm,
																			progress: Number(e.target.value),
																		})
																	}
																/>
															</div>
														</div>

														<div className="grid grid-cols-2 gap-4">
															<div>
																<Label htmlFor="startDate">Date début</Label>
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

														<div className="grid grid-cols-3 gap-4">
															<div>
																<Label htmlFor="status">Statut</Label>
																<Select
																	value={editForm.status}
																	onValueChange={(value) =>
																		setEditForm({ ...editForm, status: value })
																	}
																>
																	<SelectTrigger>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="planifie">
																			Planifié
																		</SelectItem>
																		<SelectItem value="en_cours">
																			En cours
																		</SelectItem>
																		<SelectItem value="termine">
																			Terminé
																		</SelectItem>
																		<SelectItem value="en_retard">
																			En retard
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>
															<div>
																<Label htmlFor="division">Division</Label>
																<Select
																	value={editForm.division}
																	onValueChange={(value) =>
																		setEditForm({
																			...editForm,
																			division: value,
																		})
																	}
																>
																	<SelectTrigger>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="IT">IT</SelectItem>
																		<SelectItem value="Marketing">
																			Marketing
																		</SelectItem>
																		<SelectItem value="Finance">
																			Finance
																		</SelectItem>
																		<SelectItem value="RH">RH</SelectItem>
																	</SelectContent>
																</Select>
															</div>
														</div>

														<div>
															<Label htmlFor="section">Section</Label>
															<Select
																value={editForm.section}
																onValueChange={(value) =>
																	setEditForm({ ...editForm, section: value })
																}
															>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Infrastructure">
																		Infrastructure
																	</SelectItem>
																	<SelectItem value="Développement">
																		Développement
																	</SelectItem>
																	<SelectItem value="Sécurité">
																		Sécurité
																	</SelectItem>
																	<SelectItem value="Support">
																		Support
																	</SelectItem>
																	<SelectItem value="Digital">
																		Digital
																	</SelectItem>
																	<SelectItem value="Comptabilité">
																		Comptabilité
																	</SelectItem>
																	<SelectItem value="Cloud">Cloud</SelectItem>
																</SelectContent>
															</Select>
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
															{project.name}" ? Cette action est irréversible.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Annuler</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleDeleteProject(project.id)}
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
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
