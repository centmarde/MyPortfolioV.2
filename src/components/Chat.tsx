"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUp,  Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "../components/theme-provider"

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

// Predefined answers about your background
const infoResponses: Record<string, string> = {
  default: "Hi there! I'm here to provide information about my professional background, skills, and experience. Feel free to ask me anything about my CV, education, or projects!",
  education: "I have a [Your Degree] from [Your University/Institution]. I specialized in [Your Specialization] and graduated in [Year].",
  experience: "I have [X years] of experience in [Your Industry/Field]. I've worked at companies like [Company names] where I [brief description of responsibilities].",
  skills: "My core skills include: [List your top technical skills], [List relevant soft skills], and [Any other relevant skills or certifications].",
  projects: "Some of my notable projects include: [Project 1] where I [brief description], [Project 2] which involved [brief description], and [Project 3] that resulted in [outcomes/impact].",
  contact: "You can reach me at [your email] or connect with me on LinkedIn at [your LinkedIn profile]. I'm currently [your availability status]."
}

// Helper function to find the most relevant response
function getResponseForQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('education') || lowerQuery.includes('study') || lowerQuery.includes('degree')) {
    return infoResponses.education;
  } else if (lowerQuery.includes('experience') || lowerQuery.includes('work') || lowerQuery.includes('job')) {
    return infoResponses.experience;
  } else if (lowerQuery.includes('skill') || lowerQuery.includes('know') || lowerQuery.includes('able')) {
    return infoResponses.skills;
  } else if (lowerQuery.includes('project') || lowerQuery.includes('portfolio')) {
    return infoResponses.projects;
  } else if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach')) {
    return infoResponses.contact;
  }
  
  return "I can provide information about my education, work experience, skills, projects, or contact details. What would you like to know?";
}

export default function ChatBox() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: infoResponses.default,
      isUser: false,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const responseRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  // Scroll to response when new message is added
  useEffect(() => {
    if (messages.length > 0 && !isTyping) {
      responseRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate AI typing
    setIsTyping(true)

    // Generate response based on query
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now().toString()}`,
        content: getResponseForQuery(userMessage.content),
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className={`flex flex-col w-full mx-auto rounded-xl overflow-hidden border ${
      theme === "dark" 
        ? "bg-dark-background text-dark-primary border-dark-tertiary" 
        : "bg-light-tertiary text-dark-tertiary border-light-accent"
    }`}>
      {/* Response area at the top */}
      <div className={`p-6 min-h-[200px] max-h-[400px] overflow-y-auto ${
        theme === "dark"
          ? "bg-dark-tertiary"
          : "bg-light-accent"
      }`}>
        <h2 className={`text-lg font-medium mb-4 ${
          theme === "dark"
            ? "text-dark-primary"
            : "text-light-primary"
        }`}>CV Assistant WIP.. </h2>

        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`p-4 rounded-lg border ${
                message.isUser 
                  ? theme === "dark"
                    ? "bg-dark-primary text-dark-background border-dark-primary ml-8" 
                    : "bg-dark-tertiary text-light-primary border-dark-tertiary ml-8"
                  : theme === "dark"
                    ? "bg-dark-secondary text-dark-primary border-dark-tertiary mr-8"
                    : "bg-light-secondary text-dark-tertiary border-light-tertiary mr-8"
              }`}
            >
              {message.content}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className={`p-4 rounded-lg border mr-8 ${
              theme === "dark"
                ? "bg-dark-secondary text-dark-primary border-dark-tertiary"
                : "bg-light-secondary text-dark-tertiary border-light-tertiary"
            }`}>
              <div className="flex space-x-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${theme === "dark" ? "bg-dark-primary" : "bg-dark-tertiary"}`}></div>
                <div className={`w-2 h-2 rounded-full animate-pulse ${theme === "dark" ? "bg-dark-primary" : "bg-dark-tertiary"}`} style={{ animationDelay: "0.2s" }}></div>
                <div className={`w-2 h-2 rounded-full animate-pulse ${theme === "dark" ? "bg-dark-primary" : "bg-dark-tertiary"}`} style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}

          {/* Keep reference to the latest message for scrolling */}
          <div ref={responseRef} />
        </div>
      </div>

      {/* Input area at the bottom */}
      <div className={`p-4 border-t ${
        theme === "dark"
          ? "border-dark-tertiary bg-dark-background"
          : "border-light-accent bg-light-tertiary"
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
              placeholder="Ask about my CV, experience, skills..."
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
                disabled={!input.trim() || isTyping}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  input.trim() && !isTyping
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
            onClick={() => {
              setInput("Tell me about your education");
              setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
            }}
            className={`flex items-center px-3 py-2 text-xs rounded-md hover:bg-opacity-80 transition-colors ${
              theme === "dark"
                ? "text-dark-primary bg-dark-tertiary border border-dark-secondary" 
                : "text-dark-tertiary bg-light-secondary border border-light-accent"
            }`}>
            <Sparkles className="w-3 h-3 mr-2" />
            Education
          </button>
          <button 
            onClick={() => {
              setInput("What work experience do you have?");
              setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
            }}
            className={`flex items-center px-3 py-2 text-xs rounded-md hover:bg-opacity-80 transition-colors ${
              theme === "dark"
                ? "text-dark-primary bg-dark-tertiary border border-dark-secondary" 
                : "text-dark-tertiary bg-light-secondary border border-light-accent"
            }`}>
            Work Experience
          </button>
          <button 
            onClick={() => {
              setInput("What are your key skills?");
              setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
            }}
            className={`flex items-center px-3 py-2 text-xs rounded-md hover:bg-opacity-80 transition-colors ${
              theme === "dark"
                ? "text-dark-primary bg-dark-tertiary border border-dark-secondary" 
                : "text-dark-tertiary bg-light-secondary border border-light-accent"
            }`}>
            Skills
          </button>
        </div>
      </div>
    </div>
  )
}
