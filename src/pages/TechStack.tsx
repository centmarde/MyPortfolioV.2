import { useEffect, useRef } from "react"
import {
  Box,
  Brain,
  Code,
  Code2,
  Database,
  FileCode,
  FileCode2,
  Flame,
  FlaskRoundIcon as Flask,
  Layers,
  LayoutGrid,
  Palette,
  PanelLeft,
  Send,
  Server,
  Smartphone,
  Store,
  Atom,
  Container,
} from "lucide-react"
import gsap from "gsap"

export default function TechStackShowcase() {
  const techStackRef = useRef<HTMLDivElement>(null)
  const firstRowRef = useRef<HTMLDivElement>(null)
  const secondRowRef = useRef<HTMLDivElement>(null)

  const firstRow = [
    {
      name: "Docker",
      icon: <Container className="h-8 w-8" />,
      image: "/logo/docker.png?text=Docker&height=40&width=40",
    },
    {
      name: "TensorFlow",
      icon: <Brain className="h-8 w-8" />,
      image: "/logo/TensorFlow.png?text=TF&height=40&width=40",
    },
    {
      name: "Anaconda",
      icon: <Code className="h-8 w-8" />,
      image: "/logo/Anaconda.png?text=Anaconda&height=40&width=40",
    },
    {
      name: "Django",
      icon: <Server className="h-8 w-8" />,
      image: "/logo/Django.png?text=Django&height=40&width=40",
    },
    {
      name: "Flask",
      icon: <Flask className="h-8 w-8" />,
      image: "/logo/Flask.png?text=Flask&height=40&width=40",
    },
    {
      name: "Laravel",
      icon: <FileCode className="h-8 w-8" />,
      image: "/logo/Laravel.png?text=Laravel&height=40&width=40",
    },
    {
      name: "Postman",
      icon: <Send className="h-8 w-8" />,
      image: "/logo/Postman.png?text=Postman&height=40&width=40",
    },
    {
      name: "Supabase",
      icon: <Database className="h-8 w-8" />,
      image: "/logo/supabase.svg?text=Supabase&height=40&width=40",
    },
    {
      name: "Firebase",
      icon: <Flame className="h-8 w-8" />,
      image: "/logo/Firebase.png?text=Firebase&height=40&width=40",
    },
    {
      name: "Svelte",
      icon: <FileCode2 className="h-8 w-8" />,
      image: "/logo/Svelte.png?text=Svelte&height=40&width=40",
    },
  ]

  const secondRow = [
    {
      name: "React.js",
      icon: <Atom className="h-8 w-8" />,
      image: "/logo/React.png?text=React&height=40&width=40",
    },
    {
      name: "Vue 3",
      icon: <Code2 className="h-8 w-8" />,
      image: "/logo/Vue.js.png?text=Vue&height=40&width=40",
    },
    {
      name: "TypeScript",
      icon: <Layers className="h-8 w-8" />,
      image: "/logo/typescript.png?text=TS&height=40&width=40",
    },
    {
      name: "Three Js",
      icon: <Store className="h-8 w-8" />,
      image: "/logo/Three.js.png?text=Pinia&height=40&width=40",
    },
    {
      name: "Vuetify",
      icon: <PanelLeft className="h-8 w-8" />,
      image: "/logo/Veutify.png?text=Vuetify&height=40&width=40",
    },
    {
      name: "Material UI",
      icon: <Palette className="h-8 w-8" />,
      image: "/logo/Material UI.png?text=MUI&height=40&width=40",
    },
    {
      name: "Bootstrap",
      icon: <Box className="h-8 w-8" />,
      image: "/logo/Bootstrap.png?text=Bootstrap&height=40&width=40",
    },
    {
      name: "Tailwind",
      icon: <LayoutGrid className="h-8 w-8" />,
      image: "/logo/Tailwind CSS.png?text=Tailwind&height=40&width=40",
    },
    {
      name: "Flutter",
      icon: <Smartphone className="h-8 w-8" />,
      image: "/logo/Flutter.png?text=Flutter&height=40&width=40",
    },
    {
      name: "Git",
      icon: <Code2 className="h-8 w-8" />,
      image: "/logo/Git.png?text=Git&height=40&width=40",
    },
  ]

  // Combined array for mobile view
  const allTechnologies = [...firstRow, ...secondRow]

  // GSAP entrance animation
  useEffect(() => {
    if (!techStackRef.current || !firstRowRef.current || !secondRowRef.current) return

    // Get all tech items
    const allTechItems = techStackRef.current.querySelectorAll(".tech-item")
    const firstRowItems = firstRowRef.current.querySelectorAll(".tech-item")
    const secondRowItems = secondRowRef.current.querySelectorAll(".tech-item")

    // Reset any existing animations
    gsap.set([...allTechItems], {
      opacity: 0,
      y: 20,
    })

    // Create timeline for entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    // Check if we're on mobile (2-column layout) or desktop
    const isMobile = window.innerWidth < 640

    if (isMobile) {
      // Mobile animation (animate all items)
      tl.to(allTechItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
      })
    } else {
      // Desktop animation (animate rows separately)
      tl.to(firstRowItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
      })

      tl.to(
        secondRowItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
        },
        "-=0.3"
      )
    }

    // Handle resize events to adjust animations
    const handleResize = () => {
      // Reset and re-run animations when screen size changes
      gsap.killTweensOf(allTechItems)
      tl.restart()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto py-1 px-4">
      <h2 className="text-2xl font-normal mb-8 text-center">Tech Stack</h2>
      <p className="text-center max-w-3xl mx-auto mb-10">
        Equipped with modern technologies and frameworks that enable me to build robust, scalable, and user-friendly applications.
        From front-end development to back-end solutions and containerization, these tools form the foundation of my technical expertise.
      </p>

      <div className="space-y-12" ref={techStackRef}>
        {/* Mobile view - single grid with 2 columns */}
        <div className="grid grid-cols-2 gap-4 sm:hidden">
          {allTechnologies.map((tech) => (
            <div key={tech.name} className="tech-item flex flex-col items-center cursor-pointer">
              <div className="mb-2 h-12 w-12 flex items-center justify-center">
                <div className="relative h-12 w-12">
                  <img
                    src={tech.image || "/placeholder.svg"}
                    alt={tech.name}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <span className="text-xs text-center text-gray-600 dark:text-gray-400">{tech.name}</span>
            </div>
          ))}
        </div>

        {/* Desktop view - two rows with 10 columns */}
        <div ref={firstRowRef} className="hidden sm:grid sm:grid-cols-5 md:grid-cols-10 gap-2">
          {firstRow.map((tech) => (
            <div key={tech.name} className="tech-item flex flex-col items-center cursor-pointer">
              <div className="mb-2 h-10 w-10 flex items-center justify-center">
                <div className="relative h-10 w-10">
                  <img
                    src={tech.image || "/placeholder.svg"}
                    alt={tech.name}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400">{tech.name}</span>
            </div>
          ))}
        </div>

        {/* Second Row - Desktop only */}
        <div ref={secondRowRef} className="hidden sm:grid sm:grid-cols-5 md:grid-cols-10 gap-2">
          {secondRow.map((tech) => (
            <div key={tech.name} className="tech-item flex flex-col items-center cursor-pointer">
              <div className="mb-2 h-10 w-10 flex items-center justify-center">
                <div className="relative h-10 w-10">
                  <img
                    src={tech.image || "/placeholder.svg"}
                    alt={tech.name}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

