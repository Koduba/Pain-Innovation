-- Add N/A columns back to survey_responses table
-- This migration adds boolean columns for each question to allow N/A responses

-- Start transaction for safety
BEGIN;

-- Create backup before making changes
CREATE TABLE IF NOT EXISTS survey_responses_backup_na_addition AS SELECT * FROM survey_responses;

-- Add N/A columns for all questions (q1-q58)
DO $$
BEGIN
    FOR i IN 1..58 LOOP
        BEGIN
            EXECUTE format('ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS q%s_na BOOLEAN DEFAULT FALSE', i);
        EXCEPTION
            WHEN duplicate_column THEN NULL;
        END;
    END LOOP;
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
