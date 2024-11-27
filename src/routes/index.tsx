import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // If user is already authenticated, redirect to dashboard
    if (context.auth?.currentUser) {
      throw redirect({
        to: '/dashboard'
      })
    }
  },
  component: Index
});

function Index() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Double-check in component in case user state changes after initial load
    if (currentUser) {
      navigate({ to: '/dashboard' });
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Content */}
            <div className="flex flex-col justify-center lg:col-span-6">
              <div className="animate-smooth space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  AI-Powered
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Insights </span>
                  Platform
                </h1>
                <p className="text-lg text-muted-foreground">
                  Transform your data into actionable insights with our advanced AI analytics. 
                  Make faster, smarter decisions with powerful machine learning algorithms.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="gradient" size="lg" className="animate-smooth group">
                    Get Started
                    <svg 
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="lg" className="animate-smooth">
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="lg:col-span-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card variant="glass" className="p-6 hover-lift">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-primary/10 p-3 text-primary">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Real-time Analysis</h3>
                    <p className="text-muted-foreground">Instant insights from your data</p>
                  </div>
                </Card>
                
                <Card variant="glass" className="p-6 hover-lift">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-primary/10 p-3 text-primary">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Smart Predictions</h3>
                    <p className="text-muted-foreground">Data-driven forecasting</p>
                  </div>
                </Card>
                
                <Card variant="glass" className="p-6 hover-lift">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-primary/10 p-3 text-primary">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Custom Analytics</h3>
                    <p className="text-muted-foreground">Tailored to your needs</p>
                  </div>
                </Card>
                
                <Card variant="glass" className="p-6 hover-lift">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-primary/10 p-3 text-primary">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Secure & Private</h3>
                    <p className="text-muted-foreground">Enterprise-grade security</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}