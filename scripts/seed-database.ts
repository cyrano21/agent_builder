import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      bio: 'Développeur full-stack passionné par les nouvelles technologies',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      password: await hash('demo123', 10),
      emailVerified: true,
      role: 'USER',
    },
  })

  // Create user settings
  await prisma.userSettings.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      primaryLLM: 'gpt-4-turbo',
      fallbackLLM: 'claude-3-opus',
      temperature: 0.7,
      maxTokens: 4000,
      availableModels: JSON.stringify(['gpt-4-turbo', 'claude-3-opus', 'gemini-pro']),
      emailNotifications: true,
      projectCompleted: true,
      generationErrors: true,
      updates: false,
    },
  })

  // Create subscription
  await prisma.subscription.create({
    data: {
      userId: demoUser.id,
      plan: 'PRO',
      status: 'ACTIVE',
      projectsGenerated: 3,
      tokensUsed: 25000,
      storageUsed: 524288000, // 500MB
      maxProjects: 10,
      maxTokens: 100000,
      maxStorage: 1073741824, // 1GB (max INT value)
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  // Create project templates
  const templates = await Promise.all([
    prisma.projectTemplate.upsert({
      where: { id: 'template-1' },
      update: {},
      create: {
        id: 'template-1',
        name: 'Application SaaS',
        description: 'Application Software-as-a-Service complète avec authentification et paiement',
        category: 'web-app',
        structure: {
          frontend: 'Next.js with TypeScript',
          backend: 'Node.js with Express',
          database: 'PostgreSQL',
          auth: 'NextAuth.js',
          payment: 'Stripe',
        },
        dependencies: ['next', 'react', 'typescript', '@prisma/client', 'next-auth', 'stripe'],
        config: {
          packageManager: 'npm',
          buildTool: 'Next.js',
          deployment: 'Vercel',
        },
        planPrompt: 'Générer un plan détaillé pour une application SaaS avec authentification et paiement',
        archPrompt: 'Créer une architecture technique pour une application SaaS scalable',
        wireframesPrompt: 'Design des wireframes pour une application SaaS moderne',
        designPrompt: 'Créer le design UI/UX pour une application SaaS',
        backendPrompt: 'Implémenter le backend pour une application SaaS',
        devopsPrompt: 'Configuration DevOps pour une application SaaS',
        docsPrompt: 'Générer la documentation pour une application SaaS',
        recommendedModels: JSON.stringify(['gpt-4-turbo', 'claude-3-opus']),
        usageCount: 15,
        isPublic: true,
      },
    }),
    prisma.projectTemplate.upsert({
      where: { id: 'template-2' },
      update: {},
      create: {
        id: 'template-2',
        name: 'Marketplace NFT',
        description: 'Plateforme de trading NFT avec intégration blockchain',
        category: 'blockchain',
        structure: {
          frontend: 'React with TypeScript',
          backend: 'Node.js',
          blockchain: 'Ethereum',
          smartContracts: 'Solidity',
          storage: 'IPFS',
        },
        dependencies: ['react', 'typescript', 'ethers', 'hardhat', 'ipfs-http-client'],
        config: {
          packageManager: 'npm',
          buildTool: 'Webpack',
          deployment: 'Netlify',
        },
        planPrompt: 'Générer un plan pour une marketplace NFT complète',
        archPrompt: 'Architecture pour une plateforme NFT avec blockchain',
        wireframesPrompt: 'Wireframes pour une interface de trading NFT',
        designPrompt: 'Design moderne pour une marketplace NFT',
        backendPrompt: 'Backend pour marketplace NFT avec intégration blockchain',
        devopsPrompt: 'Déploiement d\'une application blockchain',
        docsPrompt: 'Documentation pour une plateforme NFT',
        recommendedModels: JSON.stringify(['gpt-4-turbo']),
        usageCount: 8,
        isPublic: true,
      },
    }),
    prisma.projectTemplate.upsert({
      where: { id: 'template-3' },
      update: {},
      create: {
        id: 'template-3',
        name: 'App de Gestion de Projet',
        description: 'Application collaborative de gestion de tâches et projets',
        category: 'productivity',
        structure: {
          frontend: 'Next.js with TypeScript',
          backend: 'Node.js with Express',
          database: 'PostgreSQL',
          realtime: 'Socket.io',
        },
        dependencies: ['next', 'react', 'typescript', 'socket.io', '@prisma/client'],
        config: {
          packageManager: 'npm',
          buildTool: 'Next.js',
          deployment: 'Vercel',
        },
        planPrompt: 'Plan pour une application de gestion de projet collaborative',
        archPrompt: 'Architecture pour une app de gestion de tâches en temps réel',
        wireframesPrompt: 'Wireframes pour une interface de gestion de projet',
        designPrompt: 'Design pour une application de productivité',
        backendPrompt: 'Backend pour gestion de projet avec temps réel',
        devopsPrompt: 'Déploiement d\'une application temps réel',
        docsPrompt: 'Documentation pour une app de gestion de projet',
        recommendedModels: JSON.stringify(['gpt-4-turbo', 'claude-3-opus']),
        usageCount: 12,
        isPublic: true,
      },
    }),
  ])

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'SaaS de Facturation Auto',
        description: 'Solution complète de facturation automatisée pour freelancers et petites entreprises',
        userId: demoUser.id,
        templateId: templates[0].id,
        status: 'COMPLETED',
        progress: 100,
        plan: true,
        architecture: true,
        wireframes: true,
        design: true,
        backend: true,
        devops: true,
        documentation: true,
        generatedPlan: JSON.stringify({
          title: 'SaaS de Facturation Auto',
          description: 'Plateforme complète de facturation avec paiements automatisés',
          features: ['Création de factures', 'Gestion clients', 'Paiements Stripe', 'Tableau de bord', 'Rapports'],
          timeline: '6-8 semaines',
          budget: '$20,000 - $30,000',
        }),
        generatedArch: JSON.stringify({
          architecture: 'Microservices avec Next.js frontend et Node.js backend',
          database: 'PostgreSQL avec Prisma ORM',
          auth: 'NextAuth.js avec JWT',
          payment: 'Stripe integration',
        }),
        llmModel: 'gpt-4-turbo',
      },
    }),
    prisma.project.create({
      data: {
        title: 'Marketplace NFT',
        description: 'Plateforme de trading NFT avec intégration blockchain Ethereum',
        userId: demoUser.id,
        templateId: templates[1].id,
        status: 'GENERATING',
        progress: 75,
        plan: true,
        architecture: true,
        wireframes: true,
        design: true,
        backend: false,
        devops: false,
        documentation: false,
        generatedPlan: JSON.stringify({
          title: 'Marketplace NFT',
          description: 'Plateforme décentralisée pour le trading de NFTs',
          features: ['Marketplace', 'Wallet integration', 'Minting NFT', 'Royalties', 'Analytics'],
          timeline: '10-12 semaines',
          budget: '$50,000 - $70,000',
        }),
        generatedArch: JSON.stringify({
          architecture: 'Full-stack avec React frontend et Node.js backend',
          blockchain: 'Ethereum avec smart contracts Solidity',
          storage: 'IPFS pour les métadonnées NFT',
          frontend: 'React avec ethers.js',
        }),
        llmModel: 'gpt-4-turbo',
      },
    }),
    prisma.project.create({
      data: {
        title: 'App de Gestion de Projet',
        description: 'Application collaborative de gestion de tâches et projets en temps réel',
        userId: demoUser.id,
        templateId: templates[2].id,
        status: 'DRAFT',
        progress: 0,
        plan: false,
        architecture: false,
        wireframes: false,
        design: false,
        backend: false,
        devops: false,
        documentation: false,
      },
    }),
  ])

  // Create project deliverables for completed project
  await prisma.projectDeliverable.createMany({
    data: [
      {
        projectId: projects[0].id,
        type: 'PLAN',
        content: 'Plan détaillé pour le SaaS de facturation...',
        fileName: 'project-plan.pdf',
        fileSize: 1024000,
      },
      {
        projectId: projects[0].id,
        type: 'ARCHITECTURE',
        content: 'Architecture technique complète...',
        fileName: 'architecture.pdf',
        fileSize: 2048000,
      },
      {
        projectId: projects[0].id,
        type: 'WIREFRAMES',
        content: 'Wireframes de l\'interface utilisateur...',
        fileName: 'wireframes.pdf',
        fileSize: 1536000,
      },
    ],
  })

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: 'PROJECT_COMPLETED',
        title: 'Projet terminé',
        message: 'Votre projet "SaaS de Facturation Auto" a été terminé avec succès',
        data: JSON.stringify({ projectId: projects[0].id }),
        isRead: false,
      },
      {
        userId: demoUser.id,
        type: 'PROJECT_FAILED',
        title: 'Erreur de génération',
        message: 'Une erreur est survenue lors de la génération du projet "Marketplace NFT"',
        data: JSON.stringify({ projectId: projects[1].id }),
        isRead: true,
      },
    ],
  })

  // Create sample team
  const team = await prisma.team.create({
    data: {
      name: 'Équipe de Développement',
      description: 'Équipe dédiée au développement d\'applications web',
      maxMembers: 5,
      isPublic: false,
      owner: {
        connect: {
          id: demoUser.id,
        },
      },
    },
  })

  // Add user as team owner
  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: demoUser.id,
      role: 'OWNER',
    },
  })

  console.log('Database seeded successfully!')
  console.log('Demo user: demo@example.com / demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })