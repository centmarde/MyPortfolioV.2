import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextProps {
  theme: "light" | "dark"
  setTheme: (theme: "dark" | "light") => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark", // Changed from "light" to "dark"
  setTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark") // Changed from "light" to "dark"

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme)
    } else {
      setTheme("dark") // Changed to always default to dark instead of checking system preference
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

