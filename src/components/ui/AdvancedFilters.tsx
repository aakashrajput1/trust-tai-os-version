'use client'

import { useState, useEffect } from 'react'
import { 
  Filter, 
  X, 
  Plus, 
  Search, 
  Calendar,
  User,
  Settings,
  Trash2,
  Save,
  Loader2
} from 'lucide-react'
import { FilterOption, SearchFilters } from '@/types/admin'

interface AdvancedFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSavePreset?: (name: string, filters: SearchFilters) => void
  onLoadPreset?: (name: string) => SearchFilters
  availableFilters: FilterOption[]
  className?: string
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onSavePreset,
  onLoadPreset,
  availableFilters,
  className = ''
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)
  const [presetName, setPresetName] = useState('')
  const [savedPresets, setSavedPresets] = useState<string[]>([])
  const [activePreset, setActivePreset] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  useEffect(() => {
    // Load saved presets from localStorage
    const presets = localStorage.getItem('adminFilterPresets')
    if (presets) {
      setSavedPresets(JSON.parse(presets))
    }
  }, [])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    const emptyFilters: SearchFilters = {
      query: '',
      filters: {},
      sortBy: '',
      sortOrder: 'asc',
      page: 1,
      limit: 20,
    }
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const clearFilters = () => {
    const clearedFilters = { ...localFilters }
    Object.keys(clearedFilters).forEach(key => {
      if (key !== 'search') {
        (clearedFilters as any)[key] = ''
      }
    })
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const savePreset = async () => {
    if (!presetName.trim()) return

    setIsSaving(true)
    try {
      if (onSavePreset) {
        await onSavePreset(presetName, localFilters)
      } else {
        // Save to localStorage
        const presets = JSON.parse(localStorage.getItem('adminFilterPresets') || '[]')
        const newPreset = { name: presetName, filters: localFilters }
        presets.push(newPreset)
        localStorage.setItem('adminFilterPresets', JSON.stringify(presets))
        setSavedPresets(presets.map((p: any) => p.name))
      }
      setPresetName('')
      setActivePreset(presetName)
    } catch (error) {
      console.error('Error saving preset:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const loadPreset = (presetName: string) => {
    try {
      let presetFilters: SearchFilters
      
      if (onLoadPreset) {
        presetFilters = onLoadPreset(presetName)
      } else {
        // Load from localStorage
        const presets = JSON.parse(localStorage.getItem('adminFilterPresets') || '[]')
        const preset = presets.find((p: any) => p.name === presetName)
        if (preset) {
          presetFilters = preset.filters
        } else {
          return
        }
      }

      setLocalFilters(presetFilters)
      onFiltersChange(presetFilters)
      setActivePreset(presetName)
    } catch (error) {
      console.error('Error loading preset:', error)
    }
  }

  const deletePreset = (presetName: string) => {
    try {
      const presets = JSON.parse(localStorage.getItem('adminFilterPresets') || '[]')
      const filteredPresets = presets.filter((p: any) => p.name !== presetName)
      localStorage.setItem('adminFilterPresets', JSON.stringify(filteredPresets))
      setSavedPresets(filteredPresets.map((p: any) => p.name))
      
      if (activePreset === presetName) {
        setActivePreset('')
      }
    } catch (error) {
      console.error('Error deleting preset:', error)
    }
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== undefined && value !== null
    ).length
  }

  const renderFilterInput = (filter: FilterOption) => {
    const value = localFilters[filter.key as keyof SearchFilters] || ''

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleFilterChange(filter.key as keyof SearchFilters, e.target.value)}
            placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => handleFilterChange(filter.key as keyof SearchFilters, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            value={value as string}
            onChange={(e) => handleFilterChange(filter.key as keyof SearchFilters, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case 'dateRange':
        return null

      case 'multiSelect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(value as string[] || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = (value as string[]) || []
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value)
                    handleFilterChange(filter.key as keyof SearchFilters, newValues)
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
        {getActiveFilterCount() > 0 && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute mt-2 w-full max-w-4xl bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {availableFilters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>

            {/* Preset Management */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Filter Presets</h4>
              
              {/* Save Preset */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={savePreset}
                  disabled={!presetName.trim() || isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className="ml-2">Save</span>
                </button>
              </div>

              {/* Load Presets */}
              {savedPresets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {savedPresets.map((preset) => (
                    <div key={preset} className="flex items-center space-x-2">
                      <button
                        onClick={() => loadPreset(preset)}
                        className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                          activePreset === preset
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {preset}
                      </button>
                      <button
                        onClick={() => deletePreset(preset)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete preset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}



