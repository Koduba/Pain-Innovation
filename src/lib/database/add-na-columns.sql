-- Add N/A columns back to survey_responses table
-- This migration adds boolean columns for each question to allow N/A responses

-- Start transaction for safety
BEGIN;

-- Create backup before making changes
CREATE TABLE IF NOT EXISTS survey_responses_backup_na_addition AS SELECT * FROM survey_responses;

-- Add N/A columns for all questions (q1-q58) after their respective comment columns
-- PostgreSQL doesn't support ALTER TABLE ... AFTER, so we need to recreate the table
DO $$
DECLARE
    column_exists BOOLEAN;
    reorder_needed BOOLEAN;
BEGIN
    -- Check if any NA columns already exist
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name LIKE '%_na'
    ) INTO column_exists;
    
    -- Check if reordering is needed (NA columns not after comment columns)
    reorder_needed := FALSE;
    IF column_exists THEN
        FOR i IN 1..58 LOOP
            DECLARE
                comment_pos INTEGER;
                na_pos INTEGER;
            BEGIN
                SELECT ordinal_position INTO comment_pos
                FROM information_schema.columns 
                WHERE table_name = 'survey_responses' 
                AND column_name = format('q%s_comment', i);
                
                SELECT ordinal_position INTO na_pos
                FROM information_schema.columns 
                WHERE table_name = 'survey_responses' 
                AND column_name = format('q%s_na', i);
                
                IF na_pos IS NOT NULL AND comment_pos IS NOT NULL AND na_pos < comment_pos THEN
                    reorder_needed := TRUE;
                    EXIT;
                END IF;
            END;
        END LOOP;
    END IF;
    
    IF NOT column_exists OR reorder_needed THEN
        IF reorder_needed THEN
            RAISE NOTICE 'NA columns exist but are in wrong order - recreating table';
        ELSE
            RAISE NOTICE 'NA columns do not exist - creating table with proper ordering';
        END IF;
        -- Create a new table with proper column ordering
        EXECUTE '
        CREATE TABLE survey_responses_new AS 
        SELECT 
            id, survey_id, user_identifier, user_ip, user_session_id, is_completed,
            respondent_name, respondent_institution, respondent_role, respondent_date, respondent_country,
            general_comments, created_at, updated_at, last_updated_at,
            q1_rating, q1_comment, q1_na,
            q2_rating, q2_comment, q2_na,
            q3_rating, q3_comment, q3_na,
            q4_rating, q4_comment, q4_na,
            q5_rating, q5_comment, q5_na,
            q6_rating, q6_comment, q6_na,
            q7_rating, q7_comment, q7_na,
            q8_rating, q8_comment, q8_na,
            q9_rating, q9_comment, q9_na,
            q10_rating, q10_comment, q10_na,
            q11_rating, q11_comment, q11_na,
            q12_rating, q12_comment, q12_na,
            q13_rating, q13_comment, q13_na,
            q14_rating, q14_comment, q14_na,
            q15_rating, q15_comment, q15_na,
            q16_rating, q16_comment, q16_na,
            q17_rating, q17_comment, q17_na,
            q18_rating, q18_comment, q18_na,
            q19_rating, q19_comment, q19_na,
            q20_rating, q20_comment, q20_na,
            q21_rating, q21_comment, q21_na,
            q22_rating, q22_comment, q22_na,
            q23_rating, q23_comment, q23_na,
            q24_rating, q24_comment, q24_na,
            q25_rating, q25_comment, q25_na,
            q26_rating, q26_comment, q26_na,
            q27_rating, q27_comment, q27_na,
            q28_rating, q28_comment, q28_na,
            q29_rating, q29_comment, q29_na,
            q30_rating, q30_comment, q30_na,
            q31_rating, q31_comment, q31_na,
            q32_rating, q32_comment, q32_na,
            q33_rating, q33_comment, q33_na,
            q34_rating, q34_comment, q34_na,
            q35_rating, q35_comment, q35_na,
            q36_rating, q36_comment, q36_na,
            q37_rating, q37_comment, q37_na,
            q38_rating, q38_comment, q38_na,
            q39_rating, q39_comment, q39_na,
            q40_rating, q40_comment, q40_na,
            q41_rating, q41_comment, q41_na,
            q42_rating, q42_comment, q42_na,
            q43_rating, q43_comment, q43_na,
            q44_rating, q44_comment, q44_na,
            q45_rating, q45_comment, q45_na,
            q46_rating, q46_comment, q46_na,
            q47_rating, q47_comment, q47_na,
            q48_rating, q48_comment, q48_na,
            q49_rating, q49_comment, q49_na,
            q50_rating, q50_comment, q50_na,
            q51_rating, q51_comment, q51_na,
            q52_rating, q52_comment, q52_na,
            q53_rating, q53_comment, q53_na,
            q54_rating, q54_comment, q54_na,
            q55_rating, q55_comment, q55_na,
            q56_rating, q56_comment, q56_na,
            q57_rating, q57_comment, q57_na,
            q58_rating, q58_comment, q58_na
        FROM survey_responses';
        
        -- Drop old table and rename
        DROP TABLE survey_responses;
        ALTER TABLE survey_responses_new RENAME TO survey_responses;
        
        -- Recreate constraints and indexes
        FOR i IN 1..58 LOOP
            EXECUTE format('ALTER TABLE survey_responses ADD CONSTRAINT IF NOT EXISTS check_q%s_rating_range CHECK (q%s_rating BETWEEN 1 AND 5)', i, i);
        END LOOP;
        
        -- Recreate indexes
        CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
        CREATE INDEX IF NOT EXISTS idx_survey_responses_user_session ON survey_responses(user_session_id);
        
        RAISE NOTICE 'Table recreated with proper NA column ordering';
    ELSE
        RAISE NOTICE 'NA columns already exist and are in correct order - no changes needed';
    END IF;
END $$;

-- Add comments to describe the N/A columns
DO $$
BEGIN
    FOR i IN 1..58 LOOP
        EXECUTE format('COMMENT ON COLUMN survey_responses.q%s_na IS ''Indicates if question %s was marked as Not Applicable''', i, i);
    END LOOP;
END $$;

-- Verify N/A columns were added
DO $$
DECLARE
    na_columns INTEGER;
BEGIN
    SELECT COUNT(*) INTO na_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE '%_na';
    
    IF na_columns = 58 THEN
        RAISE NOTICE 'Success: All 58 N/A columns have been added';
    ELSE
        RAISE NOTICE 'Warning: Only % N/A columns were added (expected 58)', na_columns;
    END IF;
END $$;

-- Show updated table structure
DO $$
DECLARE
    total_columns INTEGER;
    rating_columns INTEGER;
    na_columns INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses';
    
    SELECT COUNT(*) INTO rating_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE '%_rating';
    
    SELECT COUNT(*) INTO na_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE '%_na';
    
    RAISE NOTICE 'Table structure after N/A addition:';
    RAISE NOTICE '- Total columns: %', total_columns;
    RAISE NOTICE '- Rating columns: %', rating_columns;
    RAISE NOTICE '- N/A columns: %', na_columns;
    RAISE NOTICE '- Backup created: survey_responses_backup_na_addition';
END $$;

-- Commit the transaction
COMMIT;

-- Final confirmation
DO $$
BEGIN
    RAISE NOTICE 'N/A column addition completed successfully!';
    RAISE NOTICE 'Backup available in: survey_responses_backup_na_addition';
    RAISE NOTICE 'Survey now supports N/A responses for all 58 questions';
END $$;
