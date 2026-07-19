import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { ThreeLoaderProvider } from './components/ThreeLoaderProvider';
import Navbar from './components/navbar';
import { useTheme } from './components/theme-provider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Welcome from './pages/Welcome';
import TechStack from './pages/TechStack';
import Github from './components/common/Github';
import Hero from './pages/Hero';
import Apex from './pages/Apex';
import Loading from './components/Loader';
import Awards from './pages/Awards';
import Works from './pages/Works';
import Footer from './pages/Footer';
import ChatBox from './components/Chat';
// import OtherPage from './pages/Other';
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Section component for consistent styling
const Section = ({ 
  id, 
  title, 
  children,
  forceTheme,
  isFirstSection = false
}: { 
  id: string; 
  title?: string; // Make title optional
  children: React.ReactNode;
  forceTheme?: 'light' | 'dark'; // Add optional forceTheme prop
  isFirstSection?: boolean; // New prop to identify first section
}) => {
  const { theme, setTheme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const previousThemeRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (!forceTheme || !sectionRef.current) return;
    
    // Create a scroll trigger that changes the theme when this section is visible
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%", 
      end: "bottom 50%",
      onEnter: () => {
        // Save current theme before changing
        previousThemeRef.current = theme;
        setTheme(forceTheme);
      },
      onLeave: () => {
        // Restore previous theme when scrolling away
        if (previousThemeRef.current) {
          setTheme(previousThemeRef.current as "light" | "dark");
        }
      },
      onEnterBack: () => {
        // Re-apply forced theme when scrolling back up
        previousThemeRef.current = theme;
        setTheme(forceTheme);
      },
      onLeaveBack: () => {
        // Restore previous theme when scrolling back up and leaving section
        if (previousThemeRef.current) {
          setTheme(previousThemeRef.current as "light" | "dark");
        }
      }
    });
    
    // Cleanup function
    return () => {
      trigger.kill();
    };
  }, [forceTheme, theme, setTheme]);
  
  return (
    <section 
      id={isFirstSection ? "home" : id} 
      ref={sectionRef}
      className={`min-h-screen py-20 px-4 ${
        theme === "light" ? "bg-[#EEF1DA] text-[#3C3D37]" : "bg-[#181C14] text-[#ECDFCC]"
      }`}
    >
      <div className="container mx-auto">
        {title && ( // Only render title if provided
          <h2 className={`text-3xl font-bold mb-8 ${
            theme === "light" ? "text-[#3C3D37]" : "text-[#ECDFCC]"
          }`}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [assetsProgress, setAssetsProgress] = useState(0);
  
  // Protection flags to prevent infinite loops
  const loadingCompletedRef = useRef(false);
  const assetsLoadedRef = useRef(false);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle the completion of loading
  const handleLoadingComplete = () => {
    if (loadingCompletedRef.current) {
      return;
    }
    
    loadingCompletedRef.current = true;
    setLoading(false);
    // Ensure scroll is enabled and position is at top
    document.body.style.overflow = '';
    document.body.style.height = '';
    window.scrollTo(0, 0);
  };
  
  // Handle when 3D assets are fully loaded
  const handleAssetsLoaded = () => {
    if (assetsLoadedRef.current) {
      return;
    }
    
    assetsLoadedRef.current = true;
    setAssetsProgress(100);
    
    // Clear any existing timeout
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }
    
    // Trigger loading complete after a short delay
    completionTimeoutRef.current = setTimeout(() => {
      handleLoadingComplete();
    }, 800); // Small delay to show 100% before hiding
  };
  
  return (
    <ThemeProvider>
      <ThreeLoaderProvider>
        {loading && <Loading onLoadingComplete={handleLoadingComplete} externalProgress={assetsProgress > 0 ? assetsProgress : undefined} />}
        <AppContent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          loading={loading}
          onAssetsLoaded={handleAssetsLoaded}
        />
      </ThreeLoaderProvider>
    </ThemeProvider>
  );
}

// Create a separate component that will use the theme hook inside the ThemeProvider context
function AppContent({ 
  activeTab, 
  setActiveTab,
  loading,
  onAssetsLoaded
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  loading: boolean;
  onAssetsLoaded: () => void;
}) {
  const { theme } = useTheme();
  const sectionsRef = useRef<HTMLElement[]>([]);
  
  useEffect(() => {
    // Only set up scroll triggers when content is loaded
    if (loading) return;
    
    const sectionIds = ["home", "background", "stack", "certificates", "projects", "others", "contacts"];
    
    // Collect all section elements
    sectionsRef.current = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    
    // Create scroll triggers for each section
    const triggers = sectionsRef.current.map((section) => {
      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveTab(section.id),
        onEnterBack: () => setActiveTab(section.id),
      });
    });
    
    // Cleanup function to kill all scroll triggers when component unmounts
    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, [loading, setActiveTab]);
  
  // Prevent body scrolling while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [loading]);
  
  return (
    <div className="App">
      {!loading && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}

      {/* Home Section with Hero as the first component */}
      <section id="home" className="h-auto min-h-screen">
        <div className="hidden md:block">
          <Hero onFullyLoaded={onAssetsLoaded} /> 
        </div>
        <div className="mt-16 md:mt-0">
          <Apex />
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            fill={theme === "dark" ? "#030712" : "#FFFFFF"} 
            fillOpacity="1" 
            d="M0,128L26.7,117.3C53.3,107,107,85,160,69.3C213.3,53,267,43,320,69.3C373.3,96,427,160,480,202.7C533.3,245,587,267,640,240C693.3,213,747,139,800,128C853.3,117,907,171,960,181.3C1013.3,192,1067,160,1120,144C1173.3,128,1227,128,1280,117.3C1333.3,107,1387,85,1413,74.7L1440,64L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"
          ></path>
        </svg>
      </section>

      {/* Background Section */}
      <Section id="background">
        <Welcome/>
      </Section>

      {/* Stack Section */}
      <Section id="stack">
        <TechStack/>
        <div className="mt-12 w-full">
          <Github username="centmarde" />
        </div>
      </Section>

      {/* Certificates Section */}
      <Section id="certificates">
        <Awards/>
      </Section>

      {/* Projects Section */}
      <Section id="projects">
       <Works/>
      </Section>

      {/* Other Skills Section */}
     {/*  <Section id="others" forceTheme="dark">
        <OtherPage />
      </Section> */}

      
      <Footer/>
      {!loading && <ChatBox />}
    </div>
    
  );
}

export default App;

