import { NextRequest, NextResponse } from 'next/server';
import { DocumentationGenerator } from '@/lib/documentation-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectData, modelSelection } = body;

    if (!projectData || !modelSelection) {
      return NextResponse.json(
        { error: 'Project data and model selection are required' },
        { status: 400 }
      );
    }

    const result = await DocumentationGenerator.generateCompleteDocumentation(
      projectData,
      modelSelection
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate documentation' },
      { status: 500 }
    );
  }
}