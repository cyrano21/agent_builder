import ZAI from 'z-ai-web-dev-sdk';

export interface AIModel {
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

export const AI_MODELS: AIModel[] = [
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

export interface ModelSelection {
  primaryModel: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export class AIModelService {
  private static instance: AIModelService;
  private zai: any = null;

  private constructor() {}

  static getInstance(): AIModelService {
    if (!AIModelService.instance) {
      AIModelService.instance = new AIModelService();
    }
    return AIModelService.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.zai = await ZAI.create();
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      throw error;
    }
  }

  getModelById(id: string): AIModel | undefined {
    return AI_MODELS.find(model => model.id === id);
  }

  getModelsByProvider(provider: AIModel['provider']): AIModel[] {
    return AI_MODELS.filter(model => model.provider === provider);
  }

  getModelsByCapability(capability: string): AIModel[] {
    return AI_MODELS.filter(model => model.capabilities.includes(capability));
  }

  async generateCode(
    prompt: string,
    selection: ModelSelection,
    onProgress?: (progress: string) => void
  ): Promise<string> {
    if (!this.zai) {
      await this.initialize();
    }

    const model = this.getModelById(selection.primaryModel);
    if (!model) {
      throw new Error(`Model ${selection.primaryModel} not found`);
    }

    try {
      const messages = [
        {
          role: 'system',
          content: `You are an expert software developer. Generate high-quality, production-ready code. 
          Follow best practices, include proper error handling, and add comments where necessary.
          The code should be modern, efficient, and maintainable.`
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const completion = await this.zai.chat.completions.create({
        messages,
        model: selection.primaryModel,
        temperature: selection.temperature,
        max_tokens: selection.maxTokens,
        top_p: selection.topP,
        frequency_penalty: selection.frequencyPenalty,
        presence_penalty: selection.presencePenalty,
        stream: model.supportsStreaming
      });

      if (model.supportsStreaming && completion.stream) {
        let fullResponse = '';
        for await (const chunk of completion.stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullResponse += content;
          if (onProgress) {
            onProgress(fullResponse);
          }
        }
        return fullResponse;
      } else {
        return completion.choices[0]?.message?.content || '';
      }
    } catch (error) {
      // Try fallback model if primary fails
      if (selection.fallbackModel && selection.fallbackModel !== selection.primaryModel) {
        console.warn(`Primary model ${selection.primaryModel} failed, trying fallback ${selection.fallbackModel}`);
        return this.generateCodeWithModel(prompt, selection.fallbackModel, selection, onProgress);
      }
      throw error;
    }
  }

  private async generateCodeWithModel(
    prompt: string,
    modelId: string,
    selection: ModelSelection,
    onProgress?: (progress: string) => void
  ): Promise<string> {
    const model = this.getModelById(modelId);
    if (!model) {
      throw new Error(`Fallback model ${modelId} not found`);
    }

    const messages = [
      {
        role: 'system',
        content: 'You are an expert software developer. Generate high-quality, production-ready code.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const completion = await this.zai.chat.completions.create({
      messages,
      model: modelId,
      temperature: selection.temperature,
      max_tokens: selection.maxTokens,
      stream: model.supportsStreaming
    });

    if (model.supportsStreaming && completion.stream) {
      let fullResponse = '';
      for await (const chunk of completion.stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        if (onProgress) {
          onProgress(fullResponse);
        }
      }
      return fullResponse;
    } else {
      return completion.choices[0]?.message?.content || '';
    }
  }

  async estimateCost(prompt: string, modelId: string, maxTokens: number): Promise<number> {
    const model = this.getModelById(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    // Estimate tokens (rough approximation: 1 token ≈ 4 characters for English)
    const estimatedInputTokens = Math.ceil(prompt.length / 4);
    const estimatedOutputTokens = Math.min(maxTokens, estimatedInputTokens * 2);

    const inputCost = (estimatedInputTokens / 1000) * model.costPer1kTokens.input;
    const outputCost = (estimatedOutputTokens / 1000) * model.costPer1kTokens.output;

    return inputCost + outputCost;
  }

  validateModelSelection(selection: Partial<ModelSelection>): string[] {
    const errors: string[] = [];

    if (!selection.primaryModel) {
      errors.push('Primary model is required');
    } else if (!this.getModelById(selection.primaryModel)) {
      errors.push(`Invalid primary model: ${selection.primaryModel}`);
    }

    if (selection.fallbackModel && !this.getModelById(selection.fallbackModel)) {
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
}

export const aiModelService = AIModelService.getInstance();