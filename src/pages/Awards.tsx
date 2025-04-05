import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Certs, CertificateItem } from "@/components/common/Certs";
import { getAchievements } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function Awards() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topAwards, setTopAwards] = useState<CertificateItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAchievements();
        setTopAwards(data.topAwards);
        setCertificates(data.certificates);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
        setError('Failed to load achievements data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Award and certificate background image paths
  const awardBgPath = "/misc/awards.svg";
  const certificateBgPath = "/misc/awards.svg";

  // SVG styling based on theme
  const getSvgStyle = (isAward = true) => {
    if (theme === 'dark') {
      return {
        filter: isAward ? 'invert(0.3) hue-rotate(180deg)' : 'invert(0.2) hue-rotate(210deg)',
        opacity: isAward ? 0.7 : 0.6,
        mixBlendMode: 'multiply' as const
      }
    } else {
      return {
        filter: isAward ? 'hue-rotate(15deg) saturate(1.2)' : 'hue-rotate(-15deg) saturate(1.1)',
        opacity: isAward ? 0.6 : 0.75,
        mixBlendMode: 'soft-light' as const
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading achievements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-100 dark:bg-red-800/30 px-4 py-2 rounded hover:bg-red-200 dark:hover:bg-red-800/50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-dark-primary">Achievements & Qualifications</h1>
        <p className="text-muted-foreground dark:text-dark-secondary light:text-light-tertiary max-w-2xl mx-auto">
          A collection of my professional recognitions and certifications throughout my career journey.
        </p>
      </div>

      {/* Top Awards Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center dark:text-dark-primary">Top Awards</h2>
        <Certs 
          items={topAwards} 
          itemType="award" 
          bgPath={awardBgPath} 
          svgStyle={getSvgStyle(true)} 
          isDark={theme === 'dark'} 
        />
      </section>

      {/* Certificates Section */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center dark:text-dark-primary">Certificates</h2>
        <Certs 
          items={certificates} 
          itemType="certificate" 
          bgPath={certificateBgPath} 
          svgStyle={getSvgStyle(false)} 
          isDark={theme === 'dark'} 
        />
      </section>
    </div>
  );
}

