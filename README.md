# Trust TAI OS - Role-Based Onboarding System

A Next.js 14 application with Supabase authentication and role-based dashboards.

## Features

- 🔐 Supabase Authentication
- 🎯 Role-based onboarding flow
- 📊 Custom dashboards for each role
- 🎨 Modern UI with Tailwind CSS
- 🔒 Middleware-based route protection
- 📱 Responsive design

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trust-tai-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Go to Settings > API to get your project URL and anon key
   - Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   Run this SQL in your Supabase SQL editor:

   ```sql
   -- Create users table
   CREATE TABLE users (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT NOT NULL,
     role TEXT,
     role_selected_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON users
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON users
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can insert own profile" ON users
     FOR INSERT WITH CHECK (auth.uid() = id);

   -- Create function to handle new user signup
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.users (id, email)
     VALUES (NEW.id, NEW.email);
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger for new user signup
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── actions/
│   │   └── updateRole.ts          # Server action for updating user roles
│   ├── dashboard/
│   │   ├── executive/
│   │   ├── project-manager/
│   │   ├── developer/
│   │   ├── support-lead/
│   │   ├── support-agent/
│   │   ├── hr/
│   │   └── sales/
│   ├── login/
│   ├── onboarding/
│   └── layout.tsx
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── RoleCard.tsx
├── lib/
│   ├── auth.ts                    # Authentication utilities
│   └── supabaseClient.ts          # Supabase client configuration
└── middleware.ts                  # Route protection middleware
```

## Available Roles

1. **Executive** - Strategic leadership and decision-making
2. **Project Manager** - Coordinate and manage project teams
3. **Developer** - Build and maintain software applications
4. **Support Lead** - Lead customer support team
5. **Support Agent** - Provide customer support
6. **HR** - Manage human resources
7. **Sales** - Drive revenue growth

## Key Features

### Authentication Flow
- Users sign up/sign in via Supabase Auth
- After successful authentication, users are redirected to `/onboarding`
- Users must select a role before accessing dashboards

### Role Selection
- Beautiful card-based interface for role selection
- Each role card includes an icon, title, and description
- Hover effects and selected states
- Responsive grid layout

### Dashboard Access
- Role-based dashboards with custom content
- Middleware protection ensures users can only access their assigned dashboard
- Automatic redirection for unauthorized access

### Security
- Server-side authentication checks
- Row-level security in Supabase
- Protected routes with middleware

## Customization

### Adding New Roles
1. Add the role to the `roles` array in `src/app/onboarding/page.tsx`
2. Create a new dashboard page in `src/app/dashboard/[role-name]/`
3. Update the middleware role mapping in `src/middleware.ts`

### Styling
- Uses Tailwind CSS with custom theme colors
- Custom shadows and gradients
- Responsive design patterns

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify

3. **Set environment variables**
   Make sure to set the Supabase environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details 