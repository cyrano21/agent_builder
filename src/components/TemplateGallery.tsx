'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TEMPLATE_CATEGORIES, type ProjectTemplate } from '@/lib/template-service';
import { 
  FolderOpen, 
  Code, 
  Smartphone, 
  Zap, 
  Settings, 
  Link, 
  Bot, 
  Users,
  Search,
  Star,
  Eye,
  Plus
} from 'lucide-react';

interface TemplateGalleryProps {
  onTemplateSelect: (template: ProjectTemplate) => void;
  onCreateProject?: (templateId: string, description: string, modelId: string, generatedContent?: any) => void;
}

export function TemplateGallery({ onTemplateSelect, onCreateProject }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterAndSortTemplates();
  }, [templates, selectedCategory, searchQuery, sortBy]);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const allTemplates = await response.json();
        setTemplates(allTemplates);
      } else {
        console.error('Failed to load templates:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const filterAndSortTemplates = () => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort templates
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = TEMPLATE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || '📁';
  };

  const getCategoryName = (categoryId: string) => {
    const category = TEMPLATE_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const handleCreateProject = async () => {
    if (!selectedTemplate || !projectDescription.trim()) return;

    try {
      if (onCreateProject) {
        // Generate project content using the API
        const response = await fetch(`/api/templates/${selectedTemplate.id}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectDescription,
            modelId: selectedModel,
          }),
        });

        if (response.ok) {
          const generatedContent = await response.json();
          // Pass the generated content to the parent component
          onCreateProject(selectedTemplate.id, projectDescription, selectedModel, generatedContent);
        } else {
          console.error('Failed to generate project:', response.statusText);
        }
      }
      setIsCreateDialogOpen(false);
      setProjectDescription('');
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Templates</h3>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Project from Template</DialogTitle>
                <DialogDescription>
                  Generate a new project using the "{selectedTemplate?.name}" template
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-description">Project Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe what you want to build..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="model-select">AI Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={!projectDescription.trim()}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TEMPLATE_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                </div>
                {selectedTemplate?.id === template.id && (
                  <Eye className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{getCategoryName(template.category)}</Badge>
                {template.isPublic && (
                  <Badge variant="secondary">Public</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-sm line-clamp-2">
                {template.description}
              </CardDescription>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>{template.usageCount} uses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bot className="h-3 w-3" />
                  <span>{template.recommendedModels.length} models</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.recommendedModels.slice(0, 3).map(modelId => (
                  <Badge key={modelId} variant="outline" className="text-xs">
                    {modelId.split('-')[0]}
                  </Badge>
                ))}
                {template.recommendedModels.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.recommendedModels.length - 3}
                  </Badge>
                )}
              </div>

              <div className="pt-2 border-t">
                <Button
                  variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                  }}
                >
                  {selectedTemplate?.id === template.id ? 'Selected' : 'Select Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No templates found matching your search criteria.
        </div>
      )}

      {/* Selected Template Details */}
      {selectedTemplate && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>{selectedTemplate.name}</span>
            </CardTitle>
            <CardDescription>{selectedTemplate.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Project Structure</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedTemplate.structure, null, 2)}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Dependencies</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedTemplate.dependencies, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available Deliverables</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedTemplate.prompts.plan && (
                  <Badge variant="outline">Project Plan</Badge>
                )}
                {selectedTemplate.prompts.architecture && (
                  <Badge variant="outline">Architecture</Badge>
                )}
                {selectedTemplate.prompts.wireframes && (
                  <Badge variant="outline">Wireframes</Badge>
                )}
                {selectedTemplate.prompts.design && (
                  <Badge variant="outline">Design</Badge>
                )}
                {selectedTemplate.prompts.backend && (
                  <Badge variant="outline">Backend</Badge>
                )}
                {selectedTemplate.prompts.devops && (
                  <Badge variant="outline">DevOps</Badge>
                )}
                {selectedTemplate.prompts.documentation && (
                  <Badge variant="outline">Documentation</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}