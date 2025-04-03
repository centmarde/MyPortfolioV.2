import { useState, useEffect } from 'react';
import { useTheme } from './theme-provider';

interface LoadingProps {
  onLoadingComplete: () => void;
}

// Collection of development-related quotes
const devQuotes = [
  "Code is like humor. When you have to explain it, it's bad. – Cory House",
  "Programming isn't about what you know; it's about what you can figure out. – Chris Pine",
  "The only way to learn a new programming language is by writing programs in it. – Dennis Ritchie",
  "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. – Dan Salomon",
  "Good code is its own best documentation. – Steve McConnell",
  "The best error message is the one that never shows up. – Thomas Fuchs",
  "First, solve the problem. Then, write the code. – John Johnson",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. – Martin Fowler",
  "Experience is the name everyone gives to their mistakes. – Oscar Wilde",
  "Programming is the art of telling another human what one wants the computer to do. – Donald Knuth",
  "Simplicity is the soul of efficiency. – Austin Freeman",
  "It's not a bug – it's an undocumented feature. – Anonymous",
  "The most disastrous thing that you can ever learn is your first programming language. – Alan Kay",
  "Java is to JavaScript what car is to carpet. – Chris Heilmann",
  "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. – Antoine de Saint-Exupery"
];

export default function Loading({ onLoadingComplete }: LoadingProps) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * devQuotes.length));
  const [quoteVisible, setQuoteVisible] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 600); // Allow time for fade out animation
          return 100;
        }
        return prev + 2; // Increase by 2% every interval to complete in roughly 5 seconds
      });
    }, 100);
    
    // Change quote every 3 seconds with fade transition
    const quoteInterval = setInterval(() => {
      // Start fade out
      setQuoteVisible(false);
      
      // After fade out completes, change quote and fade in
      setTimeout(() => {
        setQuoteIndex(prev => (prev + 1) % devQuotes.length);
        setQuoteVisible(true);
      }, 500); // Wait for fade out to complete
      
    }, 5000); // Changed from 2000ms to 3000ms
    
    return () => {
      clearInterval(interval);
      clearInterval(quoteInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-light-primary via-light-secondary to-light-tertiary dark:from-dark-background dark:via-dark-tertiary dark:to-dark-secondary transition-opacity duration-600 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ 
        pointerEvents: fadeOut ? "none" : "all",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme === 'dark' 
          ? "var(--bg-gradient-dark, linear-gradient(to bottom right, #121212, #1f1f1f, #2d2d2d))"
          : "var(--bg-gradient-light, linear-gradient(to bottom right, #ffffff, #f3f4f6, #e5e7eb))",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Quote section with fade transition */}
      <div className="max-w-md px-6 mb-12 text-center h-28 flex items-center justify-center">
        <p 
          className={`text-lg text-light-accent dark:text-dark-primary font-medium italic transition-opacity duration-500 ${quoteVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          "{devQuotes[quoteIndex]}"
        </p>
      </div>
      
      <div className="relative w-64 h-3 bg-light-tertiary/30 dark:bg-dark-tertiary/30 rounded-full overflow-hidden backdrop-blur-md">
        <div 
          className="h-full bg-gradient-to-r from-light-accent to-light-secondary dark:from-dark-primary dark:to-dark-secondary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        
        {/* Animated glow effect */}
        <div 
          className="absolute top-0 h-full w-10 bg-white/30 skew-x-12 animate-[shimmer_1.5s_infinite]"
          style={{ 
            left: `${progress - 10}%`,
            display: progress < 5 ? 'none' : 'block',
            filter: 'blur(4px)'
          }}
        />
      </div>
      
      <h3 className="mt-6 text-xl font-medium text-light-accent dark:text-dark-primary animate-pulse">
        Loading Experience
      </h3>
      
      <p className="mt-2 text-light-accent/80 dark:text-dark-primary/80 font-medium text-sm">
        {progress < 100 ? `${progress}% complete` : 'Ready!'}
      </p>
      
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <p className="text-xs text-light-accent/60 dark:text-dark-primary/60 tracking-widest animate-pulse">
          EXPLORING CREATIVITY
        </p>
      </div>
    </div>
  );
}
