import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign,
  Users,
  FolderKanban
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Projets Actifs",
      value: "24",
      change: "+2",
      changeType: "positive",
      icon: FolderKanban,
      description: "Ce mois"
    },
    {
      title: "Budget Total",
      value: "2.4M€",
      change: "-5%",
      changeType: "negative", 
      icon: DollarSign,
      description: "vs mois dernier"
    },
    {
      title: "Ressources",
      value: "127",
      change: "+8",
      changeType: "positive",
      icon: Users,
      description: "Collaborateurs actifs"
    },
    {
      title: "En Retard",
      value: "3",
      change: "-2",
      changeType: "positive",
      icon: AlertTriangle,
      description: "Projets"
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Migration CRM",
      status: "en_cours",
      progress: 75,
      budget: 450000,
      budgetUsed: 337500,
      manager: "Sophie Martin",
      deadline: "2024-08-15",
      risk: "medium"
    },
    {
      id: 2,
      name: "Refonte Site Web",
      status: "en_cours",
      progress: 40,
      budget: 120000,
      budgetUsed: 48000,
      manager: "Pierre Durand",
      deadline: "2024-09-30",
      risk: "low"
    },
    {
      id: 3,
      name: "ERP Comptabilité",
      status: "planifie",
      progress: 10,
      budget: 800000,
      budgetUsed: 80000,
      manager: "Marie Leclerc",
      deadline: "2024-12-01",
      risk: "high"
    },
    {
      id: 4,
      name: "Infrastructure Cloud",
      status: "termine",
      progress: 100,
      budget: 300000,
      budgetUsed: 285000,
      manager: "Jean Dubois",
      deadline: "2024-07-01",
      risk: "low"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_cours':
        return <Badge className="bg-info text-info-foreground">En cours</Badge>;
      case 'planifie':
        return <Badge variant="outline">Planifié</Badge>;
      case 'termine':
        return <Badge className="bg-success text-success-foreground">Terminé</Badge>;
      case 'en_retard':
        return <Badge className="bg-destructive text-destructive-foreground">En retard</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-success/20 text-success-foreground border-success/30">Faible</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning-foreground border-warning/30">Moyen</Badge>;
      case 'high':
        return <Badge className="bg-destructive/20 text-destructive-foreground border-destructive/30">Élevé</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard DSI</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos projets et ressources</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>
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
            <CardDescription>Aperçu de l'avancement des projets en cours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{project.name}</h4>
                  {getStatusBadge(project.status)}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Manager: {project.manager}</span>
                  <span>Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Avancement</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-medium">
                      {(project.budgetUsed / 1000)}k€ / {(project.budget / 1000)}k€
                    </span>
                  </div>
                  {getRiskBadge(project.risk)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Alertes Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Budget dépassé</p>
                    <p className="text-xs text-muted-foreground">
                      Migration CRM - Dépassement de 15% du budget initial
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Échéance proche</p>
                    <p className="text-xs text-muted-foreground">
                      Refonte Site Web - Livraison dans 5 jours
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Projet livré</p>
                    <p className="text-xs text-muted-foreground">
                      Infrastructure Cloud - Livré en avance et sous budget
                    </p>
                  </div>
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
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilisation ressources</span>
                  <span className="font-medium">73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Respect des délais</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Maîtrise budgétaire</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}