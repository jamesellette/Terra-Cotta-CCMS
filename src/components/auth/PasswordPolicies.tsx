import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle, XCircle, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventCommonPasswords: boolean
  preventUserInfo: boolean
  expiryDays: number
  historyCount: number
  maxAttempts: number
  lockoutDuration: number
}

const defaultPolicy: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfo: true,
  expiryDays: 90,
  historyCount: 5,
  maxAttempts: 5,
  lockoutDuration: 30
}

interface TwoFactorSettings {
  required: boolean
  requiredForAdmins: boolean
  allowedMethods: string[]
  gracePeriodDays: number
}

const defaultTwoFactor: TwoFactorSettings = {
  required: false,
  requiredForAdmins: true,
  allowedMethods: ['authenticator', 'sms', 'email'],
  gracePeriodDays: 7
}

export function PasswordPolicies() {
  const [policy, setPolicy] = useKV<PasswordPolicy>('auth-password-policy', defaultPolicy)
  const [twoFactor, setTwoFactor] = useKV<TwoFactorSettings>('auth-2fa-settings', defaultTwoFactor)
  const [testPassword, setTestPassword] = useState('')

  const handleSavePolicy = () => {
    toast.success('Password policy updated successfully')
  }

  const handleSave2FA = () => {
    toast.success('2FA settings updated successfully')
  }

  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    const currentPolicy = policy || defaultPolicy

    if (password.length < currentPolicy.minLength) {
      errors.push(`Must be at least ${currentPolicy.minLength} characters`)
    }
    if (currentPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Must contain uppercase letter')
    }
    if (currentPolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Must contain lowercase letter')
    }
    if (currentPolicy.requireNumbers && !/\d/.test(password)) {
      errors.push('Must contain number')
    }
    if (currentPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Must contain special character')
    }

    return { valid: errors.length === 0, errors }
  }

  const testResult = testPassword ? validatePassword(testPassword) : null

  const toggle2FAMethod = (method: string) => {
    setTwoFactor((current) => {
      const currentSettings = current || defaultTwoFactor
      const methods = [...currentSettings.allowedMethods]
      const index = methods.indexOf(method)
      if (index > -1) {
        if (methods.length > 1) {
          methods.splice(index, 1)
        } else {
          toast.error('At least one 2FA method must be enabled')
          return currentSettings
        }
      } else {
        methods.push(method)
      }
      return { ...currentSettings, allowedMethods: methods }
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Password Requirements</h3>
            <p className="text-sm text-muted-foreground">
              Define password complexity requirements for all users
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="minLength">Minimum Length: {(policy || defaultPolicy).minLength} characters</Label>
              </div>
              <Slider
                id="minLength"
                min={8}
                max={32}
                step={1}
                value={[(policy || defaultPolicy).minLength]}
                onValueChange={([value]) =>
                  setPolicy((current) => ({ ...(current || defaultPolicy), minLength: value }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Require Uppercase</Label>
                <Switch
                  id="uppercase"
                  checked={(policy || defaultPolicy).requireUppercase}
                  onCheckedChange={(checked) =>
                    setPolicy((current) => ({ ...(current || defaultPolicy), requireUppercase: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Require Lowercase</Label>
                <Switch
                  id="lowercase"
                  checked={(policy || defaultPolicy).requireLowercase}
                  onCheckedChange={(checked) =>
                    setPolicy((current) => ({ ...(current || defaultPolicy), requireLowercase: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Require Numbers</Label>
                <Switch
                  id="numbers"
                  checked={(policy || defaultPolicy).requireNumbers}
                  onCheckedChange={(checked) =>
                    setPolicy((current) => ({ ...(current || defaultPolicy), requireNumbers: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="special">Require Special Characters</Label>
                <Switch
                  id="special"
                  checked={(policy || defaultPolicy).requireSpecialChars}
                  onCheckedChange={(checked) =>
                    setPolicy((current) => ({ ...(current || defaultPolicy), requireSpecialChars: checked }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="common">Prevent Common Passwords</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Block commonly used passwords like "password123"
                  </p>
                </div>
                <Switch
                  id="common"
                  checked={(policy || defaultPolicy).preventCommonPasswords}
                  onCheckedChange={(checked) =>
                    setPolicy((current) => ({ ...(current || defaultPolicy), preventCommonPasswords: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="userinfo">Prevent User Information</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Block passwords containing user's name or email
                  </p>
                </div>
                <Switch
                  id="userinfo"
                  checked={(policy || defaultPolicy).preventUserInfo}
                  onCheckedChange={(checked) =>
                    setPolicy((current) => ({ ...(current || defaultPolicy), preventUserInfo: checked }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiry">Password Expiry (days)</Label>
                <Input
                  id="expiry"
                  type="number"
                  min={0}
                  value={(policy || defaultPolicy).expiryDays}
                  onChange={(e) =>
                    setPolicy((current) => ({
                      ...(current || defaultPolicy),
                      expiryDays: parseInt(e.target.value) || 0
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">0 = never expires</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="history">Password History</Label>
                <Input
                  id="history"
                  type="number"
                  min={0}
                  max={24}
                  value={(policy || defaultPolicy).historyCount}
                  onChange={(e) =>
                    setPolicy((current) => ({
                      ...(current || defaultPolicy),
                      historyCount: parseInt(e.target.value) || 0
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">Prevent reusing recent passwords</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Account Lockout</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Failed Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min={1}
                    max={10}
                    value={(policy || defaultPolicy).maxAttempts}
                    onChange={(e) =>
                      setPolicy((current) => ({
                        ...(current || defaultPolicy),
                        maxAttempts: parseInt(e.target.value) || 5
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockout">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockout"
                    type="number"
                    min={5}
                    max={1440}
                    value={(policy || defaultPolicy).lockoutDuration}
                    onChange={(e) =>
                      setPolicy((current) => ({
                        ...(current || defaultPolicy),
                        lockoutDuration: parseInt(e.target.value) || 30
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSavePolicy}>Save Password Policy</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Configure 2FA requirements and allowed methods
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa-required">Require 2FA for All Users</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  All users must enable 2FA to access the platform
                </p>
              </div>
              <Switch
                id="2fa-required"
                checked={(twoFactor || defaultTwoFactor).required}
                onCheckedChange={(checked) =>
                  setTwoFactor((current) => ({ ...(current || defaultTwoFactor), required: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa-admins">Require 2FA for Admins</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Admin users must always have 2FA enabled
                </p>
              </div>
              <Switch
                id="2fa-admins"
                checked={(twoFactor || defaultTwoFactor).requiredForAdmins}
                onCheckedChange={(checked) =>
                  setTwoFactor((current) => ({ ...(current || defaultTwoFactor), requiredForAdmins: checked }))
                }
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Allowed 2FA Methods</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Authenticator App</div>
                    <p className="text-xs text-muted-foreground">Google Authenticator, Authy, etc.</p>
                  </div>
                  <Switch
                    checked={(twoFactor || defaultTwoFactor).allowedMethods.includes('authenticator')}
                    onCheckedChange={() => toggle2FAMethod('authenticator')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">SMS</div>
                    <p className="text-xs text-muted-foreground">Text message verification codes</p>
                  </div>
                  <Switch
                    checked={(twoFactor || defaultTwoFactor).allowedMethods.includes('sms')}
                    onCheckedChange={() => toggle2FAMethod('sms')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Email</div>
                    <p className="text-xs text-muted-foreground">Email verification codes</p>
                  </div>
                  <Switch
                    checked={(twoFactor || defaultTwoFactor).allowedMethods.includes('email')}
                    onCheckedChange={() => toggle2FAMethod('email')}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grace">Grace Period (days)</Label>
              <Input
                id="grace"
                type="number"
                min={0}
                max={30}
                value={(twoFactor || defaultTwoFactor).gracePeriodDays}
                onChange={(e) =>
                  setTwoFactor((current) => ({
                    ...(current || defaultTwoFactor),
                    gracePeriodDays: parseInt(e.target.value) || 0
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Allow users this many days to set up 2FA after requirement is enabled
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave2FA}>Save 2FA Settings</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Test Password Policy</h3>
            <p className="text-sm text-muted-foreground">
              Check if a password meets the current requirements
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-password">Test Password</Label>
            <Input
              id="test-password"
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Enter a password to test..."
            />
          </div>

          {testResult && (
            <div className="space-y-2">
              {testResult.valid ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={20} weight="fill" className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Password meets all requirements
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle size={20} weight="fill" className="text-red-600" />
                    <span className="text-sm text-red-700 font-medium">
                      Password does not meet requirements
                    </span>
                  </div>
                  <ul className="space-y-1 pl-4">
                    {testResult.errors.map((error, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <XCircle size={14} className="text-red-600" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!testPassword && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Current Requirements:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>At least {(policy || defaultPolicy).minLength} characters</li>
                  {(policy || defaultPolicy).requireUppercase && <li>Contains uppercase letter</li>}
                  {(policy || defaultPolicy).requireLowercase && <li>Contains lowercase letter</li>}
                  {(policy || defaultPolicy).requireNumbers && <li>Contains number</li>}
                  {(policy || defaultPolicy).requireSpecialChars && <li>Contains special character</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
