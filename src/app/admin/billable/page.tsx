'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save, Download } from 'lucide-react'

interface BillableRule {
  id?: string
  type: string
  name: string
  condition: string
  value: string
  isBillable: boolean
}

interface BillingRate {
  id?: string
  roleId: string
  projectType: string
  hourlyRate: number
}

interface BillableSettings {
  default_hourly_rate: number
  overtime_multiplier: number
  holiday_multiplier: number
  rules: BillableRule[]
  rates: BillingRate[]
}

export default function BillableHoursPage() {
  const [settings, setSettings] = useState<BillableSettings>({
    default_hourly_rate: 50,
    overtime_multiplier: 1.5,
    holiday_multiplier: 2.0,
    rules: [],
    rates: []
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newRule, setNewRule] = useState<BillableRule>({
    type: 'role',
    name: '',
    condition: '',
    value: '',
    isBillable: true
  })
  
  const [newRate, setNewRate] = useState<BillingRate>({
    roleId: '',
    projectType: '',
    hourlyRate: 0
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/billable-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/billable-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        alert('Settings saved successfully!')
      } else {
        alert('Error saving settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const addRule = () => {
    if (newRule.name && newRule.condition && newRule.value) {
      setSettings(prev => ({
        ...prev,
        rules: [...prev.rules, { ...newRule, id: Date.now().toString() }]
      }))
      setNewRule({
        type: 'role',
        name: '',
        condition: '',
        value: '',
        isBillable: true
      })
    }
  }

  const removeRule = (id: string) => {
    setSettings(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== id)
    }))
  }

  const addRate = () => {
    if (newRate.roleId && newRate.projectType && newRate.hourlyRate > 0) {
      setSettings(prev => ({
        ...prev,
        rates: [...prev.rates, { ...newRate, id: Date.now().toString() }]
      }))
      setNewRate({
        roleId: '',
        projectType: '',
        hourlyRate: 0
      })
    }
  }

  const removeRate = (id: string) => {
    setSettings(prev => ({
      ...prev,
      rates: prev.rates.filter(rate => rate.id !== id)
    }))
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'billable-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billable Hours Settings</h1>
          <p className="text-muted-foreground">
            Configure billing rules, rates, and multipliers for your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
            <CardDescription>Default rates and multipliers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultRate">Default Hourly Rate ($)</Label>
              <Input
                id="defaultRate"
                type="number"
                value={settings.default_hourly_rate}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  default_hourly_rate: parseFloat(e.target.value) || 0
                }))}
                placeholder="50.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="overtimeMultiplier">Overtime Multiplier</Label>
              <Input
                id="overtimeMultiplier"
                type="number"
                step="0.1"
                value={settings.overtime_multiplier}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  overtime_multiplier: parseFloat(e.target.value) || 1.0
                }))}
                placeholder="1.5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="holidayMultiplier">Holiday Multiplier</Label>
              <Input
                id="holidayMultiplier"
                type="number"
                step="0.1"
                value={settings.holiday_multiplier}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  holiday_multiplier: parseFloat(e.target.value) || 2.0
                }))}
                placeholder="2.0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Rules</CardTitle>
            <CardDescription>Define when hours are billable</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="ruleType">Rule Type</Label>
                <Select 
                  value={newRule.type} 
                  onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="role">Role-based</option>
                  <option value="project_type">Project Type</option>
                  <option value="time_of_day">Time of Day</option>
                  <option value="day_of_week">Day of Week</option>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekend Work"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ruleCondition">Condition</Label>
              <Input
                id="ruleCondition"
                value={newRule.condition}
                onChange={(e) => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                placeholder="e.g., day_of_week in ['Saturday', 'Sunday']"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="ruleValue">Value</Label>
                <Input
                  id="ruleValue"
                  value={newRule.value}
                  onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., 0.5"
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="isBillable"
                  checked={newRule.isBillable}
                  onChange={(e) => setNewRule(prev => ({ ...prev, isBillable: e.target.checked }))}
                />
                <Label htmlFor="isBillable">Billable</Label>
              </div>
            </div>
            
            <Button onClick={addRule} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </CardContent>
        </Card>
      </div>

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
                      <Badge variant={rule.isBillable ? "default" : "secondary"}>
                        {rule.isBillable ? "Billable" : "Non-billable"}
                      </Badge>
                      <span className="font-medium">{rule.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rule.type}: {rule.condition} = {rule.value}
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
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
                <option value="analyst">Analyst</option>
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
              {settings.rates.map((rate) => (
                <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rate.projectType}</span>
                      <Badge variant="outline">{rate.roleId}</Badge>
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
