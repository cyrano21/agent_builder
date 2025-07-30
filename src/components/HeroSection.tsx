"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, CheckCircle, Download, Settings } from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";
import { TemplateSelector } from "@/components/TemplateSelector";
import { ClientModelSelection } from "@/lib/client-models";
import { ProjectTemplate } from "@/lib/project-templates";

interface HeroSectionProps {
  idea: string;
  setIdea: (idea: string) => void;
  isGenerating: boolean;
  generatedPlan: any;
  onGeneratePlan: () => void;
  onStartProject: () => void;
  modelSelection: ClientModelSelection;
  onModelSelectionChange: (selection: ClientModelSelection) => void;
  selectedTemplate: ProjectTemplate | null;
  onTemplateSelect: (template: ProjectTemplate) => void;
}

export default function HeroSection({ 
  idea, 
  setIdea, 
  isGenerating, 
  generatedPlan, 
  onGeneratePlan, 
  onStartProject,
  modelSelection,
  onModelSelectionChange,
  selectedTemplate,
  onTemplateSelect
}: HeroSectionProps) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          {/* Enhanced title with better typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className="mb-6">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
                🚀 Nouvelle Génération d'IA
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Transformez Vos Idées
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                en Réalité
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              L'IA générative avancée qui crée des applications web complètes avec architecture, design, backend et déploiement en quelques minutes seulement.
            </motion.p>

            {/* Enhanced trust indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>1000+ projets générés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Technologie de pointe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Support 24/7</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="max-w-6xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Tabs defaultValue="idea" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="idea" className="text-base py-3">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Votre Idée
                </TabsTrigger>
                <TabsTrigger value="templates" className="text-base py-3">
                  <Settings className="w-4 h-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="models" className="text-base py-3">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuration IA
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="idea" className="space-y-4">
                {/* Enhanced textarea for long prompts */}
                <div className="relative">
                  <Textarea
                    placeholder="Décrivez votre idée de projet en détail... Soyez aussi précis que possible sur les fonctionnalités, le design, la technologie souhaitée, et vos objectifs."
                    value={idea}
                    onChange={(e) => {
                      const text = e.target.value;
                      if (text.length <= 2000) {
                        setIdea(text);
                      }
                    }}
                    className="min-h-[120px] max-h-[300px] resize-y text-base leading-relaxed p-4 border-2 border-primary/20 focus:border-primary/40 transition-all duration-200 shadow-lg hover:shadow-xl focus:shadow-2xl bg-white/95 backdrop-blur-sm rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        onGeneratePlan();
                      }
                    }}
                  />
                  {/* Enhanced character counter and status */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <div className={`text-xs px-2 py-1 rounded font-medium ${
                      idea.length > 1800 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : idea.length > 1500 
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-white/80 text-muted-foreground border border-gray-200'
                    }`}>
                      {idea.length}/2000 caractères
                    </div>
                    {idea.length > 0 && (
                      <div className={`w-2 h-2 rounded-full ${
                        idea.length < 10 
                          ? 'bg-red-500 animate-pulse'
                          : idea.length < 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}></div>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Button 
                    onClick={onGeneratePlan}
                    disabled={isGenerating || !idea.trim() || idea.length < 10}
                    className="h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Générer le Plan Complet
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center sm:text-left">
                    <p>Appuyez sur <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Enter</kbd> pour générer</p>
                    <p className="mt-1">Minimum 10 caractères requis</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="templates">
                <TemplateSelector 
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={onTemplateSelect}
                  disabled={isGenerating}
                />
                {selectedTemplate && (
                  <Card className="mt-6 border-2 border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{selectedTemplate.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{selectedTemplate.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                        </div>
                        <Button 
                          onClick={() => {
                            setIdea(selectedTemplate.starterPrompt);
                            // Switch to idea tab
                            const tabsList = document.querySelector('[value="idea"]');
                            if (tabsList) {
                              (tabsList as HTMLElement).click();
                            }
                          }}
                        >
                          Utiliser ce template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="models">
                <ModelSelector 
                  selection={modelSelection}
                  onSelectionChange={onModelSelectionChange}
                  disabled={isGenerating}
                />
              </TabsContent>
            </Tabs>
          </motion.div>

          <GeneratedPlanDisplay 
            generatedPlan={generatedPlan} 
            onStartProject={onStartProject} 
          />
        </div>
      </div>
    </section>
  );
}

interface GeneratedPlanDisplayProps {
  generatedPlan: any;
  onStartProject: () => void;
}

function GeneratedPlanDisplay({ generatedPlan, onStartProject }: GeneratedPlanDisplayProps) {
  if (!generatedPlan) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
        className="max-w-5xl mx-auto"
      >
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
          {/* Enhanced header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-6 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </motion.div>
              <span>Plan Généré</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 ml-auto">
                IA Optimisée
              </Badge>
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg mt-2">
              {generatedPlan.description}
            </CardDescription>
          </div>
          
          <CardContent className="space-y-8 p-8">
            {/* Enhanced features section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                Fonctionnalités Principales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedPlan.features.map((feature: string, index: number) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced tech stack section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">T</span>
                </div>
                Stack Technique Recommandée
              </h4>
              <div className="flex flex-wrap gap-3">
                {generatedPlan.techStack.map((tech: string, index: number) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced metrics section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-3xl mb-2">⏱️</div>
                <p className="text-sm text-blue-600 font-medium mb-1">Timeline Estimée</p>
                <p className="text-xl font-bold text-blue-800">{generatedPlan.timeline}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-3xl mb-2">💰</div>
                <p className="text-sm text-green-600 font-medium mb-1">Coût Estimé</p>
                <p className="text-xl font-bold text-green-800">{generatedPlan.estimatedCost}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-sm text-purple-600 font-medium mb-1">Prêt à Démarrer</p>
                <p className="text-xl font-bold text-purple-800">Immédiat</p>
              </motion.div>
            </div>

            {/* Enhanced action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
            >
              <Button 
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
                onClick={onStartProject}
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Commencer le Projet
              </Button>
              <Button variant="outline" className="h-14 px-8 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-200">
                <Download className="w-6 h-6 mr-3" />
                Télécharger le Plan Détaillé
              </Button>
            </motion.div>

            {/* Additional info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200"
            >
              <p>✨ Ce plan a été généré par notre IA et peut être personnalisé selon vos besoins spécifiques</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}