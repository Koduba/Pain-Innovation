-- New schema for individual question columns
-- This creates a more analysis-friendly structure

-- Drop old table if it exists
DROP TABLE IF EXISTS survey_responses_old;

-- Backup existing data
CREATE TABLE survey_responses_old AS SELECT * FROM survey_responses;

-- Drop the old table
DROP TABLE IF EXISTS survey_responses;

-- Create new survey_responses table with individual question columns
CREATE TABLE survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  
  -- Respondent information
  respondent_name TEXT,
  respondent_institution TEXT,
  respondent_role TEXT,
  respondent_date TEXT,
  general_comments TEXT,
  
  -- Section 1: General key messages (14 questions)
  q1_rating INTEGER,
  q1_comment TEXT,
  q1_na BOOLEAN DEFAULT FALSE,
  q2_rating INTEGER,
  q2_comment TEXT,
  q2_na BOOLEAN DEFAULT FALSE,
  q3_rating INTEGER,
  q3_comment TEXT,
  q3_na BOOLEAN DEFAULT FALSE,
  q4_rating INTEGER,
  q4_comment TEXT,
  q4_na BOOLEAN DEFAULT FALSE,
  q5_rating INTEGER,
  q5_comment TEXT,
  q5_na BOOLEAN DEFAULT FALSE,
  q6_rating INTEGER,
  q6_comment TEXT,
  q6_na BOOLEAN DEFAULT FALSE,
  q7_rating INTEGER,
  q7_comment TEXT,
  q7_na BOOLEAN DEFAULT FALSE,
  q8_rating INTEGER,
  q8_comment TEXT,
  q8_na BOOLEAN DEFAULT FALSE,
  q9_rating INTEGER,
  q9_comment TEXT,
  q9_na BOOLEAN DEFAULT FALSE,
  q10_rating INTEGER,
  q10_comment TEXT,
  q10_na BOOLEAN DEFAULT FALSE,
  q11_rating INTEGER,
  q11_comment TEXT,
  q11_na BOOLEAN DEFAULT FALSE,
  q12_rating INTEGER,
  q12_comment TEXT,
  q12_na BOOLEAN DEFAULT FALSE,
  q13_rating INTEGER,
  q13_comment TEXT,
  q13_na BOOLEAN DEFAULT FALSE,
  q14_rating INTEGER,
  q14_comment TEXT,
  q14_na BOOLEAN DEFAULT FALSE,
  
  -- Section 2: Assessment & imaging (7 questions)
  q15_rating INTEGER,
  q15_comment TEXT,
  q15_na BOOLEAN DEFAULT FALSE,
  q16_rating INTEGER,
  q16_comment TEXT,
  q16_na BOOLEAN DEFAULT FALSE,
  q17_rating INTEGER,
  q17_comment TEXT,
  q17_na BOOLEAN DEFAULT FALSE,
  q18_rating INTEGER,
  q18_comment TEXT,
  q18_na BOOLEAN DEFAULT FALSE,
  q19_rating INTEGER,
  q19_comment TEXT,
  q19_na BOOLEAN DEFAULT FALSE,
  q20_rating INTEGER,
  q20_comment TEXT,
  q20_na BOOLEAN DEFAULT FALSE,
  q21_rating INTEGER,
  q21_comment TEXT,
  q21_na BOOLEAN DEFAULT FALSE,
  
  -- Section 3: Red flags / imaging criteria (4 questions)
  q22_rating INTEGER,
  q22_comment TEXT,
  q22_na BOOLEAN DEFAULT FALSE,
  q23_rating INTEGER,
  q23_comment TEXT,
  q23_na BOOLEAN DEFAULT FALSE,
  q24_rating INTEGER,
  q24_comment TEXT,
  q24_na BOOLEAN DEFAULT FALSE,
  q25_rating INTEGER,
  q25_comment TEXT,
  q25_na BOOLEAN DEFAULT FALSE,
  
  -- Section 4: Self-management (Rec. 1) (8 questions)
  q26_rating INTEGER,
  q26_comment TEXT,
  q26_na BOOLEAN DEFAULT FALSE,
  q27_rating INTEGER,
  q27_comment TEXT,
  q27_na BOOLEAN DEFAULT FALSE,
  q28_rating INTEGER,
  q28_comment TEXT,
  q28_na BOOLEAN DEFAULT FALSE,
  q29_rating INTEGER,
  q29_comment TEXT,
  q29_na BOOLEAN DEFAULT FALSE,
  q30_rating INTEGER,
  q30_comment TEXT,
  q30_na BOOLEAN DEFAULT FALSE,
  q31_rating INTEGER,
  q31_comment TEXT,
  q31_na BOOLEAN DEFAULT FALSE,
  q32_rating INTEGER,
  q32_comment TEXT,
  q32_na BOOLEAN DEFAULT FALSE,
  q33_rating INTEGER,
  q33_comment TEXT,
  q33_na BOOLEAN DEFAULT FALSE,
  
  -- Section 5: If not improving (Rec. 2a) (9 questions)
  q34_rating INTEGER,
  q34_comment TEXT,
  q34_na BOOLEAN DEFAULT FALSE,
  q35_rating INTEGER,
  q35_comment TEXT,
  q35_na BOOLEAN DEFAULT FALSE,
  q36_rating INTEGER,
  q36_comment TEXT,
  q36_na BOOLEAN DEFAULT FALSE,
  q37_rating INTEGER,
  q37_comment TEXT,
  q37_na BOOLEAN DEFAULT FALSE,
  q38_rating INTEGER,
  q38_comment TEXT,
  q38_na BOOLEAN DEFAULT FALSE,
  q39_rating INTEGER,
  q39_comment TEXT,
  q39_na BOOLEAN DEFAULT FALSE,
  q40_rating INTEGER,
  q40_comment TEXT,
  q40_na BOOLEAN DEFAULT FALSE,
  q41_rating INTEGER,
  q41_comment TEXT,
  q41_na BOOLEAN DEFAULT FALSE,
  q42_rating INTEGER,
  q42_comment TEXT,
  q42_na BOOLEAN DEFAULT FALSE,
  
  -- Section 6: Radiculopathy-specific (Rec. 2b) (6 questions)
  q43_rating INTEGER,
  q43_comment TEXT,
  q43_na BOOLEAN DEFAULT FALSE,
  q44_rating INTEGER,
  q44_comment TEXT,
  q44_na BOOLEAN DEFAULT FALSE,
  q45_rating INTEGER,
  q45_comment TEXT,
  q45_na BOOLEAN DEFAULT FALSE,
  q46_rating INTEGER,
  q46_comment TEXT,
  q46_na BOOLEAN DEFAULT FALSE,
  q47_rating INTEGER,
  q47_comment TEXT,
  q47_na BOOLEAN DEFAULT FALSE,
  q48_rating INTEGER,
  q48_comment TEXT,
  q48_na BOOLEAN DEFAULT FALSE,
  
  -- Section 7: Opioids (Rec. 3) (9 questions)
  q49_rating INTEGER,
  q49_comment TEXT,
  q49_na BOOLEAN DEFAULT FALSE,
  q50_rating INTEGER,
  q50_comment TEXT,
  q50_na BOOLEAN DEFAULT FALSE,
  q51_rating INTEGER,
  q51_comment TEXT,
  q51_na BOOLEAN DEFAULT FALSE,
  q52_rating INTEGER,
  q52_comment TEXT,
  q52_na BOOLEAN DEFAULT FALSE,
  q53_rating INTEGER,
  q53_comment TEXT,
  q53_na BOOLEAN DEFAULT FALSE,
  q54_rating INTEGER,
  q54_comment TEXT,
  q54_na BOOLEAN DEFAULT FALSE,
  q55_rating INTEGER,
  q55_comment TEXT,
  q55_na BOOLEAN DEFAULT FALSE,
  q56_rating INTEGER,
  q56_comment TEXT,
  q56_na BOOLEAN DEFAULT FALSE,
  q57_rating INTEGER,
  q57_comment TEXT,
  q57_na BOOLEAN DEFAULT FALSE,
  q58_rating INTEGER,
  q58_comment TEXT,
  q58_na BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id_v2 ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);

-- Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable read access for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable insert for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable update for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable delete for all users" ON survey_responses;
    
    -- Create new policies
    CREATE POLICY "Enable read access for all users" ON survey_responses FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON survey_responses FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for all users" ON survey_responses FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for all users" ON survey_responses FOR DELETE USING (true);
END $$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON survey_responses;
CREATE TRIGGER update_survey_responses_updated_at BEFORE UPDATE ON survey_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
