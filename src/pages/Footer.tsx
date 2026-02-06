import { useState, useEffect } from "react"
import { Github, Facebook, Mail, Phone, FileDown, Sparkles, ExternalLink } from "lucide-react"

// Custom hook for animated text effect
function useAnimatedText(text: string, interval: number = 150) {
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)
  
  useEffect(() => {
    if (index <= text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayText(text.slice(0, index))
        setIndex(index + 1)
      }, interval)
      
      return () => clearTimeout(timeoutId)
    }
  }, [index, text, interval])
  
  return displayText
}

// Custom hook for tracking online status
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    
    function handleOffline() {
      setIsOnline(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return isOnline
}

function SocialLink({ href, icon: Icon, label }: { href: string, icon: React.ComponentType<React.SVGProps<SVGSVGElement>>, label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-light-tertiary dark:hover:text-dark-primary transition-colors group flex items-center gap-1"
    >
      <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
      <span className="sr-only">{label}</span>
    </a>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const isOnline = useOnlineStatus()
  const slogan = useAnimatedText("Let's build something amazing together!")
  
  return (
    <footer className="w-full bg-dark-tertiary text-light-primary py-12 relative overflow-hidden">
      {/* Animated background sparkles - purely decorative */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles 
            key={i} 
            className="absolute animate-pulse" 
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              width: `${30 + Math.random() * 20}px`,
              height: `${30 + Math.random() * 20}px`
            }} 
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4">
        {/* Animated slogan */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-light-accent dark:text-dark-primary">
            {slogan}<span className="animate-pulse">|</span>
          </h2>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-xl font-bold border-b-2 border-light-accent dark:border-dark-primary pb-2">Contact Me</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 group hover:text-light-accent dark:hover:text-dark-primary transition-colors">
                <Mail className="h-5 w-5 group-hover:animate-bounce" />
                <a href="mailto:centmarde.campado@gmail.com" className="hover:underline">
                  centmarde.campado@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 group hover:text-light-accent dark:hover:text-dark-primary transition-colors">
                <Phone className="h-5 w-5 group-hover:animate-bounce" />
                <span className="hover:underline">
                  +63 9633490312
                </span>
              </div>
              <div className="text-sm mt-3 flex justify-center">
                {isOnline ? (
                  <span className="text-light-secondary dark:text-dark-secondary flex items-center gap-1">
                    <span className="w-2 h-2 bg-light-secondary dark:bg-dark-secondary rounded-full inline-block animate-pulse"></span> Online and available for work
                  </span>
                ) : (
                  <span className="text-light-tertiary dark:text-dark-tertiary">Currently offline</span>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-xl font-bold border-b-2 border-light-accent dark:border-dark-primary pb-2">Connect With Me</h3>
            <div className="flex flex-wrap justify-center gap-5">
              <SocialLink 
                href="https://github.com/centmarde" 
                icon={Github} 
                label="GitHub" 
              />
              <SocialLink 
                href="https://web.facebook.com/centmarde.campado" 
                icon={Facebook} 
                label="Facebook" 
              />
            </div>
          </div>

          {/* CV Download */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-xl font-bold border-b-2 border-light-accent dark:border-dark-primary pb-2">Curriculum Vitae</h3>
            <a
              href="/CV/CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="/CV/CV.pdf"
              className="bg-transparent border border-light-primary hover:bg-light-primary hover:text-dark-tertiary dark:border-dark-primary dark:hover:bg-dark-primary dark:hover:text-dark-tertiary transition-colors group relative overflow-hidden px-4 py-2 rounded-md inline-flex items-center"
            >
              <span className="absolute inset-0 w-0 bg-light-accent dark:bg-dark-primary transition-all duration-300 ease-out group-hover:w-full opacity-20"></span>
              <FileDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Download Resume
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-light-tertiary dark:border-dark-tertiary text-center text-sm text-light-tertiary dark:text-dark-primary">
          <p>© {currentYear} Centmarde Campado. All rights reserved.</p>
          <p className="mt-1 text-xs opacity-70">Designed with React, Tailwind CSS, and passion</p>
        </div>
      </div>
    </footer>
  )
}
