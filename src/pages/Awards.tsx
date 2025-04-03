import { useTheme } from "@/components/theme-provider"
import { Certs, CertificateItem } from "@/components/common/Certs"

export default function Awards() {
  const { theme } = useTheme()

  // Top 3 awards
  const topAwards: CertificateItem[] = [
    {
      id: 1,
      title: "Innovation Excellence Award",
      issuer: "Tech Industry Association",
      date: "December 2023",
      image: "/images/awards/innovation-award.jpg" // Add placeholder image path
    },
    {
      id: 2,
      title: "Leadership Achievement Award",
      issuer: "Leadership Foundation",
      date: "September 2023",
      image: "/images/awards/leadership-award.jpg" // Add placeholder image path
    },
    {
      id: 3,
      title: "Rising Star Award",
      issuer: "Industry Conference 2022",
      date: "May 2022",
      image: "/images/awards/rising-star-award.jpg" // Add placeholder image path
    },
  ]

  // Certificates
  const certificates: CertificateItem[] = [
    {
      id: 1,
      title: "Full Stack Web Development",
      issuer: "Coding Academy",
      date: "June 2023",
      image: "/images/certificates/fullstack-cert.jpg" // Add placeholder image path
    },
    {
      id: 2,
      title: "UX/UI Design Fundamentals",
      issuer: "Design Institute",
      date: "March 2023",
      image: "/images/certificates/uxui-cert.jpg" // Add placeholder image path
    },
    {
      id: 3,
      title: "Project Management Professional (PMP)",
      issuer: "Project Management Institute",
      date: "November 2022",
      image: "/images/certificates/pmp-cert.jpg" // Add placeholder image path
    },
    {
      id: 4,
      title: "Data Science Specialization",
      issuer: "Tech University",
      date: "July 2022",
      image: "/images/certificates/datascience-cert.jpg" // Add placeholder image path
    },
  ]

  // Award and certificate background image paths
  const awardBgPath = "/misc/awards.svg"
  const certificateBgPath = "/misc/awards.svg"

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
        opacity: isAward ? 0.85 : 0.75,
        mixBlendMode: 'soft-light' as const
      }
    }
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
  )
}

