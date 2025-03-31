import { useEffect, useRef } from "react";
import { GitBranch, GitCommit, GitPullRequest, Github as GithubIcon, Star } from "lucide-react";
import gsap from "gsap";
import { useTheme } from "../../components/theme-provider";

interface GithubProps {
  username: string;
}

export default function Github({ username = "centmarde" }: GithubProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Stats cards animation
  useEffect(() => {
    if (!containerRef.current) return;

    const statCards = containerRef.current.querySelectorAll('.stat-card');
    const sections = containerRef.current.querySelectorAll('.animate-section');
    
    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });

    // Animate each section with a clean fade up
    tl.fromTo(sections, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.2, 
        duration: 0.7,
        ease: "power2.out"
      }
    );

    // Animate stat cards with a slight bounce
    tl.fromTo(statCards, 
      { opacity: 0, scale: 0.9, y: 10 },
      { 
        opacity: 1, 
        scale: 1,
        y: 0, 
        stagger: 0.1, 
        duration: 0.5,
        ease: "back.out(1.2)"
      },
      "-=0.3"
    );

    // Setup hover interactions for stat cards
    statCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          duration: 0.3
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          duration: 0.3
        });
      });
    });

    return () => {
      // Cleanup event listeners
      statCards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  const isDark = theme === 'dark';
  const textColor = isDark ? "text-dark-primary" : "text-gray-800";
  const bgColor = isDark ? "bg-dark-tertiary" : "bg-white";
  const accentColor = isDark ? "bg-dark-secondary/30" : "bg-light-tertiary/20";
  const borderColor = isDark ? "border-dark-secondary/20" : "border-light-tertiary/30";

  return (
    <div ref={containerRef} className={`w-full mx-auto py-6 ${textColor}`}>
      <h2 className="text-2xl font-light mb-6 md:mb-8 text-center animate-section">
        GitHub <span className="font-medium">Presence</span>
      </h2>

      <div className="flex flex-col items-center space-y-6 md:space-y-8">
        {/* ROW 1: Minimal Profile Card - Improved mobile layout */}
        <div className={`flex flex-col sm:flex-row items-center ${accentColor} px-4 sm:px-5 py-4 rounded-lg animate-section border-b`}>
          <div className="flex items-center space-x-4 w-full">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-full border-2 border-gray-100 dark:border-gray-800 shadow-sm mb-3 sm:mb-0 sm:block hidden">
  <img 
    src={`https://github.com/${username}.png`} 
    alt={`${username}`}
    className="w-full h-full object-cover"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
    }}
  />
</div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <h3 className="text-lg font-medium">{username}</h3>
                <a 
                  href={`https://github.com/${username}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${isDark ? "bg-dark-tertiary hover:bg-dark-secondary" : "bg-light-tertiary/30 hover:bg-light-tertiary/50"} transition-colors mx-auto sm:mx-0`}
                >
                  <GithubIcon className="w-3 h-3 mr-1" />
                  Profile
                </a>
              </div>
              <p className="text-xs opacity-70 mt-1">Full-stack developer focused on modern web technologies</p>
            </div>
          </div>
        </div>

        {/* ROW 2: Stats Grid - Responsive layout */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full animate-section">
          {/* Stats Cards - 2 columns on mobile, 4 columns on lg */}
          {/* Row 1, Col 1 */}
          <div className={`stat-card ${bgColor} p-3 rounded-lg border ${borderColor} transition-all duration-300 shadow-sm flex flex-col`}>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">Stars</span>
            </div>
            <span className="text-xl sm:text-2xl font-light">120+</span>
          </div>
          
          {/* Row 1, Col 2 */}
          <div className={`stat-card ${bgColor} p-3 rounded-lg border ${borderColor} transition-all duration-300 shadow-sm flex flex-col`}>
            <div className="flex items-center mb-2">
              <GitBranch className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">Forks</span>
            </div>
            <span className="text-xl sm:text-2xl font-light">45+</span>
          </div>
          
          {/* Row 1, Col 3 */}
          <div className={`stat-card ${bgColor} p-3 rounded-lg border ${borderColor} transition-all duration-300 shadow-sm flex flex-col`}>
            <div className="flex items-center mb-2">
              <GitCommit className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">Commits</span>
            </div>
            <span className="text-xl sm:text-2xl font-light">500+</span>
          </div>
          
          {/* Row 1, Col 4 */}
          <div className={`stat-card ${bgColor} p-3 rounded-lg border ${borderColor} transition-all duration-300 shadow-sm flex flex-col`}>
            <div className="flex items-center mb-2">
              <GitPullRequest className="w-4 h-4 mr-2 text-purple-500" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">PRs</span>
            </div>
            <span className="text-xl sm:text-2xl font-light">78+</span>
          </div>
          
          {/* GitHub Trophies - With better mobile handling */}
          <div className={`col-span-2 lg:col-span-4 ${bgColor} p-2 sm:p-3 rounded-lg shadow-sm border ${borderColor} overflow-hidden mt-3`}>
            <div className="w-full overflow-x-auto pb-1 -mx-1 px-1">
              <div className="min-w-[640px]">
                <img 
                  src={`https://github-profile-trophy.vercel.app/?username=${username}&row=1&column=6&theme=${isDark ? 'darkhub' : 'flat'}&margin-w=8&no-frame=true`}
                  alt="GitHub Trophies" 
                  className="max-w-full mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom link */}
        <div className="text-center animate-section mt-2">
          <a 
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm opacity-70 hover:opacity-100 underline" 
          >
            View full activity on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
