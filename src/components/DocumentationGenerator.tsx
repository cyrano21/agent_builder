'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DocumentationPackage, 
  DocumentationSection, 
  TestFile 
} from '@/lib/documentation-generator';
import { ClientModelSelection } from '@/lib/client-models';
import { 
  Loader2, 
  FileText, 
  Code, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  TestTube,
  Architecture,
  Settings,
  GitBranch,
  Copy,
  Eye
} from 'lucide-react';

interface DocumentationGeneratorProps {
  projectData: {
    name: string;
    description: string;
    techStack: string[];
    features: string[];
    architecture?: string;
  };
  modelSelection: ClientModelSelection;
  onGenerated?: (documentation: DocumentationPackage) => void;
}

export function DocumentationGeneratorComponent({ 
  projectData, 
  modelSelection, 
  onGenerated 
}: DocumentationGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [documentation, setDocumentation] = useState<DocumentationPackage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<DocumentationSection | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestFile | null>(null);

  const handleGenerateDocumentation = async () => {
    setIsGenerating(true);
    setProgress('Initialisation...');
    setError(null);

    try {
      const response = await fetch('/api/documentation/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectData,
          modelSelection,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDocumentation(result);
        setProgress('');
        onGenerated?.(result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la génération de la documentation');
      }
    } catch (err) {
      console.error('Error generating documentation:', err);
      setError('Erreur lors de la génération de la documentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAll = () => {
    if (!documentation) return;

    // Create a simple text export of all documentation
    let content = `# ${documentation.project.name} - Documentation Package\n\n`;
    content += `Generated: ${documentation.generatedAt}\n`;
    content += `Model Used: ${documentation.modelUsed}\n\n`;
    content += `=== PROJECT INFO ===\n`;
    content += `Name: ${documentation.project.name}\n`;
    content += `Description: ${documentation.project.description}\n`;
    content += `Version: ${documentation.project.version}\n`;
    content += `Author: ${documentation.project.author}\n\n`;

    content += `=== DOCUMENTATION SECTIONS ===\n\n`;
    documentation.sections.forEach(section => {
      content += `--- ${section.title} (${section.type}, ${section.priority} priority) ---\n`;
      content += `${section.content}\n\n`;
    });

    content += `=== TEST FILES ===\n\n`;
    documentation.testFiles.forEach(testFile => {
      content += `--- ${testFile.fileName} (${testFile.type}, ${testFile.framework}, ${testFile.coverage}% coverage) ---\n`;
      content += `${testFile.content}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.name}-documentation-package.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const generateTestCoverageReport = (testFiles: TestFile[]): string => {
    const totalCoverage = testFiles.reduce((sum, file) => sum + file.coverage, 0) / testFiles.length;
    const byType = {
      unit: testFiles.filter(f => f.type === 'unit').length,
      integration: testFiles.filter(f => f.type === 'integration').length,
      e2e: testFiles.filter(f => f.type === 'e2e').length
    };

    return `
# Test Coverage Report

## Summary
- **Overall Coverage**: ${totalCoverage.toFixed(1)}%
- **Total Test Files**: ${testFiles.length}
- **Unit Tests**: ${byType.unit}
- **Integration Tests**: ${byType.integration}
- **E2E Tests**: ${byType.e2e}

## Coverage by File
${testFiles.map(file => `
- **${file.fileName}**: ${file.coverage}% (${file.type} - ${file.framework})
`).join('')}

## Recommendations
${totalCoverage >= 80 ? '✅ Excellent test coverage!' : 
  totalCoverage >= 60 ? '⚠️ Good coverage, but could be improved' : 
  '❌ Test coverage needs improvement'}

## Next Steps
1. Run tests locally: \`npm test\`
2. Generate coverage report: \`npm run test:coverage\`
3. Focus on areas with low coverage
4. Add integration tests for critical paths
5. Implement E2E tests for user workflows
    `;
  };

  const getSectionIcon = (type: DocumentationSection['type']) => {
    switch (type) {
      case 'readme': return <FileText className="w-5 h-5" />;
      case 'api': return <Code className="w-5 h-5" />;
      case 'architecture': return <Architecture className="w-5 h-5" />;
      case 'deployment': return <Settings className="w-5 h-5" />;
      case 'testing': return <TestTube className="w-5 h-5" />;
      case 'contributing': return <GitBranch className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: DocumentationSection['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTestIcon = (type: TestFile['type']) => {
    switch (type) {
      case 'unit': return <TestTube className="w-4 h-4" />;
      case 'integration': return <Code className="w-4 h-4" />;
      case 'e2e': return <Eye className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Générateur de Documentation et Tests
          </CardTitle>
          <CardDescription>
            Générez automatiquement une documentation complète et des tests pour votre projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleGenerateDocumentation}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Générer Documentation
                </>
              )}
            </Button>
            
            {documentation && (
              <Button 
                variant="outline"
                onClick={handleDownloadAll}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger Tout
              </Button>
            )}
          </div>

          {isGenerating && progress && (
            <div className="mt-4 space-y-2">
              <div className="text-sm text-muted-foreground">{progress}</div>
              <Progress value={75} className="w-full" />
            </div>
          )}

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {documentation && (
        <Tabs defaultValue="documentation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="documentation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentation.sections.map((section, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedSection(section)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSectionIcon(section.type)}
                        <CardTitle className="text-sm font-medium">
                          {section.title}
                        </CardTitle>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getPriorityColor(section.priority)}
                      >
                        {section.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {section.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyToClipboard(section.content);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{section.title}</DialogTitle>
                            <DialogDescription>
                              {section.type} documentation - Priority: {section.priority}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh]">
                            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
                              {section.content}
                            </pre>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentation.testFiles.map((testFile, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTestIcon(testFile.type)}
                        <CardTitle className="text-sm font-medium">
                          {testFile.fileName}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{testFile.framework}</Badge>
                        <Badge 
                          variant={testFile.coverage >= 80 ? "default" : "secondary"}
                        >
                          {testFile.coverage}% coverage
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground mb-3">
                      {testFile.type} test • {testFile.framework}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedTest(testFile)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyToClipboard(testFile.content)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Test Coverage Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Rapport de Couverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
                  {generateTestCoverageReport(documentation.testFiles)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Test File Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedTest?.fileName}</DialogTitle>
            <DialogDescription>
              {selectedTest?.type} test • {selectedTest?.framework} • {selectedTest?.coverage}% coverage
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded font-mono">
              {selectedTest?.content}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}