'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PROJECT_TEMPLATES, ProjectTemplate, projectTemplateService } from '@/lib/project-templates';
import { Search, Filter, Clock, Star, Zap, Users, Database, Server, Globe, Smartphone, ShoppingCart, FileText, Palette } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: ProjectTemplate | null;
  onTemplateSelect: (template: ProjectTemplate) => void;
  onCustomize?: (template: ProjectTemplate, customizations: any) => void;
  disabled?: boolean;
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect, onCustomize, disabled = false }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTemplateForDetails, setSelectedTemplateForDetails] = useState<ProjectTemplate | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(PROJECT_TEMPLATES.map(t => t.category)));
    return cats;
  }, []);

  const difficulties = useMemo(() => {
    const diffs = Array.from(new Set(PROJECT_TEMPLATES.map(t => t.difficulty)));
    return diffs;
  }, []);

  const filteredTemplates = useMemo(() => {
    let templates = PROJECT_TEMPLATES;

    if (searchQuery) {
      templates = projectTemplateService.searchTemplates(searchQuery);
    }

    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      templates = templates.filter(t => t.difficulty === selectedDifficulty);
    }

    return templates;
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const getCategoryIcon = (category: ProjectTemplate['category']) => {
    switch (category) {
      case 'web-app': return <Globe className="w-5 h-5" />;
      case 'mobile-app': return <Smartphone className="w-5 h-5" />;
      case 'api': return <Server className="w-5 h-5" />;
      case 'ecommerce': return <ShoppingCart className="w-5 h-5" />;
      case 'saas': return <Users className="w-5 h-5" />;
      case 'dashboard': return <FileText className="w-5 h-5" />;
      case 'blog': return <FileText className="w-5 h-5" />;
      case 'portfolio': return <Palette className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: ProjectTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const TemplateCard = ({ template }: { template: ProjectTemplate }) => (
    <Card 
      className={`h-full transition-all duration-200 hover:shadow-lg cursor-pointer ${
        selectedTemplate?.id === template.id 
          ? 'ring-2 ring-primary border-primary' 
          : 'hover:border-primary/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onTemplateSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{template.icon}</div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {template.estimatedTime}
                </Badge>
              </div>
            </div>
          </div>
          {getCategoryIcon(template.category)}
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Tech Stack Preview */}
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Stack technique:</div>
            <div className="flex flex-wrap gap-1">
              {template.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="px-2 py-1 bg-muted rounded text-xs">
                  {tech}
                </span>
              ))}
              {template.techStack.length > 3 && (
                <span className="px-2 py-1 bg-muted rounded text-xs">
                  +{template.techStack.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Features Preview */}
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Fonctionnalités clés:</div>
            <div className="line-clamp-2">
              {template.features.slice(0, 2).join(' • ')}
              {template.features.length > 2 && ' • ...'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onTemplateSelect(template);
              }}
            >
              {selectedTemplate?.id === template.id ? 'Sélectionné' : 'Sélectionner'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplateForDetails(template);
                  }}
                >
                  Détails
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <TemplateDetails template={template} onCustomize={onCustomize} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Choisissez un Template de Projet</h2>
          <p className="text-muted-foreground">
            Sélectionnez un template pour démarrer rapidement avec une structure préconfigurée
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-36">
                <Star className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous niveaux</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length > 1 ? 's' : ''} trouvé{filteredTemplates.length > 1 ? 's' : ''}
            </p>
            {selectedTemplate && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTemplateSelect(selectedTemplate)}
              >
                Utiliser ce template
              </Button>
            )}
          </div>

          {filteredTemplates.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                Aucun template trouvé pour votre recherche. Essayez de modifier vos filtres.
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

function TemplateDetails({ 
  template, 
  onCustomize 
}: { 
  template: ProjectTemplate; 
  onCustomize?: (template: ProjectTemplate, customizations: any) => void;
}) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="text-4xl">{template.icon}</div>
          <div>
            <DialogTitle className="text-xl">{template.name}</DialogTitle>
            <DialogDescription className="text-base">
              {template.description}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="font-medium">Catégorie</div>
          <Badge variant="outline">{template.category}</Badge>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Difficulté</div>
          <Badge variant="outline" className={
            template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }>
            {template.difficulty}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Temps estimé</div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {template.estimatedTime}
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Tags</div>
          <div className="flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-medium">Fonctionnalités</div>
        <div className="grid grid-cols-1 gap-2">
          {template.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-green-500" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-medium">Stack Technique</div>
        <div className="flex flex-wrap gap-2">
          {template.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-medium">Configuration par Défaut</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Base de données</div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              {template.customizations.database}
            </div>
          </div>
          <div>
            <div className="font-medium">Authentification</div>
            <div>{template.customizations.auth}</div>
          </div>
          <div>
            <div className="font-medium">Déploiement</div>
            <div>{template.customizations.deployment}</div>
          </div>
          <div>
            <div className="font-medium">Paiement</div>
            <div>{template.customizations.payment}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-medium">Livrables Inclus</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(template.deliverables).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
          ))}
        </div>
      </div>

      {onCustomize && (
        <Button 
          className="w-full"
          onClick={() => onCustomize(template, template.customizations)}
        >
          Personnaliser ce Template
        </Button>
      )}
    </div>
  );
}