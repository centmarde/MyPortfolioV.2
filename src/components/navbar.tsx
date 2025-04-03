import { useState, useEffect, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

interface NavbarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Move indicator to active tab
    const activeTabElement = tabsRef.current.find(
      (_, index) => ["home", "background", "stack", "certificates", "projects", "skills", "contacts"][index] === activeTab
    )
    
    if (activeTabElement && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
        duration: 0.5,
        ease: "power2.out"
      })
    }
  }, [activeTab])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveTab(id)
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

        <nav className="hidden md:flex space-x-6 relative">
          {/* Tab indicator */}
          <div 
            ref={indicatorRef} 
            className={cn(
              "absolute bottom-0 h-0.5 transition-colors",
              theme === "light" ? "bg-[#ADB2D4]" : "bg-[#697565]"
            )}
          />
          
          {[
            { name: "Home", id: "home" },
            { name: "Background", id: "background" },
            { name: "Stack", id: "stack" },
            { name: "Certificates", id: "certificates" },
            { name: "Projects", id: "projects" },
            { name: "Other Skills", id: "skills" },
            { name: "Contacts", id: "contacts" },
          ].map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "text-sm font-medium transition-colors pb-1",
                theme === "light" ? "hover:text-[#ADB2D4]" : "hover:text-[#697565]",
                activeTab === item.id ? (theme === "light" ? "text-[#ADB2D4]" : "text-[#697565]") : ""
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Theme toggle button - visible only on desktop */}
        <div className="hidden md:flex items-center">
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
        <MobileMenu 
          theme={theme} 
          setTheme={setTheme}
          scrollToSection={scrollToSection} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>
    </header>
  )
}

function Logo() {
  const { theme } = useTheme()
  const logoRef = useRef(null)

  useEffect(() => {
    // Create a rotation animation that repeats infinitely
    gsap.to(logoRef.current, {
      rotation: 360,
      duration: 10,
      ease: "linear",
      repeat: -1,
      transformOrigin: "center center",
    })

    // Cleanup function to kill animation when component unmounts
    return () => {
      gsap.killTweensOf(logoRef.current)
    }
  }, []) // Empty dependency array means this runs once on mount

  return (
    <div className="w-8 h-8">
      <svg ref={logoRef} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function MobileMenu({
  theme,
  setTheme,
  scrollToSection,
  activeTab,
}: { 
  theme: string; 
  setTheme: (theme: "dark" | "light") => void;
  scrollToSection: (id: string) => void; 
  activeTab: string; 
  setActiveTab: (id: string) => void 
}) {
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
                  activeTab === item.id ? "underline" : "",
                )}
              >
                {item.name}
              </button>
            ))}
            
            {/* Theme toggle button inside mobile menu */}
            <div className="flex items-center justify-center pt-2">
  <button
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className={cn(
      "flex items-center gap-2 p-2 rounded transition-colors",
      theme === "light" 
        ? "bg-[#D5E5D5] hover:bg-[#C7D9DD]" 
        : "bg-[#3C3D37] hover:bg-[#697565]"
    )}
    aria-label="Toggle theme"
  >
    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
  </button>
</div>
          </nav>
        </div>
      )}
    </div>
  )
}

