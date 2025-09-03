import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Application {
  id: string;
  applicant_id: string;
  title: string;
  description: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  assigned_reviewer_id: string | null;
  submitted_at: string;
  updated_at: string;
  applicant?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  assigned_reviewer?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchApplications = async () => {
    if (!profile) return;

    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          applicant:profiles!applications_applicant_id_fkey(first_name, last_name, email),
          assigned_reviewer:profiles!applications_assigned_reviewer_id_fkey(first_name, last_name, email)
        `);

      // Filter based on user role
      if (profile.role === 'applicant') {
        query = query.eq('applicant_id', profile.id);
      } else if (profile.role === 'reviewer') {
        query = query.eq('assigned_reviewer_id', profile.id);
      }
      // Admin sees all applications (no additional filter needed)

      const { data, error } = await query.order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error in fetchApplications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();

    // Set up real-time subscription
    const channel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const createApplication = async (title: string, description: string) => {
    if (!profile || profile.role !== 'applicant') return;

    const { data, error } = await supabase
      .from('applications')
      .insert({
        applicant_id: profile.id,
        title,
        description
      })
      .select()
      .single();

    if (!error) {
      fetchApplications();
    }

    return { data, error };
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    if (!profile || (profile.role !== 'admin' && profile.role !== 'reviewer')) return;

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (!error) {
      fetchApplications();
    }

    return { data, error };
  };

  const assignReviewer = async (applicationId: string, reviewerId: string) => {
    if (!profile || profile.role !== 'admin') return;

    const { data, error } = await supabase
      .from('applications')
      .update({ assigned_reviewer_id: reviewerId })
      .eq('id', applicationId)
      .select()
      .single();

    if (!error) {
      fetchApplications();
    }

    return { data, error };
  };

  return {
    applications,
    loading,
    createApplication,
    updateApplicationStatus,
    assignReviewer,
    refetch: fetchApplications
  };
};