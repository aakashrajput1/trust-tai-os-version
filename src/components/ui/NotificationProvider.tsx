'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast, { Toaster } from 'react-hot-toast'
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

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const supabase = createClientComponentClient()

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Show toast notification
    const toastIcon = {
      info: <Info className="w-4 h-4" />,
      success: <CheckCircle className="w-4 h-4" />,
      warning: <AlertTriangle className="w-4 h-4" />,
      error: <AlertTriangle className="w-4 h-4" />
    }

    toast.custom((t) => (
      <div className={`flex items-center space-x-3 bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-md ${
        notification.type === 'success' ? 'border-green-500' :
        notification.type === 'warning' ? 'border-yellow-500' :
        notification.type === 'error' ? 'border-red-500' : 'border-blue-500'
      } ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <div className={`flex-shrink-0 ${
          notification.type === 'success' ? 'text-green-500' :
          notification.type === 'warning' ? 'text-yellow-500' :
          notification.type === 'error' ? 'text-red-500' : 'text-blue-500'
        }`}>
          {toastIcon[notification.type]}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ), {
      duration: 5000,
      position: 'top-right'
    })
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

  const unreadCount = notifications.filter(n => !n.read).length

  // Set up real-time subscriptions for PM-related events
  useEffect(() => {
    const setupRealtimeSubscriptions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Mock real-time events - in production, you'd set up actual Supabase subscriptions
        // Example subscriptions for PM module:
        
        // Project updates
        // const projectUpdates = supabase
        //   .channel('project_updates')
        //   .on('postgres_changes', 
        //     { event: '*', schema: 'public', table: 'projects', filter: `manager_id=eq.${user.id}` },
        //     (payload) => {
        //       addNotification({
        //         type: 'info',
        //         title: 'Project Updated',
        //         message: `Project "${payload.new.name}" has been updated`,
        //         actionUrl: `/dashboard/project-manager/projects/${payload.new.id}`
        //       })
        //     }
        //   )
        //   .subscribe()

        // Task assignments
        // const taskAssignments = supabase
        //   .channel('task_assignments')
        //   .on('postgres_changes',
        //     { event: 'UPDATE', schema: 'public', table: 'tasks', filter: 'assignee_id=neq.null' },
        //     (payload) => {
        //       addNotification({
        //         type: 'success',
        //         title: 'Task Assigned',
        //         message: `"${payload.new.title}" has been assigned`,
        //         actionUrl: `/dashboard/project-manager/kanban`
        //       })
        //     }
        //   )
        //   .subscribe()

        // Budget alerts
        // const budgetAlerts = supabase
        //   .channel('budget_alerts')
        //   .on('postgres_changes',
        //     { event: 'UPDATE', schema: 'public', table: 'projects' },
        //     (payload) => {
        //       const budgetUsed = payload.new.budget_used / payload.new.budget_total
        //       if (budgetUsed > 0.8) {
        //         addNotification({
        //           type: 'warning',
        //           title: 'Budget Alert',
        //           message: `Project "${payload.new.name}" has used ${Math.round(budgetUsed * 100)}% of budget`,
        //           actionUrl: `/dashboard/project-manager/projects/${payload.new.id}`
        //         })
        //       }
        //     }
        //   )
        //   .subscribe()

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

    // Cleanup function would unsubscribe from channels
    return () => {
      // supabase.removeAllChannels()
    }
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
      <Toaster position="top-right" />
    </NotificationContext.Provider>
  )
}

