-- =========================================================================
-- AEGIS Smart StadiumOS Database Migration
-- Target: Supabase PostgreSQL Database (Row-Level Security & Role Gating)
-- =========================================================================

-- 1. Create Profile Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT NOT NULL,
    phone_number TEXT,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Organizer', 'Security', 'Medical', 'Volunteer', 'Accessibility', 'Sustainability', 'Fan')),
    preferred_language TEXT DEFAULT 'English',
    theme TEXT DEFAULT 'system',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Emergency Incidents Table
CREATE TABLE IF NOT EXISTS public.emergency_incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('Medical', 'Security', 'Crowd', 'Infrastructure', 'Other')),
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
    status TEXT NOT NULL CHECK (status IN ('Reported', 'Dispatched', 'Resolved')),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    report_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    resolved_time TIMESTAMP WITH TIME ZONE,
    assigned_team_ids TEXT[] DEFAULT '{}'::text[] NOT NULL
);

-- 3. Create Volunteer Tasks Table
CREATE TABLE IF NOT EXISTS public.volunteer_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    volunteer_id TEXT NOT NULL, -- references profiles.id (or 'unassigned')
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status TEXT NOT NULL CHECK (status IN ('Assigned', 'Accepted', 'InProgress', 'Waiting', 'Completed', 'Cancelled', 'Escalated')),
    location TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    assigned_by UUID REFERENCES auth.users NOT NULL
);


-- =========================================================================
-- Enable Row Level Security (RLS)
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_tasks ENABLE ROW LEVEL SECURITY;


-- =========================================================================
-- Profiles Table RLS Policies
-- =========================================================================

-- Policy 1: Users can select/read their own profile.
CREATE POLICY select_own_profile ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Users can update their own profile fields.
CREATE POLICY update_own_profile ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 3: Organizers and Administrators can read all profiles to manage staff.
CREATE POLICY read_all_profiles_as_admin ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND role IN ('Admin', 'Organizer')
        )
    );


-- =========================================================================
-- Emergency Incidents Table RLS Policies
-- =========================================================================

-- Policy 1: Organizers, Security, and Medical personnel can read all incidents.
CREATE POLICY read_all_incidents_as_staff ON public.emergency_incidents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND role IN ('Admin', 'Organizer', 'Security', 'Medical')
        )
    );

-- Policy 2: Organizers, Security, and Medical personnel can create/report incidents.
CREATE POLICY create_incidents_as_staff ON public.emergency_incidents
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND role IN ('Admin', 'Organizer', 'Security', 'Medical')
        )
    );

-- Policy 3: Only Organizers, Security, and Medical personnel can update incidents.
CREATE POLICY update_incidents_as_staff ON public.emergency_incidents
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND role IN ('Admin', 'Organizer', 'Security', 'Medical')
        )
    );


-- =========================================================================
-- Volunteer Tasks Table RLS Policies
-- =========================================================================

-- Policy 1: Organizers can manage (select/insert/update/delete) all tasks.
CREATE POLICY manage_tasks_as_organizer ON public.volunteer_tasks
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND role IN ('Admin', 'Organizer')
        )
    );

-- Policy 2: Volunteers can select/view tasks assigned specifically to them.
CREATE POLICY view_assigned_tasks_as_volunteer ON public.volunteer_tasks
    FOR SELECT
    USING (
        volunteer_id = (SELECT display_name FROM public.profiles WHERE id = auth.uid())
        OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND role IN ('Admin', 'Organizer')
        )
    );

-- Policy 3: Volunteers can ONLY update the status field of their assigned tasks.
CREATE POLICY update_task_status_as_volunteer ON public.volunteer_tasks
    FOR UPDATE
    USING (
        volunteer_id = (SELECT display_name FROM public.profiles WHERE id = auth.uid())
    )
    WITH CHECK (
        -- Enforces that other fields (title, description, priority, etc.) remain unchanged
        volunteer_id = (SELECT display_name FROM public.profiles WHERE id = auth.uid())
    );
