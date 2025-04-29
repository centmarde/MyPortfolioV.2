"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Sparkles } from "lucide-react"
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
  const { chatContent, getBioResponse, bioData } = useResponse()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const responseRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Add initial message when bioData is loaded
  useEffect(() => {
    if (bioData && messages.length === 0) {
      setMessages([
        {
          id: '0',
          content: `Hi there! I'm an AI assistant for ${bioData.name}, a ${bioData.title}. Feel free to ask me anything about their background, skills, or experience!`,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    }
  }, [bioData, messages.length]);

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
      // Get response using the bio information
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

  return (
    <div className={`flex flex-col w-full h-full mx-auto rounded-xl overflow-hidden border shadow-lg ${
      theme === "dark" 
        ? "bg-dark-background/90 text-dark-primary border-dark-tertiary backdrop-blur-xl" 
        : "bg-light-tertiary/90 text-dark-tertiary border-light-accent backdrop-blur-xl"
    }`}>
      {/* Response area at the top - updated with fixed height and improved scrolling */}
      <div 
        className={`p-6 flex-grow overflow-y-auto max-h-[60vh] md:max-h-[60vh] custom-scrollbar ${
          theme === "dark"
            ? "bg-dark-tertiary"
            : "bg-light-accent"
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: theme === "dark" ? '#4a5568 #2d3748' : '#cbd5e0 #edf2f7'
        }}
      >
       

        <div className="space-y-4 overflow-y-auto">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`p-4 rounded-lg border break-words ${
                message.isUser 
                  ? theme === "dark"
                    ? "bg-dark-primary text-dark-background border-dark-primary ml-8" 
                    : "bg-dark-tertiary text-light-primary border-dark-tertiary ml-8"
                  : theme === "dark"
                    ? "bg-dark-secondary text-dark-primary border-dark-tertiary mr-8"
                    : "bg-light-secondary text-dark-tertiary border-light-tertiary mr-8"
              }`}
              dangerouslySetInnerHTML={
                message.isUser ? { __html: message.content } : { __html: message.content.replace(/<br><think>/g, '<br>') }
              }
            />
          ))}
          
          {/* Keep reference to the latest message for scrolling */}
          <div ref={responseRef} className="h-1" />
        </div>
      </div>

      {/* Input area at the bottom */}
      <div className={`p-4 border-t flex-shrink-0 ${
        theme === "dark"
          ? "border-dark-tertiary bg-dark-background/90"
          : "border-light-accent bg-light-tertiary/90"
      }`}>
        <form onSubmit={handleSubmit} className="relative">
          <div className={`flex items-end border rounded-lg focus-within:ring-1 ${
            theme === "dark"
              ? "border-dark-tertiary bg-dark-secondary focus-within:ring-dark-primary focus-within:border-dark-primary"
              : "border-light-accent bg-light-secondary focus-within:ring-dark-tertiary focus-within:border-dark-tertiary"
          }`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={bioData ? `Ask about ${bioData.name}'s skills, experience...` : "Loading..."}
              className={`flex-1 p-3 pr-10 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none placeholder-opacity-70 max-h-[120px] min-h-[24px] ${
                theme === "dark" 
                  ? "text-dark-primary placeholder-dark-primary" 
                  : "text-dark-tertiary placeholder-dark-tertiary"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="flex items-center p-2 space-x-2">
              <button
                type="submit"
                disabled={!input.trim() || isTyping || !bioData}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  input.trim() && !isTyping && bioData
                    ? theme === "dark"
                      ? "bg-dark-primary text-dark-background hover:bg-dark-primary/90"
                      : "bg-dark-tertiary text-light-primary hover:bg-dark-tertiary/90"
                    : theme === "dark"
                      ? "bg-dark-tertiary text-dark-secondary cursor-not-allowed"
                      : "bg-light-accent text-light-primary cursor-not-allowed"
                )}
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            onClick={() => handleQuickQuery("What are your skills and tech stack?")}
            disabled={isTyping || !bioData}
            className={`flex items-center px-3 py-2 text-xs rounded-md hover:bg-opacity-80 transition-colors ${
              theme === "dark"
                ? "text-dark-primary bg-dark-tertiary border border-dark-secondary" 
                : "text-dark-tertiary bg-light-secondary border border-light-accent"
            } ${(isTyping || !bioData) ? "opacity-50 cursor-not-allowed" : ""}`}>
            <Sparkles className="w-3 h-3 mr-2" />
            Skills & Tech
          </button>
          <button 
            onClick={() => handleQuickQuery("Tell me about your background and location")}
            disabled={isTyping || !bioData}
            className={`flex items-center px-3 py-2 text-xs rounded-md hover:bg-opacity-80 transition-colors ${
              theme === "dark"
                ? "text-dark-primary bg-dark-tertiary border border-dark-secondary" 
                : "text-dark-tertiary bg-light-secondary border border-light-accent"
            } ${(isTyping || !bioData) ? "opacity-50 cursor-not-allowed" : ""}`}>
            Background
          </button>
          <button 
            onClick={() => handleQuickQuery("How can someone contact you?")}
            disabled={isTyping || !bioData}
            className={`flex items-center px-3 py-2 text-xs rounded-md hover:bg-opacity-80 transition-colors ${
              theme === "dark"
                ? "text-dark-primary bg-dark-tertiary border border-dark-secondary" 
                : "text-dark-tertiary bg-light-secondary border border-light-accent"
            } ${(isTyping || !bioData) ? "opacity-50 cursor-not-allowed" : ""}`}>
            Contact Info
          </button>
        </div>
      </div>
    </div>
  )
}
