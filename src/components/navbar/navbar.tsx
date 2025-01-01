import { Link, useNavigate } from '@tanstack/react-router'
import Logo from '@/assets/insightify-logo.svg'
import { Button } from '@/components/ui/button'
import { useAuth } from '../auth/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const logOutHandler = async () => {
    try {
      await logout();
      // Force navigation to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still try to navigate even if logout fails
      window.location.href = '/';
    }
  }

  // Navigation items for logged out users
  const publicNavItems = [
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
  ]

  // Navigation items for logged in users
  const privateNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'AI Chat', path: '/chat' },
    { name: 'AI Architect', path: '/architect' },
  ]

  const navItems = currentUser ? privateNavItems : publicNavItems

  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-smooth">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div className="relative mx-auto max-w-screen-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to={currentUser ? '/dashboard' : '/'}
            className="flex items-center gap-2 text-2xl font-black transition-opacity hover:opacity-80"
          >
            <span className="flex items-center justify-center">
              <img
                src={Logo}
                alt="Insightify Logo"
                width={36}
                height={36}
                className="h-9 w-9"
              />
            </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Insightify
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 hover-lift">
                    <span className="text-sm font-medium text-foreground">
                      {currentUser.firstName}
                    </span>
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage
                        src={currentUser.picture || undefined}
                        alt={`${currentUser.firstName}'s profile`}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {currentUser.firstName.charAt(0).toUpperCase()}
                        {currentUser.lastName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{`${currentUser.firstName} ${currentUser.lastName}`}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate({ to: '/dashboard' })}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate({ to: '/settings' })}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:bg-destructive/10"
                    onClick={logOutHandler}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" className="hidden sm:inline-flex">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button variant="gradient">
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
