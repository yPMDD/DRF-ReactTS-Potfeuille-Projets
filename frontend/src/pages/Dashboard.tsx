import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import * as fetchData from "@/services/fetchData";
import { formatBudget } from "@/lib/utils";
import {
	TrendingUp,
	TrendingDown,
	Clock,
	AlertTriangle,
	CheckCircle2,
	DollarSign,
	Users,
	FolderKanban,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Division } from "@/types/Division";
import { Manager } from "@/types/Manager";
import { MiseAjour } from "@/types/miseAjour";
import { Projet } from "@/types/Projet";
import { Secteur } from "@/types/Secteur";
import { Ressource } from "@/types/Ressource";
import { RessourceUtilisee } from "@/types/RessourceUtilisee";

export default function Dashboard() {
	const [projects, setProjects] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [managers, setManagers] = useState<any[]>([]);
	const [divisions, setDivisions] = useState<any[]>([]);
	const [secteurs, setSecteurs] = useState<any[]>([]);
	const [miseAjours, setMiseAjours] = useState<any[]>([]);
	const [ressources, setRessources] = useState<Ressource[]>([]);
	const [ressourceUtilisee, setRessourceUtilisee] = useState<
		RessourceUtilisee[]
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadAll() {
			setLoading(true);
			try {
				const [
					projectsData,
					usersData,
					managersData,
					divisionsSecteursData,
					miseAjoursData,
					ressourcesData,
					ressourceUtiliseeData,
				] = await Promise.all([
					fetchData.fetchProjects(),
					fetchData.fetchUsers(),
					fetchData.fetchManagers(),
					fetchData.fetchDivisionsAndSecteurs(),
					fetchData.fetchMiseAjour(),
					fetchData.fetchRessources(),
					fetchData.fetchRessourceUtilisee(),
				]);

				// Map dates and ensure completed projects show 100% progress
				const projectsWithProgress = (projectsData as any[]).map((p: any) => ({
					...p,
					date_debut: p.start_date,
					date_fin: p.end_date,
					// Ensure completed projects show 100% progress
					progress: p.status === "termine" ? 100 : p.progress || 0,
				}));

				setProjects(projectsWithProgress || []);
				setUsers(usersData || []);
				setManagers(managersData || []);
				setDivisions(divisionsSecteursData?.divisions || []);
				setSecteurs(divisionsSecteursData?.secteurs || []);
				setMiseAjours(miseAjoursData || []);
				setRessources(ressourcesData || []);
				setRessourceUtilisee(ressourceUtiliseeData || []);
			} catch (e) {
				// Optionally handle error
			}
			setLoading(false);
		}
		loadAll();
	}, []);

	// Compute stats
	const activeProjects =
		projects.filter((p) => p.status === "en_cours").length || "-";
	const totalBudget = projects.length
		? formatBudget(projects.reduce((sum, p) => sum + Number(p.budget || 0), 0))
		: "-";
	const totalUsers = users.length || "-";
	const lateProjects = projects.filter((p) => p.status === "en_retard").length;

	// Calculate KPIs
	const totalProjects = projects.length;
	const completedProjects = projects.filter(
		(p) => p.status === "termine"
	).length;
	const successRate =
		totalProjects > 0
			? Math.round((completedProjects / totalProjects) * 100)
			: 0;

	// Resource utilization (based on active projects vs total projects)
	const resourceUtilization =
		totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0;

	// Deadline compliance (projects not late)
	const onTimeProjects =
		totalProjects - (typeof lateProjects === "number" ? lateProjects : 0);
	const deadlineCompliance =
		totalProjects > 0 ? Math.round((onTimeProjects / totalProjects) * 100) : 0;

	// Budget control (projects within budget)
	const projectsWithBudget = projects.filter((p) => p.budget && p.budget_used);
	const withinBudgetProjects = projectsWithBudget.filter(
		(p) => Number(p.budget_used) <= Number(p.budget)
	).length;
	const budgetControl =
		projectsWithBudget.length > 0
			? Math.round((withinBudgetProjects / projectsWithBudget.length) * 100)
			: 0;

	// Resource statistics
	const totalResources = ressources.length;
	const totalResourceUtilization = ressourceUtilisee.length;
	const resourceUtilizationRate =
		totalResources > 0
			? Math.round((totalResourceUtilization / totalResources) * 100)
			: 0;

	// Calculate resource types distribution
	const resourceTypes = ressources.reduce((acc, resource) => {
		acc[resource.type] = (acc[resource.type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	// Most used resource type
	const mostUsedType = Object.entries(resourceTypes).sort(
		(a, b) => b[1] - a[1]
	)[0];
	const mostUsedTypeName = mostUsedType ? mostUsedType[0] : "Aucun";
	const mostUsedTypeCount = mostUsedType ? mostUsedType[1] : 0;

	const stats = [
		{
			title: "Projets Actifs",
			value: activeProjects,
			change: "-",
			changeType: "neutral",
			icon: FolderKanban,
			description: "En cours",
		},
		{
			title: "Budget Total",
			value: totalBudget,
			change: "-",
			changeType: "neutral",
			icon: DollarSign,
			description: "Tous projets",
		},
		{
			title: "Ressources",
			value: totalResources,
			change: "-",
			changeType: "neutral",
			icon: Users,
			description: "Disponibles",
		},
		{
			title: "Utilisation",
			value: `${resourceUtilizationRate}%`,
			change: "-",
			changeType: "neutral",
			icon: TrendingUp,
			description: "Ressources",
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

	// Sort projects by date or id (descending) and take the last 3
	const sortedProjects = [...projects]
		.sort((a, b) => {
			if (a.end_date && b.end_date) {
				return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
			}
			return (b.id || 0) - (a.id || 0);
		})
		.slice(0, 3);

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard DSI</h1>
				<p className="text-muted-foreground">
					Vue d'ensemble de vos projets et ressources
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => (
					<Card key={index} className="hover:shadow-md transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<span className="ml-1">{stat.description}</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Projects Overview */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Projects */}
				<Card>
					<CardHeader>
						<CardTitle>Projets Récents</CardTitle>
						<CardDescription>Aperçu des 3 derniers projets</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{sortedProjects.length === 0 && (
							<div className="text-center text-muted-foreground">
								Aucun projet récent
							</div>
						)}
						{sortedProjects.map((project) => (
							<div key={project.id} className="p-4 border rounded-lg space-y-3">
								<div className="flex items-center justify-between">
									<h4 className="font-medium">{project.name}</h4>
									{getStatusBadge(project.status)}
								</div>
								<div className="flex items-center justify-between text-sm text-muted-foreground">
									<span>Manager: {project.manager || "-"}</span>
									<span>
										Échéance:{" "}
										{project.end_date
											? new Date(project.end_date).toLocaleDateString("fr-FR")
											: "-"}
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span>Avancement</span>
										<span>
											{project.progress !== undefined
												? project.progress + "%"
												: "-"}
										</span>
									</div>
									<Progress value={project.progress || 0} className="h-2" />
								</div>
								<div className="flex items-center justify-between">
									<div className="text-sm">
										<span className="text-muted-foreground">Budget: </span>
										<span className="font-medium">
											{project.budget_used !== undefined &&
											project.budget !== undefined
												? `${formatBudget(
														project.budget_used
												  )} / ${formatBudget(project.budget)}`
												: "-"}
										</span>
									</div>
									{getRiskBadge(project.risk || "")}
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Resource Statistics */}
				<div className="space-y-6">
					{/* Resource Overview */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="w-5 h-5 text-primary" />
								Statistiques des Ressources
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
									<div className="flex items-center gap-2">
										<Users className="w-4 h-4 text-primary" />
										<div>
											<p className="font-medium text-sm">Total Ressources</p>
											<p className="text-2xl font-bold">{totalResources}</p>
										</div>
									</div>
								</div>
								<div className="p-3 bg-success/10 border border-success/20 rounded-lg">
									<div className="flex items-center gap-2">
										<TrendingUp className="w-4 h-4 text-success" />
										<div>
											<p className="font-medium text-sm">Utilisées</p>
											<p className="text-2xl font-bold">
												{totalResourceUtilization}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="space-y-3">
								<div className="p-3 bg-muted/50 rounded-lg">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">
											Taux d'utilisation
										</span>
										<span className="text-sm font-bold">
											{resourceUtilizationRate}%
										</span>
									</div>
									<Progress
										value={resourceUtilizationRate}
										className="h-2 mt-2"
									/>
								</div>
								<div className="p-3 bg-muted/50 rounded-lg">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">
											Type le plus utilisé
										</span>
										<span className="text-sm font-bold">
											{mostUsedTypeName}
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										{mostUsedTypeCount} ressource(s) de ce type
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					{/* Quick Stats */}
					<Card>
						<CardHeader>
							<CardTitle>Indicateurs Clés</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Taux de réussite</span>
									<span className="font-medium">{successRate}%</span>
								</div>
								<Progress value={successRate} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Utilisation ressources</span>
									<span className="font-medium">{resourceUtilization}%</span>
								</div>
								<Progress value={resourceUtilization} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Respect des délais</span>
									<span className="font-medium">{deadlineCompliance}%</span>
								</div>
								<Progress value={deadlineCompliance} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Maîtrise budgétaire</span>
									<span className="font-medium">{budgetControl}%</span>
								</div>
								<Progress value={budgetControl} className="h-2" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
