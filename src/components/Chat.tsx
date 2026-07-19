"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "../components/theme-provider"
import { useResponse } from "@/services/response"
import ChatDialog from "./dialogs/ChatDialog"

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatBox() {
  const { theme } = useTheme()
  const { chatContent, getBioResponse, portfolioData } = useResponse()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Add initial message when portfolioData is loaded
  useEffect(() => {
    if (portfolioData.bio && messages.length === 0) {
      setMessages([
        {
          id: '0',
          content: `Hi there! I'm an AI assistant for ${portfolioData.bio.name}, a ${portfolioData.bio.title}. I have information about their skills, work history, projects, achievements, and more. Feel free to ask me anything about their portfolio!`,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    }
  }, [portfolioData.bio, messages.length]);

  // Update messages when chatContent changes
  useEffect(() => {
    if (chatContent && isTyping) {
      const tempMessage = {
        id: `ai-typing-${Date.now().toString()}`,
        content: chatContent,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.id.startsWith('ai-typing-')) {
          return [...prev.slice(0, -1), tempMessage];
        }
        return [...prev, tempMessage];
      });
    }
  }, [chatContent, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now().toString()}`,
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    const typingMessage: Message = {
      id: `ai-typing-${Date.now().toString()}`,
      content: "",
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, typingMessage]);

    try {
      await getBioResponse(userMessage.content);
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting response:', error);

      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== typingMessage.id);
        return [...withoutTyping, {
          id: `ai-${Date.now().toString()}`,
          content: "I'm sorry, I encountered an issue while processing your request.",
          isUser: false,
          timestamp: new Date(),
        }];
      });

      setIsTyping(false);
    }
  }

  const isDataLoaded = !!(portfolioData.bio && portfolioData.works && portfolioData.highlights && portfolioData.achievements);

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all hover:scale-105",
          theme === "dark"
            ? "bg-[#d97706] text-white hover:bg-[#b45309]"
            : "bg-[#ea580c] text-white hover:bg-[#c2410c]"
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Chat</span>
      </button>

      {/* Chat dialog */}
      <ChatDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isTyping={isTyping}
        isDataLoaded={isDataLoaded}
        theme={theme}
        portfolioName={portfolioData.bio?.name}
      />
    </>
  )
}