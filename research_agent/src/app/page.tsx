"use client"

import { useEffect, useState } from "react"
import type { Chat } from "@/types/chat"
import { ChatInterface } from "@/components/ChatInterface"
import { ChatHistory } from "@/components/ChatHistory"
import { getChats, saveChat, deleteChat, getActiveChat, setActiveChat } from "@/lib/storage"
import { generateId } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Load chats from localStorage
  useEffect(() => {
    const storedChats = getChats()
    setChats(storedChats)

    const storedActiveChat = getActiveChat()
    if (storedActiveChat && storedChats.some((chat) => chat.id === storedActiveChat)) {
      setActiveChatId(storedActiveChat)
    } else if (storedChats.length > 0) {
      setActiveChatId(storedChats[0].id)
      setActiveChat(storedChats[0].id)
    }
  }, [])

  const handleNewChat = () => {
    const newChat: Chat = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const updatedChats = [newChat, ...chats]
    setChats(updatedChats)
    setActiveChatId(newChat.id)
    saveChat(newChat)
    setActiveChat(newChat.id)

    // Close sidebar on mobile after selecting
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId)
    setActiveChat(chatId)

    // Close sidebar on mobile after selecting
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleDeleteChat = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId)
    setChats(updatedChats)
    deleteChat(chatId)

    if (activeChatId === chatId) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id)
        setActiveChat(updatedChats[0].id)
      } else {
        setActiveChatId("")
        setActiveChat("")
      }
    }
  }

  const handleUpdateChat = (updatedChat: Chat) => {
    // Check if this is a new chat (not in the existing chats list)
    const chatExists = chats.some((chat) => chat.id === updatedChat.id)

    let updatedChats
    if (!chatExists) {
      // This is a new chat, add it to the beginning of the list
      updatedChats = [updatedChat, ...chats]
      // Set it as the active chat
      setActiveChatId(updatedChat.id)
      setActiveChat(updatedChat.id)
    } else {
      // Update existing chat
      updatedChats = chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    }

    setChats(updatedChats)
    saveChat(updatedChat)
  }

  const activeChat = chats.find((chat) => chat.id === activeChatId) || {
    id: "",
    title: "",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <main className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-72 md:w-80" : "w-0"}
          fixed md:relative z-40
        `}
      >
        <div
          className={`h-full w-72 md:w-80 ${!sidebarOpen && "transform -translate-x-full"} transition-transform duration-300`}
        >
          <ChatHistory
            chats={chats}
            activeChat={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Sidebar toggle button - desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute top-4 left-4 z-50 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Sidebar toggle button - mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 left-4 z-50 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Chat interface */}
        <div className="flex-1 h-full">
          <ChatInterface chat={activeChat} onUpdateChat={handleUpdateChat} />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </main>
  )
}
