"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Sparkles, 
  ArrowLeft, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Code,
  Database,
  Cloud,
  Settings,
  Play,
  Pause
} from "lucide-react";

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

interface DeliverableFile {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  createdAt: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [deliverables, setDeliverables] = useState<DeliverableFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        // Mock data for demo
        setProject({
          id: projectId,
          title: "SaaS de Facturation Auto",
          description: "Solution complète de facturation automatisée pour les petites entreprises",
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
        });
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDeliverable = async (deliverableType: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/deliverables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliverableType,
          idea: project?.description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        
        // Add to deliverables list
        const newDeliverable: DeliverableFile = {
          id: Date.now().toString(),
          name: `${deliverableType}_${project?.title || 'project'}.pdf`,
          type: deliverableType,
          size: "2.3 MB",
          url: `/api/projects/${projectId}/deliverables/${deliverableType}`,
          createdAt: new Date().toISOString()
        };
        setDeliverables([...deliverables, newDeliverable]);
        
        alert(`Livrable ${deliverableType} généré avec succès !`);
      }
    } catch (error) {
      console.error("Error generating deliverable:", error);
      alert("Erreur lors de la génération du livrable");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportProject = async () => {
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
        a.download = `${project?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project_package.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting project:", error);
      alert("Erreur lors de l'export du projet");
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/?view=dashboard');
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Erreur lors de la suppression du projet");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Projet non trouvé</h1>
          <Button onClick={() => router.push('/?view=dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/?view=dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">{project.title}</span>
                {getStatusBadge(project.status)}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportProject}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/?view=settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteProject}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Project Overview */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Créé: {project.createdAt}</span>
              <span>Modifié: {project.lastModified}</span>
            </div>
          </div>

          {/* Progress */}
          {project.status === "generating" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Génération en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progression</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="deliverables">Livrables</TabsTrigger>
              <TabsTrigger value="generate">Générer</TabsTrigger>
              <TabsTrigger value="files">Fichiers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deliverables Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>État des livrables</CardTitle>
                    <CardDescription>Progression de chaque livrable du projet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(project.deliverables).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {value ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium capitalize">{key}</div>
                            <div className="text-sm text-muted-foreground">
                              {value ? 'Terminé' : 'Non commencé'}
                            </div>
                          </div>
                        </div>
                        {value && (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Project Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du projet</CardTitle>
                    <CardDescription>Détails et configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Statut</div>
                        <div>{getStatusBadge(project.status)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Progression</div>
                        <div className="text-lg font-semibold">{project.progress}%</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Créé le</div>
                        <div>{project.createdAt}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Modifié le</div>
                        <div>{project.lastModified}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="deliverables" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(project.deliverables).map(([key, value]) => (
                  <Card key={key} className={value ? 'border-green-200' : 'border-gray-200'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 capitalize">
                        {value ? <CheckCircle className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-gray-400" />}
                        {key}
                      </CardTitle>
                      <CardDescription>
                        {value ? 'Livrable terminé et disponible' : 'Livrable non commencé'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {value ? (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir le livrable
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleGenerateDeliverable(key)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          Générer
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="generate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Générer des livrables</CardTitle>
                  <CardDescription>
                    Sélectionnez les livrables que vous souhaitez générer pour ce projet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(project.deliverables)
                      .filter(([_, value]) => !value)
                      .map(([key, _]) => (
                        <Button
                          key={key}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start"
                          onClick={() => handleGenerateDeliverable(key)}
                          disabled={isGenerating}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium capitalize">{key}</span>
                          </div>
                          <p className="text-sm text-muted-foreground text-left">
                            Générer le livrable {key} pour ce projet
                          </p>
                        </Button>
                      ))}
                  </div>
                  
                  {Object.entries(project.deliverables).every(([_, value]) => value) && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Tous les livrables ont été générés pour ce projet !
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fichiers du projet</CardTitle>
                  <CardDescription>
                    Tous les fichiers générés pour ce projet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deliverables.length > 0 ? (
                    <div className="space-y-2">
                      {deliverables.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {file.type} • {file.size} • {new Date(file.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun fichier disponible pour ce projet</p>
                      <Button className="mt-4" onClick={() => setActiveTab("generate")}>
                        Générer des livrables
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}