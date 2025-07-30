// Client-side only model definitions - no z-ai-web-dev-sdk imports

export interface ClientAIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'meta';
  description: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  costPer1kTokens: {
    input: number;
    output: number;
  };
  capabilities: string[];
}

export interface ClientModelSelection {
  primaryModel: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export const CLIENT_AI_MODELS: ClientAIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Le modèle le plus avancé pour le raisonnement complexe et la génération de code',
    maxTokens: 128000,
    supportsStreaming: true,
    supportsVision: true,
    costPer1kTokens: { input: 0.01, output: 0.03 },
    capabilities: ['code-generation', 'reasoning', 'multimodal', 'function-calling']
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Modèle multimodal optimisé pour la vitesse et l\'efficacité',
    maxTokens: 128000,
    supportsStreaming: true,
    supportsVision: true,
    costPer1kTokens: { input: 0.005, output: 0.015 },
    capabilities: ['code-generation', 'reasoning', 'multimodal', 'function-calling', 'fast-response']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Excellent pour l\'analyse de code et la documentation technique',
    maxTokens: 200000,
    supportsStreaming: true,
    supportsVision: true,
    costPer1kTokens: { input: 0.015, output: 0.075 },
    capabilities: ['code-analysis', 'documentation', 'reasoning', 'long-context']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    description: 'Équilibre parfait entre performance et coût pour le développement',
    maxTokens: 200000,
    supportsStreaming: true,
    supportsVision: true,
    costPer1kTokens: { input: 0.003, output: 0.015 },
    capabilities: ['code-generation', 'documentation', 'balanced-performance']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Modèle polyvalent de Google avec support multimodal',
    maxTokens: 32768,
    supportsStreaming: true,
    supportsVision: true,
    costPer1kTokens: { input: 0.00125, output: 0.005 },
    capabilities: ['multimodal', 'code-generation', 'translation', 'cost-effective']
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'meta',
    description: 'Modèle open-source performant pour le développement général',
    maxTokens: 8192,
    supportsStreaming: true,
    supportsVision: false,
    costPer1kTokens: { input: 0.00088, output: 0.00088 },
    capabilities: ['code-generation', 'general-purpose', 'cost-effective', 'open-source']
  }
];

// Helper functions for client-side model operations
export function getClientModelById(id: string): ClientAIModel | undefined {
  return CLIENT_AI_MODELS.find(model => model.id === id);
}

export function getClientModelsByProvider(provider: ClientAIModel['provider']): ClientAIModel[] {
  return CLIENT_AI_MODELS.filter(model => model.provider === provider);
}

export function getClientModelsByCapability(capability: string): ClientAIModel[] {
  return CLIENT_AI_MODELS.filter(model => model.capabilities.includes(capability));
}

export function validateClientModelSelection(selection: Partial<ClientModelSelection>): string[] {
  const errors: string[] = [];

  if (!selection.primaryModel) {
    errors.push('Primary model is required');
  } else if (!getClientModelById(selection.primaryModel)) {
    errors.push(`Invalid primary model: ${selection.primaryModel}`);
  }

  if (selection.fallbackModel && !getClientModelById(selection.fallbackModel)) {
    errors.push(`Invalid fallback model: ${selection.fallbackModel}`);
  }

  if (selection.temperature !== undefined && (selection.temperature < 0 || selection.temperature > 2)) {
    errors.push('Temperature must be between 0 and 2');
  }

  if (selection.maxTokens !== undefined && selection.maxTokens < 1) {
    errors.push('Max tokens must be greater than 0');
  }

  if (selection.topP !== undefined && (selection.topP < 0 || selection.topP > 1)) {
    errors.push('Top P must be between 0 and 1');
  }

  if (selection.frequencyPenalty !== undefined && (selection.frequencyPenalty < -2 || selection.frequencyPenalty > 2)) {
    errors.push('Frequency penalty must be between -2 and 2');
  }

  if (selection.presencePenalty !== undefined && (selection.presencePenalty < -2 || selection.presencePenalty > 2)) {
    errors.push('Presence penalty must be between -2 and 2');
  }

  return errors;
}