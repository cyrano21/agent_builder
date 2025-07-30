"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Sparkles, 
  Plus, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Code,
  Database,
  Cloud,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import BackButton from "@/components/BackButton";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "draft" | "generating" | "completed" | "failed";
  progress: number;
  createdAt: string;
  lastModified: string;
  deliverables: {
    plan: boolean;
    architecture: boolean;
    wireframes: boolean;
    design: boolean;
    backend: boolean;
    devops: boolean;
    documentation: boolean;
  };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [newIdea, setNewIdea] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "SaaS de Facturation Auto",
      description: "Solution complète de facturation automatisée",
      status: "completed",
      progress: 100,
      createdAt: "2024-01-15",
      lastModified: "2024-01-15",
      deliverables: {
        plan: true,
        architecture: true,
        wireframes: true,
        design: true,
        backend: true,
        devops: true,
        documentation: true
      }
    },
    {
      id: "2",
      title: "Marketplace NFT",
      description: "Plateforme de trading NFT avec intégration blockchain",
      status: "generating",
      progress: 75,
      createdAt: "2024-01-14",
      lastModified: "2024-01-15",
      deliverables: {
        plan: true,
        architecture: true,
        wireframes: true,
        design: true,
        backend: false,
        devops: false,
        documentation: false
      }
    },
    {
      id: "3",
      title: "App de Gestion de Projet",
      description: "Application collaborative de gestion de tâches",
      status: "draft",
      progress: 0,
      createdAt: "2024-01-13",
      lastModified: "2024-01-13",
      deliverables: {
        plan: false,
        architecture: false,
        wireframes: false,
        design: false,
        backend: false,
        devops: false,
        documentation: false
      }
    }
  ]);

  const handleCreateProject = async () => {
    if (!newIdea.trim()) return;
    
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProject: Project = {
        id: Date.now().toString(),
        title: newIdea.split(',')[0] || "Nouveau Projet",
        description: newIdea,
        status: "draft",
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        deliverables: {
          plan: false,
          architecture: false,
          wireframes: false,
          design: false,
          backend: false,
          devops: false,
          documentation: false
        }
      };
      
      setProjects([newProject, ...projects]);
      setNewIdea("");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800"><Loader2 className="w-3 h-3 mr-1 animate-spin" />En cours</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Échoué</Badge>;
      default:
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === "completed").length,
    inProgressProjects: projects.filter(p => p.status === "generating").length,
    avgGenerationTime: "8.5 minutes"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Agent Builder Enterprise v2</span>
              </div>
              <nav className="hidden md:flex space-x-4">
                <Button variant="ghost" size="sm">Tableau de bord</Button>
                <Button variant="ghost" size="sm">Projets</Button>
                <Button variant="ghost" size="sm">Paramètres</Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <BackButton showHome={true} className="mb-6" />
        
        {/* Quick Create */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Créer un nouveau projet
            </CardTitle>
            <CardDescription>
              Décrivez votre idée et laissez notre AI générer un plan complet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Textarea
                placeholder="Ex: SaaS de facturation auto, application de gestion de projet, marketplace NFT..."
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                className="flex-1 min-h-[80px]"
              />
              <Button 
                onClick={handleCreateProject} 
                disabled={!newIdea.trim() || isCreating}
                className="self-start"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Créer le projet
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Loader2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgressProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgGenerationTime}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Projets récents</CardTitle>
                  <CardDescription>Vos 3 projets les plus récents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{project.title}</h4>
                          {getStatusBadge(project.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Créé: {project.createdAt}</span>
                          <span>Modifié: {project.lastModified}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Dernières actions sur vos projets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Marketplace NFT - Génération du backend en cours</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">SaaS de Facturation Auto - Projet terminé avec succès</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-950/20">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">App de Gestion de Projet - Projet créé</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{project.title}</CardTitle>
                          {getStatusBadge(project.status)}
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Éditer
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Exporter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.status === "generating" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progression de la génération</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="w-full" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {Object.entries(project.deliverables).map(([key, value]) => (
                        <div key={key} className="text-center p-3 border rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {key === 'plan' && <FileText className="w-4 h-4" />}
                            {key === 'architecture' && <Code className="w-4 h-4" />}
                            {key === 'wireframes' && <Eye className="w-4 h-4" />}
                            {key === 'design' && <Brain className="w-4 h-4" />}
                            {key === 'backend' && <Database className="w-4 h-4" />}
                            {key === 'devops' && <Cloud className="w-4 h-4" />}
                            {key === 'documentation' && <FileText className="w-4 h-4" />}
                          </div>
                          <div className="text-xs font-medium capitalize">{key}</div>
                          <div className={`text-xs ${value ? 'text-green-600' : 'text-gray-400'}`}>
                            {value ? 'Terminé' : 'En attente'}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <span>Créé: {project.createdAt}</span>
                        <span>Modifié: {project.lastModified}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de génération</CardTitle>
                  <CardDescription>Performance du générateur d'agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de réussite</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Temps moyen de génération</span>
                      <span className="font-medium">8.5 minutes</span>
                    </div>
                    <Progress value={85} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Satisfaction utilisateur</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <Progress value={96} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des ressources</CardTitle>
                  <CardDescription>Consommation AI et stockage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tokens utilisés ce mois</span>
                      <span className="font-medium">45,230 / 100,000</span>
                    </div>
                    <Progress value={45} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stockage utilisé</span>
                      <span className="font-medium">2.3 GB / 10 GB</span>
                    </div>
                    <Progress value={23} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Projets générés</span>
                      <span className="font-medium">12 / 50</span>
                    </div>
                    <Progress value={24} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}