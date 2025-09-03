-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'reviewer', 'applicant');

-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'applicant',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  assigned_reviewer_id UUID REFERENCES public.profiles(id),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create application documents table
CREATE TABLE public.application_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on application documents
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- Create application comments table for reviewer feedback
CREATE TABLE public.application_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on application comments
ALTER TABLE public.application_comments ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = required_role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for applications
CREATE POLICY "Applicants can view their own applications" ON public.applications
FOR SELECT USING (
  applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Reviewers can view assigned applications" ON public.applications
FOR SELECT USING (
  assigned_reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can view all applications" ON public.applications
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Applicants can insert their own applications" ON public.applications
FOR INSERT WITH CHECK (
  applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Reviewers can update assigned applications" ON public.applications
FOR UPDATE USING (
  assigned_reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for application documents
CREATE POLICY "Users can view documents for accessible applications" ON public.application_documents
FOR SELECT USING (
  application_id IN (
    SELECT id FROM public.applications 
    WHERE applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR assigned_reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Applicants can insert documents for their applications" ON public.application_documents
FOR INSERT WITH CHECK (
  application_id IN (
    SELECT id FROM public.applications 
    WHERE applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- RLS Policies for application comments
CREATE POLICY "Users can view comments for accessible applications" ON public.application_comments
FOR SELECT USING (
  application_id IN (
    SELECT id FROM public.applications 
    WHERE applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR assigned_reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Reviewers can insert comments for assigned applications" ON public.application_comments
FOR INSERT WITH CHECK (
  reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  AND (
    application_id IN (
      SELECT id FROM public.applications 
      WHERE assigned_reviewer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Create storage bucket for application documents
INSERT INTO storage.buckets (id, name, public) VALUES ('application-documents', 'application-documents', false);

-- Storage policies for application documents
CREATE POLICY "Users can view documents for accessible applications" ON storage.objects
FOR SELECT USING (
  bucket_id = 'application-documents' 
  AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
);

CREATE POLICY "Applicants can upload documents for their applications" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'application-documents'
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    'applicant'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.application_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;