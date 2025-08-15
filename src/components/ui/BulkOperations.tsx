'use client'

import { useState, useEffect } from 'react'
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit, 
  Download, 
  Upload, 
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react'

interface BulkOperationsProps<T> {
  items: T[]
  selectedItems: T[]
  onSelectionChange: (selectedItems: T[]) => void
  onBulkDelete?: (items: T[]) => Promise<void>
  onBulkUpdate?: (items: T[], updates: any) => Promise<void>
  onBulkExport?: (items: T[], format: 'csv' | 'json') => Promise<void>
  onBulkImport?: (file: File) => Promise<void>
  getItemId: (item: T) => string
  getItemDisplayName: (item: T) => string
  className?: string
}

export function BulkOperations<T>({
  items,
  selectedItems,
  onSelectionChange,
  onBulkDelete,
  onBulkUpdate,
  onBulkExport,
  onBulkImport,
  getItemId,
  getItemDisplayName,
  className = ''
}: BulkOperationsProps<T>) {
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingAction, setProcessingAction] = useState<string>('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)

  useEffect(() => {
    setSelectAll(selectedItems.length === items.length && items.length > 0)
  }, [selectedItems, items])

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([])
    } else {
      onSelectionChange([...items])
    }
  }

  const handleSelectItem = (item: T) => {
    const isSelected = selectedItems.some(selected => getItemId(selected) === getItemId(item))
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => getItemId(selected) !== getItemId(item)))
    } else {
      onSelectionChange([...selectedItems, item])
    }
  }

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedItems.length === 0) return

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedItems.length} selected item(s)? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setIsProcessing(true)
      setProcessingAction('Deleting...')
      await onBulkDelete(selectedItems)
      onSelectionChange([])
      setShowBulkActions(false)
    } catch (error) {
      console.error('Bulk delete error:', error)
      alert('Error deleting items. Please try again.')
    } finally {
      setIsProcessing(false)
      setProcessingAction('')
    }
  }

  const handleBulkExport = async (format: 'csv' | 'json') => {
    if (!onBulkExport || selectedItems.length === 0) return

    try {
      setIsProcessing(true)
      setProcessingAction(`Exporting ${format.toUpperCase()}...`)
      await onBulkExport(selectedItems, format)
    } catch (error) {
      console.error('Bulk export error:', error)
      alert('Error exporting items. Please try again.')
    } finally {
      setIsProcessing(false)
      setProcessingAction('')
    }
  }

  const handleBulkImport = async () => {
    if (!onBulkImport || !importFile) return

    try {
      setIsProcessing(true)
      setProcessingAction('Importing...')
      setImportProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      await onBulkImport(importFile)
      
      clearInterval(progressInterval)
      setImportProgress(100)
      
      setTimeout(() => {
        setShowImportModal(false)
        setImportFile(null)
        setImportProgress(0)
      }, 1000)
    } catch (error) {
      console.error('Bulk import error:', error)
      alert('Error importing items. Please try again.')
    } finally {
      setIsProcessing(false)
      setProcessingAction('')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImportFile(file)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {/* Bulk Selection Bar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {selectAll ? 'Deselect All' : 'Select All'}
              </span>
            </label>
            
            {selectedItems.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedItems.length} of {items.length} items selected
              </span>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions ({selectedItems.length})
              </button>
            </div>
          )}
        </div>

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              {onBulkDelete && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isProcessing}
                  className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </button>
              )}

              {onBulkExport && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkExport('csv')}
                    disabled={isProcessing}
                    className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleBulkExport('json')}
                    disabled={isProcessing}
                    className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </button>
                </div>
              )}

              {onBulkImport && (
                <button
                  onClick={() => setShowImportModal(true)}
                  disabled={isProcessing}
                  className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </button>
              )}

              {isProcessing && (
                <div className="flex items-center text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {processingAction}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Import Items</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  accept=".csv,.json,.xlsx"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: CSV, JSON, Excel
                </p>
              </div>

              {importProgress > 0 && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={!importFile || isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Processing...
            </h3>
            <p className="text-gray-600">{processingAction}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Higher-order component to add bulk operations to any list
export function withBulkOperations<T>(
  Component: React.ComponentType<any>,
  bulkOperationsProps: Omit<BulkOperationsProps<T>, 'items' | 'selectedItems' | 'onSelectionChange'>
) {
  return function EnhancedComponent(props: any) {
    const [selectedItems, setSelectedItems] = useState<T[]>([])

    const enhancedProps = {
      ...props,
      selectedItems,
      onSelectionChange: setSelectedItems,
      bulkOperations: (
        <BulkOperations<T>
          items={props.items || []}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          {...bulkOperationsProps}
        />
      )
    }

    return <Component {...enhancedProps} />
  }
}



