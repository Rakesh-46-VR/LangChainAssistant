import axios from "axios"

const BASE_URL = "http://127.0.0.1:8000"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function askQuestion(query: string) {
  try {
    const response = await api.post("/ask", { query })
    return response
  } catch (error) {
    console.error("Error asking question:", error)
    throw error
  }
}
