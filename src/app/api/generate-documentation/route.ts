import { NextRequest, NextResponse } from 'next/server';
import { DocumentationGenerator } from '@/lib/documentation-generator';
import { ModelSelection } from '@/lib/ai-models';

export async function POST(request: NextRequest) {
  try {
    const { projectData, modelSelection } = await request.json();

    if (!projectData || !modelSelection) {
      return NextResponse.json(
        { error: 'Missing required fields: projectData and modelSelection' },
        { status: 400 }
      );
    }

    // Validate project data
    const requiredFields = ['name', 'description', 'techStack', 'features'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate documentation
    const documentation = await DocumentationGenerator.generateCompleteDocumentation(
      projectData,
      modelSelection
    );

    return NextResponse.json({
      success: true,
      documentation,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate documentation' },
      { status: 500 }
    );
  }
}