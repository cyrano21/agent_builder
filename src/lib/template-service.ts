import { db } from './db';
import { llmService } from './llm-service';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: any;
  dependencies: any;
  config: any;
  prompts: {
    plan?: string;
    architecture?: string;
    wireframes?: string;
    design?: string;
    backend?: string;
    devops?: string;
    documentation?: string;
  };
  recommendedModels: string[];
  usageCount: number;
  isPublic: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Full-stack web applications',
    icon: '🌐',
    templates: ['react-nextjs', 'vue-nuxt', 'angular']
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    description: 'Native and cross-platform mobile apps',
    icon: '📱',
    templates: ['react-native', 'flutter', 'ionic']
  },
  {
    id: 'api',
    name: 'API Service',
    description: 'RESTful and GraphQL APIs',
    icon: '🔌',
    templates: ['rest-api', 'graphql-api', 'microservice']
  },
  {
    id: 'ml-ai',
    name: 'ML/AI Project',
    description: 'Machine learning and AI projects',
    icon: '🤖',
    templates: ['ml-pipeline', 'ai-chatbot', 'data-science']
  },
  {
    id: 'devops',
    name: 'DevOps Tooling',
    description: 'DevOps and infrastructure projects',
    icon: '⚙️',
    templates: ['ci-cd', 'monitoring', 'infrastructure']
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Blockchain and Web3 projects',
    icon: '🔗',
    templates: ['smart-contract', 'dapp', 'defi']
  }
];

export const DEFAULT_TEMPLATES: Omit<ProjectTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[] = [
  {
    name: 'React + Next.js Web App',
    description: 'Modern full-stack web application with React and Next.js',
    category: 'web-app',
    structure: {
      root: {
        'src/': {
          'app/': 'Next.js app router',
          'components/': 'React components',
          'lib/': 'Utility functions',
          'styles/': 'CSS and styling',
          'types/': 'TypeScript definitions'
        },
        'public/': 'Static assets',
        'tests/': 'Test files'
      }
    },
    dependencies: {
      'next': '^14.0.0',
      'react': '^18.0.0',
      'react-dom': '^18.0.0',
      'typescript': '^5.0.0',
      'tailwindcss': '^3.0.0',
      '@prisma/client': '^5.0.0'
    },
    config: {
      'next.config.js': 'Next.js configuration',
      'tailwind.config.js': 'Tailwind CSS configuration',
      'tsconfig.json': 'TypeScript configuration'
    },
    prompts: {
      plan: 'Generate a comprehensive project plan for a React + Next.js web application including architecture, features, timeline, and technical requirements.',
      architecture: 'Design the system architecture for a Next.js application including component structure, state management, API integration, and database design.',
      wireframes: 'Create detailed wireframes for the main pages and user flows of the React application.',
      design: 'Design the UI/UX for the React application including component library, styling approach, and responsive design.',
      backend: 'Implement the backend API using Next.js API routes, including authentication, database operations, and business logic.',
      devops: 'Set up CI/CD pipeline, deployment configuration, and monitoring for the Next.js application.',
      documentation: 'Generate comprehensive documentation including API docs, setup instructions, and code documentation.'
    },
    recommendedModels: ['gpt-4-turbo', 'claude-3-opus'],
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'REST API Service',
    description: 'Scalable REST API with Node.js and Express',
    category: 'api',
    structure: {
      root: {
        'src/': {
          'controllers/': 'Request handlers',
          'models/': 'Data models',
          'routes/': 'API routes',
          'middleware/': 'Custom middleware',
          'services/': 'Business logic',
          'utils/': 'Utility functions',
          'tests/': 'Test files'
        },
        'docs/': 'API documentation'
      }
    },
    dependencies: {
      'express': '^4.18.0',
      'cors': '^2.8.5',
      'helmet': '^7.0.0',
      'joi': '^17.9.0',
      'bcryptjs': '^2.4.3',
      'jsonwebtoken': '^9.0.0',
      'prisma': '^5.0.0'
    },
    config: {
      '.env.example': 'Environment variables template',
      'app.js': 'Express application entry point'
    },
    prompts: {
      plan: 'Create a comprehensive plan for a REST API service including endpoints, data models, authentication, and scalability considerations.',
      architecture: 'Design the API architecture including route structure, middleware, database design, and error handling patterns.',
      backend: 'Implement the REST API endpoints with proper validation, authentication, error handling, and database integration.',
      devops: 'Set up deployment, monitoring, logging, and CI/CD pipeline for the API service.',
      documentation: 'Generate API documentation including endpoint specifications, request/response examples, and integration guides.'
    },
    recommendedModels: ['gpt-4-turbo', 'claude-3-sonnet'],
    isPublic: true,
    createdBy: 'system'
  },
  {
    name: 'React Native Mobile App',
    description: 'Cross-platform mobile application with React Native',
    category: 'mobile-app',
    structure: {
      root: {
        'src/': {
          'components/': 'React Native components',
          'screens/': 'App screens',
          'navigation/': 'Navigation setup',
          'services/': 'API services',
          'utils/': 'Utility functions',
          'assets/': 'App assets',
          'tests/': 'Test files'
        }
      }
    },
    dependencies: {
      'react-native': '^0.72.0',
      '@react-navigation/native': '^6.0.0',
      '@react-navigation/stack': '^6.0.0',
      'axios': '^1.4.0',
      'react-native-async-storage': '^1.18.0',
      'react-native-gesture-handler': '^2.12.0'
    },
    config: {
      'app.json': 'React Native app configuration',
      'babel.config.js': 'Babel configuration',
      'metro.config.js': 'Metro bundler configuration'
    },
    prompts: {
      plan: 'Generate a comprehensive plan for a React Native mobile app including features, platform considerations, and development timeline.',
      architecture: 'Design the mobile app architecture including component structure, navigation, state management, and API integration.',
      wireframes: 'Create detailed mobile app wireframes for all screens and user flows.',
      design: 'Design the mobile UI/UX including component library, theming, and platform-specific adaptations.',
      backend: 'Implement the mobile backend API and real-time features for the React Native application.',
      devops: 'Set up mobile app deployment, testing, and CI/CD pipeline for both iOS and Android.',
      documentation: 'Generate mobile app documentation including setup guides, API integration, and deployment instructions.'
    },
    recommendedModels: ['gpt-4-turbo', 'claude-3-opus'],
    isPublic: true,
    createdBy: 'system'
  }
];

export class TemplateService {
  async initializeDefaultTemplates(): Promise<void> {
    try {
      for (const templateData of DEFAULT_TEMPLATES) {
        const existing = await db.projectTemplate.findFirst({
          where: { name: templateData.name }
        });

        if (!existing) {
          await db.projectTemplate.create({
            data: {
              ...templateData,
              structure: templateData.structure,
              dependencies: templateData.dependencies,
              config: templateData.config,
              planPrompt: templateData.prompts.plan,
              archPrompt: templateData.prompts.architecture,
              wireframesPrompt: templateData.prompts.wireframes,
              designPrompt: templateData.prompts.design,
              backendPrompt: templateData.prompts.backend,
              devopsPrompt: templateData.prompts.devops,
              docsPrompt: templateData.prompts.documentation,
              recommendedModels: JSON.stringify(templateData.recommendedModels)
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to initialize default templates:', error);
    }
  }

  async getAllTemplates(): Promise<ProjectTemplate[]> {
    const templates = await db.projectTemplate.findMany({
      orderBy: { usageCount: 'desc' as const }
    });

    return templates.map(template => ({
      ...template,
      structure: JSON.parse(template.structure as string),
      dependencies: JSON.parse(template.dependencies as string),
      config: JSON.parse(template.config as string),
      prompts: {
        plan: template.planPrompt,
        architecture: template.archPrompt,
        wireframes: template.wireframesPrompt,
        design: template.designPrompt,
        backend: template.backendPrompt,
        devops: template.devopsPrompt,
        documentation: template.docsPrompt
      },
      recommendedModels: JSON.parse(template.recommendedModels as string)
    }));
  }

  async getTemplateById(id: string): Promise<ProjectTemplate | null> {
    const template = await db.projectTemplate.findUnique({
      where: { id }
    });

    if (!template) return null;

    return {
      ...template,
      structure: JSON.parse(template.structure as string),
      dependencies: JSON.parse(template.dependencies as string),
      config: JSON.parse(template.config as string),
      prompts: {
        plan: template.planPrompt,
        architecture: template.archPrompt,
        wireframes: template.wireframesPrompt,
        design: template.designPrompt,
        backend: template.backendPrompt,
        devops: template.devopsPrompt,
        documentation: template.docsPrompt
      },
      recommendedModels: JSON.parse(template.recommendedModels as string)
    };
  }

  async getTemplatesByCategory(category: string): Promise<ProjectTemplate[]> {
    const templates = await db.projectTemplate.findMany({
      where: { category },
      orderBy: { usageCount: 'desc' as const }
    });

    return templates.map(template => ({
      ...template,
      structure: JSON.parse(template.structure as string),
      dependencies: JSON.parse(template.dependencies as string),
      config: JSON.parse(template.config as string),
      prompts: {
        plan: template.planPrompt,
        architecture: template.archPrompt,
        wireframes: template.wireframesPrompt,
        design: template.designPrompt,
        backend: template.backendPrompt,
        devops: template.devopsPrompt,
        documentation: template.docsPrompt
      },
      recommendedModels: JSON.parse(template.recommendedModels as string)
    }));
  }

  async createTemplate(templateData: Omit<ProjectTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>, userId?: string): Promise<ProjectTemplate> {
    const template = await db.projectTemplate.create({
      data: {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        structure: templateData.structure,
        dependencies: templateData.dependencies,
        config: templateData.config,
        planPrompt: templateData.prompts.plan,
        archPrompt: templateData.prompts.architecture,
        wireframesPrompt: templateData.prompts.wireframes,
        designPrompt: templateData.prompts.design,
        backendPrompt: templateData.prompts.backend,
        devopsPrompt: templateData.prompts.devops,
        docsPrompt: templateData.prompts.documentation,
        recommendedModels: JSON.stringify(templateData.recommendedModels),
        isPublic: templateData.isPublic,
        createdBy: userId
      }
    });

    return {
      ...template,
      structure: JSON.parse(template.structure as string),
      dependencies: JSON.parse(template.dependencies as string),
      config: JSON.parse(template.config as string),
      prompts: {
        plan: template.planPrompt,
        architecture: template.archPrompt,
        wireframes: template.wireframesPrompt,
        design: template.designPrompt,
        backend: template.backendPrompt,
        devops: template.devopsPrompt,
        documentation: template.docsPrompt
      },
      recommendedModels: JSON.parse(template.recommendedModels as string)
    };
  }

  async updateTemplateUsage(id: string): Promise<void> {
    await db.projectTemplate.update({
      where: { id },
      data: { usageCount: { increment: 1 } }
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    await db.projectTemplate.delete({
      where: { id }
    });
  }

  async generateProjectFromTemplate(
    templateId: string,
    projectDescription: string,
    modelId: string = 'gpt-4-turbo'
  ): Promise<{
    plan: string;
    architecture: string;
    wireframes: string;
    design: string;
    backend: string;
    devops: string;
    documentation: string;
  }> {
    const template = await this.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const results = await Promise.all([
      template.prompts.plan ? llmService.generateCompletion(
        `${template.prompts.plan}\n\nProject Description: ${projectDescription}`,
        modelId,
        { temperature: 0.7 }
      ) : Promise.resolve(''),

      template.prompts.architecture ? llmService.generateCompletion(
        `${template.prompts.architecture}\n\nProject Description: ${projectDescription}`,
        modelId,
        { temperature: 0.5 }
      ) : Promise.resolve(''),

      template.prompts.wireframes ? llmService.generateCompletion(
        `${template.prompts.wireframes}\n\nProject Description: ${projectDescription}`,
        modelId,
        { temperature: 0.6 }
      ) : Promise.resolve(''),

      template.prompts.design ? llmService.generateCompletion(
        `${template.prompts.design}\n\nProject Description: ${projectDescription}`,
        modelId,
        { temperature: 0.7 }
      ) : Promise.resolve(''),

      template.prompts.backend ? llmService.generateCompletion(
        `${template.prompts.backend}\n\nProject Description: ${projectDescription}`,
        modelId,
        { temperature: 0.3 }
      ) : Promise.resolve(''),

      template.prompts.devops ? llmService.generateCompletion(
        `${template.prompts.devops}\n\nProject Description: ${projectDescription}`,
        modelId,
        { temperature: 0.4 }
      ) : Promise.resolve(''),

      template.prompts.documentation ? llmService.generateCompletion(
        `${template.prompts.documentation}\n\nProject Description: ${projectDescription}`,
        modelId,
        { temperature: 0.3 }
      ) : Promise.resolve('')
    ]);

    await this.updateTemplateUsage(templateId);

    return {
      plan: results[0],
      architecture: results[1],
      wireframes: results[2],
      design: results[3],
      backend: results[4],
      devops: results[5],
      documentation: results[6]
    };
  }
}

export const templateService = new TemplateService();