import { db } from '@/lib/db'
import { UserRole, ProjectStatus, SubscriptionPlan, SubscriptionStatus } from '@prisma/client'

async function main() {
  console.log('🌱 Seeding MongoDB database...')

  try {
    // Create demo user
    const demoUser = await db.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo User',
        role: UserRole.USER,
        emailVerified: true,
      },
    })

    console.log('✅ Created demo user:', demoUser.email)

    // Create user settings
    await db.userSettings.upsert({
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

    console.log('✅ Created user settings')

    // Create subscription - use create instead of upsert for MongoDB
    const existingSubscription = await db.subscription.findFirst({
      where: { userId: demoUser.id }
    })

    if (!existingSubscription) {
      await db.subscription.create({
        data: {
          userId: demoUser.id,
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.ACTIVE,
          projectsGenerated: 0,
          tokensUsed: 0,
          storageUsed: 0,
          maxProjects: 3,
          maxTokens: 50000,
          maxStorage: 1073741824, // 1GB
        },
      })
      console.log('✅ Created subscription')
    } else {
      console.log('✅ Subscription already exists')
    }

    // Create project templates
    const webAppTemplate = await db.projectTemplate.upsert({
      where: { id: 'web-app-template' },
      update: {},
      create: {
        id: 'web-app-template',
        name: 'Web Application',
        description: 'Full-stack web application with React and Node.js',
        category: 'web-app',
        structure: JSON.stringify({
          frontend: 'React with TypeScript',
          backend: 'Node.js with Express',
          database: 'MongoDB',
          auth: 'NextAuth.js',
          styling: 'Tailwind CSS',
        }),
        dependencies: JSON.stringify([
          'react',
          'next',
          '@prisma/client',
          'next-auth',
          'tailwindcss',
        ]),
        config: JSON.stringify({
          packageManager: 'npm',
          buildTool: 'Next.js',
          deployment: 'Vercel',
        }),
        planPrompt: 'Create a comprehensive project plan for a web application',
        archPrompt: 'Design the system architecture for a scalable web application',
        wireframesPrompt: 'Create wireframes for the main application screens',
        designPrompt: 'Design a modern, responsive user interface',
        backendPrompt: 'Implement the backend API with proper error handling',
        devopsPrompt: 'Set up CI/CD pipeline and deployment configuration',
        docsPrompt: 'Generate comprehensive documentation for the project',
        recommendedModels: JSON.stringify(['gpt-4-turbo', 'claude-3-opus']),
        isPublic: true,
        usageCount: 0,
      },
    })

    console.log('✅ Created web application template')

    const mobileAppTemplate = await db.projectTemplate.upsert({
      where: { id: 'mobile-app-template' },
      update: {},
      create: {
        id: 'mobile-app-template',
        name: 'Mobile Application',
        description: 'Cross-platform mobile application with React Native',
        category: 'mobile-app',
        structure: JSON.stringify({
          framework: 'React Native',
          state: 'Redux Toolkit',
          navigation: 'React Navigation',
          api: 'RESTful API',
          storage: 'AsyncStorage',
        }),
        dependencies: JSON.stringify([
          'react-native',
          '@reduxjs/toolkit',
          'react-navigation',
          'axios',
        ]),
        config: JSON.stringify({
          packageManager: 'npm',
          buildTool: 'Expo',
          deployment: 'App Store / Play Store',
        }),
        planPrompt: 'Create a project plan for a mobile application',
        archPrompt: 'Design the mobile app architecture',
        wireframesPrompt: 'Create mobile app wireframes',
        designPrompt: 'Design mobile app UI/UX',
        backendPrompt: 'Implement mobile backend API',
        devopsPrompt: 'Set up mobile app CI/CD',
        docsPrompt: 'Generate mobile app documentation',
        recommendedModels: JSON.stringify(['gpt-4-turbo']),
        isPublic: true,
        usageCount: 0,
      },
    })

    console.log('✅ Created mobile application template')

    // Create sample projects
    const project1 = await db.project.create({
      data: {
        title: 'E-commerce Platform',
        description: 'A full-featured e-commerce platform with user authentication, product catalog, and payment processing',
        userId: demoUser.id,
        status: ProjectStatus.COMPLETED,
        progress: 100,
        templateId: webAppTemplate.id,
        plan: true,
        architecture: true,
        wireframes: true,
        design: true,
        backend: true,
        devops: true,
        documentation: true,
        generatedPlan: 'Comprehensive e-commerce platform plan including user management, product catalog, shopping cart, and payment integration.',
        generatedArch: 'Microservices architecture with separate services for users, products, orders, and payments.',
        generatedWireframes: 'Wireframes for homepage, product listing, product detail, cart, and checkout flows.',
        generatedDesign: 'Modern, responsive design with clean UI and smooth user experience.',
        generatedBackend: 'RESTful API with Node.js, Express, and MongoDB database.',
        generatedDevops: 'CI/CD pipeline with automated testing and deployment to cloud platform.',
        llmModel: 'gpt-4-turbo',
      },
    })

    console.log('✅ Created e-commerce project')

    const project2 = await db.project.create({
      data: {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates and team features',
        userId: demoUser.id,
        status: ProjectStatus.GENERATING,
        progress: 60,
        templateId: webAppTemplate.id,
        plan: true,
        architecture: true,
        wireframes: true,
        design: false,
        backend: false,
        devops: false,
        documentation: false,
        generatedPlan: 'Task management app with real-time collaboration, drag-and-drop interface, and team workflows.',
        generatedArch: 'Real-time architecture with WebSocket support and event-driven design.',
        generatedWireframes: 'Wireframes for dashboard, task board, team management, and analytics.',
        llmModel: 'claude-3-opus',
      },
    })

    console.log('✅ Created task management project')

    const project3 = await db.project.create({
      data: {
        title: 'Fitness Tracker',
        description: 'A mobile fitness tracking application with workout planning and progress monitoring',
        userId: demoUser.id,
        status: ProjectStatus.DRAFT,
        progress: 0,
        templateId: mobileAppTemplate.id,
        plan: false,
        architecture: false,
        wireframes: false,
        design: false,
        backend: false,
        devops: false,
        documentation: false,
      },
    })

    console.log('✅ Created fitness tracker project')

    // Create sample deliverables
    await db.projectDeliverable.create({
      data: {
        projectId: project1.id,
        type: 'PLAN',
        content: 'Comprehensive e-commerce platform plan including user management, product catalog, shopping cart, and payment integration.',
        fileName: 'project-plan.pdf',
        fileSize: 1024000,
        downloadUrl: '/downloads/project-plan.pdf',
      },
    })

    await db.projectDeliverable.create({
      data: {
        projectId: project1.id,
        type: 'ARCHITECTURE',
        content: 'Microservices architecture with separate services for users, products, orders, and payments.',
        fileName: 'architecture-diagram.png',
        fileSize: 2048000,
        downloadUrl: '/downloads/architecture-diagram.png',
      },
    })

    console.log('✅ Created project deliverables')

    // Create sample team
    const existingTeam = await db.team.findFirst({
      where: { name: 'Demo Team' }
    })

    let team
    if (!existingTeam) {
      team = await db.team.create({
        data: {
          name: 'Demo Team',
          description: 'A sample team for demonstration purposes',
          maxMembers: 5,
          isPublic: false,
          owner: {
            connect: { id: demoUser.id },
          },
        },
      })
      console.log('✅ Created demo team')
    } else {
      team = existingTeam
      console.log('✅ Demo team already exists')
    }

    // Add team member
    const existingTeamMember = await db.teamMember.findFirst({
      where: { 
        teamId: team.id,
        userId: demoUser.id 
      }
    })

    if (!existingTeamMember) {
      await db.teamMember.create({
        data: {
          teamId: team.id,
          userId: demoUser.id,
          role: 'OWNER',
        },
      })
      console.log('✅ Added team member')
    } else {
      console.log('✅ Team member already exists')
    }

    // Create sample notifications
    const existingNotifications = await db.notification.findMany({
      where: { userId: demoUser.id }
    })

    if (existingNotifications.length === 0) {
      await db.notification.createMany({
        data: [
          {
            userId: demoUser.id,
            type: 'PROJECT_COMPLETED',
            title: 'Project Completed',
            message: 'Your e-commerce platform project has been completed successfully!',
            isRead: false,
          },
          {
            userId: demoUser.id,
            type: 'PROJECT_FAILED',
            title: 'Project Generation Failed',
            message: 'There was an issue generating your fitness tracker project.',
            isRead: true,
          },
        ],
      })
      console.log('✅ Created notifications')
    } else {
      console.log('✅ Notifications already exist')
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - Users: 1`)
    console.log(`   - Projects: 3`)
    console.log(`   - Templates: 2`)
    console.log(`   - Teams: 1`)
    console.log(`   - Deliverables: 2`)
    console.log(`   - Notifications: 2`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })