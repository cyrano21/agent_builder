import ZAI from 'z-ai-web-dev-sdk';
import { LLM_MODELS, type LLMModel, type LLMProvider } from './llm-models';

export class LLMService {
  private zai: any = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.zai = await ZAI.create();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize ZAI:', error);
      throw new Error('Failed to initialize LLM service');
    }
  }

  async generateCompletion(
    prompt: string,
    modelId: string = 'gpt-4-turbo',
    options: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
      streaming?: boolean;
    } = {}
  ): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    const model = LLM_MODELS.find(m => m.id === modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const messages: any[] = [];
    
    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    try {
      const completion = await this.zai.chat.completions.create({
        messages,
        model: modelId,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? model.maxTokens,
        stream: options.streaming ?? false
      });

      if (options.streaming) {
        // Handle streaming response
        let fullContent = '';
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullContent += content;
        }
        return fullContent;
      } else {
        return completion.choices[0]?.message?.content || '';
      }
    } catch (error) {
      console.error('LLM completion error:', error);
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }

  async generateCode(
    description: string,
    language: string,
    modelId: string = 'gpt-4-turbo'
  ): Promise<string> {
    const systemPrompt = `You are an expert ${language} developer. Generate clean, efficient, and well-documented code based on the description provided. Follow best practices and include appropriate error handling.`;
    
    const prompt = `Generate ${language} code for: ${description}\n\nPlease provide:\n1. The complete code implementation\n2. Brief explanation of how it works\n3. Any dependencies or setup required`;

    return this.generateCompletion(prompt, modelId, {
      temperature: 0.3,
      systemPrompt
    });
  }

  async generateDocumentation(
    code: string,
    language: string,
    modelId: string = 'gpt-4-turbo'
  ): Promise<string> {
    const systemPrompt = `You are a technical documentation expert. Generate comprehensive documentation for the provided ${language} code.`;
    
    const prompt = `Generate documentation for this ${language} code:\n\n${code}\n\nPlease provide:\n1. Overview and purpose\n2. Function/method descriptions\n3. Parameter explanations\n4. Return value descriptions\n5. Usage examples\n6. Error handling`;

    return this.generateCompletion(prompt, modelId, {
      temperature: 0.3,
      systemPrompt
    });
  }

  async generateTests(
    code: string,
    language: string,
    framework: string = 'jest',
    modelId: string = 'gpt-4-turbo'
  ): Promise<string> {
    const systemPrompt = `You are a testing expert. Generate comprehensive unit tests for the provided ${language} code using ${framework}.`;
    
    const prompt = `Generate ${framework} tests for this ${language} code:\n\n${code}\n\nPlease provide:\n1. Unit tests for all functions/methods\n2. Edge case testing\n3. Mock setup if needed\n4. Test coverage for happy paths and error cases`;

    return this.generateCompletion(prompt, modelId, {
      temperature: 0.3,
      systemPrompt
    });
  }

  async reviewCode(
    code: string,
    language: string,
    modelId: string = 'gpt-4-turbo'
  ): Promise<string> {
    const systemPrompt = `You are a senior code reviewer. Provide detailed feedback on code quality, best practices, security, and performance.`;
    
    const prompt = `Review this ${language} code and provide feedback:\n\n${code}\n\nPlease analyze:\n1. Code quality and readability\n2. Best practices adherence\n3. Security considerations\n4. Performance optimization opportunities\n5. Bug potential\n6. Suggested improvements`;

    return this.generateCompletion(prompt, modelId, {
      temperature: 0.5,
      systemPrompt
    });
  }

  getAvailableModels(category?: 'text' | 'code' | 'multimodal'): LLMModel[] {
    if (category) {
      return LLM_MODELS.filter(model => model.category === category);
    }
    return LLM_MODELS;
  }

  getModelById(modelId: string): LLMModel | undefined {
    return LLM_MODELS.find(model => model.id === modelId);
  }

  getModelsByProvider(provider: 'openai' | 'anthropic' | 'google' | 'local'): LLMModel[] {
    return LLM_MODELS.filter(model => model.provider === provider);
  }

  async estimateCost(modelId: string, promptTokens: number): Promise<number> {
    const model = this.getModelById(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    // Estimate response tokens (typically 1.5-2x prompt tokens for code generation)
    const estimatedResponseTokens = Math.round(promptTokens * 1.5);
    const totalTokens = promptTokens + estimatedResponseTokens;

    return (totalTokens / 1000) * model.costPer1kTokens;
  }

  async validateModelCapabilities(
    modelId: string,
    requirements: {
      maxTokens?: number;
      streaming?: boolean;
      category?: 'text' | 'code' | 'multimodal';
    }
  ): Promise<boolean> {
    const model = this.getModelById(modelId);
    if (!model) return false;

    if (requirements.maxTokens && model.maxTokens < requirements.maxTokens) {
      return false;
    }

    if (requirements.streaming && !model.supportsStreaming) {
      return false;
    }

    if (requirements.category && model.category !== requirements.category) {
      return false;
    }

    return true;
  }
}

export const llmService = new LLMService();