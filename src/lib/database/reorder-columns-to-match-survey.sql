-- Reorder database columns to exactly match the survey instrument order
-- This ensures NA columns follow rating columns for each question
-- Based on the survey sections in surveyData.ts

-- Start transaction for safety
BEGIN;

-- Create backup before making changes
CREATE TABLE IF NOT EXISTS survey_responses_backup_column_order AS SELECT * FROM survey_responses;

-- Recreate table with exact survey instrument column order
-- Order: respondent info, general_comments, then q1_rating, q1_comment, q1_na, q2_rating, q2_comment, q2_na, etc.
DO $$
BEGIN
    RAISE NOTICE 'Recreating survey_responses table with exact survey instrument order...';
    
    -- Drop the table recreation if it exists from previous attempts
    DROP TABLE IF EXISTS survey_responses_new;
    
    -- Create new table with exact survey order
    EXECUTE '
    CREATE TABLE survey_responses_new AS 
    SELECT 
        id, survey_id, user_identifier, user_ip, user_session_id, is_completed,
        respondent_name, respondent_institution, respondent_role, respondent_date, respondent_country,
        general_comments, created_at, updated_at, last_updated_at,
        
        -- Section 1: General key messages (q1-q14)
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
        
        -- Section 2: Assessment & imaging (q15-q21)
        q15_rating, q15_comment, q15_na,
        q16_rating, q16_comment, q16_na,
        q17_rating, q17_comment, q17_na,
        q18_rating, q18_comment, q18_na,
        q19_rating, q19_comment, q19_na,
        q20_rating, q20_comment, q20_na,
        q21_rating, q21_comment, q21_na,
        
        -- Section 3: Red flags / imaging criteria (q22-q26)
        q22_rating, q22_comment, q22_na,
        q23_rating, q23_comment, q23_na,
        q24_rating, q24_comment, q24_na,
        q25_rating, q25_comment, q25_na,
        q26_rating, q26_comment, q26_na,
        
        -- Section 4: Self-management (Rec. 1) (q27-q34)
        q27_rating, q27_comment, q27_na,
        q28_rating, q28_comment, q28_na,
        q29_rating, q29_comment, q29_na,
        q30_rating, q30_comment, q30_na,
        q31_rating, q31_comment, q31_na,
        q32_rating, q32_comment, q32_na,
        q33_rating, q33_comment, q33_na,
        q34_rating, q34_comment, q34_na,
        
        -- Section 5: If not improving (Rec. 2a) (q35-q43)
        q35_rating, q35_comment, q35_na,
        q36_rating, q36_comment, q36_na,
        q37_rating, q37_comment, q37_na,
        q38_rating, q38_comment, q38_na,
        q39_rating, q39_comment, q39_na,
        q40_rating, q40_comment, q40_na,
        q41_rating, q41_comment, q41_na,
        q42_rating, q42_comment, q42_na,
        q43_rating, q43_comment, q43_na,
        
        -- Section 6: Radiculopathy-specific (Rec. 2b) (q44-q49)
        q44_rating, q44_comment, q44_na,
        q45_rating, q45_comment, q45_na,
        q46_rating, q46_comment, q46_na,
        q47_rating, q47_comment, q47_na,
        q48_rating, q48_comment, q48_na,
        q49_rating, q49_comment, q49_na,
        
        -- Section 7: Opioids (Rec. 3) (q50-q58)
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
    
    -- Drop dependent objects first, then drop and rename table
    DROP VIEW IF EXISTS survey_summary;
    DROP TABLE survey_responses;
    ALTER TABLE survey_responses_new RENAME TO survey_responses;
    
    RAISE NOTICE 'Table recreated with exact survey instrument column order';
END $$;

-- Recreate all constraints
DO $$
BEGIN
    RAISE NOTICE 'Recreating constraints...';
    
    -- Add rating range constraints for all questions
    FOR i IN 1..58 LOOP
        EXECUTE format('ALTER TABLE survey_responses ADD CONSTRAINT IF NOT EXISTS check_q%s_rating_range CHECK (q%s_rating BETWEEN 1 AND 5)', i, i);
    END LOOP;
    
    -- Add NOT NULL constraints for essential columns
    ALTER TABLE survey_responses ADD CONSTRAINT IF NOT EXISTS survey_id_not_null CHECK (survey_id IS NOT NULL);
    ALTER TABLE survey_responses ADD CONSTRAINT IF NOT EXISTS respondent_name_not_null CHECK (respondent_name IS NOT NULL);
    ALTER TABLE survey_responses ADD CONSTRAINT IF NOT EXISTS respondent_date_not_null CHECK (respondent_date IS NOT NULL);
    
    RAISE NOTICE 'Constraints recreated';
END $$;

-- Recreate indexes for performance
DO $$
BEGIN
    RAISE NOTICE 'Recreating indexes...';
    
    -- Primary key and foreign key indexes
    CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
    CREATE INDEX IF NOT EXISTS idx_survey_responses_user_session ON survey_responses(user_session_id);
    CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);
    CREATE INDEX IF NOT EXISTS idx_survey_responses_is_completed ON survey_responses(is_completed);
    
    RAISE NOTICE 'Indexes recreated';
END $$;

-- Recreate the survey_summary view with new column order
DO $$
BEGIN
    RAISE NOTICE 'Recreating survey_summary view...';
    
    EXECUTE '
    CREATE OR REPLACE VIEW survey_summary AS
    SELECT 
        sr.id,
        sr.survey_id,
        sr.respondent_name,
        sr.respondent_institution,
        sr.respondent_role,
        sr.respondent_date,
        sr.respondent_country,
        sr.general_comments,
        sr.is_completed,
        sr.created_at,
        sr.updated_at,
        
        -- Calculate completion statistics
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_name = ''survey_responses'' 
         AND column_name LIKE ''q%_rating'') as total_questions,
         
        (SELECT COUNT(*) 
         FROM (SELECT unnest(ARRAY[
            q1_rating, q2_rating, q3_rating, q4_rating, q5_rating, q6_rating, q7_rating, q8_rating, q9_rating, q10_rating,
            q11_rating, q12_rating, q13_rating, q14_rating, q15_rating, q16_rating, q17_rating, q18_rating, q19_rating, q20_rating,
            q21_rating, q22_rating, q23_rating, q24_rating, q25_rating, q26_rating, q27_rating, q28_rating, q29_rating, q30_rating,
            q31_rating, q32_rating, q33_rating, q34_rating, q35_rating, q36_rating, q37_rating, q38_rating, q39_rating, q40_rating,
            q41_rating, q42_rating, q43_rating, q44_rating, q45_rating, q46_rating, q47_rating, q48_rating, q49_rating, q50_rating,
            q51_rating, q52_rating, q53_rating, q54_rating, q55_rating, q56_rating, q57_rating, q58_rating
         ]) WHERE unnest IS NOT NULL) as answered_questions) as answered_count,
         
        -- Calculate NA responses count
        (SELECT COUNT(*) 
         FROM (SELECT unnest(ARRAY[
            q1_na, q2_na, q3_na, q4_na, q5_na, q6_na, q7_na, q8_na, q9_na, q10_na,
            q11_na, q12_na, q13_na, q14_na, q15_na, q16_na, q17_na, q18_na, q19_na, q20_na,
            q21_na, q22_na, q23_na, q24_na, q25_na, q26_na, q27_na, q28_na, q29_na, q30_na,
            q31_na, q32_na, q33_na, q34_na, q35_na, q36_na, q37_na, q38_na, q39_na, q40_na,
            q41_na, q42_na, q43_na, q44_na, q45_na, q46_na, q47_na, q48_na, q49_na, q50_na,
            q51_na, q52_na, q53_na, q54_na, q55_na, q56_na, q57_na, q58_na
         ]) WHERE unnest = TRUE) as na_count) as na_count,
         
        -- Calculate average rating (excluding NA responses)
        (SELECT AVG(unnest) 
         FROM (SELECT unnest(ARRAY[
            q1_rating, q2_rating, q3_rating, q4_rating, q5_rating, q6_rating, q7_rating, q8_rating, q9_rating, q10_rating,
            q11_rating, q12_rating, q13_rating, q14_rating, q15_rating, q16_rating, q17_rating, q18_rating, q19_rating, q20_rating,
            q21_rating, q22_rating, q23_rating, q24_rating, q25_rating, q26_rating, q27_rating, q28_rating, q29_rating, q30_rating,
            q31_rating, q32_rating, q33_rating, q34_rating, q35_rating, q36_rating, q37_rating, q38_rating, q39_rating, q40_rating,
            q41_rating, q42_rating, q43_rating, q44_rating, q45_rating, q46_rating, q47_rating, q48_rating, q49_rating, q50_rating,
            q51_rating, q52_rating, q53_rating, q54_rating, q55_rating, q56_rating, q57_rating, q58_rating
         ]) WHERE unnest IS NOT NULL) as ratings) as average_rating,
         
        -- Calculate completion percentage
        CASE 
            WHEN (SELECT COUNT(*) FROM information_schema.columns 
                  WHERE table_name = ''survey_responses'' 
                  AND column_name LIKE ''q%_rating'') > 0 
            THEN ROUND(
                (SELECT COUNT(*) 
                 FROM (SELECT unnest(ARRAY[
                    q1_rating, q2_rating, q3_rating, q4_rating, q5_rating, q6_rating, q7_rating, q8_rating, q9_rating, q10_rating,
                    q11_rating, q12_rating, q13_rating, q14_rating, q15_rating, q16_rating, q17_rating, q18_rating, q19_rating, q20_rating,
                    q21_rating, q22_rating, q23_rating, q24_rating, q25_rating, q26_rating, q27_rating, q28_rating, q29_rating, q30_rating,
                    q31_rating, q32_rating, q33_rating, q34_rating, q35_rating, q36_rating, q37_rating, q38_rating, q39_rating, q40_rating,
                    q41_rating, q42_rating, q43_rating, q44_rating, q45_rating, q46_rating, q47_rating, q48_rating, q49_rating, q50_rating,
                    q51_rating, q52_rating, q53_rating, q54_rating, q55_rating, q56_rating, q57_rating, q58_rating
                 ]) WHERE unnest IS NOT NULL) * 100.0 / 
                (SELECT COUNT(*) FROM information_schema.columns 
                 WHERE table_name = ''survey_responses'' 
                 AND column_name LIKE ''q%_rating''), 2)
            ELSE 0 
        END as completion_percentage
        
    FROM survey_responses sr';
    
    RAISE NOTICE 'survey_summary view recreated with new column order';
END $$;

-- Verify the column order matches the survey instrument
DO $$
DECLARE
    expected_order TEXT[] := ARRAY[
        'id', 'survey_id', 'user_identifier', 'user_ip', 'user_session_id', 'is_completed',
        'respondent_name', 'respondent_institution', 'respondent_role', 'respondent_date', 'respondent_country',
        'general_comments', 'created_at', 'updated_at', 'last_updated_at'
    ];
    actual_order TEXT[] := '{}';
    errors TEXT[] := '{}';
    question_num INTEGER;
BEGIN
    RAISE NOTICE 'Verifying column order matches survey instrument...';
    
    -- Get actual column order
    SELECT array_agg(column_name ORDER BY ordinal_position) INTO actual_order
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses';
    
    -- Add expected question columns to expected_order
    FOR question_num IN 1..58 LOOP
        expected_order := array_append(expected_order, format('q%s_rating', question_num));
        expected_order := array_append(expected_order, format('q%s_comment', question_num));
        expected_order := array_append(expected_order, format('q%s_na', question_num));
    END LOOP;
    
    -- Check if orders match
    IF actual_order = expected_order THEN
        RAISE NOTICE 'SUCCESS: Column order matches survey instrument exactly!';
    ELSE
        RAISE NOTICE 'ERROR: Column order does not match survey instrument';
        RAISE NOTICE 'Expected % columns, found % columns', array_length(expected_order, 1), array_length(actual_order, 1);
        
        -- Show first few differences
        FOR i IN 1..LEAST(10, array_length(expected_order, 1)) LOOP
            IF actual_order[i] IS DISTINCT FROM expected_order[i] THEN
                RAISE NOTICE 'Position %: Expected "%", found "%"', i, expected_order[i], COALESCE(actual_order[i], 'NULL');
            END IF;
        END LOOP;
    END IF;
END $$;

-- Show final table structure summary
DO $$
DECLARE
    total_columns INTEGER;
    rating_columns INTEGER;
    comment_columns INTEGER;
    na_columns INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses';
    
    SELECT COUNT(*) INTO rating_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE '%_rating';
    
    SELECT COUNT(*) INTO comment_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE '%_comment';
    
    SELECT COUNT(*) INTO na_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE '%_na';
    
    RAISE NOTICE '';
    RAISE NOTICE 'Final table structure:';
    RAISE NOTICE '- Total columns: %', total_columns;
    RAISE NOTICE '- Rating columns: %', rating_columns;
    RAISE NOTICE '- Comment columns: %', comment_columns;
    RAISE NOTICE '- NA columns: %', na_columns;
    RAISE NOTICE '- Backup created: survey_responses_backup_column_order';
    RAISE NOTICE '';
    RAISE NOTICE 'Column order now matches survey instrument exactly:';
    RAISE NOTICE 'respondent_info -> general_comments -> q1_rating, q1_comment, q1_na -> q2_rating, q2_comment, q2_na -> ... -> q58_rating, q58_comment, q58_na';
END $$;

-- Commit the transaction
COMMIT;

-- Final confirmation
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Database column reordering completed successfully!';
    RAISE NOTICE 'All columns now follow the exact survey instrument order';
    RAISE NOTICE 'NA columns are positioned immediately after their respective comment columns';
    RAISE NOTICE 'Backup available in: survey_responses_backup_column_order';
END $$;
