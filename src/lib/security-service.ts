import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// CSRF Protection
export class CSRFService {
  private static readonly CSRF_TOKEN_LENGTH = 32
  private static readonly CSRF_HEADER_NAME = "X-CSRF-Token"
  private static readonly CSRF_COOKIE_NAME = "csrf-token"

  /**
   * Generate a random CSRF token
   */
  static generateToken(): string {
    const array = new Uint8Array(this.CSRF_TOKEN_LENGTH)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("")
  }

  /**
   * Validate CSRF token
   */
  static validateToken(request: NextRequest): boolean {
    const tokenFromHeader = request.headers.get(this.CSRF_HEADER_NAME)
    const tokenFromCookie = request.cookies.get(this.CSRF_COOKIE_NAME)?.value

    if (!tokenFromHeader || !tokenFromCookie) {
      return false
    }

    return tokenFromHeader === tokenFromCookie
  }

  /**
   * Set CSRF token in response cookie
   */
  static setTokenCookie(response: NextResponse, token: string): void {
    response.cookies.set(this.CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600 // 1 hour
    })
  }

  /**
   * Get CSRF token from request
   */
  static getTokenFromRequest(request: NextRequest): string | null {
    return request.cookies.get(this.CSRF_COOKIE_NAME)?.value || null
  }
}

// Input Validation Schemas
export const validationSchemas = {
  // User validation
  user: {
    register: z.object({
      name: z.string().min(2).max(50),
      email: z.string().email(),
      password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
    }),

    login: z.object({
      email: z.string().email(),
      password: z.string().min(1)
    }),

    updateProfile: z.object({
      name: z.string().min(2).max(50).optional(),
      bio: z.string().max(500).optional(),
      avatar: z.string().url().optional()
    }),

    changePassword: z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/,
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
    })
  },

  // Project validation
  project: {
    create: z.object({
      title: z.string().min(3).max(100),
      description: z.string().min(10).max(1000),
      templateId: z.string().optional(),
      teamId: z.string().optional()
    }),

    update: z.object({
      title: z.string().min(3).max(100).optional(),
      description: z.string().min(10).max(1000).optional(),
      status: z.enum(["DRAFT", "GENERATING", "COMPLETED", "FAILED"]).optional(),
      progress: z.number().min(0).max(100).optional()
    }),

    generateDeliverable: z.object({
      deliverableType: z.enum(["PLAN", "ARCHITECTURE", "WIREFRAMES", "DESIGN", "BACKEND", "DEVOPS", "DOCUMENTATION"]),
      idea: z.string().min(10),
      modelId: z.string().optional()
    })
  },

  // Team validation
  team: {
    create: z.object({
      name: z.string().min(3).max(50),
      description: z.string().max(500).optional(),
      maxMembers: z.number().min(2).max(100).optional()
    }),

    inviteMember: z.object({
      email: z.string().email(),
      role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"])
    }),

    updateMemberRole: z.object({
      memberId: z.string(),
      role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"])
    })
  },

  // Template validation
  template: {
    create: z.object({
      name: z.string().min(3).max(100),
      description: z.string().min(10).max(1000),
      category: z.string().min(2).max(50),
      structure: z.record(z.any()),
      dependencies: z.record(z.any()),
      config: z.record(z.any()),
      recommendedModels: z.array(z.string())
    })
  },

  // Comment validation
  comment: {
    create: z.object({
      projectId: z.string(),
      content: z.string().min(1).max(2000),
      parentId: z.string().optional(),
      deliverableType: z.enum(["PLAN", "ARCHITECTURE", "WIREFRAMES", "DESIGN", "BACKEND", "DEVOPS", "DOCUMENTATION"]).optional()
    })
  }
}

// Security Middleware
export class SecurityService {
  /**
   * Validate and sanitize input data
   */
  static validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => 
          `${err.path.join(".")}: ${err.message}`
        ).join(", ")
        throw new Error(`Validation error: ${errorMessage}`)
      }
      throw error
    }
  }

  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(html: string): string {
    // Simple HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
  }

  /**
   * Check for SQL injection patterns
   */
  static detectSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|WHERE)(\s|$)/i,
      /(\s|^)(OR|AND)\s+\d+\s*=\s*\d+/i,
      /(\s|^)(OR|AND)\s+\d+\s*>\s*\d+/i,
      /(\s|^)(OR|AND)\s+\d+\s*<\s*\d+/i,
      /['"]\s*OR\s*['"]\d['"]\s*=\s*['"]\d['"]/i,
      /['"]\s*AND\s*['"]\d['"]\s*=\s*['"]\d['"]/i,
      /;\s*(DROP|DELETE|UPDATE)/i,
      /\/\*.*\*\//i,
      /--.*$/i
    ]

    return sqlPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Check for NoSQL injection patterns
   */
  static detectNoSqlInjection(input: string): boolean {
    const nosqlPatterns = [
      /\$where/i,
      /\$ne/i,
      /\$gt/i,
      /\$lt/i,
      /\$regex/i,
      /\$exists/i,
      /javascript\s*:/i,
      /document\./i,
      /db\./i
    ]

    return nosqlPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Check for XSS patterns
   */
  static detectXss(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<applet/i,
      /<meta/i,
      /<link/i,
      /<base/i,
      /<style/i,
      /expression\s*\(/i,
      /vbscript:/i,
      /data:\s*text\/html/i
    ]

    return xssPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Security headers for API responses
   */
  static getSecurityHeaders(): Record<string, string> {
    return {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
    }
  }

  /**
   * Rate limiting configuration
   */
  static getRateLimitConfig(endpoint: string): {
    windowMs: number
    max: number
    message: string
  } {
    const configs: Record<string, any> = {
      "/api/auth/login": { windowMs: 900000, max: 5, message: "Too many login attempts" },
      "/api/auth/register": { windowMs: 900000, max: 3, message: "Too many registration attempts" },
      "/api/projects": { windowMs: 3600000, max: 100, message: "Too many project creation attempts" },
      "/api/generate": { windowMs: 3600000, max: 50, message: "Too many generation requests" },
      "default": { windowMs: 900000, max: 100, message: "Too many requests" }
    }

    return configs[endpoint] || configs.default
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(file: File, options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}): { valid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = [],
      allowedExtensions = []
    } = options

    // Check file size
    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds maximum limit of ${maxSize} bytes` }
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type ${file.type} is not allowed` }
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (!extension || !allowedExtensions.includes(extension)) {
        return { valid: false, error: `File extension .${extension} is not allowed` }
      }
    }

    return { valid: true }
  }
}

// Helper function to create secure API response
export function createSecureResponse(
  data: any,
  status: number = 200,
  headers: Record<string, string> = {}
): NextResponse {
  const securityHeaders = SecurityService.getSecurityHeaders()
  
  return NextResponse.json(data, {
    status,
    headers: { ...securityHeaders, ...headers }
  })
}

// Helper function to handle API errors securely
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)
  
  if (error instanceof Error) {
    // Don't expose internal error details to client
    const message = error.message.includes("Validation error") 
      ? error.message 
      : "Internal server error"
    
    return createSecureResponse(
      { error: message },
      error.message.includes("Validation error") ? 400 : 500
    )
  }
  
  return createSecureResponse({ error: "Internal server error" }, 500)
}