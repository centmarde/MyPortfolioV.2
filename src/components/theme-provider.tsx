import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextProps {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme)
    } else {
      window.matchMedia("(prefers-color-scheme: dark)").matches ? setTheme("dark") : setTheme("light")
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

