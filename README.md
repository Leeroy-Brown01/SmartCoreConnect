# Review Stream Hub - Digital Application Submission & Review System

A comprehensive web-based platform built with React and Supabase for managing digital application submissions and reviews with real-time updates.

## Features

### User Roles & Permissions

- **Admin Dashboard**
  - Complete system oversight and management
  - User management (view, edit, assign roles)
  - Application monitoring and status updates
  - Reviewer assignment to applications
  - System-wide analytics and reporting

- **Reviewer Dashboard**
  - View assigned applications
  - Review submitted documents and details
  - Update application statuses (Pending, Under Review, Approved, Rejected)
  - Add structured feedback and comments
  - Real-time notifications for new assignments

- **Applicant Dashboard**
  - Submit new applications with documents
  - Track application progress in real-time
  - View submission history
  - Receive status updates and reviewer feedback

### Core Functionality

- **Real-Time Updates**: Live synchronization across all dashboards using Supabase realtime
- **Secure Authentication**: Email/password authentication with role-based access control
- **Document Management**: File upload and storage with secure access controls
- **Status Tracking**: Comprehensive application lifecycle management
- **Comment System**: Structured feedback and communication between reviewers and applicants

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time subscriptions, File storage)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API with custom hooks
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Role-specific dashboard components
│   ├── applications/   # Application-related components
│   ├── layout/        # Layout components
│   └── ui/            # Reusable UI components (shadcn/ui)
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── integrations/      # External service integrations
└── lib/               # Utility functions
supabase/
├── config.toml        # Supabase configuration
└── migrations/        # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase CLI (download from https://github.com/supabase/cli/releases/latest and add to PATH)
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <YOUR_GIT_URL>
cd review-stream-hub
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials (if it doesn't already exist):

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server (connects to your online Supabase project):

```bash
npm run dev
```

### Backend Automation

The application connects to your online Supabase project. The local Supabase scripts are available for local development if needed:

#### Available Scripts

- `npm run dev` - Prompts for Supabase credentials and starts the frontend development server
- `npm run dev:frontend` - Runs only the frontend development server
- `npm run backend:start` - Starts the local Supabase development environment
- `npm run backend:stop` - Stops the local Supabase development environment
- `npm run backend:reset` - Resets and restarts the Supabase environment
- `npm run backend:migrate` - Applies database migrations
- `npm run backend:seed` - Seeds the database with initial data

#### First-Time Setup

When you run `npm run dev` for the first time, the system will:

1. Prompt you to enter your Supabase project URL and anon key
2. Update the .env file with your credentials
3. Start the frontend development server connected to your online Supabase project

#### Manual Backend Management

If you need to manage the backend separately:

```bash
# Start only the backend
npm run backend:start

# Apply migrations manually
npm run backend:migrate

# Stop the backend
npm run backend:stop
```

### Database Setup

The application automatically creates the necessary database tables and policies when first deployed. The schema includes:

- **User Profiles**: Extended user information with role assignments
- **Applications**: Core application data with status tracking
- **Comments**: Reviewer feedback and communication
- **Documents**: File metadata for uploaded documents
- **Storage**: Secure file storage with access controls

### Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Role-Based Permissions**: Granular access control based on user roles
- **Secure File Upload**: Protected document storage with user-specific access
- **Authentication**: Secure email/password authentication with session management

## Deployment

### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/226f41c7-07d7-43dd-aa25-79be3d28f635) and click on Share -> Publish.

### Manual Deployment

The application can be deployed to any static hosting service:

```bash
npm run build
```

Deploy the `dist` folder to your hosting provider.

## Usage

### For Administrators

1. Sign up and get assigned admin role
2. Access the admin dashboard to manage users and applications
3. Assign reviewers to incoming applications
4. Monitor system-wide statistics and activity

### For Reviewers

1. Create an account (admin assigns reviewer role)
2. View assigned applications in the reviewer dashboard
3. Download and review submitted documents
4. Update application statuses and provide feedback
5. Communicate with applicants through the comment system

### For Applicants

1. Sign up for an account
2. Submit applications with required information and documents
3. Track application progress in real-time
4. View reviewer feedback and status updates
5. Maintain a complete submission history

## Features Overview

- ✅ **Multi-role Authentication System**
- ✅ **Real-time Dashboard Updates**
- ✅ **Application Lifecycle Management**
- ✅ **Document Upload & Storage**
- ✅ **Reviewer Assignment System**
- ✅ **Comment & Feedback System**
- ✅ **Responsive Design**
- ✅ **Role-based Access Control**
- ✅ **Real-time Notifications**
- ✅ **Comprehensive User Management**

## Development

### Editing the Code

**Use Lovable**: Visit [Lovable Project](https://lovable.dev/projects/226f41c7-07d7-43dd-aa25-79be3d28f635) and start prompting.

**Use your preferred IDE**: Clone this repo, install dependencies with `npm i`, and run `npm run dev`.

**GitHub Codespaces**: Use the Code button to launch a Codespace environment.

### Technologies Used

- Vite
- TypeScript  
- React 18
- Supabase
- shadcn/ui
- Tailwind CSS
- React Router
- React Hook Form

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the project repository.
