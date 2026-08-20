import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AppNotification } from "@/types"
import apiClient from "@/lib/apiClient"
import { useAuth } from "@/contexts/AuthContext"

interface NotificationsContextType {
  notifications: AppNotification[]
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  unreadCount: number
  fetchNotifications: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    if (!currentUser) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    try {
      const res = await apiClient.get('/notifications')
      setNotifications(res.data.items || [])
      setUnreadCount(res.data.unread_count || 0)
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [currentUser])

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`)
      // Optimistic update
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, is_read: true } : notif)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all')
      // Optimistic update
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read", error)
    }
  }

  return (
    <NotificationsContext.Provider value={{ notifications, markAsRead, markAllAsRead, unreadCount, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
