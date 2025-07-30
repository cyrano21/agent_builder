import { db } from './db';
import { rbacService } from './rbac-service';
import { TeamRole, UserRole } from '@prisma/client';

export interface ProjectShare {
  id: string;
  projectId: string;
  sharedById: string;
  sharedWithId: string;
  accessLevel: 'VIEW' | 'EDIT' | 'ADMIN';
  createdAt: Date;
  expiresAt?: Date;
}

export interface ShareSettings {
  allowDownload: boolean;
  allowComments: boolean;
  allowFork: boolean;
  requireApproval: boolean;
}

export class ProjectSharingService {
  async shareProject(
    projectId: string,
    ownerId: string,
    targetUserId: string,
    accessLevel: 'VIEW' | 'EDIT' | 'ADMIN',
    settings?: Partial<ShareSettings>,
    expiresAt?: Date
  ): Promise<ProjectShare> {
    // Check if owner has permission to share
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { user: true }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== ownerId) {
      throw new Error('Only project owner can share the project');
    }

    // Check if already shared
    const existingShare = await db.projectShare.findFirst({
      where: {
        projectId,
        sharedWithId: targetUserId
      }
    });

    if (existingShare) {
      // Update existing share
      return db.projectShare.update({
        where: { id: existingShare.id },
        data: {
          accessLevel,
          expiresAt,
          settings: settings || {}
        }
      });
    }

    // Create new share
    return db.projectShare.create({
      data: {
        projectId,
        sharedById: ownerId,
        sharedWithId: targetUserId,
        accessLevel,
        expiresAt,
        settings: settings || {}
      }
    });
  }

  async getSharedProjects(userId: string): Promise<any[]> {
    const shares = await db.projectShare.findMany({
      where: {
        sharedWithId: userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            _count: {
              select: {
                deliverables: true
              }
            }
          }
        },
        sharedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' as const }
    });

    return shares.map(share => ({
      ...share.project,
      sharedBy: share.sharedBy,
      accessLevel: share.accessLevel,
      sharedAt: share.createdAt,
      expiresAt: share.expiresAt,
      settings: share.settings
    }));
  }

  async revokeShare(projectId: string, shareId: string, userId: string): Promise<void> {
    const share = await db.projectShare.findUnique({
      where: { id: shareId },
      include: { project: true }
    });

    if (!share) {
      throw new Error('Share not found');
    }

    // Check if user has permission to revoke
    if (share.project.userId !== userId && share.sharedById !== userId) {
      throw new Error('You do not have permission to revoke this share');
    }

    await db.projectShare.delete({
      where: { id: shareId }
    });
  }

  async updateShareSettings(
    shareId: string,
    userId: string,
    settings: Partial<ShareSettings>
  ): Promise<void> {
    const share = await db.projectShare.findUnique({
      where: { id: shareId },
      include: { project: true }
    });

    if (!share) {
      throw new Error('Share not found');
    }

    // Check if user has permission to update
    if (share.project.userId !== userId && share.sharedById !== userId) {
      throw new Error('You do not have permission to update share settings');
    }

    await db.projectShare.update({
      where: { id: shareId },
      data: { settings }
    });
  }

  async canAccessProject(projectId: string, userId: string): Promise<{
    hasAccess: boolean;
    accessLevel?: 'VIEW' | 'EDIT' | 'ADMIN';
    isOwner: boolean;
  }> {
    // Check if user is owner
    const project = await db.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return { hasAccess: false, isOwner: false };
    }

    if (project.userId === userId) {
      return { hasAccess: true, accessLevel: 'ADMIN', isOwner: true };
    }

    // Check if project is shared with user
    const share = await db.projectShare.findFirst({
      where: {
        projectId,
        sharedWithId: userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });

    if (share) {
      return {
        hasAccess: true,
        accessLevel: share.accessLevel,
        isOwner: false
      };
    }

    // Check team access
    const teamMember = await db.teamMember.findFirst({
      where: {
        user: {
          projects: {
            some: { id: projectId }
          }
        }
      }
    });

    if (teamMember) {
      return {
        hasAccess: true,
        accessLevel: teamMember.role === 'VIEWER' ? 'VIEW' : 
                 teamMember.role === 'MEMBER' ? 'EDIT' : 'ADMIN',
        isOwner: false
      };
    }

    return { hasAccess: false, isOwner: false };
  }
}

export const projectSharingService = new ProjectSharingService();