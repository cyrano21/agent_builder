export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web-app' | 'mobile-app' | 'api' | 'ecommerce' | 'saas' | 'dashboard' | 'blog' | 'portfolio';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  icon: string;
  tags: string[];
  features: string[];
  techStack: string[];
  starterPrompt: string;
  deliverables: {
    plan: boolean;
    architecture: boolean;
    wireframes: boolean;
    design: boolean;
    backend: boolean;
    devops: boolean;
    documentation: boolean;
  };
  customizations: {
    database: 'sqlite' | 'postgresql' | 'mysql' | 'mongodb';
    auth: 'none' | 'basic' | 'oauth' | 'jwt';
    deployment: 'none' | 'vercel' | 'aws' | 'docker';
    payment: 'none' | 'stripe' | 'paypal';
  };
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'saas-starter',
    name: 'SaaS Starter',
    description: 'Application SaaS complète avec authentification, abonnements et tableau de bord',
    category: 'saas',
    difficulty: 'intermediate',
    estimatedTime: '2-3 semaines',
    icon: '💼',
    tags: ['SaaS', 'Subscription', 'Dashboard', 'Authentication'],
    features: [
      'Authentification utilisateur',
      'Gestion des abonnements',
      'Tableau de bord analytique',
      'Gestion des profils',
      'Intégration de paiement',
      'API REST complète'
    ],
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth.js', 'Tailwind CSS'],
    starterPrompt: 'Créez une application SaaS pour la gestion de projets en équipe avec des fonctionnalités de collaboration en temps réel, tableaux Kanban, et système d\'abonnement.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: true,
      design: true,
      backend: true,
      devops: true,
      documentation: true
    },
    customizations: {
      database: 'postgresql',
      auth: 'oauth',
      deployment: 'vercel',
      payment: 'stripe'
    }
  },
  {
    id: 'ecommerce-platform',
    name: 'E-commerce Platform',
    description: 'Plateforme e-commerce complète avec gestion des produits, panier et paiement',
    category: 'ecommerce',
    difficulty: 'advanced',
    estimatedTime: '3-4 semaines',
    icon: '🛒',
    tags: ['E-commerce', 'Shopping Cart', 'Payment', 'Inventory'],
    features: [
      'Catalogue de produits',
      'Panier d\'achat',
      'Passerelle de paiement',
      'Gestion des commandes',
      'Suivi des expéditions',
      'Administration des produits'
    ],
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'React Query', 'Zustand'],
    starterPrompt: 'Développez une plateforme e-commerce moderne avec recherche avancée, filtrage par catégories, recommandations de produits, et interface d\'administration complète.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: true,
      design: true,
      backend: true,
      devops: true,
      documentation: true
    },
    customizations: {
      database: 'postgresql',
      auth: 'jwt',
      deployment: 'aws',
      payment: 'stripe'
    }
  },
  {
    id: 'blog-cms',
    name: 'Blog CMS',
    description: 'Système de gestion de contenu moderne avec éditeur riche et SEO',
    category: 'blog',
    difficulty: 'beginner',
    estimatedTime: '1-2 semaines',
    icon: '📝',
    tags: ['CMS', 'Blog', 'SEO', 'Content Management'],
    features: [
      'Éditeur de articles riche',
      'Gestion des catégories',
      'Optimisation SEO',
      'Commentaires',
      'Recherche',
      'Analytics intégré'
    ],
    techStack: ['Next.js', 'Prisma', 'SQLite', 'MDXEditor', 'Tailwind CSS'],
    starterPrompt: 'Créez un système de blog moderne avec éditeur Markdown, support des images, catégories, tags, et optimisation SEO automatique.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: true,
      design: true,
      backend: true,
      devops: false,
      documentation: true
    },
    customizations: {
      database: 'sqlite',
      auth: 'basic',
      deployment: 'vercel',
      payment: 'none'
    }
  },
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Tableau de bord analytique avec visualisations de données en temps réel',
    category: 'dashboard',
    difficulty: 'intermediate',
    estimatedTime: '2-3 semaines',
    icon: '📊',
    tags: ['Analytics', 'Dashboard', 'Data Visualization', 'Charts'],
    features: [
      'Visualisations de données',
      'Filtres dynamiques',
      'Export de données',
      'Tableaux de bord personnalisables',
      'Alertes en temps réel',
      'Intégrations multiples'
    ],
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Chart.js', 'WebSocket', 'D3.js'],
    starterPrompt: 'Développez un tableau de bord analytique pour le suivi des métriques business avec graphiques interactifs, filtres avancés, et export PDF/Excel.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: true,
      design: true,
      backend: true,
      devops: true,
      documentation: true
    },
    customizations: {
      database: 'postgresql',
      auth: 'jwt',
      deployment: 'docker',
      payment: 'none'
    }
  },
  {
    id: 'api-backend',
    name: 'REST API Backend',
    description: 'API REST complète avec documentation et tests automatisés',
    category: 'api',
    difficulty: 'intermediate',
    estimatedTime: '1-2 semaines',
    icon: '🔧',
    tags: ['API', 'REST', 'Documentation', 'Testing'],
    features: [
      'Endpoints REST complets',
      'Documentation OpenAPI',
      'Tests automatisés',
      'Rate limiting',
      'Validation des données',
      'Gestion des erreurs'
    ],
    techStack: ['Next.js API Routes', 'Prisma', 'PostgreSQL', 'Jest', 'Swagger'],
    starterPrompt: 'Créez une API REST robuste pour une application de gestion de ressources avec authentification, pagination, filtres, et documentation complète.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: false,
      design: false,
      backend: true,
      devops: true,
      documentation: true
    },
    customizations: {
      database: 'postgresql',
      auth: 'jwt',
      deployment: 'docker',
      payment: 'none'
    }
  },
  {
    id: 'portfolio-showcase',
    name: 'Portfolio Showcase',
    description: 'Portfolio personnel moderne avec projets et animations',
    category: 'portfolio',
    difficulty: 'beginner',
    estimatedTime: '3-5 jours',
    icon: '🎨',
    tags: ['Portfolio', 'Showcase', 'Animations', 'Personal'],
    features: [
      'Galerie de projets',
      'Animations fluides',
      'Formulaire de contact',
      'Blog intégré',
      'Thème sombre/clair',
      'Optimisation mobile'
    ],
    techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'React Email'],
    starterPrompt: 'Développez un portfolio personnel moderne avec présentation de projets, animations interactives, blog intégré, et formulaire de contact.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: true,
      design: true,
      backend: false,
      devops: true,
      documentation: false
    },
    customizations: {
      database: 'sqlite',
      auth: 'none',
      deployment: 'vercel',
      payment: 'none'
    }
  },
  {
    id: 'task-management',
    name: 'Task Management App',
    description: 'Application de gestion de tâches collaborative avec tableaux Kanban',
    category: 'web-app',
    difficulty: 'intermediate',
    estimatedTime: '2-3 semaines',
    icon: '✅',
    tags: ['Task Management', 'Kanban', 'Collaboration', 'Project Management'],
    features: [
      'Tableaux Kanban',
      'Collaboration en temps réel',
      'Assignation des tâches',
      'Commentaires et fichiers',
      'Notifications',
      'Export des données'
    ],
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Socket.io', 'Drag and Drop', 'Tailwind CSS'],
    starterPrompt: 'Créez une application de gestion de tâches collaborative avec tableaux Kanban, drag-and-drop, commentaires en temps réel, et notifications push.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: true,
      design: true,
      backend: true,
      devops: true,
      documentation: true
    },
    customizations: {
      database: 'postgresql',
      auth: 'oauth',
      deployment: 'vercel',
      payment: 'none'
    }
  },
  {
    id: 'social-media',
    name: 'Social Media Platform',
    description: 'Plateforme de médias sociaux avec flux, posts et interactions',
    category: 'web-app',
    difficulty: 'advanced',
    estimatedTime: '4-6 semaines',
    icon: '📱',
    tags: ['Social Media', 'Feed', 'Posts', 'Interactions'],
    features: [
      'Fil d\'actualité',
      'Posts et commentaires',
      'Likes et partages',
      'Messagerie instantanée',
      'Profils utilisateurs',
      'Notifications'
    ],
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Socket.io', 'WebRTC', 'Redis'],
    starterPrompt: 'Développez une plateforme de médias sociaux moderne avec fil d\'actualité algorithmique, messagerie instantanée, stories, et interactions en temps réel.',
    deliverables: {
      plan: true,
      architecture: true,
      wireframes: true,
      design: true,
      backend: true,
      devops: true,
      documentation: true
    },
    customizations: {
      database: 'postgresql',
      auth: 'oauth',
      deployment: 'aws',
      payment: 'none'
    }
  }
];

export class ProjectTemplateService {
  static getTemplateById(id: string): ProjectTemplate | undefined {
    return PROJECT_TEMPLATES.find(template => template.id === id);
  }

  static getTemplatesByCategory(category: ProjectTemplate['category']): ProjectTemplate[] {
    return PROJECT_TEMPLATES.filter(template => template.category === category);
  }

  static getTemplatesByDifficulty(difficulty: ProjectTemplate['difficulty']): ProjectTemplate[] {
    return PROJECT_TEMPLATES.filter(template => template.difficulty === difficulty);
  }

  static getTemplatesByTag(tag: string): ProjectTemplate[] {
    return PROJECT_TEMPLATES.filter(template => 
      template.tags.some(templateTag => 
        templateTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

  static searchTemplates(query: string): ProjectTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return PROJECT_TEMPLATES.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  static getRecommendedTemplates(userPreferences?: {
    category?: ProjectTemplate['category'];
    difficulty?: ProjectTemplate['difficulty'];
    tags?: string[];
  }): ProjectTemplate[] {
    let templates = [...PROJECT_TEMPLATES];
    
    if (userPreferences) {
      if (userPreferences.category) {
        templates = templates.filter(t => t.category === userPreferences.category);
      }
      if (userPreferences.difficulty) {
        templates = templates.filter(t => t.difficulty === userPreferences.difficulty);
      }
      if (userPreferences.tags && userPreferences.tags.length > 0) {
        templates = templates.filter(t => 
          userPreferences.tags!.some(prefTag => 
            t.tags.some(templateTag => 
              templateTag.toLowerCase().includes(prefTag.toLowerCase())
            )
          )
        );
      }
    }
    
    // Sort by relevance and return top recommendations
    return templates.slice(0, 4);
  }

  static getTemplateStats(): {
    total: number;
    byCategory: Record<ProjectTemplate['category'], number>;
    byDifficulty: Record<ProjectTemplate['difficulty'], number>;
  } {
    const stats = {
      total: PROJECT_TEMPLATES.length,
      byCategory: {} as Record<ProjectTemplate['category'], number>,
      byDifficulty: {} as Record<ProjectTemplate['difficulty'], number>,
    };

    PROJECT_TEMPLATES.forEach(template => {
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
      stats.byDifficulty[template.difficulty] = (stats.byDifficulty[template.difficulty] || 0) + 1;
    });

    return stats;
  }

  static customizeTemplate(
    template: ProjectTemplate,
    customizations: Partial<ProjectTemplate['customizations']>
  ): ProjectTemplate {
    return {
      ...template,
      customizations: {
        ...template.customizations,
        ...customizations
      }
    };
  }

  static generatePromptFromTemplate(
    template: ProjectTemplate,
    userRequirements?: string
  ): string {
    let prompt = template.starterPrompt;
    
    if (userRequirements) {
      prompt += `\n\nRequirements spécifiques:\n${userRequirements}`;
    }
    
    // Add tech stack information
    prompt += `\n\nStack technique recommandée: ${template.techStack.join(', ')}`;
    
    // Add key features
    prompt += `\n\nFonctionnalités clés à inclure:\n${template.features.map(f => `- ${f}`).join('\n')}`;
    
    return prompt;
  }
}

export const projectTemplateService = ProjectTemplateService;