'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, Settings, DollarSign, Clock, Users } from 'lucide-react'
import { useRoles } from '@/hooks/useRoles'

interface BillingRule {
  id?: string
  name: string
  description: string
  rate: number
  type: 'hourly' | 'fixed' | 'percentage'
  isActive: boolean
}

interface BillingRate {
  id?: string
  roleId: string
  projectType: string
  hourlyRate: number
}

interface BillableSettings {
  rules: BillingRule[]
  rates: BillingRate[]
  autoBilling: boolean
  taxRate: number
  currency: string
}

export default function BillableSettingsPage() {
  const [settings, setSettings] = useState<BillableSettings>({
    rules: [],
    rates: [],
    autoBilling: false,
    taxRate: 0,
    currency: 'USD'
  })

  const [newRule, setNewRule] = useState<BillingRule>({
    name: '',
    description: '',
    rate: 0,
    type: 'hourly',
    isActive: true
  })

  const [newRate, setNewRate] = useState<BillingRate>({
    roleId: '',
    projectType: '',
    hourlyRate: 0
  })

  const { roles, loading: rolesLoading } = useRoles()

  // Get role names for billing rates
  const roleOptions = roles.map(role => ({
    value: role.name,
    label: role.display_name
  }))

  useEffect(() => {
    // Load settings from API
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/billable-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading billable settings:', error)
    }
  }

  const addRule = () => {
    if (!newRule.name || newRule.rate <= 0) return

    const rule: BillingRule = {
      ...newRule,
      id: Date.now().toString()
    }

    setSettings(prev => ({
      ...prev,
      rules: [...prev.rules, rule]
    }))

    setNewRule({
      name: '',
      description: '',
      rate: 0,
      type: 'hourly',
      isActive: true
    })
  }

  const removeRule = (id: string) => {
    setSettings(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== id)
    }))
  }

  const addRate = () => {
    if (!newRate.roleId || !newRate.projectType || newRate.hourlyRate <= 0) return

    const rate: BillingRate = {
      ...newRate,
      id: Date.now().toString()
    }

    setSettings(prev => ({
      ...prev,
      rates: [...prev.rates, rate]
    }))

    setNewRate({
      roleId: '',
      projectType: '',
      hourlyRate: 0
    })
  }

  const removeRate = (id: string) => {
    setSettings(prev => ({
      ...prev,
      rates: prev.rates.filter(rate => rate.id !== id)
    }))
  }

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/admin/billable-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billable Settings</h1>
          <p className="text-gray-600 mt-2">Configure billing rules, rates, and automation</p>
        </div>
        <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic billing configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={settings.currency} 
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autoBilling">Auto Billing</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoBilling"
                  checked={settings.autoBilling}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBilling: checked }))}
                />
                <span className="text-sm text-gray-600">Enable automatic billing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Rules</CardTitle>
          <CardDescription>Define custom billing rules and policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Overtime Rate"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ruleDescription">Description</Label>
              <Input
                id="ruleDescription"
                value={newRule.description}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                placeholder="1.5x rate for overtime"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ruleRate">Rate</Label>
              <Input
                id="ruleRate"
                type="number"
                value={newRule.rate}
                onChange={(e) => setNewRule(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                placeholder="1.5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ruleType">Type</Label>
              <Select 
                value={newRule.type} 
                onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as 'hourly' | 'fixed' | 'percentage' }))}
              >
                <option value="hourly">Hourly</option>
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ruleActive">Active</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ruleActive"
                  checked={newRule.isActive}
                  onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, isActive: checked }))}
                />
                <span className="text-sm text-gray-600">Enable rule</span>
              </div>
            </div>
          </div>
          
          <Button onClick={addRule} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rules */}
      {settings.rules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Rules</CardTitle>
            <CardDescription>Current billing rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {settings.rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rule.name}</span>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{rule.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rule.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rate: {rule.rate} {rule.type === 'percentage' ? '%' : rule.type === 'hourly' ? 'x' : ''}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeRule(rule.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Rates</CardTitle>
          <CardDescription>Set hourly rates for different roles and project types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="rateRole">Role</Label>
              <Select 
                value={newRate.roleId} 
                onChange={(e) => setNewRate(prev => ({ ...prev, roleId: e.target.value }))}
              >
                <option value="">Select role</option>
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rateProjectType">Project Type</Label>
              <Input
                id="rateProjectType"
                value={newRate.projectType}
                onChange={(e) => setNewRate(prev => ({ ...prev, projectType: e.target.value }))}
                placeholder="e.g., Web Development"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rateHourly">Hourly Rate ($)</Label>
              <Input
                id="rateHourly"
                type="number"
                value={newRate.hourlyRate}
                onChange={(e) => setNewRate(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                placeholder="75.00"
              />
            </div>
          </div>
          
          <Button onClick={addRate} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Rate
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rates */}
      {settings.rates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Rates</CardTitle>
            <CardDescription>Current billing rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {settings.rates.map((rate) => {
                const roleName = roleOptions.find(r => r.value === rate.roleId)?.label || rate.roleId
                return (
                  <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rate.projectType}</span>
                        <Badge variant="outline">{roleName}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${rate.hourlyRate}/hour
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRate(rate.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
