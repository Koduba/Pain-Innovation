-- Add respondent_country column to survey_responses table
-- This script adds the country field for the new cover page feature

-- Start transaction for safety
BEGIN;

-- Create backup before making changes
CREATE TABLE IF NOT EXISTS survey_responses_backup_country AS SELECT * FROM survey_responses;

-- Add the country column
DO $$
BEGIN
    -- Check if column already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'respondent_country'
    ) THEN
        -- Add the country column
        ALTER TABLE survey_responses ADD COLUMN respondent_country TEXT;
        
        RAISE NOTICE 'Added respondent_country column to survey_responses table';
    ELSE
        RAISE NOTICE 'respondent_country column already exists';
    END IF;
END $$;

-- Add comment to describe the column
COMMENT ON COLUMN survey_responses.respondent_country IS 'Country of the respondent (added for cover page enhancement)';

-- Verify the column was added
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'respondent_country'
    ) INTO column_exists;
    
    IF column_exists THEN
        RAISE NOTICE 'respondent_country column successfully added to survey_responses table';
        RAISE NOTICE 'Backup available in: survey_responses_backup_country';
    ELSE
        RAISE NOTICE 'ERROR: respondent_country column was not added';
    END IF;
END $$;

-- Show updated table structure
DO $$
DECLARE
    total_columns INTEGER;
    respondent_columns INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses';
    
    SELECT COUNT(*) INTO respondent_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE 'respondent_%';
    
    RAISE NOTICE 'Updated table structure:';
    RAISE NOTICE '- Total columns: %', total_columns;
    RAISE NOTICE '- Respondent columns: %', respondent_columns;
    RAISE NOTICE '- New column: respondent_country';
END $$;

-- Commit the transaction
COMMIT;

-- Final confirmation
DO $$
BEGIN
    RAISE NOTICE 'Country column addition completed successfully!';
    RAISE NOTICE 'The cover page now includes a country field for respondents.';
END $$;
