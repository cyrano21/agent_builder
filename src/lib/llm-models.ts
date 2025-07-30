export interface LLMModel {
  id: string;
  name: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  maxTokens: number;
  supportsStreaming: boolean;
  costPer1kTokens: number;
  category: 'text' | 'code' | 'multimodal';
}

export interface LLMProvider {
  name: string;
  models: LLMModel[];
  apiKey?: string;
  baseUrl?: string;
}

export const LLM_MODELS: LLMModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable model, advanced reasoning',
    provider: 'openai',
    maxTokens: 128000,
    supportsStreaming: true,
    costPer1kTokens: 0.01,
    category: 'text'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Previous flagship model',
    provider: 'openai',
    maxTokens: 8192,
    supportsStreaming: true,
    costPer1kTokens: 0.03,
    category: 'text'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and capable for most tasks',
    provider: 'openai',
    maxTokens: 16385,
    supportsStreaming: true,
    costPer1kTokens: 0.0015,
    category: 'text'
  },
  
  // Anthropic Models
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most capable Claude model',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    costPer1kTokens: 0.015,
    category: 'text'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balance of capability and speed',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    costPer1kTokens: 0.003,
    category: 'text'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fastest Claude model',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    costPer1kTokens: 0.00025,
    category: 'text'
  },
  
  // Google Models
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s capable multimodal model',
    provider: 'google',
    maxTokens: 32768,
    supportsStreaming: true,
    costPer1kTokens: 0.00125,
    category: 'multimodal'
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    description: 'Most capable Google model',
    provider: 'google',
    maxTokens: 32768,
    supportsStreaming: true,
    costPer1kTokens: 0.002,
    category: 'multimodal'
  }
];