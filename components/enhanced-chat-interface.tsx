"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowRight, Sparkles, X, RefreshCw } from "lucide-react"
import { useAi } from "@/contexts/ai-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAirQuality } from "@/contexts/air-quality-context"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export default function EnhancedChatInterface({ isOpen, onClose }: EnhancedChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { chatHistory, addMessage, getChatHistoryForApi, clearChatHistory } = useAi()
  const inputRef = useRef<HTMLInputElement>(null)
  const chatCardRef = useRef<HTMLDivElement>(null)
  const { airQualityData } = useAirQuality()

  // Filter messages to only show those from the chat source or without a source
  const displayMessages = chatHistory.filter((msg) => !msg.source || msg.source === "chat")

  // Suggested queries that users might want to ask
  const suggestedQueries = [
    "What does AQI mean?",
    "Is PM2.5 dangerous?",
    "How can I protect myself on bad air days?",
    "What causes air pollution?",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  // Focus the input when the chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle click outside to close the chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatCardRef.current && !chatCardRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    // Add user message to the unified chat history
    addMessage({
      role: "user",
      content: messageText,
      source: "chat",
    })

    setInput("")
    setIsLoading(true)

    try {
      // Call our API route with the complete chat history
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          chatHistory: getChatHistoryForApi(),
          context: {
            location: airQualityData?.location || "unknown location",
            aqi: airQualityData?.aqi || 0,
            category: airQualityData?.category || "unknown",
            mainPollutant: airQualityData?.mainPollutant || "unknown",
            healthImplications: airQualityData?.healthImplications || "",
            // Add detailed pollutant information
            pollutants: airQualityData?.pollutants || {},
            timestamp: airQualityData?.timestamp || new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      // Add assistant response to the unified chat history
      addMessage({
        role: "model",
        content: data.response,
        source: "chat",
      })
    } catch (error) {
      console.error("Error generating response:", error)
      addMessage({
        role: "model",
        content: "Oops! I had a little hiccup processing that. Can you try asking again? 😅",
        source: "chat",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(query)
  }

  const handleClearChat = () => {
    clearChatHistory()
  }

  // Function to process message content and make AQI values clickable
  const processMessageContent = (content: string) => {
    // This regex looks for patterns like "AQI of 42" or "AQI is 42" or "AQI: 42"
    const aqiRegex = /(AQI(?:\s+(?:of|is|:|about))?\s+)(\d+)/gi

    // This regex looks for pollutant measurements like "PM2.5: 12 μg/m³" or "PM10 level of 25"
    const pollutantRegex =
      /(PM2\.5|PM10|Ozone|NO2|SO2|CO)(?:\s+(?:of|is|:|about|level|concentration))?\s+(\d+(?:\.\d+)?)/gi

    const parts = []
    let lastIndex = 0

    // Process AQI values
    content.replace(aqiRegex, (match, prefix, value, index) => {
      // Add text before the match
      if (index > lastIndex) {
        parts.push(content.substring(lastIndex, index))
      }

      // Add the prefix (e.g., "AQI of ")
      parts.push(prefix)

      // Add the clickable value
      const aqiValue = Number.parseInt(value)
      parts.push(
        <button
          key={`aqi-${index}`}
          onClick={() => handleSendMessage(`What does an AQI of ${value} mean?`)}
          className="font-medium text-sky-600 hover:text-sky-800 underline underline-offset-2 transition-colors"
        >
          {value}
        </button>,
      )

      lastIndex = index + match.length
      return match // This return value is not used
    })

    // Process pollutant values
    let tempContent = content
    if (lastIndex < content.length) {
      tempContent = content.substring(lastIndex)
    }

    const tempParts = []
    lastIndex = 0

    tempContent.replace(pollutantRegex, (match, pollutant, value, index) => {
      // Add text before the match
      if (index > lastIndex) {
        tempParts.push(tempContent.substring(lastIndex, index))
      }

      // Add the pollutant name
      tempParts.push(`${pollutant} `)

      // Add the clickable value
      tempParts.push(
        <button
          key={`pollutant-${index}`}
          onClick={() => handleSendMessage(`What does ${pollutant} ${value} mean?`)}
          className="font-medium text-sky-600 hover:text-sky-800 underline underline-offset-2 transition-colors"
        >
          {value}
        </button>,
      )

      lastIndex = index + match.length
      return match // This return value is not used
    })

    // Add any remaining text
    if (lastIndex < tempContent.length) {
      tempParts.push(tempContent.substring(lastIndex))
    }

    // Combine all parts
    if (parts.length > 0) {
      return [...parts, ...tempParts]
    } else if (tempParts.length > 0) {
      return tempParts
    } else {
      return content
    }
  }

  // remove asterisk from the message content
  const removeAsterisk = (content: string) => {
    return content.replace(/\*/g, "")
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inset-0"
          />
          <motion.div
            ref={chatCardRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-3xl max-h-[90vh] z-10"
          >
            <Card className="w-full h-full flex flex-col shadow-xl border-sky-200 overflow-hidden">
              <CardHeader className="px-4 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white flex flex-row items-center justify-between space-y-0 border-b border-sky-800">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h2 className="font-semibold tracking-tight">Chat with Breezy</h2>
                  {airQualityData && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      AQI: {airQualityData.aqi} in {airQualityData.location}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full text-white hover:bg-white/20 transition-colors"
                    onClick={handleClearChat}
                    title="Clear chat history"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="sr-only">Clear chat</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose()
                    }}
                    className="h-8 w-8 rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-grow overflow-hidden p-0 bg-gradient-to-b from-sky-50 to-white">
                <div className="space-y-4 overflow-y-auto p-4 max-h-[50vh] scroll-smooth">
                  {displayMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="bg-sky-100 p-3 rounded-full mb-3">
                        <Sparkles className="h-6 w-6 text-sky-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Welcome to Breezy Chat!</h3>
                      <p className="text-sm text-gray-600 max-w-md">
                        Ask me anything about air quality, pollution, health effects, or how to protect yourself on bad
                        air days.
                      </p>
                    </div>
                  ) : (
                    displayMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-4 py-2.5 shadow-sm ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white"
                              : "bg-white border border-sky-100 text-gray-800"
                          }`}
                        >
                            {message.role === "user" ? (
                              removeAsterisk(message.content)
                            ) : (
                              <span>{processMessageContent(removeAsterisk(message.content))}</span>
                            )}
                        </div>
                      </motion.div>
                    ))
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-sky-100 text-gray-800 rounded-lg px-4 py-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-sky-600 animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 rounded-full bg-sky-600 animate-bounce [animation-delay:0.4s]" />
                          </div>
                          <span className="text-sm text-gray-500">Breezy is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-4 py-3 bg-white border-t border-sky-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Questions:</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestedQueries.map((query, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSuggestedQuery(query)}
                        className="text-xs px-3 py-1.5 bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 text-sky-700 rounded-full border border-sky-200 transition-colors flex items-center gap-1 disabled:opacity-50 shadow-sm"
                        disabled={isLoading}
                      >
                        <span>{query}</span>
                        <ArrowRight className="h-3 w-3" />
                      </motion.button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      placeholder="Ask me anything about air quality..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 border-sky-200 focus-visible:ring-sky-500 shadow-sm"
                      disabled={isLoading}
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-sm transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
