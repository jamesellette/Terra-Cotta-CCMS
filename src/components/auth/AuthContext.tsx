import { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  status: 'active' | 'inactive' | 'suspended'
  emailVerifiedAt?: string
  lastLoginAt?: string
  mfaEnabled: boolean
  roles: UserRole[]
  metadata: Record<string, any>
}

export interface UserRole {
  roleId: string
  roleName: string
  siteId?: string
  permissions: string[]
  grantedAt: string
}

export interface Session {
  id: string
  userId: string
  token: string
  ipAddress?: string
  userAgent?: string
  expiresAt: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (roleName: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useKV<User | null>('auth-user', null)
  const [session, setSession] = useKV<Session | null>('auth-session', null)

  const login = async (email: string, password: string) => {
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      firstName: 'Demo',
      lastName: 'User',
      status: 'active',
      mfaEnabled: false,
      lastLoginAt: new Date().toISOString(),
      roles: [
        {
          roleId: '1',
          roleName: 'Admin',
          permissions: ['*'],
          grantedAt: new Date().toISOString()
        }
      ],
      metadata: {}
    }

    const mockSession: Session = {
      id: crypto.randomUUID(),
      userId: mockUser.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    }

    setUser(mockUser)
    setSession(mockSession)
  }

  const logout = () => {
    setUser(null)
    setSession(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.roles.some(role => 
      role.permissions.includes('*') || role.permissions.includes(permission)
    )
  }

  const hasRole = (roleName: string): boolean => {
    if (!user) return false
    return user.roles.some(role => role.roleName === roleName)
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        session: session ?? null,
        isAuthenticated: !!user && !!session,
        login,
        logout,
        hasPermission,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
