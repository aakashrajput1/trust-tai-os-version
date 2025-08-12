'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

interface ToastNotification extends Notification {
  visible: boolean
}

export function SimpleNotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const supabase = createClientComponentClient()

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // Check for duplicate notifications (same title and message) within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const isDuplicate = notifications.some(n => 
      n.title === notification.title && 
      n.message === notification.message &&
      n.timestamp > fiveMinutesAgo
    )
    
    if (isDuplicate) {
      return // Don't add duplicate notifications within 5 minutes
    }
    
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Add to toast notifications
    const toastNotification: ToastNotification = { ...newNotification, visible: true }
    setToasts(prev => [toastNotification, ...prev])
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newNotification.id))
    }, 5000)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50'
      case 'error':
        return 'border-red-500 bg-red-50'
      default:
        return 'border-blue-500 bg-blue-50'
    }
  }

  // Clean up old notifications (older than 1 hour) every 10 minutes
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      setNotifications(prev => prev.filter(n => n.timestamp > oneHourAgo))
    }, 10 * 60 * 1000) // Every 10 minutes

    return () => clearInterval(cleanupInterval)
  }, [])

  // Set up real-time subscriptions for PM-related events
  useEffect(() => {
    const setupRealtimeSubscriptions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Simulate some real-time notifications for demo purposes
        const demoNotifications = [
          {
            type: 'success' as const,
            title: 'Task Completed',
            message: 'Sarah M. completed "Design user authentication flow"'
          },
          {
            type: 'warning' as const,
            title: 'Overdue Task',
            message: 'Task "API integration" is now overdue'
          },
          {
            type: 'info' as const,
            title: 'Team Update',
            message: 'Mike R. updated project timeline'
          }
        ]

        // Add demo notifications with delay
        demoNotifications.forEach((notification, index) => {
          setTimeout(() => {
            addNotification(notification)
          }, (index + 1) * 10000) // 10s intervals
        })

      } catch (error) {
        console.error('Error setting up real-time subscriptions:', error)
      }
    }

    setupRealtimeSubscriptions()
  }, [supabase])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification
    }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start space-x-3 rounded-lg shadow-lg border-l-4 p-4 transition-all duration-300 transform ${
              toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } ${getNotificationStyles(toast.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">{toast.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

