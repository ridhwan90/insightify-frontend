import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from '@/components/auth/AuthProvider'
import { IoSend } from "react-icons/io5"
import { BsRobot, BsThreeDots } from "react-icons/bs"
import { FaUser } from "react-icons/fa"
import { Message, createChatStream, createMessage } from '@/service/chatApi'
import { motion, AnimatePresence } from "framer-motion"
import Markdown from 'react-markdown'

interface ChatMessage extends Message {
  id: string
  timestamp: Date
}

const MessageBubble = ({ message, isStreaming = false }: { message: ChatMessage, isStreaming?: boolean }) => {
  const isAI = message.role === 'assistant'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-start gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border ${
        isAI
          ? 'border-primary/20 bg-primary/10 text-primary'
          : 'border-accent/20 bg-accent/10 text-accent'
      }`}>
        {isAI ? <BsRobot className="h-4 w-4" /> : <FaUser className="h-4 w-4" />}
      </div>
      
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`group relative max-w-[80%] rounded-2xl px-4 py-2 ${
          isAI 
            ? 'bg-muted/50 backdrop-blur-sm' 
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <Markdown
            components={{
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2" {...props} />
            }}
          >
            {message.content}
          </Markdown>
        </div>
        <span className="mt-1 block text-[10px] opacity-50">
          {message.timestamp.toLocaleTimeString()}
        </span>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-muted-foreground"
          >
            <BsThreeDots className="animate-pulse" />
            <span>AI is typing</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

function Chat() {
  const { currentUser } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hello ${currentUser?.firstName}! 👋\nI'm your AI assistant. How can I help you today?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentStreamingMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setCurrentStreamingMessage('')

    try {
      // Include initial assistant message if this is the first user message
      const messageHistory = messages.length === 0 
        ? [
            createMessage('assistant', `Hello ${currentUser?.firstName}! 👋\nI'm your AI assistant. How can I help you today?`),
            createMessage('user', input.trim())
          ]
        : messages.map(({ role, content }) => ({ role, content }))
          .concat(createMessage('user', input.trim()))

      const stream = await createChatStream(messageHistory)
      
      // Create a temporary message for streaming
      const streamingMessageId = Date.now().toString()
      let streamContent = ''

      for await (const chunk of stream) {
        if (chunk === '[DONE]') break
        streamContent += chunk
        setCurrentStreamingMessage(streamContent)
      }

      // Add the final message
      setMessages(prev => [...prev, {
        id: streamingMessageId,
        content: streamContent,
        role: 'assistant',
        timestamp: new Date()
      }])
      setCurrentStreamingMessage('')

    } catch (error) {
      console.error('Chat error:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-[44px] top-[64px] overflow-hidden">
      <div className="container relative mx-auto h-full max-w-4xl p-4">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-b from-background to-background/50 -z-10" />
        <div className="fixed inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl opacity-70" />
        <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl opacity-70" />
        
        <Card className="relative flex h-full flex-col overflow-hidden border-muted/50 shadow-2xl">
          {/* Chat Header */}
          <div className="border-b border-muted/20 bg-muted/5 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BsRobot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-track-muted/10 scrollbar-thumb-muted/20">
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {currentStreamingMessage && (
                  <MessageBubble
                    message={{
                      id: 'streaming',
                      content: currentStreamingMessage,
                      role: 'assistant',
                      timestamp: new Date()
                    }}
                    isStreaming={true}
                  />
                )}
              </AnimatePresence>
              
              {isLoading && !currentStreamingMessage && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-muted/20 bg-muted/5 p-4 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="bg-background/50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading || !input.trim()}
                className="shrink-0 bg-primary/20 text-primary hover:bg-primary/30"
              >
                <IoSend className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/chat')({
  beforeLoad: ({ context }) => {
    const { currentUser } = context.auth
    if (!currentUser) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/chat'
        }
      })
    }
  },
  component: Chat
})
