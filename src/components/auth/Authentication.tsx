import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersManagement } from './UsersManagement'
import { RolesManagement } from './RolesManagement'
import { SessionsManagement } from './SessionsManagement'
import { AuditLogs } from './AuditLogs'
import { APIKeys } from './APIKeys'
import { PasswordPolicies } from './PasswordPolicies'
import { Shield, Users, Key, ClockCounterClockwise, ListChecks, LockKey } from '@phosphor-icons/react'

export function Authentication() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-teal flex items-center justify-center">
            <Shield size={24} weight="fill" className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Authentication & Authorization</h1>
            <p className="text-muted-foreground mt-1">Manage users, roles, permissions, and security</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="users" className="gap-2 py-3">
            <Users size={18} weight={activeTab === 'users' ? 'fill' : 'regular'} />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2 py-3">
            <Shield size={18} weight={activeTab === 'roles' ? 'fill' : 'regular'} />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2 py-3">
            <Key size={18} weight={activeTab === 'sessions' ? 'fill' : 'regular'} />
            <span className="hidden sm:inline">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-2 py-3">
            <LockKey size={18} weight={activeTab === 'api-keys' ? 'fill' : 'regular'} />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2 py-3">
            <ClockCounterClockwise size={18} weight={activeTab === 'audit' ? 'fill' : 'regular'} />
            <span className="hidden sm:inline">Audit Logs</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2 py-3">
            <ListChecks size={18} weight={activeTab === 'policies' ? 'fill' : 'regular'} />
            <span className="hidden sm:inline">Policies</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesManagement />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <SessionsManagement />
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <APIKeys />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <PasswordPolicies />
        </TabsContent>
      </Tabs>
    </div>
  )
}
