import { db } from './db';
import { rbacService } from './rbac-service';
import { TeamRole, UserRole } from '@prisma/client';

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  maxMembers: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: TeamMember[];
  projects: any[];
  _count: {
    members: number;
    projects: number;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  maxMembers?: number;
  isPublic?: boolean;
}

export interface InviteMemberData {
  email: string;
  role: TeamRole;
}

export class TeamService {
  async createTeam(data: CreateTeamData, ownerId: string): Promise<Team> {
    const team = await db.team.create({
      data: {
        name: data.name,
        description: data.description,
        maxMembers: data.maxMembers || 10,
        isPublic: data.isPublic || false,
        owner: {
          connect: { id: ownerId }
        },
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER'
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        projects: true,
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    });

    return team;
  }

  async getTeamById(teamId: string, userId?: string): Promise<Team | null> {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        projects: {
          include: {
            _count: {
              select: {
                deliverables: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    });

    if (!team) {
      return null;
    }

    // Check if user has access to this team
    if (userId) {
      const hasAccess = await this.canAccessTeam(teamId, userId);
      if (!hasAccess) {
        return null;
      }
    }

    return team;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const teams = await db.team.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        projects: true,
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' as const }
    });

    return teams;
  }

  async getPublicTeams(limit: number = 20, offset: number = 0): Promise<Team[]> {
    const teams = await db.team.findMany({
      where: { isPublic: true },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          take: 5,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' as const }
    });

    return teams;
  }

  async inviteMember(teamId: string, inviterId: string, inviteData: InviteMemberData): Promise<void> {
    // Check if inviter has permission to invite members
    const team = await this.getTeamById(teamId, inviterId);
    if (!team) {
      throw new Error('Team not found');
    }

    const memberRole = team.members.find(m => m.userId === inviterId)?.role;
    if (!memberRole || !rbacService.canManageTeamMembers('USER' as UserRole, memberRole)) {
      throw new Error('You do not have permission to invite members to this team');
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      throw new Error('Team is full');
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: inviteData.email }
    });

    if (existingUser) {
      // Check if user is already a member
      const existingMember = team.members.find(m => m.userId === existingUser.id);
      if (existingMember) {
        throw new Error('User is already a member of this team');
      }

      // Add existing user to team
      await db.teamMember.create({
        data: {
          teamId,
          userId: existingUser.id,
          role: inviteData.role
        }
      });
    } else {
      // Create invitation for new user (in a real app, this would send an email)
      await db.teamMember.create({
        data: {
          teamId,
          userId: 'pending', // Would be replaced with actual user ID after registration
          role: inviteData.role
        }
      });
    }
  }

  async updateMemberRole(teamId: string, memberId: string, newRole: TeamRole, updaterId: string): Promise<void> {
    // Check if updater has permission
    const team = await this.getTeamById(teamId, updaterId);
    if (!team) {
      throw new Error('Team not found');
    }

    const updaterRole = team.members.find(m => m.userId === updaterId)?.role;
    if (!updaterRole || !rbacService.canManageTeamMembers('USER' as UserRole, updaterRole)) {
      throw new Error('You do not have permission to update member roles');
    }

    // Update member role
    await db.teamMember.update({
      where: { id: memberId },
      data: { role: newRole }
    });
  }

  async removeMember(teamId: string, memberId: string, removerId: string): Promise<void> {
    // Check if remover has permission
    const team = await this.getTeamById(teamId, removerId);
    if (!team) {
      throw new Error('Team not found');
    }

    const removerRole = team.members.find(m => m.userId === removerId)?.role;
    if (!removerRole || !rbacService.canManageTeamMembers('USER' as UserRole, removerRole)) {
      throw new Error('You do not have permission to remove members from this team');
    }

    // Cannot remove the last owner
    const memberToRemove = team.members.find(m => m.id === memberId);
    if (!memberToRemove) {
      throw new Error('Member not found');
    }

    if (memberToRemove.role === 'OWNER') {
      const ownerCount = team.members.filter(m => m.role === 'OWNER').length;
      if (ownerCount <= 1) {
        throw new Error('Cannot remove the last owner of the team');
      }
    }

    // Remove member
    await db.teamMember.delete({
      where: { id: memberId }
    });
  }

  async leaveTeam(teamId: string, userId: string): Promise<void> {
    const team = await this.getTeamById(teamId, userId);
    if (!team) {
      throw new Error('Team not found');
    }

    const member = team.members.find(m => m.userId === userId);
    if (!member) {
      throw new Error('You are not a member of this team');
    }

    // Cannot leave if you're the last owner
    if (member.role === 'OWNER') {
      const ownerCount = team.members.filter(m => m.role === 'OWNER').length;
      if (ownerCount <= 1) {
        throw new Error('Cannot leave team as the last owner. Please transfer ownership first.');
      }
    }

    // Remove member
    await db.teamMember.delete({
      where: { id: member.id }
    });
  }

  async updateTeam(teamId: string, updateData: Partial<CreateTeamData>, updaterId: string): Promise<Team> {
    // Check if updater has permission
    const team = await this.getTeamById(teamId, updaterId);
    if (!team) {
      throw new Error('Team not found');
    }

    const memberRole = team.members.find(m => m.userId === updaterId)?.role;
    if (!memberRole || !rbacService.hasPermission(memberRole, 'team_settings', 'update', true)) {
      throw new Error('You do not have permission to update this team');
    }

    const updatedTeam = await db.team.update({
      where: { id: teamId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        projects: true,
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    });

    return updatedTeam;
  }

  async deleteTeam(teamId: string, deleterId: string): Promise<void> {
    // Check if deleter has permission
    const team = await this.getTeamById(teamId, deleterId);
    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId !== deleterId) {
      throw new Error('Only team owner can delete the team');
    }

    // Delete team (this will cascade delete members and projects)
    await db.team.delete({
      where: { id: teamId }
    });
  }

  async canAccessTeam(teamId: string, userId: string): Promise<boolean> {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!team) {
      return false;
    }

    // Owner can always access
    if (team.ownerId === userId) {
      return true;
    }

    // Members can access
    if (team.members.length > 0) {
      return true;
    }

    // Public teams can be accessed by anyone (read-only)
    return team.isPublic;
  }

  async getTeamRole(teamId: string, userId: string): Promise<TeamRole | null> {
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId
      }
    });

    return member?.role || null;
  }

  async searchTeams(query: string, userId?: string): Promise<Team[]> {
    const teams = await db.team.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ]
          },
          {
            OR: [
              { isPublic: true },
              userId ? { ownerId: userId } : undefined,
              userId ? {
                members: {
                  some: { userId }
                }
              } : undefined
            ].filter(Boolean)
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          take: 5,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      },
      take: 20,
      orderBy: { updatedAt: 'desc' as const }
    });

    return teams;
  }

  async getTeamStats(teamId: string): Promise<{
    totalProjects: number;
    completedProjects: number;
    totalMembers: number;
    activeMembers: number;
    recentActivity: Date | null;
  }> {
    const [projects, members, activity] = await Promise.all([
      db.project.count({
        where: { teamId }
      }),
      db.teamMember.count({
        where: { teamId }
      }),
      db.project.findFirst({
        where: { teamId },
        orderBy: { updatedAt: 'desc' as const },
        select: { updatedAt: true }
      })
    ]);

    const completedProjects = await db.project.count({
      where: { 
        teamId,
        status: 'COMPLETED'
      }
    });

    return {
      totalProjects: projects,
      completedProjects,
      totalMembers: members,
      activeMembers: members, // Could be enhanced with actual activity tracking
      recentActivity: activity?.updatedAt || null
    };
  }
}

export const teamService = new TeamService();