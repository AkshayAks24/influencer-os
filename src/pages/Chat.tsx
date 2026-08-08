import { useState, useRef, useEffect } from "react"
import { FiSend, FiArrowLeft, FiMoreVertical, FiMessageSquare } from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/common/EmptyState"
import { cn } from "@/lib/utils"
import type { Conversation, ChatMessage } from "@/types"
import initialChatData from "@/data/chatMessages.json"

export function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>(
    initialChatData as unknown as Conversation[]
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [inputText, setInputText] = useState("")
  
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find(c => c.id === activeId)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeConversation?.messages.length])

  // Mark as read when opening conversation
  useEffect(() => {
    if (activeId) {
      setConversations(prev => 
        prev.map(c => c.id === activeId ? { ...c, unreadCount: 0 } : c)
      )
    }
  }, [activeId])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeId) return

    const newMessage: ChatMessage = {
      id: `msg-new-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      message: inputText.trim(),
      timestamp: new Date().toISOString(),
      isOwnMessage: true
    }

    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [...c.messages, newMessage]
        }
      }
      return c
    }))

    setInputText("")
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full -m-4 md:-m-6 border-t md:border-t-0 md:rounded-lg overflow-hidden bg-background">
      
      {/* LEFT PANE: Conversation List */}
      <div 
        className={cn(
          "flex-col w-full md:w-80 lg:w-96 border-r flex shrink-0",
          activeId ? "hidden md:flex" : "flex"
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
              const lastMessage = conv.messages[conv.messages.length - 1]
            return (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={cn(
                  "w-full text-left p-4 flex items-center gap-4 transition-colors hover:bg-muted/50 border-b last:border-b-0",
                  activeId === conv.id ? "bg-muted" : "bg-transparent"
                )}
              >
                <Avatar className="h-12 w-12 border shrink-0">
                  <AvatarImage src={conv.participant.avatar} alt={conv.participant.name} />
                  <AvatarFallback>{conv.participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-sm truncate">{conv.participant.name}</h3>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(lastMessage.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {lastMessage?.isOwnMessage && "You: "}{lastMessage?.message}
                    </p>
                    {conv.unreadCount > 0 && (
                      <Badge className="h-5 min-w-[1.25rem] px-1 rounded-full flex items-center justify-center shrink-0">
                        {conv.unreadCount}
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
          "flex-col flex-1 bg-muted/20 relative",
          !activeId ? "hidden md:flex items-center justify-center" : "flex"
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
                  onClick={() => setActiveId(null)}
                >
                  <FiArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10 border shrink-0">
                  <AvatarImage src={activeConversation.participant.avatar} alt={activeConversation.participant.name} />
                  <AvatarFallback>{activeConversation.participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{activeConversation.participant.name}</h3>
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
              {activeConversation.messages.map((msg, i) => {
                const showAvatar = !msg.isOwnMessage && (i === activeConversation.messages.length - 1 || activeConversation.messages[i + 1]?.isOwnMessage)
                
                return (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex gap-3 max-w-[85%] md:max-w-[70%]",
                      msg.isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {!msg.isOwnMessage && (
                      <div className="w-8 shrink-0 flex items-end">
                        {showAvatar && (
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={activeConversation.participant.avatar} />
                            <AvatarFallback>{activeConversation.participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}
                    
                    <div className={cn(
                      "flex flex-col gap-1",
                      msg.isOwnMessage ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm",
                        msg.isOwnMessage 
                          ? "bg-primary text-primary-foreground rounded-br-sm" 
                          : "bg-background border rounded-bl-sm shadow-sm"
                      )}>
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-muted-foreground px-1">
                        {formatTime(msg.timestamp)}
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
                  className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputText.trim()}
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
