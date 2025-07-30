import { llmService } from './llm-service';

export interface DocumentationOptions {
  includeOverview?: boolean;
  includeApiDocs?: boolean;
  includeSetupGuide?: boolean;
  includeExamples?: boolean;
  format?: 'markdown' | 'html' | 'json';
}

export interface TestOptions {
  framework: 'jest' | 'mocha' | 'vitest' | 'cypress';
  includeUnitTests?: boolean;
  includeIntegrationTests?: boolean;
  includeE2eTests?: boolean;
  coverageTarget?: number;
}

export interface CodeReviewOptions {
  focusAreas?: ('security' | 'performance' | 'best-practices' | 'maintainability')[];
  severityLevel?: 'low' | 'medium' | 'high';
  includeSuggestions?: boolean;
  includeScore?: boolean;
}

export class DocumentationService {
  async generateProjectDocumentation(
    projectData: {
      name: string;
      description: string;
      techStack: string[];
      structure: any;
      generatedContent: Record<string, string>;
    },
    options: DocumentationOptions = {}
  ): Promise<string> {
    const {
      includeOverview = true,
      includeApiDocs = true,
      includeSetupGuide = true,
      includeExamples = true,
      format = 'markdown'
    } = options;

    const sections: string[] = [];

    // Generate overview
    if (includeOverview) {
      const overview = await llmService.generateCompletion(
        `Generate a comprehensive project overview for:
Project Name: ${projectData.name}
Description: ${projectData.description}
Tech Stack: ${projectData.techStack.join(', ')}

Please include:
1. Project purpose and goals
2. Key features and functionality
3. Architecture overview
4. Technology stack details
5. Prerequisites and requirements`,
        'gpt-4-turbo',
        { temperature: 0.5 }
      );
      sections.push(`# Project Overview\n\n${overview}`);
    }

    // Generate API documentation
    if (includeApiDocs && projectData.generatedContent.backend) {
      const apiDocs = await llmService.generateCompletion(
        `Generate API documentation for this backend code:\n\n${projectData.generatedContent.backend}\n\nPlease include:\n1. Endpoint descriptions\n2. Request/response formats\n3. Authentication methods\n4. Error handling\n5. Rate limiting`,
        'gpt-4-turbo',
        { temperature: 0.3 }
      );
      sections.push(`# API Documentation\n\n${apiDocs}`);
    }

    // Generate setup guide
    if (includeSetupGuide) {
      const setupGuide = await llmService.generateCompletion(
        `Generate a comprehensive setup guide for:
Project: ${projectData.name}
Tech Stack: ${projectData.techStack.join(', ')}
Structure: ${JSON.stringify(projectData.structure, null, 2)}

Please include:
1. Installation instructions
2. Configuration steps
3. Environment setup
4. Database setup
5. Running the application`,
        'gpt-4-turbo',
        { temperature: 0.4 }
      );
      sections.push(`# Setup Guide\n\n${setupGuide}`);
    }

    // Generate usage examples
    if (includeExamples) {
      const examples = await llmService.generateCompletion(
        `Generate practical usage examples for:
Project: ${projectData.name}
Description: ${projectData.description}
Generated Content: ${Object.keys(projectData.generatedContent).join(', ')}

Please include:
1. Basic usage examples
2. Advanced use cases
3. Common scenarios
4. Code snippets
5. Best practices`,
        'gpt-4-turbo',
        { temperature: 0.6 }
      );
      sections.push(`# Usage Examples\n\n${examples}`);
    }

    // Format the final documentation
    let documentation = sections.join('\n\n---\n\n');
    
    if (format === 'html') {
      documentation = this.convertMarkdownToHtml(documentation);
    } else if (format === 'json') {
      documentation = JSON.stringify({
        title: projectData.name,
        description: projectData.description,
        sections: sections,
        generatedAt: new Date().toISOString()
      }, null, 2);
    }

    return documentation;
  }

  async generateCodeDocumentation(
    code: string,
    language: string,
    filePath?: string
  ): Promise<string> {
    const prompt = `Generate comprehensive documentation for this ${language} code${filePath ? ` in file: ${filePath}` : ''}:\n\n${code}\n\nPlease provide:\n1. File/module purpose\n2. Function/method documentation\n3. Parameter descriptions\n4. Return value explanations\n5. Usage examples\n6. Dependencies and requirements`;

    return llmService.generateCompletion(prompt, 'gpt-4-turbo', { temperature: 0.3 });
  }

  async generateTests(
    code: string,
    language: string,
    options: TestOptions
  ): Promise<string> {
    const {
      framework,
      includeUnitTests = true,
      includeIntegrationTests = false,
      includeE2eTests = false,
      coverageTarget = 80
    } = options;

    let prompt = `Generate comprehensive ${framework} tests for this ${language} code:\n\n${code}\n\n`;

    const testTypes = [];
    if (includeUnitTests) testTypes.push('unit tests');
    if (includeIntegrationTests) testTypes.push('integration tests');
    if (includeE2eTests) testTypes.push('end-to-end tests');

    prompt += `Please generate ${testTypes.join(', ')} with ${coverageTarget}% coverage target.\n\nInclude:\n`;

    if (includeUnitTests) {
      prompt += `1. Unit tests for all functions/methods\n`;
    }
    if (includeIntegrationTests) {
      prompt += `2. Integration tests for component interactions\n`;
    }
    if (includeE2eTests) {
      prompt += `3. End-to-end tests for user workflows\n`;
    }

    prompt += `4. Mock setup and teardown\n5. Edge case testing\n6. Error scenario testing\n7. Test organization and structure`;

    return llmService.generateCompletion(prompt, 'gpt-4-turbo', { temperature: 0.3 });
  }

  async reviewCode(
    code: string,
    language: string,
    options: CodeReviewOptions = {}
  ): Promise<{
    score: number;
    issues: Array<{
      type: 'security' | 'performance' | 'best-practices' | 'maintainability';
      severity: 'low' | 'medium' | 'high';
      description: string;
      suggestion?: string;
      line?: number;
    }>;
    summary: string;
    suggestions: string[];
  }> {
    const {
      focusAreas = ['security', 'performance', 'best-practices', 'maintainability'],
      severityLevel = 'medium',
      includeSuggestions = true,
      includeScore = true
    } = options;

    const prompt = `Review this ${language} code and provide detailed feedback:\n\n${code}\n\nFocus areas: ${focusAreas.join(', ')}\nSeverity level: ${severityLevel}\n\nPlease provide:\n1. Overall code quality score (1-100)\n2. List of issues found with severity levels\n3. Detailed summary of findings\n4. Specific suggestions for improvement`;

    const review = await llmService.generateCompletion(prompt, 'gpt-4-turbo', { temperature: 0.4 });

    // Parse the review response (in a real implementation, this would be more sophisticated)
    const lines = review.split('\n');
    let score = 75; // Default score
    const issues: any[] = [];
    const suggestions: string[] = [];
    let summary = '';

    // Simple parsing logic (would be enhanced in production)
    for (const line of lines) {
      if (line.includes('Score:') || line.includes('score:')) {
        const match = line.match(/(\d+)/);
        if (match) {
          score = parseInt(match[1]);
        }
      } else if (line.toLowerCase().includes('security') || line.toLowerCase().includes('performance')) {
        // Extract issues (simplified)
        const severity = line.toLowerCase().includes('high') ? 'high' : 
                       line.toLowerCase().includes('medium') ? 'medium' : 'low';
        issues.push({
          type: line.toLowerCase().includes('security') ? 'security' : 'performance',
          severity,
          description: line.trim(),
          suggestion: includeSuggestions ? 'Review and optimize this section' : undefined
        });
      } else if (line.toLowerCase().includes('suggestion') || line.toLowerCase().includes('recommend')) {
        suggestions.push(line.trim());
      }
    }

    summary = lines.filter(line => 
      !line.includes('Score:') && 
      !line.toLowerCase().includes('security') && 
      !line.toLowerCase().includes('performance') &&
      !line.toLowerCase().includes('suggestion')
    ).join('\n').trim();

    return {
      score,
      issues,
      summary,
      suggestions
    };
  }

  async generateApiSpec(
    endpoints: Array<{
      method: string;
      path: string;
      description: string;
      parameters?: any;
      requestBody?: any;
      responses?: any;
    }>,
    format: 'openapi' | 'swagger' | 'postman' = 'openapi'
  ): Promise<string> {
    const prompt = `Generate a ${format} API specification for these endpoints:\n\n${JSON.stringify(endpoints, null, 2)}\n\nPlease include:\n1. Complete API specification\n2. Schema definitions\n3. Authentication requirements\n4. Error responses\n5. Example requests/responses`;

    return llmService.generateCompletion(prompt, 'gpt-4-turbo', { temperature: 0.3 });
  }

  async generateReadme(
    projectData: {
      name: string;
      description: string;
      version: string;
      author: string;
      license: string;
      techStack: string[];
      features: string[];
      installation: string;
      usage: string;
      contributing?: string;
    }
  ): Promise<string> {
    const prompt = `Generate a comprehensive README.md file for:\n\n${JSON.stringify(projectData, null, 2)}\n\nPlease include all standard README sections with proper formatting and badges.`;

    return llmService.generateCompletion(prompt, 'gpt-4-turbo', { temperature: 0.4 });
  }

  private convertMarkdownToHtml(markdown: string): string {
    // Simple markdown to HTML conversion (in production, use a proper library like marked)
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/```(.*?)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      .replace(/\n/gim, '<br>');
  }
}

export const documentationService = new DocumentationService();