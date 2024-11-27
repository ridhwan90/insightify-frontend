import { createFileRoute, redirect } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    // Check if user is authenticated
    const { currentUser } = context.auth
    if (!currentUser) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate({ to: '/' });
    }
  }, [currentUser, navigate]);

  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2.5%',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Active Users',
      value: '3.2k',
      change: '+12.3%',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Avg. Response Time',
      value: '250ms',
      change: '-8.1%',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '+3.2%',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const recentProjects = [
    { name: 'E-commerce Analytics', status: 'In Progress', date: '2024-02-15' },
    { name: 'Customer Segmentation', status: 'Completed', date: '2024-02-14' },
    { name: 'Sales Forecasting', status: 'In Review', date: '2024-02-13' },
    { name: 'Market Analysis', status: 'Completed', date: '2024-02-12' },
  ];

  return (
    <div className="min-h-full bg-background/50 pb-8">
      {/* Welcome Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="relative px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-semibold">
              Welcome back, <span className="text-primary">{currentUser?.firstName}</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Here's what's happening with your projects today.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover-lift">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="mt-8">
          <Card className="overflow-hidden">
            <div className="border-b border-border/50 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Recent Projects</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {recentProjects.map((project) => (
                <div key={project.name} className="flex items-center justify-between p-6 hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Last updated on {project.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          project.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400'
                        }
                      `}
                    >
                      {project.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-lift">
            <div className="flex h-full flex-col justify-between p-6">
              <div className="space-y-2">
                <div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">New Project</h3>
                <p className="text-sm text-muted-foreground">Create a new AI analysis project from scratch</p>
              </div>
              <Button className="mt-4" variant="outline">
                Get Started
              </Button>
            </div>
          </Card>

          <Card className="hover-lift">
            <div className="flex h-full flex-col justify-between p-6">
              <div className="space-y-2">
                <div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Import Data</h3>
                <p className="text-sm text-muted-foreground">Upload and analyze your existing dataset</p>
              </div>
              <Button className="mt-4" variant="outline">
                Upload Files
              </Button>
            </div>
          </Card>

          <Card className="hover-lift">
            <div className="flex h-full flex-col justify-between p-6">
              <div className="space-y-2">
                <div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">View Reports</h3>
                <p className="text-sm text-muted-foreground">Access your generated insights and reports</p>
              </div>
              <Button className="mt-4" variant="outline">
                Open Reports
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}