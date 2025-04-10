"use client"

import { useState } from "react"
import type { Chat } from "@/types/chat"
import { formatDate, truncate } from "@/lib/utils"
import { PlusCircle, Trash2 } from "lucide-react"

interface ChatHistoryProps {
  chats: Chat[]
  activeChat: string
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
}

export function ChatHistory({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat }: ChatHistoryProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col bg-zinc-900 border-r border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-2">Recent Chats</h3>

        {chats.length === 0 ? (
          <p className="text-zinc-500 text-sm p-2">No recent chats</p>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className="relative"
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    activeChat === chat.id
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <div className="font-medium">{truncate(chat.title, 25)}</div>
                  <div className="text-xs opacity-70 mt-1">{formatDate(chat.updatedAt)}</div>
                </button>

                {hoveredChat === chat.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-red-500 transition-colors"
                    aria-label="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
