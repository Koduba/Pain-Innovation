-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_data JSONB NOT NULL,
  response_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_surveys_is_active ON surveys(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
-- Note: These policies may already exist, use DROP POLICY first if you need to recreate them
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable read access for all users" ON surveys;
    DROP POLICY IF EXISTS "Enable insert for all users" ON surveys;
    DROP POLICY IF EXISTS "Enable update for all users" ON surveys;
    DROP POLICY IF EXISTS "Enable delete for all users" ON surveys;
    
    DROP POLICY IF EXISTS "Enable read access for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable insert for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable update for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable delete for all users" ON survey_responses;
    
    -- Create new policies
    CREATE POLICY "Enable read access for all users" ON surveys FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON surveys FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for all users" ON surveys FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for all users" ON surveys FOR DELETE USING (true);

    CREATE POLICY "Enable read access for all users" ON survey_responses FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON survey_responses FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for all users" ON survey_responses FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for all users" ON survey_responses FOR DELETE USING (true);
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
DROP TRIGGER IF EXISTS update_surveys_updated_at ON surveys;
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON survey_responses;
CREATE TRIGGER update_survey_responses_updated_at BEFORE UPDATE ON survey_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
