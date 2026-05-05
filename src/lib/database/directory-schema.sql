-- Pain Medicine Leaders Directory Database Schema

-- Profiles table for user profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase auth
  membership_code TEXT,
  full_name TEXT NOT NULL,
  professional_email TEXT UNIQUE,
  profile_picture TEXT, -- JSON array of image URLs
  institution TEXT,
  job_role TEXT,
  role_title TEXT, -- President, Professor, etc.
  nationality TEXT,
  address TEXT,
  areas_of_interest TEXT[], -- JSON array
  affiliated_pain_society TEXT[], -- JSON array
  linkedin_profile TEXT,
  twitter_profile TEXT, -- X (formerly Twitter)
  publications_link TEXT,
  bio TEXT, -- "Please tell us about yourself"
  status TEXT DEFAULT 'CONFIRMED', -- CONFIRMED, PENDING, etc.
  is_public BOOLEAN DEFAULT true, -- Profile visibility
  show_email_to_connections BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections table for member connections
CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Messages table for direct messaging
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table for special interest groups
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group memberships
CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- admin, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, profile_id)
);

-- Collaboration requests
CREATE TABLE IF NOT EXISTS collaboration_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- message, connection_request, collaboration_request, group_invite
  title TEXT NOT NULL,
  content TEXT,
  related_id UUID, -- ID of related entity (message, connection, etc.)
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(professional_email);
CREATE INDEX IF NOT EXISTS idx_profiles_institution ON profiles(institution);
CREATE INDEX IF NOT EXISTS idx_profiles_nationality ON profiles(nationality);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public);

CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_recipient ON connections(recipient_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_groups_creator ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_private ON groups(is_private);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_profile ON group_members(profile_id);

CREATE INDEX IF NOT EXISTS idx_collaboration_requester ON collaboration_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_recipient ON collaboration_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_status ON collaboration_requests(status);

CREATE INDEX IF NOT EXISTS idx_notifications_profile ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can view public profiles" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    
    CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can view public profiles" ON profiles FOR SELECT USING (is_public = true);
    CREATE POLICY "Connected users can view profiles" ON profiles FOR SELECT USING (
        is_public = false AND 
        (
            auth.uid() IN (
                SELECT requester_id FROM connections 
                WHERE recipient_id = profiles.user_id AND status = 'accepted'
                UNION
                SELECT recipient_id FROM connections 
                WHERE requester_id = profiles.user_id AND status = 'accepted'
            )
        )
    );
    CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
END $$;

-- RLS Policies for Connections
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their connections" ON connections;
    DROP POLICY IF EXISTS "Users can create connection requests" ON connections;
    DROP POLICY IF EXISTS "Users can update their connections" ON connections;
    
    CREATE POLICY "Users can view their connections" ON connections FOR SELECT USING (
        auth.uid() IN (requester_id, recipient_id)
    );
    CREATE POLICY "Users can create connection requests" ON connections FOR INSERT WITH CHECK (
        auth.uid() = requester_id
    );
    CREATE POLICY "Users can update their connections" ON connections FOR UPDATE USING (
        auth.uid() IN (requester_id, recipient_id)
    );
END $$;

-- RLS Policies for Messages
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their messages" ON messages;
    DROP POLICY IF EXISTS "Users can send messages" ON messages;
    DROP POLICY IF EXISTS "Users can update their messages" ON messages;
    
    CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (
        auth.uid() IN (sender_id, recipient_id)
    );
    CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
        auth.uid() = sender_id
    );
    CREATE POLICY "Users can update their messages" ON messages FOR UPDATE USING (
        auth.uid() = recipient_id
    );
END $$;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_connections_updated_at ON connections;
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collaboration_requests_updated_at ON collaboration_requests;
CREATE TRIGGER update_collaboration_requests_updated_at BEFORE UPDATE ON collaboration_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
