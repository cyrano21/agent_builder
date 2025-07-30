"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Download, Trash2, FolderOpen } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "draft" | "generating" | "completed" | "failed";
  progress: number;
  createdAt: string;
  lastModified: string;
  deliverables: {
    plan: boolean;
    architecture: boolean;
    wireframes: boolean;
    design: boolean;
    backend: boolean;
    devops: boolean;
    documentation: boolean;
  };
}

interface ProjectListProps {
  projects: Project[];
  onExportProject: (projectId: string, projectName: string) => void;
  onDeleteProject: (projectId: string) => void;
  onGenerateDeliverable: (projectId: string, deliverableType: string, projectDescription: string) => void;
  getStatusBadge: (status: Project["status"]) => JSX.Element;
}

export default function ProjectList({ 
  projects, 
  onExportProject, 
  onDeleteProject, 
  onGenerateDeliverable, 
  getStatusBadge 
}: ProjectListProps) {
  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project}
          onExportProject={onExportProject}
          onDeleteProject={onDeleteProject}
          onGenerateDeliverable={onGenerateDeliverable}
          getStatusBadge={getStatusBadge}
        />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onExportProject: (projectId: string, projectName: string) => void;
  onDeleteProject: (projectId: string) => void;
  onGenerateDeliverable: (projectId: string, deliverableType: string, projectDescription: string) => void;
  getStatusBadge: (status: Project["status"]) => JSX.Element;
}

function ProjectCard({ 
  project, 
  onExportProject, 
  onDeleteProject, 
  onGenerateDeliverable, 
  getStatusBadge 
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{project.title}</span>
                {getStatusBadge(project.status)}
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Éditer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onExportProject(project.id, project.title)}
              >
                <Download className="w-4 h-4 mr-1" />
                Exporter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDeleteProject(project.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
            </div>
            
            <DeliverablesGrid deliverables={project.deliverables} />
            
            <ProjectActions 
              project={project}
              onGenerateDeliverable={onGenerateDeliverable}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface DeliverablesGridProps {
  deliverables: Project["deliverables"];
}

function DeliverablesGrid({ deliverables }: DeliverablesGridProps) {
  return (
    <div>
      <h4 className="font-medium mb-2">Livrables</h4>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(deliverables).map(([key, value]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            className={`p-2 rounded text-center text-sm ${
              value 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {key}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface ProjectActionsProps {
  project: Project;
  onGenerateDeliverable: (projectId: string, deliverableType: string, projectDescription: string) => void;
}

function ProjectActions({ project, onGenerateDeliverable }: ProjectActionsProps) {
  const missingDeliverables = Object.entries(project.deliverables)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        Créé: {project.createdAt} | Modifié: {project.lastModified}
      </div>
      <div className="flex space-x-2">
        {missingDeliverables.map((deliverable) => (
          <Button
            key={deliverable}
            variant="outline"
            size="sm"
            onClick={() => onGenerateDeliverable(project.id, deliverable, project.description)}
          >
            Générer {deliverable}
          </Button>
        ))}
      </div>
    </div>
  );
}

// Recent Projects List Component
interface RecentProjectsProps {
  projects: Project[];
  getStatusBadge: (status: Project["status"]) => JSX.Element;
}

export function RecentProjects({ projects, getStatusBadge }: RecentProjectsProps) {
  return (
    <div className="space-y-4">
      {projects.slice(0, 3).map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white"
              whileHover={{ rotate: 10 }}
            >
              <FolderOpen className="w-5 h-5" />
            </motion.div>
            <div>
              <h4 className="font-medium">{project.title}</h4>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {getStatusBadge(project.status)}
            <Progress value={project.progress} className="w-24" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}