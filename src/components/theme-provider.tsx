import type React from "react"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { gsap } from "gsap"

interface ThemeContextProps {
  theme: "light" | "dark"
  setTheme: (theme: "dark" | "light") => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
  setTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const overlayRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme)
    } else {
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", theme)
    
    // Skip animation on initial render
    if (!overlayRef.current) return
    
    // Prevent multiple animations from running simultaneously
    if (isAnimating.current) return
    isAnimating.current = true
    
    // Determine colors based on the new theme
    const themeColor = theme === "dark" ? "#181C14" : "#EEF1DA"
    
    // Create the animation sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Update the document class after the animation
        if (theme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
        isAnimating.current = false
      }
    })
    
    // Animation sequence
    tl.set(overlayRef.current, { display: "block", background: themeColor })
      .to(overlayRef.current, { 
        opacity: 0.7, 
        duration: 0.3, 
        ease: "power2.inOut" 
      })
      .to(overlayRef.current, { 
        opacity: 0, 
        duration: 0.5, 
        delay: 0.1, 
        ease: "power2.out" 
      })
      .set(overlayRef.current, { display: "none" })
    
  }, [theme])

  const handleThemeChange = (newTheme: "dark" | "light") => {
    if (theme !== newTheme && !isAnimating.current) {
      setTheme(newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {/* Theme transition overlay */}
      <div 
        ref={overlayRef}
        style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
          pointerEvents: "none",
          display: "none",
          opacity: 0,
        }}
      />
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

