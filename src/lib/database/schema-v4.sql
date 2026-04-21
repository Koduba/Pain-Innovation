-- Schema V4: Update for 5-point Likert scale without N/A option
-- This migration:
-- 1. Converts 7-point scale to 5-point scale
-- 2. Removes N/A columns
-- 3. Updates validation constraints
-- 4. Migrates existing data

-- Start transaction for safety
BEGIN;

-- Create backup of existing data
CREATE TABLE survey_responses_backup_v4 AS SELECT * FROM survey_responses;

-- Function to convert 7-point scale to 5-point scale
CREATE OR REPLACE FUNCTION convert_7_to_5_point_scale(rating_7point INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- 7-point scale: 1, 2, 3, 4, 5, 6, 7
    -- 5-point scale: 1, 2, 3, 4, 5
    
    -- Handle null/invalid values
    IF rating_7point IS NULL OR rating_7point < 1 OR rating_7point > 7 THEN
        RETURN 3; -- Default to neutral
    END IF;
    
    -- Conversion mapping:
    -- 1 -> 1 (Strongly disagree)
    -- 2 -> 1 (Strongly disagree) 
    -- 3 -> 2 (Disagree)
    -- 4 -> 3 (Neutral)
    -- 5 -> 4 (Agree)
    -- 6 -> 5 (Strongly agree)
    -- 7 -> 5 (Strongly agree)
    
    CASE 
        WHEN rating_7point <= 2 THEN 1
        WHEN rating_7point = 3 THEN 2
        WHEN rating_7point = 4 THEN 3
        WHEN rating_7point = 5 THEN 4
        WHEN rating_7point >= 6 THEN 5
        ELSE 3 -- Default fallback
    END;
END;
$$ LANGUAGE plpgsql;

-- Add new 5-point scale columns (if they don't exist)
DO $$
BEGIN
    -- Add new rating columns for 5-point scale
    FOR i IN 1..58 LOOP
        BEGIN
            EXECUTE format('ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS q%s_rating_5point INTEGER CHECK (q%s_rating_5point BETWEEN 1 AND 5)', i, i);
        EXCEPTION
            WHEN duplicate_column THEN NULL;
        END;
    END LOOP;
END $$;

-- Migrate existing 7-point ratings to 5-point scale
DO $$
BEGIN
    FOR i IN 1..58 LOOP
        EXECUTE format('UPDATE survey_responses SET q%s_rating_5point = convert_7_to_5_point_scale(q%s_rating) WHERE q%s_rating IS NOT NULL', i, i, i);
    END LOOP;
END $$;

-- Drop old N/A columns
DO $$
BEGIN
    FOR i IN 1..58 LOOP
        BEGIN
            EXECUTE format('ALTER TABLE survey_responses DROP COLUMN IF EXISTS q%s_na', i);
        EXCEPTION
            WHEN undefined_column THEN NULL;
        END;
    END LOOP;
END $$;

-- Replace old rating columns with new 5-point scale columns
DO $$
BEGIN
    FOR i IN 1..58 LOOP
        BEGIN
            -- Drop old column
            EXECUTE format('ALTER TABLE survey_responses DROP COLUMN IF EXISTS q%s_rating', i);
            
            -- Rename new column to replace old one
            EXECUTE format('ALTER TABLE survey_responses RENAME COLUMN q%s_rating_5point TO q%s_rating', i, i);
            
            -- Add check constraint for 5-point scale
            EXECUTE format('ALTER TABLE survey_responses ADD CONSTRAINT check_q%s_rating_range CHECK (q%s_rating BETWEEN 1 AND 5)', i, i);
        EXCEPTION
            WHEN others THEN
                RAISE NOTICE 'Error processing column q%s: %', i, SQLERRM;
        END;
    END LOOP;
END $$;

-- Update indexes for new structure
DROP INDEX IF EXISTS idx_survey_responses_survey_id_v2;
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_user ON survey_responses(survey_id, user_identifier);

-- Update Row Level Security policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable read access for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable insert for all users" ON survey_responses;
    DROP POLICY IF EXISTS "Enable update for own responses" ON survey_responses;
    DROP POLICY IF EXISTS "Enable delete for own responses" ON survey_responses;
    
    -- Create new policies
    CREATE POLICY "Enable read access for all users" ON survey_responses FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON survey_responses FOR INSERT WITH CHECK (
        -- Validate 5-point scale ratings
        q1_rating BETWEEN 1 AND 5 AND
        q2_rating BETWEEN 1 AND 5 AND
        q3_rating BETWEEN 1 AND 5 AND
        q4_rating BETWEEN 1 AND 5 AND
        q5_rating BETWEEN 1 AND 5 AND
        q6_rating BETWEEN 1 AND 5 AND
        q7_rating BETWEEN 1 AND 5 AND
        q8_rating BETWEEN 1 AND 5 AND
        q9_rating BETWEEN 1 AND 5 AND
        q10_rating BETWEEN 1 AND 5 AND
        q11_rating BETWEEN 1 AND 5 AND
        q12_rating BETWEEN 1 AND 5 AND
        q13_rating BETWEEN 1 AND 5 AND
        q14_rating BETWEEN 1 AND 5 AND
        q15_rating BETWEEN 1 AND 5 AND
        q16_rating BETWEEN 1 AND 5 AND
        q17_rating BETWEEN 1 AND 5 AND
        q18_rating BETWEEN 1 AND 5 AND
        q19_rating BETWEEN 1 AND 5 AND
        q20_rating BETWEEN 1 AND 5 AND
        q21_rating BETWEEN 1 AND 5 AND
        q22_rating BETWEEN 1 AND 5 AND
        q23_rating BETWEEN 1 AND 5 AND
        q24_rating BETWEEN 1 AND 5 AND
        q25_rating BETWEEN 1 AND 5 AND
        q26_rating BETWEEN 1 AND 5 AND
        q27_rating BETWEEN 1 AND 5 AND
        q28_rating BETWEEN 1 AND 5 AND
        q29_rating BETWEEN 1 AND 5 AND
        q30_rating BETWEEN 1 AND 5 AND
        q31_rating BETWEEN 1 AND 5 AND
        q32_rating BETWEEN 1 AND 5 AND
        q33_rating BETWEEN 1 AND 5 AND
        q34_rating BETWEEN 1 AND 5 AND
        q35_rating BETWEEN 1 AND 5 AND
        q36_rating BETWEEN 1 AND 5 AND
        q37_rating BETWEEN 1 AND 5 AND
        q38_rating BETWEEN 1 AND 5 AND
        q39_rating BETWEEN 1 AND 5 AND
        q40_rating BETWEEN 1 AND 5 AND
        q41_rating BETWEEN 1 AND 5 AND
        q42_rating BETWEEN 1 AND 5 AND
        q43_rating BETWEEN 1 AND 5 AND
        q44_rating BETWEEN 1 AND 5 AND
        q45_rating BETWEEN 1 AND 5 AND
        q46_rating BETWEEN 1 AND 5 AND
        q47_rating BETWEEN 1 AND 5 AND
        q48_rating BETWEEN 1 AND 5 AND
        q49_rating BETWEEN 1 AND 5 AND
        q50_rating BETWEEN 1 AND 5 AND
        q51_rating BETWEEN 1 AND 5 AND
        q52_rating BETWEEN 1 AND 5 AND
        q53_rating BETWEEN 1 AND 5 AND
        q54_rating BETWEEN 1 AND 5 AND
        q55_rating BETWEEN 1 AND 5 AND
        q56_rating BETWEEN 1 AND 5 AND
        q57_rating BETWEEN 1 AND 5 AND
        q58_rating BETWEEN 1 AND 5
    );
    
    CREATE POLICY "Enable update for own responses" ON survey_responses FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for own responses" ON survey_responses FOR DELETE USING (true);
END $$;

-- Update trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON survey_responses;
CREATE TRIGGER update_survey_responses_updated_at BEFORE UPDATE ON survey_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create validation function for 5-point scale
CREATE OR REPLACE FUNCTION validate_5_point_scale()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate all rating columns are between 1 and 5
    FOR i IN 1..58 LOOP
        EXECUTE format('IF (NEW.q%s_rating < 1 OR NEW.q%s_rating > 5) THEN RAISE EXCEPTION ''q%s_rating must be between 1 and 5''; END IF', i, i, i);
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger (optional - can be removed if performance is an issue)
-- DROP TRIGGER IF EXISTS validate_5_point_scale_trigger ON survey_responses;
-- CREATE TRIGGER validate_5_point_scale_trigger BEFORE INSERT OR UPDATE ON survey_responses
--   FOR EACH ROW EXECUTE FUNCTION validate_5_point_scale();

-- Create summary view for data analysis
CREATE OR REPLACE VIEW survey_summary AS
SELECT 
    survey_id,
    respondent_name,
    respondent_institution,
    respondent_role,
    respondent_date,
    general_comments,
    created_at,
    updated_at,
    -- Calculate average rating across all questions
    (
        (q1_rating + q2_rating + q3_rating + q4_rating + q5_rating + q6_rating + q7_rating + q8_rating + q9_rating + q10_rating +
         q11_rating + q12_rating + q13_rating + q14_rating + q15_rating + q16_rating + q17_rating + q18_rating + q19_rating + q20_rating +
         q21_rating + q22_rating + q23_rating + q24_rating + q25_rating + q26_rating + q27_rating + q28_rating + q29_rating + q30_rating +
         q31_rating + q32_rating + q33_rating + q34_rating + q35_rating + q36_rating + q37_rating + q38_rating + q39_rating + q40_rating +
         q41_rating + q42_rating + q43_rating + q44_rating + q45_rating + q46_rating + q47_rating + q48_rating + q49_rating + q50_rating +
         q51_rating + q52_rating + q53_rating + q54_rating + q55_rating + q56_rating + q57_rating + q58_rating) / 58.0
    ) as average_rating,
    -- Count of non-null responses
    (
        (CASE WHEN q1_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q2_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q3_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q4_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q5_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q6_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q7_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q8_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q9_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q10_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q11_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q12_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q13_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q14_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q15_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q16_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q17_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q18_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q19_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q20_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q21_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q22_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q23_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q24_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q25_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q26_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q27_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q28_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q29_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q30_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q31_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q32_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q33_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q34_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q35_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q36_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q37_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q38_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q39_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q40_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q41_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q42_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q43_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q44_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q45_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q46_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q47_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q48_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q49_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q50_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q51_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q52_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q53_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q54_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q55_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q56_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q57_rating IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN q58_rating IS NOT NULL THEN 1 ELSE 0 END)
    ) as completed_questions
FROM survey_responses;

-- Clean up temporary function
DROP FUNCTION IF EXISTS convert_7_to_5_point_scale;

-- Commit the transaction
COMMIT;

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Database migration to V4 completed successfully:';
    RAISE NOTICE '- Converted 7-point scale to 5-point scale';
    RAISE NOTICE '- Removed N/A columns';
    RAISE NOTICE '- Updated validation constraints';
    RAISE NOTICE '- Created backup in survey_responses_backup_v4';
END $$;
