import { Prisma } from '@prisma/client';
import { cache } from './cache';

// Database query optimization utilities
export class DBOptimizer {
  // Cache key generator for queries
  static generateCacheKey(model: string, operation: string, args: any): string {
    return `${model}:${operation}:${JSON.stringify(args)}`;
  }

  // Cached query wrapper
  static async cachedQuery<T>(
    model: string,
    operation: string,
    queryFn: () => Promise<T>,
    args: any,
    ttl: number = 300000 // 5 minutes default
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(model, operation, args);
    
    // Try to get from cache first
    const cached = cache.get<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Execute query and cache result
    const result = await queryFn();
    cache.set(cacheKey, result, ttl);
    
    return result;
  }

  // Optimized user queries
  static userQueries = {
    // Get user with all relations efficiently
    getUserWithRelations: (userId: string) => ({
      include: {
        settings: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' as const },
          take: 1
        },
        projects: {
          orderBy: { updatedAt: 'desc' as const },
          take: 5,
          include: {
            deliverables: {
              take: 3,
              orderBy: { createdAt: 'desc' as const }
            }
          }
        }
      }
    }),

    // Get user by email with minimal fields
    getUserByEmail: (email: string) => ({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true
      }
    }),

    // Get user settings only
    getUserSettings: (userId: string) => ({
      where: { userId },
      select: {
        primaryLLM: true,
        fallbackLLM: true,
        temperature: true,
        maxTokens: true,
        emailNotifications: true,
        projectCompleted: true,
        generationErrors: true,
        updates: true
      }
    })
  };

  // Optimized project queries
  static projectQueries = {
    // Get project with deliverables
    getProjectWithDeliverables: (projectId: string) => ({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        deliverables: {
          orderBy: { createdAt: 'desc' as const }
        }
      }
    }),

    // Get projects list with pagination
    getProjectsList: (userId: string, page: number, limit: number) => ({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' as const },
      include: {
        _count: {
          select: {
            deliverables: true
          }
        }
      }
    }),

    // Get project statistics
    getProjectStats: (userId: string) => ({
      where: { userId },
      select: {
        _count: {
          select: {
            _all: true,
            deliverables: true
          }
        },
        status: true
      }
    })
  };

  // Optimized subscription queries
  static subscriptionQueries = {
    // Get active subscription
    getActiveSubscription: (userId: string) => ({
      where: {
        userId,
        status: 'ACTIVE' as const
      },
      orderBy: {
        createdAt: 'desc' as const
      },
      take: 1
    }),

    // Get subscription with usage stats
    getSubscriptionWithUsage: (userId: string) => ({
      where: {
        userId,
        status: 'ACTIVE' as const
      },
      include: {
        user: {
          select: {
            _count: {
              select: {
                projects: true
              }
            }
          }
        }
      }
    })
  };

  // Batch query utilities
  static async batchGetUsers(userIds: string[]) {
    const chunks = this.chunkArray(userIds, 50); // Process in chunks of 50
    const results: any[] = [];

    for (const chunk of chunks) {
      const chunkResults = await db.user.findMany({
        where: {
          id: {
            in: chunk
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      });
      results.push(...chunkResults);
    }

    return results;
  }

  // Utility function to chunk arrays
  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Query performance monitoring
  static async monitorQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    threshold: number = 1000 // 1 second threshold
  ): Promise<T> {
    const start = performance.now();
    const result = await queryFn();
    const duration = performance.now() - start;

    if (duration > threshold) {
      console.warn(`Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      // Here you could send this to a monitoring service
    }

    return result;
  }

  // Optimized count queries
  static async getOptimizedCount(
    model: any,
    where: any,
    useCache: boolean = true
  ): Promise<number> {
    const cacheKey = `count:${model.name}:${JSON.stringify(where)}`;
    
    if (useCache) {
      const cached = cache.get<number>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    const count = await model.count({ where });
    
    if (useCache) {
      cache.set(cacheKey, count, 60000); // Cache counts for 1 minute
    }

    return count;
  }

  // Pagination helper with optimized queries
  static async getPaginatedResults<T>(
    model: any,
    options: {
      where?: any;
      orderBy?: any;
      page: number;
      limit: number;
      include?: any;
      select?: any;
    }
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { where, orderBy, page, limit, include, select } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      model.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include,
        select
      }),
      this.getOptimizedCount(model, where)
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

// Extended Prisma client with optimized methods
import { db } from './db';

export const optimizedDb = {
  // User methods
  users: {
    async findById(id: string) {
      return DBOptimizer.cachedQuery(
        'user',
        'findById',
        () => db.user.findUnique({
          where: { id },
          include: {
            settings: true,
            subscriptions: {
              orderBy: { createdAt: 'desc' as const },
              take: 1
            },
            projects: {
              orderBy: { updatedAt: 'desc' as const },
              take: 5,
              include: {
                deliverables: {
                  take: 3,
                  orderBy: { createdAt: 'desc' as const }
                }
              }
            }
          }
        }),
        { id }
      );
    },

    async findByEmail(email: string) {
      return DBOptimizer.cachedQuery(
        'user',
        'findByEmail',
        () => db.user.findUnique(DBOptimizer.userQueries.getUserByEmail(email)),
        { email }
      );
    },

    async getSettings(userId: string) {
      return DBOptimizer.cachedQuery(
        'userSettings',
        'getSettings',
        () => db.userSettings.findUnique(DBOptimizer.userQueries.getUserSettings(userId)),
        { userId }
      );
    }
  },

  // Project methods
  projects: {
    async findById(id: string) {
      return DBOptimizer.cachedQuery(
        'project',
        'findById',
        () => db.project.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            deliverables: {
              orderBy: { createdAt: 'desc' as const }
            }
          }
        }),
        { id }
      );
    },

    async findUserProjects(userId: string, page: number = 1, limit: number = 10) {
      return DBOptimizer.getPaginatedResults(db.project, {
        where: { userId },
        orderBy: { updatedAt: 'desc' as const },
        page,
        limit,
        include: {
          _count: {
            select: {
              deliverables: true
            }
          }
        }
      });
    },

    async getStats(userId: string) {
      return DBOptimizer.cachedQuery(
        'project',
        'getStats',
        () => db.project.findMany(DBOptimizer.projectQueries.getProjectStats(userId)),
        { userId },
        300000 // Cache for 5 minutes
      );
    }
  },

  // Subscription methods
  subscriptions: {
    async getActive(userId: string) {
      return DBOptimizer.cachedQuery(
        'subscription',
        'getActive',
        () => db.subscription.findFirst(DBOptimizer.subscriptionQueries.getActiveSubscription(userId)),
        { userId },
        60000 // Cache for 1 minute
      );
    },

    async getWithUsage(userId: string) {
      return DBOptimizer.cachedQuery(
        'subscription',
        'getWithUsage',
        () => db.subscription.findFirst(DBOptimizer.subscriptionQueries.getSubscriptionWithUsage(userId)),
        { userId },
        30000 // Cache for 30 seconds
      );
    }
  }
};