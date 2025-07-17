import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, BarChart3, PieChart, TrendingUp, FileText, Calendar, Eye } from "lucide-react";

export default function Rapports() {
  const reports = [
    {
      id: 1,
      name: "Rapport Mensuel Projets",
      format: "Excel",
      createdAt: "2024-01-15",
      createdBy: "Sophie Martin",
      size: "2.4 MB",
      periode: "Janvier 2024"
    },
    {
      id: 2,
      name: "Analyse Budget Q4",
      format: "PDF",
      createdAt: "2024-01-10",
      createdBy: "Marie Leclerc",
      size: "1.8 MB",
      periode: "Q4 2023"
    },
    {
      id: 3,
      name: "Performance Équipes",
      format: "Excel",
      createdAt: "2024-01-08",
      createdBy: "Jean Dubois",
      size: "3.2 MB",
      periode: "Décembre 2023"
    },
    {
      id: 4,
      name: "Ressources Disponibles",
      format: "CSV",
      createdAt: "2024-01-05",
      createdBy: "Pierre Durand",
      size: "856 KB",
      periode: "Janvier 2024"
    },
    {
      id: 5,
      name: "Analyse Risques",
      format: "PDF",
      createdAt: "2024-01-03",
      createdBy: "Alex Martin",
      size: "1.2 MB",
      periode: "6 derniers mois"
    }
  ];

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'Excel':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Excel</Badge>;
      case 'PDF':
        return <Badge variant="outline" className="bg-red-50 text-red-700">PDF</Badge>;
      case 'CSV':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">CSV</Badge>;
      default:
        return <Badge variant="outline">{format}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">Analytics et exports de données</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Exporter Excel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Options d'export</DialogTitle>
              <DialogDescription>
                Configurez les filtres pour votre export Excel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Période</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 derniers jours</SelectItem>
                    <SelectItem value="30days">30 derniers jours</SelectItem>
                    <SelectItem value="3months">3 derniers mois</SelectItem>
                    <SelectItem value="6months">6 derniers mois</SelectItem>
                    <SelectItem value="1year">1 an</SelectItem>
                    <SelectItem value="custom">Période personnalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type de données</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="projects" className="rounded" />
                    <label htmlFor="projects" className="text-sm">Projets</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="resources" className="rounded" />
                    <label htmlFor="resources" className="text-sm">Ressources</label>
                  </div>
                </div>
              </div>
              <div>
                <Label>Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Format d'export" />
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
              <Button variant="outline">Annuler</Button>
              <Button>Exporter</Button>
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
            <p className="text-sm text-muted-foreground">Vue d'ensemble de l'avancement de tous les projets</p>
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
            <p className="text-sm text-muted-foreground">Analyse de la répartition budgétaire par projet</p>
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
            <p className="text-sm text-muted-foreground">Indicateurs de performance des équipes projet</p>
          </CardContent>
        </Card>
      </div>

      {/* Generated Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports Générés ({reports.length})</CardTitle>
          <p className="text-sm text-muted-foreground">Historique de tous les rapports créés</p>
        </CardHeader>
        <CardContent>
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
                      {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" title="Voir le rapport">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
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