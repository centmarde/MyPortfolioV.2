"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "../components/theme-provider"
import { useResponse } from "@/services/response"

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
  const responseRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = "24px"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  // Modified scroll behavior for better experience
  useEffect(() => {
    if (messages.length > 0) {
      responseRef.current?.scrollIntoView({ 
        behavior: isTyping ? "auto" : "smooth",
        block: "end" 
      });
    }
  }, [messages, isTyping, chatContent]);

  // Update messages when chatContent changes
  useEffect(() => {
    if (chatContent && isTyping) {
      const tempMessage = {
        id: `ai-typing-${Date.now().toString()}`,
        content: chatContent,
        isUser: false,
        timestamp: new Date(),
      };
      
      // Find and replace the typing indicator message
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

    // Add user message and clear input
    setMessages(prev => [...prev, userMessage])
    setInput("")

    // Set typing indicator
    setIsTyping(true)
    
    // Add initial AI typing message
    const typingMessage: Message = {
      id: `ai-typing-${Date.now().toString()}`,
      content: "",
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, typingMessage]);
    
    try {
      // Get response using the portfolio information
      await getBioResponse(userMessage.content);
      
      // Typing completed
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      setMessages(prev => {
        // Remove the typing indicator
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

  const handleQuickQuery = (query: string) => {
    setInput(query);
    setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
  };
  
  // Check if all portfolio data is loaded
  const isDataLoaded = portfolioData.bio && portfolioData.works && portfolioData.highlights && portfolioData.achievements;

  return (
    <div className={`flex flex-col w-full h-full max-w-4xl mx-auto ${
      theme === "dark" 
        ? "bg-[#1a1a1a] text-[#e8e8e8]" 
        : "bg-white text-[#2c2c2c]"
    }`}>
      {/* Messages area */}
      <div 
        className={`flex-1 overflow-y-auto px-4 md:px-6 ${
          theme === "dark"
            ? "bg-[#1a1a1a]"
            : "bg-white"
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: theme === "dark" ? '#333 #1a1a1a' : '#d4d4d4 #fff'
        }}
      >
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.map(message => (
            <div 
              key={message.id}
              className="flex gap-4"
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                message.isUser 
                  ? theme === "dark"
                    ? "bg-[#2d2d2d] text-[#e8e8e8]"
                    : "bg-[#f4f4f4] text-[#2c2c2c]"
                  : theme === "dark"
                    ? "bg-[#d97706] text-white"
                    : "bg-[#ea580c] text-white"
              }`}>
                {message.isUser ? "U" : "A"}
              </div>
              
              {/* Message content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className={`text-[15px] leading-relaxed break-words ${
                  theme === "dark" ? "text-[#e8e8e8]" : "text-[#2c2c2c]"
                }`}>
                  <div 
                    dangerouslySetInnerHTML={
                      message.isUser 
                        ? { __html: message.content } 
                        : { __html: message.content.replace(/<br><think>/g, '<br>') }
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* Keep reference to the latest message for scrolling */}
          <div ref={responseRef} className="h-1" />
        </div>
      </div>

      {/* Input area - Fixed at bottom */}
      <div className={`border-t flex-shrink-0 ${
        theme === "dark"
          ? "border-[#2d2d2d] bg-[#1a1a1a]"
          : "border-[#e5e5e5] bg-white"
      }`}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
          {/* Quick actions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => handleQuickQuery("What are your skills and tech stack?")}
                disabled={isTyping || !isDataLoaded}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-[#2d2d2d] text-[#e8e8e8] hover:bg-[#3d3d3d] border border-[#3d3d3d]" 
                    : "bg-[#f4f4f4] text-[#2c2c2c] hover:bg-[#e5e5e5] border border-[#e5e5e5]"
                } ${(isTyping || !isDataLoaded) ? "opacity-50 cursor-not-allowed" : ""}`}>
                Skills & Tech
              </button>
              <button 
                onClick={() => handleQuickQuery("Tell me about your projects and work experience")}
                disabled={isTyping || !isDataLoaded}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-[#2d2d2d] text-[#e8e8e8] hover:bg-[#3d3d3d] border border-[#3d3d3d]" 
                    : "bg-[#f4f4f4] text-[#2c2c2c] hover:bg-[#e5e5e5] border border-[#e5e5e5]"
                } ${(isTyping || !isDataLoaded) ? "opacity-50 cursor-not-allowed" : ""}`}>
                Projects
              </button>
              <button 
                onClick={() => handleQuickQuery("What certifications and achievements do you have?")}
                disabled={isTyping || !isDataLoaded}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-[#2d2d2d] text-[#e8e8e8] hover:bg-[#3d3d3d] border border-[#3d3d3d]" 
                    : "bg-[#f4f4f4] text-[#2c2c2c] hover:bg-[#e5e5e5] border border-[#e5e5e5]"
                } ${(isTyping || !isDataLoaded) ? "opacity-50 cursor-not-allowed" : ""}`}>
                Achievements
              </button>
              <button 
                onClick={() => handleQuickQuery("How can someone contact you?")}
                disabled={isTyping || !isDataLoaded}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-[#2d2d2d] text-[#e8e8e8] hover:bg-[#3d3d3d] border border-[#3d3d3d]" 
                    : "bg-[#f4f4f4] text-[#2c2c2c] hover:bg-[#e5e5e5] border border-[#e5e5e5]"
                } ${(isTyping || !isDataLoaded) ? "opacity-50 cursor-not-allowed" : ""}`}>
                Contact
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="relative">
            <div className={`flex items-end rounded-2xl border transition-all ${
              theme === "dark"
                ? "border-[#3d3d3d] bg-[#2d2d2d] focus-within:border-[#5d5d5d]"
                : "border-[#d4d4d4] bg-[#f9f9f9] focus-within:border-[#b4b4b4]"
            }`}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={portfolioData.bio ? `Message about ${portfolioData.bio.name}...` : "Loading..."}
                className={`flex-1 px-4 py-3 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none max-h-[200px] min-h-[52px] text-[15px] leading-relaxed ${
                  theme === "dark" 
                    ? "text-[#e8e8e8] placeholder-[#737373]" 
                    : "text-[#2c2c2c] placeholder-[#6b6b6b]"
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                rows={1}
              />
              <div className="flex items-center pb-2 pr-2">
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping || !isDataLoaded}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    input.trim() && !isTyping && isDataLoaded
                      ? theme === "dark"
                        ? "bg-[#d97706] text-white hover:bg-[#b45309]"
                        : "bg-[#ea580c] text-white hover:bg-[#c2410c]"
                      : theme === "dark"
                        ? "bg-[#3d3d3d] text-[#737373] cursor-not-allowed"
                        : "bg-[#e5e5e5] text-[#a3a3a3] cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
