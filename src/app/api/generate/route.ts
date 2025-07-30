import { NextRequest, NextResponse } from 'next/server';
import { aiModelService } from '@/lib/ai-models';

export async function POST(request: NextRequest) {
  try {
    const { projectId, idea, modelSelection } = await request.json();

    if (!projectId || !idea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize AI model service
    await aiModelService.initialize();

    // Use provided model selection or default
    const selection = modelSelection || {
      primaryModel: 'gpt-4-turbo',
      fallbackModel: 'claude-3-sonnet',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    };

    // Step 1: Generate Product Plan
    const productPlanPrompt = `
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

    const productPlan = await aiModelService.generateCode(productPlanPrompt, selection);

    // Step 2: Generate Technical Architecture
    const techArchPrompt = `
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

    const techArch = await aiModelService.generateCode(techArchPrompt, selection);

    // Step 3: Generate Wireframes Description
    const wireframesPrompt = `
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

    const wireframes = await aiModelService.generateCode(wireframesPrompt, selection);

    // Step 4: Generate Design System
    const designSystemPrompt = `
    En tant que Visual Designer, créez un design system pour:
    
    Idée: "${idea}"
    
    Fournissez:
    1. Design tokens (couleurs, typographie, espacement)
    2. Composants principaux (Button, Input, Modal, Table, etc.)
    3. Guidelines pour mode clair/sombre
    4. Principles de design
    
    Répondez en français avec un format structuré.
    `;

    const designSystem = await aiModelService.generateCode(designSystemPrompt, selection);

    // Step 5: Generate Backend Code Structure
    const backendPrompt = `
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

    const backend = await aiModelService.generateCode(backendPrompt, selection);

    // Step 6: Generate DevOps Configuration
    const devopsPrompt = `
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

    const devops = await aiModelService.generateCode(devopsPrompt, selection);

    // Compile the complete response
    const generatedPlan = {
      projectId,
      idea,
      modelUsed: selection.primaryModel,
      deliverables: {
        productPlan,
        technicalArchitecture: techArch,
        wireframes,
        designSystem,
        backendCode: backend,
        devopsConfig: devops,
      },
      generatedAt: new Date().toISOString(),
      status: 'completed'
    };

    return NextResponse.json(generatedPlan);
  } catch (error) {
    console.error('Error generating project plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate project plan' },
      { status: 500 }
    );
  }
}