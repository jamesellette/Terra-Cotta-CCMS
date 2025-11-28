export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  roles: string[]
  status: 'active' | 'inactive' | 'invited'
  mfaEnabled: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  category: PermissionCategory
  action: PermissionAction
  resource: string
  description: string
}

export type PermissionCategory = 
  | 'content'
  | 'commerce'
  | 'analytics'
  | 'users'
  | 'system'

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'publish'
  | 'manage'

export interface Session {
  id: string
  userId: string
  device: string
  browser: string
  os: string
  location?: string
  ip: string
  status: 'active' | 'expired'
  lastActivity: string
  expiresAt: string
  createdAt: string
}

export interface ApiKey {
  id: string
  name: string
  key?: string
  scopes: string[]
  status: 'active' | 'revoked'
  lastUsed?: string
  expiresAt?: string
  createdAt: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: AuditResourceType
  resourceId?: string
  details: Record<string, unknown>
  severity: 'info' | 'warning' | 'error' | 'critical'
  ip: string
  userAgent: string
  timestamp: string
}

export type AuditResourceType =
  | 'user'
  | 'role'
  | 'content'
  | 'product'
  | 'order'
  | 'session'
  | 'api_key'
  | 'settings'

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventCommonPasswords: boolean
  expiryDays: number
  historyCount: number
  maxAttempts: number
  lockoutDuration: number
  mfaRequired: 'all' | 'admins' | 'none'
  mfaMethods: ('authenticator' | 'sms' | 'email')[]
  mfaGracePeriod: number
}
