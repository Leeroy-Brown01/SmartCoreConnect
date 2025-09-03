import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ReviewerDashboard from '@/components/dashboard/ReviewerDashboard';
import ApplicantDashboard from '@/components/dashboard/ApplicantDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (profile?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'reviewer':
        return <ReviewerDashboard />;
      case 'applicant':
        return <ApplicantDashboard />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to SmartCoreConnect</h2>
            <p className="text-muted-foreground">Your role is being configured. Please contact an administrator.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;