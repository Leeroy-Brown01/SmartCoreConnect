import React, { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, Clock, CheckCircle, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ApplicationComments from '@/components/applications/ApplicationComments';

const ApplicantDashboard = () => {
  const { applications, loading, createApplication } = useApplications();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [newApplication, setNewApplication] = useState({
    title: '',
    description: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'under_review':
        return <Badge variant="outline">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    if (!newApplication.title.trim() || !newApplication.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsCreating(false);
      return;
    }

    const { error } = await createApplication(newApplication.title, newApplication.description);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Application submitted successfully"
      });
      setNewApplication({ title: '', description: '' });
    }
    
    setIsCreating(false);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    underReview: applications.filter(app => app.status === 'under_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applicant Dashboard</h2>
          <p className="text-muted-foreground">
            Submit and track your applications
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit New Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Application Title</Label>
                <Input
                  id="title"
                  value={newApplication.title}
                  onChange={(e) => setNewApplication({ ...newApplication, title: e.target.value })}
                  placeholder="Enter application title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newApplication.description}
                  onChange={(e) => setNewApplication({ ...newApplication, description: e.target.value })}
                  placeholder="Describe your application in detail"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>
            Track the status of all your submitted applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Reviewer</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.title}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>
                    {app.assigned_reviewer ? (
                      <span>
                        {app.assigned_reviewer.first_name} {app.assigned_reviewer.last_name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{selectedApplication?.title}</DialogTitle>
                        </DialogHeader>
                        {selectedApplication && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Status</h4>
                              {getStatusBadge(selectedApplication.status)}
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedApplication.description}
                              </p>
                            </div>
                            
                            {selectedApplication.assigned_reviewer && (
                              <div>
                                <h4 className="font-medium mb-2">Assigned Reviewer</h4>
                                <p className="text-sm">
                                  {selectedApplication.assigned_reviewer.first_name} {selectedApplication.assigned_reviewer.last_name}
                                </p>
                              </div>
                            )}

                            <ApplicationComments applicationId={selectedApplication.id} />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {applications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You haven't submitted any applications yet. Click "New Application" to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantDashboard;