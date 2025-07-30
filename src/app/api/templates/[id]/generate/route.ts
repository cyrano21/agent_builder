import { NextRequest, NextResponse } from 'next/server';
import { templateService } from '@/lib/template-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { projectDescription, modelId } = body;

    if (!projectDescription) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }

    const results = await templateService.generateProjectFromTemplate(
      params.id,
      projectDescription,
      modelId || 'gpt-4-turbo'
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error generating project from template:', error);
    return NextResponse.json(
      { error: 'Failed to generate project from template' },
      { status: 500 }
    );
  }
}