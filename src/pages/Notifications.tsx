import { useState } from "react"
import { useNotifications } from "@/contexts/NotificationsContext"
import { FiMessageSquare, FiActivity, FiAlertCircle, FiBell, FiCheckCircle } from "react-icons/fi"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/EmptyState"
import type { AppNotification } from "@/types"

type FilterTab = "all" | "campaign" | "message" | "system"

export function Notifications() {
  const { notifications, markAsRead } = useNotifications()
  const [activeTab, setActiveTab] = useState<FilterTab>("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <FiMessageSquare className="h-4 w-4 text-blue-500" />
      case "campaign":
        return <FiActivity className="h-4 w-4 text-green-500" />
      case "alert":
        return <FiAlertCircle className="h-4 w-4 text-red-500" />
      case "system":
        return <FiAlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <FiBell className="h-4 w-4 text-gray-500" />
    }
  }

  // Filter logic
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true
    if (activeTab === "system") return n.type === "system" || n.type === "alert"
    return n.type === activeTab
  })

  // Grouping logic
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterday = today - 86400000
  const lastWeek = today - 86400000 * 7

  const grouped = filteredNotifications.reduce((acc, notif) => {
    const time = new Date(notif.timestamp).getTime()
    if (time >= today) acc.today.push(notif)
    else if (time >= yesterday) acc.yesterday.push(notif)
    else if (time >= lastWeek) acc.thisWeek.push(notif)
    else acc.older.push(notif)
    return acc
  }, { today: [], yesterday: [], thisWeek: [], older: [] } as Record<string, AppNotification[]>)

  const groupLabels = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "thisWeek", label: "This Week" },
    { key: "older", label: "Older" }
  ]

  const tabs: { id: FilterTab, label: string }[] = [
    { id: "all", label: "All" },
    { id: "campaign", label: "Campaign Updates" },
    { id: "message", label: "Messages" },
    { id: "system", label: "System & Alerts" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Stay updated on your campaigns, messages, and account alerts.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <Button 
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="rounded-full"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<FiCheckCircle className="h-10 w-10" />}
              title="You're all caught up!"
              description="No notifications match this filter."
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {groupLabels.map(group => {
            const items = grouped[group.key]
            if (items.length === 0) return null

            return (
              <div key={group.key} className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </h3>
                <Card>
                  <div className="divide-y divide-border">
                    {items.map(notification => (
                      <div 
                        key={notification.id}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                        className={`flex gap-4 p-4 transition-colors ${notification.read ? 'bg-card' : 'bg-primary/5 cursor-pointer hover:bg-primary/10'}`}
                      >
                        <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-muted' : 'bg-background shadow-sm border border-primary/20'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <Badge variant="default" className="shrink-0 h-2 w-2 rounded-full p-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString(undefined, { 
                              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
