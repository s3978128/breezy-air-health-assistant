"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Define the message type for the unified chat history
export type ChatMessage = {
  role: "user" | "model" | "system"
  content: string
  source?: "chat" | "explanation" // Track where the message originated
  timestamp: number
  id: string // Unique identifier for each message
}

type AiContextType = {
  // Explanation functionality
  showExplanation: (id: string, content: string) => void
  hideExplanation: () => void
  currentExplanation: { id: string; content: string } | null
  isShowingExplanation: boolean
  explanationHistory: { id: string; content: string }[]

  // Unified chat history
  chatHistory: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => string
  getChatHistoryForApi: () => { role: string; parts: { text: string }[] }[]
  clearChatHistory: () => void
}

const AiContext = createContext<AiContextType | undefined>(undefined)

// Generate a unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 15)

export function AiProvider({ children }: { children: ReactNode }) {
  // Explanation state
  const [currentExplanation, setCurrentExplanation] = useState<{ id: string; content: string } | null>(null)
  const [explanationHistory, setExplanationHistory] = useState<{ id: string; content: string }[]>([])

  // Unified chat history state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      content: "Hey there! 👋 I'm Breezy, your friendly air quality buddy! How can I help you today?",
      source: "chat",
      timestamp: Date.now(),
      id: generateId(),
    },
  ])

  // Add a message to the unified chat history
  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    const id = generateId()
    const newMessage = {
      ...message,
      id,
      timestamp: Date.now(),
    }

    setChatHistory((prev) => [...prev, newMessage])
    return id
  }, [])

  // Get formatted chat history for API calls
  const getChatHistoryForApi = useCallback(() => {
    const history = chatHistory.slice(-10)
  
    const firstUserIndex = history.findIndex((msg) => msg.role === "user")
    const safeHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : []
  
    return safeHistory.map((msg) => ({
      role: msg.role === "model" ? "model" : msg.role,
      parts: [{ text: msg.content }],
    }))
  }, [chatHistory])  
  

  // Clear chat history
  const clearChatHistory = useCallback(() => {
    setChatHistory([
      {
        role: "model",
        content: "Hey there! 👋 I'm Breezy, your friendly air quality buddy! How can I help you today?",
        source: "chat",
        timestamp: Date.now(),
        id: generateId(),
      },
    ])
  }, [])

  // Show explanation and add to chat history
  const showExplanation = useCallback(
    (id: string, content: string) => {
      setCurrentExplanation({ id, content })

      // Add the explanation request to chat history
      addMessage({
        role: "user",
        content: `Can you explain about ${id}?`,
        source: "explanation",
      })

      // Add the explanation response to chat history
      addMessage({
        role: "model",
        content: content,
        source: "explanation",
      })

      // Also maintain the separate explanation history
      setExplanationHistory((prev) => {
        // Don't add duplicates
        if (!prev.some((item) => item.id === id)) {
          return [...prev, { id, content }]
        }
        return prev
      })
    },
    [addMessage],
  )

  const hideExplanation = useCallback(() => {
    setCurrentExplanation(null)
  }, [])

  return (
    <AiContext.Provider
      value={{
        // Explanation functionality
        showExplanation,
        hideExplanation,
        currentExplanation,
        isShowingExplanation: !!currentExplanation,
        explanationHistory,

        // Unified chat history
        chatHistory,
        addMessage,
        getChatHistoryForApi,
        clearChatHistory,
      }}
    >
      {children}
    </AiContext.Provider>
  )
}

export function useAi() {
  const context = useContext(AiContext)
  if (context === undefined) {
    throw new Error("useAi must be used within an AiProvider")
  }
  return context
}
