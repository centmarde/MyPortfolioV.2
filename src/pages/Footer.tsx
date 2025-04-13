import { Button } from "@/components/ui/button"
import { Github, Facebook, Mail, Phone, FileDown } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-xl font-bold">Contact Me</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:your.email@example.com" className="hover:underline">
                 centmarde.campado@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                <a  className="hover:underline">
                  +63 9633490312
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-xl font-bold">Connect With Me</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/centmarde"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
             {/*  <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a> */}
             {/*  <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a> */}
             {/*  <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a> */}
              <a
                href="https://web.facebook.com/centmarde.campado"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>

          {/* CV Download */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-xl font-bold"> Curriculum Vitae</h3>
            <Button
              variant="outline"
              className="bg-transparent border-white hover:bg-white hover:text-slate-900 transition-colors"
              onClick={() => window.open("https://www.dropbox.com/scl/fi/ju882jgxo07go6yax91cv/The-Strongest-Algorithm-CV.pdf?rlkey=pxwakx1eadrb6mn4q115ic2p0&st=xi6uuy1t&dl=0", "_blank")}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Drop Box
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-700 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Centmarde Campado. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
