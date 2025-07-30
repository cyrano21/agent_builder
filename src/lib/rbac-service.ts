import { UserRole, TeamRole } from "@prisma/client"

export interface Permission {
  resource: string
  action: "create" | "read" | "update" | "delete" | "manage"
}

export interface RolePermissions {
  role: UserRole | TeamRole
  permissions: Permission[]
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  // User role permissions
  {
    role: "USER",
    permissions: [
      { resource: "projects", action: "create" },
      { resource: "projects", action: "read" },
      { resource: "projects", action: "update" },
      { resource: "projects", action: "delete" },
      { resource: "profile", action: "read" },
      { resource: "profile", action: "update" },
      { resource: "settings", action: "read" },
      { resource: "settings", action: "update" },
    ]
  },
  
  // Admin role permissions
  {
    role: "ADMIN",
    permissions: [
      { resource: "projects", action: "create" },
      { resource: "projects", action: "read" },
      { resource: "projects", action: "update" },
      { resource: "projects", action: "delete" },
      { resource: "projects", action: "manage" },
      { resource: "users", action: "read" },
      { resource: "users", action: "update" },
      { resource: "teams", action: "create" },
      { resource: "teams", action: "read" },
      { resource: "teams", action: "update" },
      { resource: "teams", action: "delete" },
      { resource: "profile", action: "read" },
      { resource: "profile", action: "update" },
      { resource: "settings", action: "read" },
      { resource: "settings", action: "update" },
      { resource: "billing", action: "read" },
      { resource: "billing", action: "update" },
    ]
  },
  
  // Super Admin role permissions
  {
    role: "SUPER_ADMIN",
    permissions: [
      { resource: "*", action: "*" }, // Full access
    ]
  },
  
  // Team role permissions
  {
    role: "OWNER",
    permissions: [
      { resource: "team_projects", action: "create" },
      { resource: "team_projects", action: "read" },
      { resource: "team_projects", action: "update" },
      { resource: "team_projects", action: "delete" },
      { resource: "team_projects", action: "manage" },
      { resource: "team_members", action: "create" },
      { resource: "team_members", action: "read" },
      { resource: "team_members", action: "update" },
      { resource: "team_members", action: "delete" },
      { resource: "team_settings", action: "read" },
      { resource: "team_settings", action: "update" },
    ]
  },
  
  {
    role: "ADMIN",
    permissions: [
      { resource: "team_projects", action: "create" },
      { resource: "team_projects", action: "read" },
      { resource: "team_projects", action: "update" },
      { resource: "team_projects", action: "delete" },
      { resource: "team_members", action: "read" },
      { resource: "team_members", action: "update" },
      { resource: "team_settings", action: "read" },
    ]
  },
  
  {
    role: "MEMBER",
    permissions: [
      { resource: "team_projects", action: "create" },
      { resource: "team_projects", action: "read" },
      { resource: "team_projects", action: "update" },
      { resource: "team_members", action: "read" },
    ]
  },
  
  {
    role: "VIEWER",
    permissions: [
      { resource: "team_projects", action: "read" },
      { resource: "team_members", action: "read" },
    ]
  }
]

export class RBACService {
  /**
   * Check if a user has permission for a specific action on a resource
   */
  hasPermission(
    userRole: UserRole | TeamRole,
    resource: string,
    action: string,
    isTeamContext: boolean = false
  ): boolean {
    const roleConfig = ROLE_PERMISSIONS.find(rp => rp.role === userRole)
    
    if (!roleConfig) {
      return false
    }

    return roleConfig.permissions.some(permission => {
      // Wildcard permissions
      if (permission.resource === "*" && permission.action === "*") {
        return true
      }
      
      if (permission.resource === "*" && permission.action === action) {
        return true
      }
      
      if (permission.resource === resource && permission.action === "*") {
        return true
      }
      
      // Exact match
      return permission.resource === resource && permission.action === action
    })
  }

  /**
   * Check if user can access a specific project
   */
  canAccessProject(
    userRole: UserRole,
    teamRole: TeamRole | null,
    projectOwnerId: string,
    currentUserId: string,
    isTeamProject: boolean
  ): boolean {
    // Super admin can access everything
    if (userRole === "SUPER_ADMIN") {
      return true
    }

    // User can access their own projects
    if (projectOwnerId === currentUserId) {
      return true
    }

    // Team project access based on team role
    if (isTeamProject && teamRole) {
      return this.hasPermission(teamRole, "team_projects", "read", true)
    }

    // Admin can access all projects
    if (userRole === "ADMIN") {
      return true
    }

    return false
  }

  /**
   * Check if user can modify a project
   */
  canModifyProject(
    userRole: UserRole,
    teamRole: TeamRole | null,
    projectOwnerId: string,
    currentUserId: string,
    isTeamProject: boolean
  ): boolean {
    // Super admin can modify everything
    if (userRole === "SUPER_ADMIN") {
      return true
    }

    // User can modify their own projects
    if (projectOwnerId === currentUserId) {
      return this.hasPermission(userRole, "projects", "update")
    }

    // Team project modification based on team role
    if (isTeamProject && teamRole) {
      return this.hasPermission(teamRole, "team_projects", "update", true)
    }

    // Admin can modify all projects
    if (userRole === "ADMIN") {
      return true
    }

    return false
  }

  /**
   * Check if user can delete a project
   */
  canDeleteProject(
    userRole: UserRole,
    teamRole: TeamRole | null,
    projectOwnerId: string,
    currentUserId: string,
    isTeamProject: boolean
  ): boolean {
    // Super admin can delete everything
    if (userRole === "SUPER_ADMIN") {
      return true
    }

    // User can delete their own projects
    if (projectOwnerId === currentUserId) {
      return this.hasPermission(userRole, "projects", "delete")
    }

    // Team project deletion based on team role
    if (isTeamProject && teamRole) {
      return this.hasPermission(teamRole, "team_projects", "delete", true)
    }

    // Admin can delete all projects
    if (userRole === "ADMIN") {
      return true
    }

    return false
  }

  /**
   * Check if user can manage team members
   */
  canManageTeamMembers(userRole: UserRole, teamRole: TeamRole | null): boolean {
    if (userRole === "SUPER_ADMIN") {
      return true
    }

    if (teamRole && (teamRole === "OWNER" || teamRole === "ADMIN")) {
      return this.hasPermission(teamRole, "team_members", "manage", true)
    }

    return false
  }

  /**
   * Check if user can access admin panel
   */
  canAccessAdminPanel(userRole: UserRole): boolean {
    return userRole === "ADMIN" || userRole === "SUPER_ADMIN"
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(role: UserRole | TeamRole): Permission[] {
    const roleConfig = ROLE_PERMISSIONS.find(rp => rp.role === role)
    return roleConfig?.permissions || []
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(
    userRole: UserRole | TeamRole,
    permissions: Array<{ resource: string; action: string }>,
    isTeamContext: boolean = false
  ): boolean {
    return permissions.some(permission =>
      this.hasPermission(userRole, permission.resource, permission.action, isTeamContext)
    )
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(
    userRole: UserRole | TeamRole,
    permissions: Array<{ resource: string; action: string }>,
    isTeamContext: boolean = false
  ): boolean {
    return permissions.every(permission =>
      this.hasPermission(userRole, permission.resource, permission.action, isTeamContext)
    )
  }
}

export const rbacService = new RBACService()