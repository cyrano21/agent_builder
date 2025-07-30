"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Sparkles,
  Zap,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Import our new components
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsCards from "@/components/StatsCards";
import ProjectList, { RecentProjects } from "@/components/ProjectList";
import FeaturesGrid, { CTASection } from "@/components/FeaturesGrid";
import SettingsPanel from "@/components/SettingsPanel";
import Footer from "@/components/Footer";
import FloatingNavigation from "@/components/FloatingNavigation";
import { ClientModelSelection } from "@/lib/client-models";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { ProjectTemplate } from "@/lib/project-templates";

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

export default function Home() {
  // Navigation history hook
  const { currentView, navigateTo, goBack, canGoBack, history } =
    useNavigationHistory();

  // Get view from URL parameters
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [modelSelection, setModelSelection] = useState<ClientModelSelection>({
    primaryModel: "gpt-4-turbo",
    fallbackModel: "claude-3-sonnet",
    temperature: 0.7,
    maxTokens: 4000,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState("overview");
  const [newIdea, setNewIdea] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Load projects from database
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/projects?userId=cmdqa2tgd0000spjaur9krmje");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          setError("Erreur lors du chargement des projets");
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleGeneratePlan = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    try {
      // Call the actual API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: "temp",
          idea: idea.trim(),
          modelSelection: modelSelection,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();

      setGeneratedPlan(data);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Erreur lors de la génération du plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newIdea.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newIdea.split(",")[0] || "Nouveau Projet",
          description: newIdea.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject = await response.json();

      setProjects([newProject, ...projects]);
      setNewIdea("");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Erreur lors de la création du projet");
    } finally {
      setIsCreating(false);
    }
  };

  const handleExportProject = async (
    projectId: string,
    projectName: string
  ) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format: "zip" }),
      });

      if (!response.ok) {
        throw new Error("Failed to export project");
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${projectName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_project_package.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting project:", error);
      alert("Erreur lors de l'export du projet");
    }
  };

  const handleGenerateDeliverable = async (
    projectId: string,
    deliverableType: string,
    projectDescription: string
  ) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/deliverables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliverableType,
          idea: projectDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate deliverable");
      }

      const data = await response.json();

      // Refresh projects to get updated data
      const projectsResponse = await fetch("/api/projects?userId=cmdqa2tgd0000spjaur9krmje");
      if (projectsResponse.ok) {
        const updatedProjects = await projectsResponse.json();
        setProjects(updatedProjects);
      }

      alert(`Livrable ${deliverableType} généré avec succès !`);
    } catch (error) {
      console.error("Error generating deliverable:", error);
      alert("Erreur lors de la génération du livrable");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Refresh projects to get updated data
      const projectsResponse = await fetch("/api/projects?userId=cmdqa2tgd0000spjaur9krmje");
      if (projectsResponse.ok) {
        const updatedProjects = await projectsResponse.json();
        setProjects(updatedProjects);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Erreur lors de la suppression du projet");
    }
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
              </motion.div>
              Terminé
            </Badge>
          </motion.div>
        );
      case "generating":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-3 h-3 mr-1" />
              </motion.div>
              En cours
            </Badge>
          </motion.div>
        );
      case "failed":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <motion.div
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <AlertCircle className="w-3 h-3 mr-1" />
              </motion.div>
              Échoué
            </Badge>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Badge
              variant="outline"
              className="border-2 hover:border-primary hover:text-primary transition-all duration-200"
            >
              Brouillon
            </Badge>
          </motion.div>
        );
    }
  };

  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    inProgressProjects: projects.filter((p) => p.status === "generating")
      .length,
    avgGenerationTime: projects.length > 0 ? "8.5 minutes" : "N/A",
  };

  // Navigation handler - utilise le hook maintenant
  const navigateToHandler = (
    view: "landing" | "dashboard" | "settings",
    path?: string
  ) => {
    navigateTo(view, path);
  };

  // Render settings view
  const renderSettingsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <Header currentView={currentView} onNavigate={navigateToHandler} />
      <SettingsPanel onNavigate={navigateToHandler} />
      <FloatingNavigation showHistory={true} />
      <Footer showFullFooter={false} />
    </div>
  );

  // Render dashboard view
  const renderDashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <Header currentView={currentView} onNavigate={navigateToHandler} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <StatsCards stats={stats} />

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md h-10">
              <TabsTrigger value="overview" className="text-sm px-4 py-2">Aperçu</TabsTrigger>
              <TabsTrigger value="projects" className="text-sm px-4 py-2">Projets</TabsTrigger>
              <TabsTrigger value="activity" className="text-sm px-4 py-2">Activité</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Actions Rapides</CardTitle>
                  <CardDescription className="text-sm">
                    Créez un nouveau projet ou générez un plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  <div className="space-y-3">
                    {/* Enhanced textarea for project creation */}
                    <div className="relative">
                      <Textarea
                        placeholder="Décrivez votre idée de projet en détail... Soyez précis sur les fonctionnalités et objectifs."
                        value={newIdea}
                        onChange={(e) => {
                          const text = e.target.value;
                          if (text.length <= 1000) {
                            setNewIdea(text);
                          }
                        }}
                        className="min-h-[100px] max-h-[200px] resize-y text-base leading-relaxed p-4 border-2 border-primary/20 focus:border-primary/40 transition-all duration-200 shadow-md hover:shadow-lg focus:shadow-xl bg-white/95 backdrop-blur-sm rounded-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            handleCreateProject();
                          }
                        }}
                      />
                      {/* Enhanced character counter and status */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <div
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            newIdea.length > 900
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : newIdea.length > 700
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : "bg-white/80 text-muted-foreground border border-gray-200"
                          }`}
                        >
                          {newIdea.length}/1000 caractères
                        </div>
                        {newIdea.length > 0 && (
                          <div
                            className={`w-2 h-2 rounded-full ${
                              newIdea.length < 10
                                ? "bg-red-500 animate-pulse"
                                : newIdea.length < 30
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                        )}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCreateProject}
                        disabled={
                          isCreating || !newIdea.trim() || newIdea.length < 10
                        }
                        className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Création en cours...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mr-2" />
                            Créer le Projet
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Helper text */}
                    <div className="text-xs text-muted-foreground text-center">
                      <p>
                        Appuyez sur{" "}
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">
                          Ctrl+Enter
                        </kbd>{" "}
                        pour créer rapidement
                      </p>
                      <p className="mt-1">Minimum 10 caractères requis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Projets Récents</CardTitle>
                  <CardDescription className="text-sm">
                    Vos derniers projets et leur statut
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <RecentProjects
                    projects={projects}
                    getStatusBadge={getStatusBadge}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectList
                projects={projects}
                onExportProject={handleExportProject}
                onDeleteProject={handleDeleteProject}
                onGenerateDeliverable={handleGenerateDeliverable}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <ActivitySection />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <FloatingNavigation showHistory={true} />
      <Footer showFullFooter={false} />
    </div>
  );

  // Render landing view
  const renderLandingView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <Header currentView={currentView} onNavigate={navigateToHandler} />

      <HeroSection
        idea={idea}
        setIdea={setIdea}
        isGenerating={isGenerating}
        generatedPlan={generatedPlan}
        onGeneratePlan={handleGeneratePlan}
        onStartProject={() => navigateTo("dashboard")}
        modelSelection={modelSelection}
        onModelSelectionChange={setModelSelection}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
      />

      <FeaturesGrid />

      <CTASection
        onStartFree={() => navigateTo("dashboard")}
        onViewDemo={() => console.log("View demo")}
      />

      <FloatingNavigation showHistory={false} />
      <Footer />
    </div>
  );

  // Activity Section Component
  const ActivitySection = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Activité Récente</CardTitle>
        <CardDescription className="text-sm">Les dernières actions sur vos projets</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {[
            {
              action: "Projet créé",
              project: "Marketplace NFT",
              time: "Il y a 2 heures",
            },
            {
              action: "Plan généré",
              project: "SaaS de Facturation Auto",
              time: "Il y a 5 heures",
            },
            {
              action: "Design complété",
              project: "App de Gestion de Projet",
              time: "Hier",
            },
            {
              action: "Backend déployé",
              project: "SaaS de Facturation Auto",
              time: "Il y a 2 jours",
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base">{activity.action}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {activity.project}
                </p>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                {activity.time}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Main render logic
  return (
    <>
      {currentView === "settings" && renderSettingsView()}
      {currentView === "dashboard" && renderDashboardView()}
      {currentView === "landing" && renderLandingView()}
    </>
  );
}
