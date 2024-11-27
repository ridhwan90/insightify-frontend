import { Link } from "@tanstack/react-router"
import Logo from '@/assets/insightify-logo.svg'
import { FaGithub } from "react-icons/fa"
import { IoLogoVercel } from "react-icons/io5"

const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/yourusername/insightify',
      icon: <FaGithub className="h-4 w-4" />
    },
    {
      name: 'Deployment',
      href: 'https://insightify.vercel.app',
      icon: <IoLogoVercel className="h-4 w-4" />
    }
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-4xl px-4 py-2">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
          <div className="flex items-center gap-3">
            <Link 
              to="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <img src={Logo} alt="Insightify Logo" className="h-5 w-5" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-sm font-semibold text-transparent">
                Insightify
              </span>
            </Link>
            <span className="hidden text-sm text-muted-foreground/80 md:inline">
              |
            </span>
            <span className="text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} All rights reserved
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Terms of Service
            </Link>
            <div className="flex items-center gap-3 border-l border-border/50 pl-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer