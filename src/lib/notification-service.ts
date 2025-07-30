import { db } from './db';
import { NotificationType } from '@prisma/client';

export interface NotificationData {
  projectId?: string;
  teamId?: string;
  commentId?: string;
  userId?: string;
  [key: string]: any;
}

export class NotificationService {
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: NotificationData
  ): Promise<void> {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || {}
      }
    });
  }

  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' as const },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return notifications;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await db.notification.updateMany({
      where: {
        id: notificationId,
        userId
      },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await db.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await db.notification.deleteMany({
      where: {
        id: notificationId,
        userId
      }
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return db.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  // Convenience methods for common notification types
  async notifyProjectCompleted(projectId: string, userId: string, projectName: string): Promise<void> {
    await this.createNotification(
      userId,
      'PROJECT_COMPLETED',
      'Project Completed',
      `Your project "${projectName}" has been completed successfully!`,
      { projectId }
    );
  }

  async notifyProjectFailed(projectId: string, userId: string, projectName: string): Promise<void> {
    await this.createNotification(
      userId,
      'PROJECT_FAILED',
      'Project Generation Failed',
      `There was an issue generating your project "${projectName}". Please check the details.`,
      { projectId }
    );
  }

  async notifyTeamInvitation(teamId: string, userId: string, teamName: string, inviterName: string): Promise<void> {
    await this.createNotification(
      userId,
      'TEAM_INVITATION',
      'Team Invitation',
      `${inviterName} has invited you to join the team "${teamName}"`,
      { teamId }
    );
  }

  async notifyCommentAdded(projectId: string, userId: string, projectName: string, commenterName: string): Promise<void> {
    await this.createNotification(
      userId,
      'COMMENT_ADDED',
      'New Comment',
      `${commenterName} commented on your project "${projectName}"`,
      { projectId }
    );
  }

  async notifyProjectShared(projectId: string, userId: string, projectName: string, sharerName: string): Promise<void> {
    await this.createNotification(
      userId,
      'PROJECT_SHARED',
      'Project Shared',
      `${sharerName} has shared a project "${projectName}" with you`,
      { projectId }
    );
  }

  async notifyBillingUpdate(userId: string, message: string): Promise<void> {
    await this.createNotification(
      userId,
      'BILLING_UPDATE',
      'Billing Update',
      message
    );
  }

  async notifySystemUpdate(userId: string, message: string): Promise<void> {
    await this.createNotification(
      userId,
      'SYSTEM_UPDATE',
      'System Update',
      message
    );
  }

  // Batch notifications
  async notifyTeamMembers(
    teamId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: NotificationData,
    excludeUserId?: string
  ): Promise<void> {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });

    if (!team) return;

    const notifications = team.members
      .filter(member => member.userId !== excludeUserId)
      .map(member => ({
        userId: member.userId,
        type,
        title,
        message,
        data: { ...data, teamId }
      }));

    if (notifications.length > 0) {
      await db.notification.createMany({
        data: notifications
      });
    }
  }

  // Cleanup old notifications
  async cleanupOldNotifications(daysOld: number = 90): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await db.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        isRead: true
      }
    });
  }

  // Get notification statistics
  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    recent: any[];
  }> {
    const [total, unread, byTypeData, recent] = await Promise.all([
      db.notification.count({ where: { userId } }),
      this.getUnreadCount(userId),
      db.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true }
      }),
      this.getUserNotifications(userId, 10)
    ]);

    const byType = byTypeData.reduce((acc, item) => {
      acc[item.type as NotificationType] = item._count.type;
      return acc;
    }, {} as Record<NotificationType, number>);

    return {
      total,
      unread,
      byType,
      recent
    };
  }
}

export const notificationService = new NotificationService();