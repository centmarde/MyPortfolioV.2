"use client"

import { useEffect, useRef } from "react"
import { ArrowUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

type ChatDialogProps = {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  input: string
  setInput: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isTyping: boolean
  isDataLoaded: boolean
  theme: string
  portfolioName?: string
}

export default function ChatDialog({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  handleSubmit,
  isTyping,
  isDataLoaded,
  theme,
  portfolioName,
}: ChatDialogProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const responseRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = "24px"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      responseRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-xl border shadow-2xl flex flex-col max-h-[85vh] ${
          theme === "dark"
            ? "bg-[#1a1a1a] border-[#2d2d2d]"
            : "bg-white border-[#e5e5e5]"
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === "dark" ? "border-[#2d2d2d]" : "border-[#e5e5e5]"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-[#e8e8e8]" : "text-[#2c2c2c]"
            }`}
          >
            Chat
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-md p-2 ${
              theme === "dark"
                ? "text-[#737373] hover:bg-[#2d2d2d] hover:text-[#e8e8e8]"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages area - NO y-axis scroll */}
        <div className="flex-1 px-6 py-4 overflow-y-hidden">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    message.isUser
                      ? theme === "dark"
                        ? "bg-[#2d2d2d] text-[#e8e8e8]"
                        : "bg-[#f4f4f4] text-[#2c2c2c]"
                      : theme === "dark"
                        ? "bg-[#d97706] text-white"
                        : "bg-[#ea580c] text-white"
                  }`}
                >
                  {message.isUser ? "U" : "A"}
                </div>

                {/* Message content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div
                    className={`text-[15px] leading-relaxed break-words ${
                      theme === "dark" ? "text-[#e8e8e8]" : "text-[#2c2c2c]"
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={
                        message.isUser
                          ? { __html: message.content }
                          : {
                              __html: message.content.replace(
                                /<br><think>/g,
                                "<br>"
                              ),
                            }
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <div ref={responseRef} className="h-1" />
          </div>
        </div>

        {/* Input area */}
        <div
          className={`px-6 py-4 border-t ${
            theme === "dark" ? "border-[#2d2d2d]" : "border-[#e5e5e5]"
          }`}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div
              className={`flex items-end rounded-2xl border transition-all ${
                theme === "dark"
                  ? "border-[#3d3d3d] bg-[#2d2d2d] focus-within:border-[#5d5d5d]"
                  : "border-[#d4d4d4] bg-[#f9f9f9] focus-within:border-[#b4b4b4]"
              }`}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  portfolioName
                    ? `Message about ${portfolioName}...`
                    : "Loading..."
                }
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