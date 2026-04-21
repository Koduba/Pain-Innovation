-- Schema V3: Add user tracking and edit capabilities
-- This adds user identification and prevents duplicate submissions

-- Add user tracking columns to existing survey_responses table
ALTER TABLE survey_responses 
ADD COLUMN IF NOT EXISTS user_identifier TEXT,
ADD COLUMN IF NOT EXISTS user_ip TEXT,
ADD COLUMN IF NOT EXISTS user_session_id TEXT,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for user tracking
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_identifier ON survey_responses(user_identifier);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_ip ON survey_responses(user_ip);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_session_id ON survey_responses(user_session_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_user ON survey_responses(survey_id, user_identifier);

-- Update policies to include user tracking
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable read access for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable insert for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable update for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable delete for all users" ON survey_responses;
    
    -- Create new policies with user tracking
    CREATE POLICY "Enable read access for all users" ON survey_responses FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON survey_responses FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for own responses" ON survey_responses FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for own responses" ON survey_responses FOR DELETE USING (true);
END $$;

-- Function to get or create user identifier
CREATE OR REPLACE FUNCTION get_user_identifier(user_ip TEXT, user_session TEXT)
RETURNS TEXT AS $$
DECLARE
    user_id TEXT;
BEGIN
    -- Create a consistent user identifier based on IP and session
    user_id := COALESCE(user_session, user_ip);
    
    -- If neither exists, create a fallback identifier
    IF user_id IS NULL THEN
        user_id := 'anonymous_' || EXTRACT(EPOCH FROM NOW())::TEXT;
    END IF;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has already submitted
CREATE OR REPLACE FUNCTION has_user_submitted(survey_uuid UUID, user_identifier TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    submission_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO submission_count
    FROM survey_responses
    WHERE survey_id = survey_uuid 
    AND user_identifier = user_identifier;
    
    RETURN submission_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's existing response
CREATE OR REPLACE FUNCTION get_user_response(survey_uuid UUID, user_identifier TEXT)
RETURNS TABLE(id UUID, survey_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT sr.id, sr.survey_id
    FROM survey_responses sr
    WHERE sr.survey_id = survey_uuid 
    AND sr.user_identifier = user_identifier
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Update trigger to also update last_updated_at
CREATE OR REPLACE FUNCTION update_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate triggers
DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON survey_responses;
CREATE TRIGGER update_survey_responses_updated_at BEFORE UPDATE ON survey_responses
  FOR EACH ROW EXECUTE FUNCTION update_timestamps();
