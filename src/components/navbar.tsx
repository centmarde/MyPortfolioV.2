"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "py-2 shadow-md" : "py-4",
        theme === "light" ? "bg-[#EEF1DA] text-[#3C3D37]" : "bg-[#181C14] text-[#ECDFCC]",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        <nav className="hidden md:flex space-x-6">
          {[
            { name: "Home", id: "home" },
            { name: "Background", id: "background" },
            { name: "Stack", id: "stack" },
            { name: "Certificates", id: "certificates" },
            { name: "Projects", id: "projects" },
            { name: "Other Skills", id: "skills" },
            { name: "Contacts", id: "contacts" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "text-sm font-medium transition-colors hover:underline",
                theme === "light" ? "hover:text-[#ADB2D4]" : "hover:text-[#697565]",
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              theme === "light"
                ? "bg-[#D5E5D5] hover:bg-[#C7D9DD] focus:ring-[#ADB2D4]"
                : "bg-[#3C3D37] hover:bg-[#697565] focus:ring-[#ECDFCC]",
            )}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <MobileMenu theme={theme} scrollToSection={scrollToSection} />
      </div>
    </header>
  )
}

function Logo() {
  const { theme } = useTheme()

  return (
    <div className="w-8 h-8 animate-spin-slow">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" stroke={theme === "light" ? "#ADB2D4" : "#697565"} strokeWidth="2" />
        <path
          d="M16 4L16 28"
          stroke={theme === "light" ? "#C7D9DD" : "#ECDFCC"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 16L28 16"
          stroke={theme === "light" ? "#C7D9DD" : "#ECDFCC"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function MobileMenu({ theme, scrollToSection }: { theme: string; scrollToSection: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded transition-colors",
          theme === "light" ? "bg-[#D5E5D5] hover:bg-[#C7D9DD]" : "bg-[#3C3D37] hover:bg-[#697565]",
        )}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isOpen ? (
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 p-4 shadow-lg",
            theme === "light" ? "bg-[#EEF1DA] text-[#3C3D37]" : "bg-[#181C14] text-[#ECDFCC]",
          )}
        >
          <nav className="flex flex-col space-y-4">
            {[
              { name: "Home", id: "home" },
              { name: "Background", id: "background" },
              { name: "Stack", id: "stack" },
              { name: "Certificates", id: "certificates" },
              { name: "Projects", id: "projects" },
              { name: "Other Skills", id: "skills" },
              { name: "Contacts", id: "contacts" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "text-sm font-medium transition-colors hover:underline py-2",
                  theme === "light" ? "hover:text-[#ADB2D4]" : "hover:text-[#697565]",
                )}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

