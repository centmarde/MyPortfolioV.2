import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/navbar';
import { useTheme } from './components/theme-provider';

// Section component for consistent styling
const Section = ({ 
  id, 
  title, 
  children 
}: { 
  id: string; 
  title: string; 
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
        <h2 className={`text-3xl font-bold mb-8 ${
          theme === "light" ? "text-[#3C3D37]" : "text-[#ECDFCC]"
        }`}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
};

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Navbar />

        {/* Home Section */}
        <section 
          id="home" 
          className="h-screen flex items-center justify-center"
        >
          <HomeContent />
        </section>

        {/* Background Section */}
        <Section id="background" title="Background">
          <p>Your background information goes here.</p>
        </Section>

        {/* Stack Section */}
        <Section id="stack" title="Tech Stack">
          <p>Your tech stack information goes here.</p>
        </Section>

        {/* Certificates Section */}
        <Section id="certificates" title="Certificates">
          <p>Your certificates information goes here.</p>
        </Section>

        {/* Projects Section */}
        <Section id="projects" title="Projects">
          <p>Your projects information goes here.</p>
        </Section>

        {/* Other Skills Section */}
        <Section id="skills" title="Other Skills">
          <p>Your other skills information goes here.</p>
        </Section>

        {/* Contacts Section */}
        <Section id="contacts" title="Contact Me">
          <p>Your contact information goes here.</p>
        </Section>
      </div>
    </ThemeProvider>
  );
}

// Home content component with hero section styling
const HomeContent = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`w-full ${
      theme === "light" ? "bg-[#EEF1DA] text-[#3C3D37]" : "bg-[#181C14] text-[#ECDFCC]"
    }`}>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center h-full">
        <h1 className={`text-5xl md:text-6xl font-bold mb-6 text-center ${
          theme === "light" ? "text-[#3C3D37]" : "text-[#ECDFCC]"
        }`}>
          My Portfolio
        </h1>
        <p className="text-xl text-center max-w-2xl mb-8">
          Welcome to my professional portfolio. I'm a developer passionate about creating beautiful and functional applications.
        </p>
        <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          theme === "light" 
            ? "bg-[#ADB2D4] text-white hover:bg-[#8C91C2]" 
            : "bg-[#697565] text-[#ECDFCC] hover:bg-[#515A4F]"
        }`}>
          View My Work
        </button>
      </div>
    </div>
  );
};

export default App;
