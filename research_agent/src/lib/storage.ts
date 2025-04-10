import type { Chat } from "@/types/chat"

const CHATS_KEY = "research-agent-chats"
const ACTIVE_CHAT_KEY = "research-agent-active-chat"

export function getChats(): Chat[] {
  if (typeof window === "undefined") return []

  const chats = localStorage.getItem(CHATS_KEY)
  return chats ? JSON.parse(chats) : []
}

export function saveChat(chat: Chat): void {
  if (typeof window === "undefined") return

  const chats = getChats()
  const existingIndex = chats.findIndex((c) => c.id === chat.id)

  if (existingIndex >= 0) {
    chats[existingIndex] = chat
  } else {
    chats.push(chat)
  }

  localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
}

export function deleteChat(chatId: string): void {
  if (typeof window === "undefined") return

  const chats = getChats().filter((chat) => chat.id !== chatId)
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats))

  // If active chat is deleted, clear active chat
  const activeChat = getActiveChat()
  if (activeChat === chatId) {
    setActiveChat("")
  }
}

export function getActiveChat(): string {
  if (typeof window === "undefined") return ""

  return localStorage.getItem(ACTIVE_CHAT_KEY) || ""
}

export function setActiveChat(chatId: string): void {
  if (typeof window === "undefined") return

  localStorage.setItem(ACTIVE_CHAT_KEY, chatId)
}
