"use client"

import { useEffect, useRef, useState } from "react"
import type { Chat, Message } from "@/types/chat"
import { MessageBubble } from "./MessageBubble"
import { ChatInput } from "./ChatInput"
import { askQuestion } from "@/lib/api"
import { generateId } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ChatInterfaceProps {
  chat: Chat
  onUpdateChat: (chat: Chat) => void
}

export function ChatInterface({ chat, onUpdateChat }: ChatInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat.messages])

  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      content,
      role: "user",
      timestamp: Date.now(),
    }

    // Check if this is a new chat (no ID) and create one if needed
    let updatedChat: Chat

    if (!chat.id) {
      // Create a new chat since none exists
      updatedChat = {
        id: generateId(),
        title: content.length > 30 ? content.substring(0, 30) + "..." : content,
        messages: [userMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    } else {
      // Update existing chat with user message
      updatedChat = {
        ...chat,
        messages: [...chat.messages, userMessage],
        updatedAt: Date.now(),
      }

      // If this is the first message in an existing chat, set the title
      if (chat.messages.length === 0) {
        updatedChat.title = content.length > 30 ? content.substring(0, 30) + "..." : content
      }
    }

    onUpdateChat(updatedChat)

    // Get response from API
    setIsLoading(true)
    try {
      const response = await askQuestion(content)

      // Create assistant message
      const assistantMessage: Message = {
        id: generateId(),
        content: response.data.content || "Sorry, I couldn't find an answer.",
        role: "assistant",
        timestamp: Date.now(),
      }

      // Update chat with assistant message
      const finalChat: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: Date.now(),
      }

      onUpdateChat(finalChat)
    } catch (error) {
      // Create error message
      const errorMessage: Message = {
        id: generateId(),
        content: "Sorry, there was an error processing your request.",
        role: "assistant",
        timestamp: Date.now(),
      }

      // Update chat with error message
      const finalChat: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
        updatedAt: Date.now(),
      }

      onUpdateChat(finalChat)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full pt-16 md:pt-16">
      {" "}
      {/* Added padding-top to account for the toggle button */}
      <div className="flex-1 overflow-y-auto p-4">
        {chat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <p className="text-xl font-medium mb-2">Research Assistant</p>
            <p className="text-sm">Ask me anything to begin your research</p>
          </div>
        ) : (
          <>
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-zinc-800 px-4 py-3 rounded-lg flex items-center">
                  <Loader2 size={16} className="animate-spin text-indigo-400 mr-2" />
                  <span className="text-zinc-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}
