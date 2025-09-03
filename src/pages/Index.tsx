import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">SmartCoreConnect</h1>
            <Link to="/auth">
              <Button>Sign In / Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Digital Application Submission & Review System
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your application process with our comprehensive platform designed for efficient submission, review, and management.
          </p>
          <Link to="/auth">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Easy Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Submit applications with document uploads and track progress in real-time.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Multi-Role Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dedicated dashboards for administrators, reviewers, and applicants.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Efficient Review</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Streamlined review process with status updates and feedback systems.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instant notifications and live status updates for all stakeholders.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Create Account</h4>
              <p className="text-muted-foreground">
                Sign up and get assigned your appropriate role (applicant, reviewer, or admin).
              </p>
            </div>
            
            <div>
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Submit or Review</h4>
              <p className="text-muted-foreground">
                Applicants submit applications while reviewers evaluate and provide feedback.
              </p>
            </div>
            
            <div>
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Track Progress</h4>
              <p className="text-muted-foreground">
                Monitor application status and receive real-time updates throughout the process.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 SmartCoreConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
