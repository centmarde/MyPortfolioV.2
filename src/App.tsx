import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/navbar';
import { useTheme } from './components/theme-provider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Welcome from './pages/Welcome';
import TechStack from './pages/TechStack';
import Github from './components/common/Github';
import Hero from './pages/Hero';
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Section component for consistent styling
const Section = ({ 
  id, 
  title, 
  children 
}: { 
  id: string; 
  title?: string; // Make title optional
  children: React.ReactNode 
}) => {
  const { theme } = useTheme();
  
  return (
    <section 
      id={id} 
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
  const sectionsRef = useRef<HTMLElement[]>([]);
  const sectionIds = ["home", "background", "stack", "certificates", "projects", "skills", "contacts"];

  useEffect(() => {
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
  }, []);

  return (
    <ThemeProvider>
      <div className="App">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Home Section - Adjusted height to match Hero component */}
        <section 
          id="home" 
          className="h-[1000vh]" // Changed to 500vh to match Hero's internal height
        >
          <Hero />
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
          <p>Your certificates information goes here.</p>
        </Section>

        {/* Projects Section */}
        <Section id="projects">
          <p>Your projects information goes here.</p>
        </Section>

        {/* Other Skills Section */}
        <Section id="skills">
          <p>Your other skills information goes here.</p>
        </Section>

        {/* Contacts Section */}
        <Section id="contacts">
          <p>Your contact information goes here.</p>
        </Section>
      </div>
    </ThemeProvider>
  );
}

export default App;
