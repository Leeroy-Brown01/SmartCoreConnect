import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  application_id: string;
  reviewer_id: string;
  comment: string;
  created_at: string;
  reviewer: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface ApplicationCommentsProps {
  applicationId: string;
}

const ApplicationComments: React.FC<ApplicationCommentsProps> = ({ applicationId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { profile } = useAuth();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('application_comments')
        .select(`
          *,
          reviewer:profiles!application_comments_reviewer_id_fkey(first_name, last_name, email)
        `)
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error in fetchComments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up real-time subscription for comments
    const channel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'application_comments',
          filter: `application_id=eq.${applicationId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicationId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    if (!profile || (profile.role !== 'admin' && profile.role !== 'reviewer')) {
      toast({
        title: "Error",
        description: "Only reviewers and admins can add comments",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('application_comments')
        .insert({
          application_id: applicationId,
          reviewer_id: profile.id,
          comment: newComment.trim()
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "destructive"
        });
      } else {
        setNewComment('');
        toast({
          title: "Success",
          description: "Comment added successfully"
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const canAddComments = profile && (profile.role === 'admin' || profile.role === 'reviewer');

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-4">Comments & Feedback</h4>
        
        {comments.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.reviewer.first_name, comment.reviewer.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {comment.reviewer.first_name} {comment.reviewer.last_name}
                      </span>
                      <Badge variant="outline" className="text-xs">Reviewer</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()} at{' '}
                        {new Date(comment.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {canAddComments && (
          <form onSubmit={handleSubmitComment} className="mt-4 space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your feedback or comments..."
              rows={3}
            />
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? 'Adding Comment...' : 'Add Comment'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationComments;