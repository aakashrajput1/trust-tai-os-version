'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { AdminNotification, RealTimeEvent } from '@/types/admin'

interface RealTimeNotificationContextType {
  notifications: AdminNotification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
}

const RealTimeNotificationContext = createContext<RealTimeNotificationContextType | undefined>(undefined)

interface RealTimeNotificationProviderProps {
  children: ReactNode
  adminId?: string
}

export function RealTimeNotificationProvider({ children, adminId }: RealTimeNotificationProviderProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const maxReconnectAttempts = 5

  // Initialize EventSource for Server-Sent Events
  useEffect(() => {
    if (!adminId) return

    const initializeEventSource = () => {
      try {
        setConnectionStatus('connecting')
        
        // Create EventSource for real-time updates
        const es = new EventSource(`/api/admin/notifications/stream?adminId=${adminId}`)
        
        es.onopen = () => {
          setIsConnected(true)
          setConnectionStatus('connected')
          setReconnectAttempts(0)
          console.log('Real-time notifications connected')
        }

        es.onmessage = (event) => {
          try {
            const data: RealTimeEvent = JSON.parse(event.data)
            handleRealTimeEvent(data)
          } catch (error) {
            console.error('Error parsing real-time event:', error)
          }
        }

        es.onerror = (error) => {
          console.error('EventSource error:', error)
          setIsConnected(false)
          setConnectionStatus('error')
          es.close()
          
          // Attempt to reconnect
          if (reconnectAttempts < maxReconnectAttempts) {
            setTimeout(() => {
              setReconnectAttempts(prev => prev + 1)
              initializeEventSource()
            }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)) // Exponential backoff
          }
        }

        setEventSource(es)
      } catch (error) {
        console.error('Error initializing EventSource:', error)
        setConnectionStatus('error')
      }
    }

    initializeEventSource()

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [adminId, reconnectAttempts])

  // Handle different types of real-time events
  const handleRealTimeEvent = (event: RealTimeEvent) => {
    switch (event.type) {
      case 'user_created':
        addNotification({
          id: `user-${event.timestamp}`,
          type: 'info',
          title: 'New User Created',
          message: `User ${event.payload.email} has been created`,
          createdAt: event.timestamp,
          isRead: false,
          actionUrl: `/admin/users/${event.payload.userId}`,
          metadata: event.payload
        })
        break

      case 'user_updated':
        addNotification({
          id: `user-update-${event.timestamp}`,
          type: 'info',
          title: 'User Updated',
          message: `User ${event.payload.email} has been updated`,
          createdAt: event.timestamp,
          isRead: false,
          actionUrl: `/admin/users/${event.payload.userId}`,
          metadata: event.payload
        })
        break

      case 'role_changed':
        addNotification({
          id: `role-${event.timestamp}`,
          type: 'warning',
          title: 'Role Change Request',
          message: `Role change requested for ${event.payload.userEmail}`,
          createdAt: event.timestamp,
          isRead: false,
          actionUrl: `/admin/users/${event.payload.userId}`,
          metadata: event.payload
        })
        break

      case 'system_alert':
        addNotification({
          id: `alert-${event.timestamp}`,
          type: event.payload.severity === 'critical' ? 'error' : 'warning',
          title: 'System Alert',
          message: event.payload.message,
          createdAt: event.timestamp,
          isRead: false,
          actionUrl: `/admin/system-health`,
          metadata: event.payload
        })
        break

      case 'audit_event':
        addNotification({
          id: `audit-${event.timestamp}`,
          type: 'info',
          title: 'Audit Event',
          message: `${event.payload.action} on ${event.payload.resource}`,
          createdAt: event.timestamp,
          isRead: false,
          actionUrl: `/admin/audit`,
          metadata: event.payload
        })
        break

      case 'integration_status':
        addNotification({
          id: `integration-${event.timestamp}`,
          type: event.payload.status === 'failed' ? 'error' : 'info',
          title: 'Integration Status',
          message: `${event.payload.name}: ${event.payload.status}`,
          createdAt: event.timestamp,
          isRead: false,
          actionUrl: `/admin/integrations`,
          metadata: event.payload
        })
        break

      default:
        console.log('Unknown event type:', event.type)
    }
  }

  // Add new notification
  const addNotification = (notification: AdminNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 99)]) // Keep max 100 notifications
  }

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Clear specific notification
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length

  const value: RealTimeNotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    isConnected,
    connectionStatus
  }

  return (
    <RealTimeNotificationContext.Provider value={value}>
      {children}
    </RealTimeNotificationContext.Provider>
  )
}

// Hook to use real-time notifications
export function useRealTimeNotifications() {
  const context = useContext(RealTimeNotificationContext)
  if (context === undefined) {
    throw new Error('useRealTimeNotifications must be used within a RealTimeNotificationProvider')
  }
  return context
}

// Notification Bell Component
export function NotificationBell() {
  const { unreadCount, notifications, markAsRead, markAllAsRead, clearAllNotifications, isConnected, connectionStatus } = useRealTimeNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600'
      case 'connecting': return 'text-yellow-600'
      case 'disconnected': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return notificationTime.toLocaleDateString()
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {/* Connection Status Indicator */}
        <div className={`absolute -bottom-1 -right-1 h-2 w-2 rounded-full ${getStatusColor(connectionStatus)}`}></div>
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className={`text-xs ${getStatusColor(connectionStatus)}`}>
                {connectionStatus === 'connected' ? '● Live' : '○ Offline'}
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id)
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <div className="mt-2">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}
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



