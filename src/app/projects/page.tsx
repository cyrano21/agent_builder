"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Trash2,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newIdea, setNewIdea] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects?userId=cmdqa2tgd0000spjaur9krmje');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        // Mock data for demo
        setProjects([
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
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newIdea.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newIdea.split(',')[0] || "Nouveau Projet",
          description: newIdea.trim(),
          userId: 'demo-user',
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([newProject, ...projects]);
        setNewIdea("");
      } else {
        alert("Erreur lors de la création du projet");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: 'zip' }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `project-${projectId}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors du téléchargement du projet');
      }
    } catch (error) {
      console.error('Error downloading project:', error);
      alert('Erreur lors du téléchargement du projet');
    }
  };

  const handleEditProject = (projectId: string) => {
    router.push(`/projects/${projectId}/edit`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
      } else {
        alert('Erreur lors de la suppression du projet');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 text-xs sm:text-xs px-2 py-0.5"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-xs px-2 py-0.5"><Loader2 className="w-3 h-3 mr-1 animate-spin" />En cours</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 text-xs sm:text-xs px-2 py-0.5"><AlertCircle className="w-3 h-3 mr-1" />Échoué</Badge>;
      default:
        return <Badge variant="outline" className="text-xs sm:text-xs px-2 py-0.5">Brouillon</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && project.status === activeTab;
  });

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === "completed").length,
    generating: projects.filter(p => p.status === "generating").length,
    draft: projects.filter(p => p.status === "draft").length
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
                <span className="text-xl font-bold hidden sm:inline">Agent Builder Enterprise v2</span>
                <span className="text-base font-bold sm:hidden">ABE v2</span>
              </div>
              <nav className="hidden lg:flex space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-sm px-3 py-2">
                  Accueil
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="text-sm px-3 py-2">
                  Tableau de bord
                </Button>
                <Button variant="ghost" size="sm" className="text-sm px-3 py-2 bg-muted">Projets</Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/settings')} className="text-sm px-3 py-2">
                  Paramètres
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/billing')} className="text-sm px-3 py-2">
                  Facturation
                </Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Projets</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Gérez tous vos projets et leur progression
                </p>
              </div>
              <Button onClick={() => router.push('/?view=dashboard')} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau projet
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
                    </div>
                    <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Terminés</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">En cours</p>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.generating}</p>
                    </div>
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Brouillons</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-600">{stats.draft}</p>
                    </div>
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher des projets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm h-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-sm px-3 py-2 h-10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto h-auto p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2">Tous ({stats.total})</TabsTrigger>
              <TabsTrigger value="draft" className="text-xs sm:text-sm px-2 py-2">Brouillons ({stats.draft})</TabsTrigger>
              <TabsTrigger value="generating" className="text-xs sm:text-sm px-2 py-2">En cours ({stats.generating})</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm px-2 py-2">Terminés ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredProjects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun projet trouvé</h3>
                    <p className="text-muted-foreground mb-4 text-sm text-center">
                      {searchTerm ? "Aucun projet ne correspond à votre recherche." : "Commencez par créer votre premier projet."}
                    </p>
                    <Button onClick={() => router.push('/?view=dashboard')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un projet
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg line-clamp-2 leading-tight">{project.title}</CardTitle>
                            <CardDescription className="line-clamp-2 text-xs sm:text-sm">{project.description}</CardDescription>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(project.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-4 pt-2">
                        {/* Progress */}
                        {project.status === "generating" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span>Progression</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="w-full h-2" />
                          </div>
                        )}

                        {/* Deliverables */}
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm font-medium">Livrables ({Object.values(project.deliverables).filter(Boolean).length}/7)</p>
                          <div className="grid grid-cols-4 gap-1">
                            {Object.entries(project.deliverables).slice(0, 4).map(([key, value]) => (
                              <div
                                key={key}
                                className={`w-1.5rem h-1.5rem rounded-full flex items-center justify-center text-0.625rem ${
                                  value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}
                                title={key}
                              >
                                {value ? '✓' : '○'}
                              </div>
                            ))}
                            {Object.values(project.deliverables).filter(Boolean).length > 4 && (
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                                +{Object.values(project.deliverables).filter(Boolean).length - 4}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs px-2 py-1 h-auto min-h-8"
                            onClick={() => router.push(`/projects/${project.id}`)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span className="hidden sm:inline">Voir</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs px-2 py-1 h-auto min-h-8"
                            onClick={() => handleEditProject(project.id)}
                            title="Éditer le projet"
                          >
                            <Edit className="w-3.5 h-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Éditer</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs px-2 py-1 h-auto min-h-8"
                                title="Plus d'actions"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => handleDownloadProject(project.id)}>
                                <Download className="w-3.5 h-3.5 mr-2" />
                                Exporter
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs sm:text-xs text-muted-foreground pt-2 border-t">
                          <span>Créé: {project.createdAt}</span>
                          <span>Modifié: {project.lastModified}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}