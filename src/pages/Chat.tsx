import { useState, useRef, useEffect } from "react"
import { FiSend, FiArrowLeft, FiMoreVertical, FiMessageSquare } from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/common/EmptyState"
import { cn } from "@/lib/utils"
import apiClient from "@/lib/apiClient"
import { useAuth } from "@/contexts/AuthContext"

interface ConversationSummary {
  other_user_id: number
  other_user_name: string
  last_message: string
  last_message_at: string
  unread_count: number
}

interface ChatMessage {
  id: number
  sender_id: number
  receiver_id: number
  message: string
  is_read: boolean
  created_at: string
}

export function Chat() {
  const { currentUser } = useAuth()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [activeUserId, setActiveUserId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find(c => c.other_user_id === activeUserId)

  const fetchConversations = async () => {
    try {
      const res = await apiClient.get('/conversations')
      setConversations(res.data || [])
    } catch (error) {
      console.error("Failed to fetch conversations", error)
    }
  }

  const fetchMessages = async (userId: number) => {
    setIsLoading(true)
    try {
      const res = await apiClient.get(`/conversations/${userId}/messages`)
      setMessages(res.data || [])
    } catch (error) {
      console.error("Failed to fetch messages", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (activeUserId) {
      fetchMessages(activeUserId)
      // mark local conversation unread count to 0
      setConversations(prev => 
        prev.map(c => c.other_user_id === activeUserId ? { ...c, unread_count: 0 } : c)
      )
    } else {
      setMessages([])
    }
  }, [activeUserId])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeUserId) return

    const tempText = inputText.trim()
    setInputText("")
    
    // Optimistically add message
    const tempMsg: ChatMessage = {
      id: Date.now(),
      sender_id: currentUser?.id || 0,
      receiver_id: activeUserId,
      message: tempText,
      is_read: true,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempMsg])
    
    try {
      await apiClient.post('/messages', {
        receiver_id: activeUserId,
        message: tempText
      })
      // Refresh to get actual data
      fetchMessages(activeUserId)
      fetchConversations()
    } catch (error) {
      console.error("Failed to send message", error)
    }
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full border rounded-lg overflow-hidden bg-background">
      
      {/* LEFT PANE: Conversation List */}
      <div 
        className={cn(
          "flex-col w-full md:w-80 lg:w-96 border-r flex shrink-0",
          activeUserId ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<FiMessageSquare className="h-8 w-8" />}
                title="No messages"
                description="Your inbox is completely empty."
              />
            </div>
          ) : (
            conversations.map(conv => {
            return (
              <button
                key={conv.other_user_id}
                onClick={() => setActiveUserId(conv.other_user_id)}
                className={cn(
                  "w-full text-left p-4 flex items-center gap-4 transition-colors hover:bg-primary/10 border-b last:border-b-0 border-l-2 border-l-transparent",
                  activeUserId === conv.other_user_id ? "bg-primary/10 border-l-primary" : "bg-transparent"
                )}
              >
                <Avatar className="h-12 w-12 border shrink-0">
                  <AvatarFallback>{conv.other_user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-sm truncate">{conv.other_user_name}</h3>
                    {conv.last_message_at && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(conv.last_message_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {conv.last_message}
                    </p>
                    {conv.unread_count > 0 && (
                      <Badge className="h-5 min-w-[1.25rem] px-1 rounded-full flex items-center justify-center shrink-0">
                        {conv.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            )
          }))}
        </div>
      </div>

      {/* RIGHT PANE: Active Thread */}
      <div 
        className={cn(
          "flex-col flex-1 bg-background relative",
          !activeUserId ? "hidden md:flex items-center justify-center" : "flex"
        )}
      >
        {!activeConversation ? (
          <div className="text-center text-muted-foreground hidden md:block">
            <FiMessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <div className="h-16 border-b bg-background flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden -ml-2 shrink-0"
                  onClick={() => setActiveUserId(null)}
                >
                  <FiArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10 border shrink-0">
                  <AvatarFallback>{activeConversation.other_user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{activeConversation.other_user_name}</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <FiMoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Scroll Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg, i) => {
                const isOwnMessage = msg.sender_id === currentUser?.id
                const showAvatar = !isOwnMessage && (i === messages.length - 1 || messages[i + 1]?.sender_id !== msg.sender_id)
                
                return (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex gap-3 max-w-[85%] md:max-w-[70%]",
                      isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {!isOwnMessage && (
                      <div className="w-8 shrink-0 flex items-end">
                        {showAvatar && (
                          <Avatar className="h-8 w-8 border">
                            <AvatarFallback>{activeConversation.other_user_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}
                    
                    <div className={cn(
                      "flex flex-col gap-1",
                      isOwnMessage ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm",
                        isOwnMessage 
                          ? "bg-primary text-primary-foreground rounded-br-sm" 
                          : "bg-background border rounded-bl-sm shadow-sm"
                      )}>
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-muted-foreground px-1">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t mt-auto">
              <form 
                onSubmit={handleSend}
                className="flex items-center gap-2"
              >
                <Input 
                  placeholder="Type a message..." 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 rounded-full bg-secondary border-transparent focus-visible:ring-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputText.trim() || isLoading}
                  className="rounded-full shrink-0 h-10 w-10"
                >
                  <FiSend className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
      
    </div>
  )
}
