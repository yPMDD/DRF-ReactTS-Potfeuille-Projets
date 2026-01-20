import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
	Download,
	BarChart3,
	PieChart,
	TrendingUp,
	FileText,
	Calendar,
	Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	fetchRepports,
	generateReport,
	downloadReport,
} from "@/services/fetchData";

interface Report {
	id: string;
	name: string;
	format: string;
	periode: string;
	createdAt: string;
}

export default function Rapports() {
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [exportLoading, setExportLoading] = useState(false);
	const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

	// Export form state
	const [exportForm, setExportForm] = useState({
		periode: "",
		dataTypes: [] as string[],
		format: "",
	});

	useEffect(() => {
		const loadReports = async () => {
			try {
				const data = await fetchRepports();
				setReports(data);
			} catch (error) {
				console.error("Failed to fetch reports:", error);
			} finally {
				setLoading(false);
			}
		};

		loadReports();
	}, []);

	const handleExport = async () => {
		if (
			!exportForm.periode ||
			exportForm.dataTypes.length === 0 ||
			!exportForm.format
		) {
			alert("Veuillez remplir tous les champs requis.");
			return;
		}

		setExportLoading(true);
		try {
			const result = await generateReport({
				periode: exportForm.periode,
				data_types: exportForm.dataTypes,
				format: exportForm.format,
			});

			// Refresh reports list
			const updatedReports = await fetchRepports();
			setReports(updatedReports);

			// Close dialog and reset form
			setIsExportDialogOpen(false);
			setExportForm({ periode: "", dataTypes: [], format: "" });

			alert(`Rapport ${exportForm.format.toUpperCase()} généré avec succès!`);
		} catch (error) {
			console.error("Failed to generate report:", error);
			alert("Erreur lors de la génération du rapport.");
		} finally {
			setExportLoading(false);
		}
	};

	const handleDownload = async (reportId: string, reportName: string) => {
		try {
			const blob = await downloadReport(reportId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;

			// Create a more meaningful filename for download
			const timestamp = new Date().toISOString().split("T")[0];
			const downloadName = `${reportName}_${timestamp}.${
				blob.type.includes("pdf")
					? "pdf"
					: blob.type.includes("csv")
					? "csv"
					: "xlsx"
			}`;
			a.download = downloadName;

			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Failed to download report:", error);
			alert("Erreur lors du téléchargement du rapport.");
		}
	};

	const handleDataTypeChange = (dataType: string, checked: boolean) => {
		if (checked) {
			setExportForm((prev) => ({
				...prev,
				dataTypes: [...prev.dataTypes, dataType],
			}));
		} else {
			setExportForm((prev) => ({
				...prev,
				dataTypes: prev.dataTypes.filter((type) => type !== dataType),
			}));
		}
	};

	const getFormatBadge = (format: string) => {
		switch (format) {
			case "Excel":
				return (
					<Badge variant="outline" className="bg-green-50 text-green-700">
						Excel
					</Badge>
				);
			case "PDF":
				return (
					<Badge variant="outline" className="bg-red-50 text-red-700">
						PDF
					</Badge>
				);
			case "CSV":
				return (
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						CSV
					</Badge>
				);
			default:
				return <Badge variant="outline">{format}</Badge>;
		}
	};

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
					<p className="text-muted-foreground">
						Analytics et exports de données
					</p>
				</div>
				<Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Download className="w-4 h-4" />
							Générer un rapport
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Générer un rapport</DialogTitle>
							<DialogDescription>
								Configurez les options pour générer votre rapport personnalisé
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label>Période du rapport</Label>
								<Select
									value={exportForm.periode}
									onValueChange={(value) =>
										setExportForm((prev) => ({ ...prev, periode: value }))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionner une période" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7days">7 derniers jours</SelectItem>
										<SelectItem value="30days">30 derniers jours</SelectItem>
										<SelectItem value="3months">3 derniers mois</SelectItem>
										<SelectItem value="6months">6 derniers mois</SelectItem>
										<SelectItem value="1year">1 an</SelectItem>
										<SelectItem value="custom">
											Période personnalisée
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Données à inclure</Label>
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="projects"
											className="rounded"
											checked={exportForm.dataTypes.includes("projects")}
											onChange={(e) =>
												handleDataTypeChange("projects", e.target.checked)
											}
										/>
										<label htmlFor="projects" className="text-sm">
											Projets (informations complètes)
										</label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="resources"
											className="rounded"
											checked={exportForm.dataTypes.includes("resources")}
											onChange={(e) =>
												handleDataTypeChange("resources", e.target.checked)
											}
										/>
										<label htmlFor="resources" className="text-sm">
											Ressources (inventaire et utilisation)
										</label>
									</div>
								</div>
							</div>
							<div>
								<Label>Format du rapport</Label>
								<Select
									value={exportForm.format}
									onValueChange={(value) =>
										setExportForm((prev) => ({ ...prev, format: value }))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Choisir le format" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
										<SelectItem value="csv">CSV (.csv)</SelectItem>
										<SelectItem value="pdf">PDF (.pdf)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setIsExportDialogOpen(false)}
								disabled={exportLoading}
							>
								Annuler
							</Button>
							<Button onClick={handleExport} disabled={exportLoading}>
								{exportLoading ? "Génération..." : "Exporter"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="w-5 h-5" />
							Avancement Projets
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Vue d'ensemble de l'avancement de tous les projets
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PieChart className="w-5 h-5" />
							Répartition Budget
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Analyse de la répartition budgétaire par projet
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="w-5 h-5" />
							Performance Équipes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Indicateurs de performance des équipes projet
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Generated Reports Table */}
			<Card>
				<CardHeader>
					<CardTitle>Rapports Générés ({reports.length})</CardTitle>
					<p className="text-sm text-muted-foreground">
						Historique de tous les rapports créés
					</p>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex justify-center items-center py-8">
							<p>Chargement des rapports...</p>
						</div>
					) : reports.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
							<FileText className="w-12 h-12 text-muted-foreground" />
							<h3 className="text-lg font-medium">Aucun rapport disponible</h3>
							<p className="text-sm text-muted-foreground max-w-md">
								Vous n'avez pas encore généré de rapports. Utilisez le bouton
								"Exporter Excel" pour créer votre premier rapport.
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nom du rapport</TableHead>
									<TableHead>Format</TableHead>
									<TableHead>Période</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{reports.map((report) => (
									<TableRow key={report.id}>
										<TableCell>
											<div className="flex items-center gap-2">
												<FileText className="w-4 h-4 text-muted-foreground" />
												<span className="font-medium">{report.name}</span>
											</div>
										</TableCell>
										<TableCell>{getFormatBadge(report.format)}</TableCell>
										<TableCell>
											<Badge variant="secondary">{report.periode}</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1 text-sm">
												<Calendar className="w-3 h-3" />
												{new Date(report.createdAt).toLocaleDateString("fr-FR")}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="icon"
													title="Voir le rapport"
													onClick={() => handleDownload(report.id, report.name)}
												>
													<Eye className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													title="Télécharger"
													onClick={() => handleDownload(report.id, report.name)}
												>
													<Download className="w-4 h-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
