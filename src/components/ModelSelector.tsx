'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CLIENT_AI_MODELS, type ClientAIModel } from '@/lib/client-models';
import { Brain, Cpu, Zap, DollarSign, CheckCircle } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange: (modelId: string) => void;
  category?: 'text' | 'code' | 'multimodal';
  showAdvanced?: boolean;
}

export function ModelSelector({ 
  selectedModel, 
  onModelChange, 
  category, 
  showAdvanced = false 
}: ModelSelectorProps) {
  const [models, setModels] = useState<ClientAIModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('capability');

  useEffect(() => {
    let filteredModels = CLIENT_AI_MODELS;

    if (selectedCategory !== 'all') {
      filteredModels = filteredModels.filter(model => model.capabilities.includes(selectedCategory));
    }

    if (selectedProvider !== 'all') {
      filteredModels = filteredModels.filter(model => model.provider === selectedProvider);
    }

    // Sort models
    filteredModels = [...filteredModels].sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return a.costPer1kTokens - b.costPer1kTokens;
        case 'tokens':
          return b.maxTokens - a.maxTokens;
        case 'capability':
        default:
          // Sort by capability (heuristic based on model name and provider)
          const capabilityOrder = { 'openai': 3, 'anthropic': 2, 'google': 1 };
          const aCapability = capabilityOrder[a.provider] || 0;
          const bCapability = capabilityOrder[b.provider] || 0;
          return bCapability - aCapability;
      }
    });

    setModels(filteredModels);
  }, [selectedCategory, selectedProvider, sortBy]);

  const providers = Array.from(new Set(CLIENT_AI_MODELS.map(model => model.provider)));
  const categories = Array.from(new Set(CLIENT_AI_MODELS.flatMap(model => model.capabilities)));

  const getModelColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-blue-100 text-blue-800';
      case 'google': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return <Brain className="h-4 w-4" />;
      case 'anthropic': return <Cpu className="h-4 w-4" />;
      case 'google': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Select AI Model</h3>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category-filter">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provider-filter">Provider</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map(provider => (
                  <SelectItem key={provider} value={provider}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sort-by">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capability">Capability</SelectItem>
                <SelectItem value="cost">Cost (Low to High)</SelectItem>
                <SelectItem value="tokens">Max Tokens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Model Grid */}
      <RadioGroup value={selectedModel} onValueChange={onModelChange} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <Card key={model.id} className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <RadioGroupItem
                    value={model.id}
                    id={model.id}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    {getProviderIcon(model.provider)}
                    <CardTitle className="text-sm">{model.name}</CardTitle>
                  </div>
                  {selectedModel === model.id && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getModelColor(model.provider)}>
                    {model.provider}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-xs">
                  {model.description}
                </CardDescription>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Cpu className="h-3 w-3" />
                    <span>{model.maxTokens.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>${model.costPer1kTokens.input}/1k tokens</span>
                  </div>
                  {model.supportsStreaming && (
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>Streaming supported</span>
                    </div>
                  )}
                  {model.supportsVision && (
                    <div className="flex items-center space-x-1">
                      <Brain className="h-3 w-3" />
                      <span>Vision supported</span>
                    </div>
                  )}
                </div>

                {showAdvanced && (
                  <div className="pt-2 border-t">
                    <Button
                      variant={selectedModel === model.id ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => onModelChange(model.id)}
                    >
                      {selectedModel === model.id ? 'Selected' : 'Select Model'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {models.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No models found matching your filters.
        </div>
      )}
    </div>
  );
}