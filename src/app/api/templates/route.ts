import { NextRequest, NextResponse } from 'next/server';
import { templateService } from '@/lib/template-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let templates;
    if (category) {
      templates = await templateService.getTemplatesByCategory(category);
    } else {
      templates = await templateService.getAllTemplates();
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, structure, dependencies, config, prompts, recommendedModels, isPublic } = body;

    const template = await templateService.createTemplate({
      name,
      description,
      category,
      structure,
      dependencies,
      config,
      prompts,
      recommendedModels,
      isPublic
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}