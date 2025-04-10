export interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: number
  }
  
  export interface Chat {
    id: string
    title: string
    messages: Message[]
    createdAt: number
    updatedAt: number
  }