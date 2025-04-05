import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "lucide-react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import PortfolioSections from "@/components/common/Portfolio"
// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  // References for animated elements
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create a timeline for sequenced animations
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    })

    // Text animations with staggered reveal
    if (headingRef.current) {
      tl.fromTo(headingRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }
      )
    }
    
    if (descriptionRef.current) {
      tl.fromTo(descriptionRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7 }, 
        "-=0.4"
      )
    }
    
    // Button animations
    if (buttonsRef.current && buttonsRef.current.children) {
      tl.fromTo(buttonsRef.current.children, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.2 }, 
        "-=0.3"
      )
    }
    
    // Social icons with bouncy effect
    if (socialsRef.current && socialsRef.current.children) {
      tl.fromTo(socialsRef.current.children, 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.7)" }, 
        "-=0.2"
      )
    }
    
    // Profile image reveal
    if (imageRef.current) {
      tl.fromTo(imageRef.current, 
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1 },
        "-=1.5"
      )
    }

    // Play the animation immediately on load for initial view
    tl.play();

    // Create ScrollTrigger to control the animation timeline when scrolling
    if (sectionRef.current) {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current, // Target the section reference directly
        start: "top 80%", 
        end: "bottom 20%",
        onEnter: () => tl.restart(),
        onEnterBack: () => tl.restart(),
        once: false // Allow multiple triggering
      });
      
      // Cleanup
      return () => {
        st.kill();
        tl.kill();
      };
    }
  }, []);

  return (
    <div ref={sectionRef} className="flex min-h-screen flex-col">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 order-2 lg:order-1">
                <div className="space-y-2">
                  <h1 ref={headingRef} className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Hi, I'm <span className="text-primary">Centmarde</span>
                  </h1>
                  <p ref={descriptionRef} className="max-w-[600px] text-muted-foreground md:text-xl">
                    A passionate full-stack developer specializing in building exceptional digital experiences. I focus
                    on creating responsive, user-friendly applications with modern technologies.
                  </p>
                </div>
                <div ref={buttonsRef} className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex items-center gap-2">
                    View My Work
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">Download Resume</Button>
                </div>
                <div ref={socialsRef} className="flex gap-4 mt-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </a>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                <div className="relative w-[280px] h-[320px] sm:w-[350px] sm:h-[400px] lg:w-[400px] lg:h-[450px] overflow-hidden rounded-lg">
                  <div ref={imageRef} className="w-full h-full bg-muted">
                    <img
                      src="/test.jpg"
                      alt="Profile Image"
                      className="object-cover w-full h-full"
                      width={400}
                      height={450}
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <PortfolioSections />
      </main>
    
    </div>
  )
}

