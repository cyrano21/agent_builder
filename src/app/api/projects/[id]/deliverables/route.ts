import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { deliverableType, idea } = await request.json();

    if (!deliverableType || !idea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch project
    const project = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    let prompt = '';
    let generatedContent = '';

    switch (deliverableType) {
      case 'PLAN':
        prompt = `
        En tant qu'Architecte Produit expert, analysez l'idée suivante et générez un plan produit complet:
        
        Idée: "${idea}"
        
        Fournissez:
        1. Vision produit
        2. Personas cibles
        3. User journeys
        4. KPIs principaux
        5. Epics et user stories (format Gherkin)
        6. Risques et stratégies de mitigation
        
        Répondez en français avec un format structuré en markdown.
        `;
        break;

      case 'ARCHITECTURE':
        prompt = `
        En tant qu'Architecte Technique, concevez l'architecture technique pour:
        
        Idée: "${idea}"
        
        Fournissez:
        1. Arborescence technique (structure des dossiers)
        2. Spécifications API (OpenAPI 3.1)
        3. Configuration Docker (docker-compose.yml, Dockerfile)
        4. Configuration Terraform (VPC, RDS, ECS, CloudFront)
        5. Choix technologiques justifiés
        
        Répondez en français avec un format structuré.
        `;
        break;

      case 'WIREFRAMES':
        prompt = `
        En tant qu'UX Designer, décrivez les wireframes pour:
        
        Idée: "${idea}"
        
        Fournissez des descriptions détaillées pour 5 écrans principaux:
        1. Landing Page
        2. Dashboard
        3. Settings
        4. Billing
        5. Login/Register
        
        Pour chaque écran, décrivez:
        - Layout principal
        - Composants clés
        - Flux utilisateur
        - Points d'interaction
        
        Répondez en français.
        `;
        break;

      case 'DESIGN':
        prompt = `
        En tant que Visual Designer, créez un design system pour:
        
        Idée: "${idea}"
        
        Fournissez:
        1. Design tokens (couleurs, typographie, espacement)
        2. Composants principaux (Button, Input, Modal, Table, etc.)
        3. Guidelines pour mode clair/sombre
        4. Principles de design
        
        Répondez en français avec un format structuré.
        `;
        break;

      case 'BACKEND':
        prompt = `
        En tant que Backend Developer, générez la structure de code backend pour:
        
        Idée: "${idea}"
        
        Fournissez:
        1. Modèles de données (schéma de base de données)
        2. Endpoints REST avec descriptions
        3. Structure des fichiers
        4. Configuration de base
        5. Exemples de code clés
        
        Utilisez Next.js API Routes, Prisma, et PostgreSQL.
        Répondez en français.
        `;
        break;

      case 'DEVOPS':
        prompt = `
        En tant que DevOps Engineer, créez la configuration DevOps pour:
        
        Idée: "${idea}"
        
        Fournissez:
        1. GitHub Actions workflow (CI/CD)
        2. Terraform modules réutilisables
        3. Configuration pour 3 environnements (dev, staging, prod)
        4. Stratégie de secrets management
        5. Monitoring et logging
        
        Répondez en français avec des exemples de code.
        `;
        break;

      case 'DOCUMENTATION':
        prompt = `
        En tant que Technical Writer, créez une documentation complète pour:
        
        Idée: "${idea}"
        
        Fournissez:
        1. README.md avec setup instructions
        2. API documentation
        3. Deployment guide
        4. Contributing guidelines
        5. Changelog
        
        Répondez en français avec un format markdown.
        `;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid deliverable type' },
          { status: 400 }
        );
    }

    // Generate content using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Vous êtes un expert dans votre domaine avec une forte expérience professionnelle.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    generatedContent = completion.choices[0]?.message?.content || '';

    // Save generated content to project
    const updateData: any = {};
    switch (deliverableType) {
      case 'PLAN':
        updateData.generatedPlan = generatedContent;
        updateData.plan = true;
        break;
      case 'ARCHITECTURE':
        updateData.generatedArch = generatedContent;
        updateData.architecture = true;
        break;
      case 'WIREFRAMES':
        updateData.generatedWireframes = generatedContent;
        updateData.wireframes = true;
        break;
      case 'DESIGN':
        updateData.generatedDesign = generatedContent;
        updateData.design = true;
        break;
      case 'BACKEND':
        updateData.generatedBackend = generatedContent;
        updateData.backend = true;
        break;
      case 'DEVOPS':
        updateData.generatedDevops = generatedContent;
        updateData.devops = true;
        break;
      case 'DOCUMENTATION':
        updateData.documentation = true;
        break;
    }

    // Update project with generated content
    const updatedProject = await db.project.update({
      where: { id: params.id },
      data: updateData,
    });

    // Create deliverable record
    const deliverable = await db.projectDeliverable.create({
      data: {
        projectId: params.id,
        type: deliverableType,
        content: generatedContent,
        fileName: `${deliverableType.toLowerCase()}_${Date.now()}.md`,
        fileSize: Buffer.byteLength(generatedContent, 'utf8'),
      },
    });

    // Calculate and update progress
    const allDeliverables = ['plan', 'architecture', 'wireframes', 'design', 'backend', 'devops', 'documentation'];
    const completedDeliverables = allDeliverables.filter(key => updatedProject[key as keyof typeof updatedProject]);
    const progress = Math.round((completedDeliverables.length / allDeliverables.length) * 100);

    await db.project.update({
      where: { id: params.id },
      data: { progress },
    });

    return NextResponse.json({
      deliverable,
      project: { ...updatedProject, progress },
      generatedContent
    });

  } catch (error) {
    console.error('Error generating deliverable:', error);
    return NextResponse.json(
      { error: 'Failed to generate deliverable' },
      { status: 500 }
    );
  }
}