import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'reviewer' | 'applicant';
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchProfiles = async () => {
    if (!profile || profile.role !== 'admin') {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error in fetchProfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [profile]);

  const updateUserRole = async (profileId: string, newRole: Profile['role']) => {
    if (!profile || profile.role !== 'admin') return;

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profileId)
      .select()
      .single();

    if (!error) {
      fetchProfiles();
    }

    return { data, error };
  };

  const getReviewers = () => {
    return profiles.filter(p => p.role === 'reviewer');
  };

  return {
    profiles,
    loading,
    updateUserRole,
    getReviewers,
    refetch: fetchProfiles
  };
};