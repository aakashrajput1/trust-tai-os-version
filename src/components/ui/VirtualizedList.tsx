'use client'

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react'

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => ReactNode
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
  loading?: boolean
  className?: string
  overscan?: number
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  onLoadMore,
  hasMore = false,
  loading = false,
  className = '',
  overscan = 5
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  )

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex + 1)

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  // Intersection observer for infinite loading
  useEffect(() => {
    if (!loadingRef.current || !onLoadMore || !hasMore) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          setIsIntersecting(true)
          onLoadMore().finally(() => setIsIntersecting(false))
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(loadingRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [onLoadMore, hasMore, loading])

  // Auto-scroll to top when items change
  useEffect(() => {
    if (containerRef && items.length > 0) {
      containerRef.scrollTop = 0
      setScrollTop(0)
    }
  }, [items.length])

  return (
    <div className={className}>
      <div
        ref={setContainerRef}
        style={{ height: containerHeight, overflow: 'auto' }}
        onScroll={handleScroll}
        className="relative"
      >
        {/* Spacer for total height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items */}
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) => (
              <div
                key={startIndex + index}
                style={{ height: itemHeight }}
                className="absolute top-0 left-0 right-0"
              >
                {renderItem(item, startIndex + index)}
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          {onLoadMore && hasMore && (
            <div
              ref={loadingRef}
              style={{ 
                position: 'absolute',
                top: totalHeight - 100,
                left: 0,
                right: 0,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading more...</span>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Scroll to load more</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced version with search and filtering
interface EnhancedVirtualizedListProps<T> extends VirtualizedListProps<T> {
  searchTerm: string
  onSearchChange: (term: string) => void
  filters: Record<string, any>
  onFiltersChange: (filters: Record<string, any>) => void
  sortOptions: Array<{ value: string; label: string }>
  sortBy: string
  onSortChange: (sortBy: string) => void
  sortDirection: 'asc' | 'desc'
  onSortDirectionChange: (direction: 'asc' | 'desc') => void
}

export function EnhancedVirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  onLoadMore,
  hasMore = false,
  loading = false,
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  sortOptions,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
  className = '',
  overscan = 5
}: EnhancedVirtualizedListProps<T>) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className={className}>
      {/* Search and Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Direction */}
          <div>
            <button
              onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              {sortDirection === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="ml-2 capitalize">{sortDirection}</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(filters).some(key => filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (value === '' || value === null || value === undefined) return null
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                    <button
                      onClick={() => onFiltersChange({ ...filters, [key]: '' })}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Virtualized List */}
      <VirtualizedList
        items={items}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        renderItem={renderItem}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
        overscan={overscan}
      />
    </div>
  )
}

// Hook for managing virtualized list state
export function useVirtualizedList<T>(
  initialItems: T[] = [],
  pageSize: number = 50
) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadMore = useCallback(async (loadFunction: (page: number, pageSize: number) => Promise<T[]>) => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const newItems = await loadFunction(page, pageSize)
      
      if (newItems.length < pageSize) {
        setHasMore(false)
      }
      
      setItems(prev => [...prev, ...newItems])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error loading more items:', error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, loading, hasMore])

  const reset = useCallback(() => {
    setItems([])
    setPage(1)
    setHasMore(true)
    setLoading(false)
  }, [])

  const updateItems = useCallback((newItems: T[]) => {
    setItems(newItems)
    setPage(1)
    setHasMore(true)
  }, [])

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset,
    updateItems
  }
}



