import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Clock,
	Euro,
	Wrench,
	MessageSquare,
	Calendar,
	Edit,
	Plus,
	CheckCircle2,
	Search,
	User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
	fetchProjects,
	fetchMiseAjour,
	fetchRessources,
	fetchRessourceUtilisee,
} from "@/services/fetchData";
import { getStoredUser } from "@/services/auth";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createMiseAjour, addRessourceUtilisee } from "@/services/sendData";
import { markProjectAsCompleted } from "@/services/updateData";
import { formatBudget } from "@/lib/utils";
import { Ressource } from "@/types/Ressource";
import { RessourceUtilisee } from "@/types/RessourceUtilisee";
import { Checkbox } from "@/components/ui/checkbox";
export default function SimpleUserProjects() {
	const [projects, setProjects] = useState([]);
	const [miseAjourUpdates, setMiseAjourUpdates] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedProject, setSelectedProject] = useState(null);
	const [newUpdate, setNewUpdate] = useState("");
	const [editingProject, setEditingProject] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [editForm, setEditForm] = useState({
		spent: 0,
		progress: 0,
		ressources: [] as string[],
	});
	const [availableResources, setAvailableResources] = useState<Ressource[]>([]);
	const [ressourceUtilisee, setRessourceUtilisee] = useState<
		RessourceUtilisee[]
	>([]);
	const { toast } = useToast();

	useEffect(() => {
		const loadProjects = async () => {
			try {
				setIsLoading(true);
				const user = getStoredUser();
				if (!user) return;

				const [allProjects, allMiseAjour, allResources, allRessourceUtilisee] =
					await Promise.all([
						fetchProjects(),
						fetchMiseAjour(),
						fetchRessources(),
						fetchRessourceUtilisee(),
					]);

				const managerProjects = allProjects
					.filter(
						(project) =>
							project.manager === `${user.first_name} ${user.last_name}`
					)
					.map((project) => ({
						...project,
						// Ensure completed projects show 100% progress
						progress:
							project.status === "termine" ? 100 : project.progress || 0,
					}));

				setProjects(managerProjects);
				setMiseAjourUpdates(allMiseAjour);
				setAvailableResources(allResources);
				setRessourceUtilisee(allRessourceUtilisee);
				console.log("Initial ressourceUtilisee data:", allRessourceUtilisee);
			} catch (error) {
				console.error("Failed to load projects:", error);
				toast({
					title: "Erreur",
					description: "Impossible de charger les projets",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadProjects();
	}, []); // Empty dependency array means this runs once on mount

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "terminé":
			case "termine":
				return "bg-success text-success-foreground";
			case "en cours":
			case "en_cours":
				return "bg-warning text-warning-foreground";
			case "en attente":
				return "bg-secondary text-secondary-foreground";
			case "bloqué":
			case "bloque":
				return "bg-destructive text-destructive-foreground";
			default:
				return "bg-secondary text-secondary-foreground";
		}
	};

	const formatStatus = (status: string) => {
		return status
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const calculateDaysLeft = (deadline: string) => {
		const today = new Date();
		const deadlineDate = new Date(deadline);
		const diffTime = deadlineDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const handleAddUpdate = async () => {
		if (!newUpdate.trim() || !selectedProject) return;
		const user = getStoredUser();
		console.log(user);
		try {
			await createMiseAjour(selectedProject.id, user.id, newUpdate.trim());

			toast({
				title: "Mise à jour ajoutée",
				description: "Votre mise à jour a été enregistrée avec succès",
			});
			setNewUpdate("");
			setSelectedProject(null);
			// Refresh the mise à jour updates
			const updatedMiseAjour = await fetchMiseAjour();
			setMiseAjourUpdates(updatedMiseAjour);
		} catch (error) {
			toast({
				title: "Erreur",
				description: "Impossible d'ajouter la mise à jour",
				variant: "destructive",
			});
		}
	};

	const handleEditProject = (project) => {
		// Get current project resources
		const currentResources = getProjectResources(project.id);
		const currentResourceIds = currentResources.map((cr) =>
			cr.ressource.id.toString()
		);

		setEditingProject(project);
		setEditForm({
			spent: parseFloat(project.budget_used),
			progress: project.progress,
			ressources: currentResourceIds,
		});
	};

	const handleSaveProject = async () => {
		if (!editingProject) return;

		try {
			// Update project basic info
			const updatedProjects = projects.map((p) =>
				p.id === editingProject.id
					? {
							...p,
							budget_used: editForm.spent.toString(),
							progress: editForm.progress,
					  }
					: p
			);

			setProjects(updatedProjects);

			// Handle resource updates
			if (editForm.ressources.length > 0) {
				// Get current project resources
				const currentResources = getProjectResources(editingProject.id);

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

			// Refresh the resources data
			const ressourceUtiliseeData = await fetchRessourceUtilisee();
			console.log("Updated ressourceUtilisee data:", ressourceUtiliseeData);
			setRessourceUtilisee(ressourceUtiliseeData);

			// Also refresh the projects data to ensure everything is in sync
			const [allProjects, allMiseAjour] = await Promise.all([
				fetchProjects(),
				fetchMiseAjour(),
			]);

			const user = getStoredUser();
			const managerProjects = allProjects
				.filter(
					(project) =>
						project.manager === `${user.first_name} ${user.last_name}`
				)
				.map((project) => ({
					...project,
					progress: project.status === "termine" ? 100 : project.progress || 0,
				}));

			setProjects(managerProjects);
			setMiseAjourUpdates(allMiseAjour);

			setEditingProject(null);

			toast({
				title: "Projet mis à jour",
				description: "Les informations du projet ont été enregistrées",
			});
		} catch (error) {
			console.error("Error updating project:", error);
			toast({
				title: "Erreur",
				description: "Impossible de mettre à jour le projet.",
				variant: "destructive",
			});
		}
	};

	const handleMarkAsDone = async (projectId: number) => {
		try {
			console.log(`Marking project ${projectId} as completed...`);
			await markProjectAsCompleted(projectId);
			console.log(`Project ${projectId} marked as completed successfully`);

			const updatedProjects = projects.map((p) =>
				p.id === projectId ? { ...p, status: "termine", progress: 100 } : p
			);

			setProjects(updatedProjects);

			toast({
				title: "Projet marqué comme terminé",
				description: "Le projet a été marqué comme terminé avec succès",
				variant: "default",
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

	// Get mise à jour updates for a specific project
	const getProjectUpdates = (projectId: number) => {
		return miseAjourUpdates.filter((update) => update.project === projectId);
	};

	// Format date for display
	const formatDate = (dateString: string) => {
		if (!dateString) return "—";
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return "—";
			return date.toLocaleDateString("fr-FR", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return "—";
		}
	};

	const filteredProjects = projects.filter(
		(project) =>
			project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<p>Chargement des projets...</p>
			</div>
		);
	}

	// Helper function to get project resources
	const getProjectResources = (projectId: number) => {
		const resources = ressourceUtilisee.filter(
			(ru) => ru.project.id === projectId
		);
		console.log(`Resources for project ${projectId}:`, resources);
		console.log("All ressourceUtilisee:", ressourceUtilisee);
		return resources;
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Mes Projets</h1>
				<p className="text-muted-foreground">
					Projets qui vous sont assignés ({projects.length})
				</p>
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

			{filteredProjects.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">
						Aucun projet trouvé{" "}
						{searchTerm ? "pour votre recherche" : "qui vous soit assigné"}
					</p>
				</div>
			) : (
				<div className="grid gap-6">
					{filteredProjects.map((project) => {
						const daysLeft = calculateDaysLeft(project.end_date);
						const budgetPercentage =
							(parseFloat(project.budget_used) / parseFloat(project.budget)) *
							100;
						const projectUpdates = getProjectUpdates(project.id);

						return (
							<Card key={project.id} className="shadow-card">
								<CardHeader>
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="flex items-center gap-2">
												{project.name}
												<Badge className={getStatusColor(project.status)}>
													{formatStatus(project.status)}
												</Badge>
											</CardTitle>
											<p className="text-muted-foreground mt-1">
												{project.description}
											</p>
										</div>
										<div className="flex gap-2 items-center">
											{project.status !== "termine" && (
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
														<DialogTitle>
															Modifier le projet - {project.name}
														</DialogTitle>
													</DialogHeader>
													<div className="space-y-4">
														<div className="grid grid-cols-2 gap-4">
															<div>
																<Label htmlFor="spent">
																	Budget utilisé (€)
																</Label>
																<Input
																	id="spent"
																	type="number"
																	value={editForm.spent}
																	onChange={(e) =>
																		setEditForm({
																			...editForm,
																			spent: Number(e.target.value),
																		})
																	}
																	max={
																		editingProject
																			? parseFloat(editingProject.budget)
																			: undefined
																	}
																/>
															</div>
															<div>
																<Label htmlFor="ressources">
																	Ressources disponibles
																</Label>
																<div className="border rounded-md p-3 max-h-32 overflow-y-auto">
																	{availableResources.map((resource) => (
																		<div
																			key={resource.id}
																			className="flex items-center space-x-2 py-1"
																		>
																			<Checkbox
																				id={`resource-${resource.id}`}
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
														size="sm"
														onClick={() => setSelectedProject(project)}
													>
														<MessageSquare className="w-4 h-4 mr-2" />
														Ajouter une mise à jour
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-2xl">
													<DialogHeader>
														<DialogTitle>
															Ajouter une mise à jour - {project.name}
														</DialogTitle>
													</DialogHeader>
													<div className="space-y-4">
														<div>
															<label className="text-sm font-medium">
																Nouvelle mise à jour
															</label>
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
													{parseFloat(project.budget_used).toLocaleString()}€ /{" "}
													{parseFloat(project.budget).toLocaleString()}€
												</p>
												<div className="flex items-center gap-1 mt-1">
													<Progress
														value={budgetPercentage}
														className="h-1 flex-1"
													/>
													<span className="text-xs">
														{budgetPercentage.toFixed(0)}%
													</span>
												</div>
											</div>
										</div>

										{/* Timeline */}
										<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
											<Clock className="w-4 h-4 text-primary" />
											<div>
												<p className="text-xs text-muted-foreground">
													Échéance
												</p>
												<p className="font-semibold">
													{new Date(project.end_date).toLocaleDateString(
														"fr-FR"
													)}
												</p>
												<p
													className={`text-xs ${
														daysLeft < 30
															? "text-destructive"
															: "text-muted-foreground"
													}`}
												>
													{daysLeft > 0
														? `${daysLeft} jours restants`
														: `En retard de ${Math.abs(daysLeft)} jours`}
												</p>
											</div>
										</div>

										{/* Category */}
										<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
											<Wrench className="w-4 h-4 text-primary" />
											<div>
												<p className="text-xs text-muted-foreground">
													Catégorie
												</p>
												<p className="font-semibold">
													{project.category || "Non spécifiée"}
												</p>
												<p className="text-xs text-muted-foreground">
													{project.secteur}
												</p>
											</div>
										</div>

										{/* Resources */}
										<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
											<User className="w-4 h-4 text-primary" />
											<div>
												<p className="text-xs text-muted-foreground">
													Ressources
												</p>
												{(() => {
													const projectResources = getProjectResources(
														project.id
													);
													if (projectResources.length === 0) {
														return (
															<p className="text-xs text-muted-foreground">
																Aucune ressource
															</p>
														);
													}
													return (
														<Dialog>
															<DialogTrigger asChild>
																<Button
																	variant="outline"
																	size="sm"
																	className="mt-1"
																>
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
									</div>

									{/* Mise à jour Updates */}
									{projectUpdates.length > 0 && (
										<div className="mt-6">
											<h4 className="text-sm font-medium mb-3 flex items-center gap-2">
												<MessageSquare className="w-4 h-4" />
												Mises à jour ({projectUpdates.length})
											</h4>
											<div className="space-y-3">
												{projectUpdates.map((update, index) => (
													<div
														key={update.id || index}
														className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary/20"
													>
														<div className="flex items-start justify-between mb-2">
															<div className="flex items-center gap-2">
																<User className="w-4 h-4 text-muted-foreground" />
																<span className="text-sm font-medium">
																	{update.manager && update.manager.user
																		? `${
																				update.manager.user.first_name || ""
																		  } ${
																				update.manager.user.last_name || ""
																		  }`.trim() || "Manager"
																		: "Manager"}
																</span>
															</div>
															<span className="text-xs text-muted-foreground">
																{formatDate(update.date)}
															</span>
														</div>
														<p className="text-sm text-muted-foreground">
															{update.content}
														</p>
													</div>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
