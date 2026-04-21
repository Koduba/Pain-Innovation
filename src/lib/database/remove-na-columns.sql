-- Remove all N/A columns from survey_responses table
-- This script specifically targets and removes only the N/A columns

-- Start transaction for safety
BEGIN;

-- Create backup before making changes
CREATE TABLE survey_responses_backup_na_removal AS SELECT * FROM survey_responses;

-- List of N/A columns to be removed
DO $$
DECLARE
    na_columns TEXT[] := ARRAY[
        'q1_na', 'q2_na', 'q3_na', 'q4_na', 'q5_na', 'q6_na', 'q7_na', 'q8_na', 'q9_na', 'q10_na',
        'q11_na', 'q12_na', 'q13_na', 'q14_na', 'q15_na', 'q16_na', 'q17_na', 'q18_na', 'q19_na', 'q20_na',
        'q21_na', 'q22_na', 'q23_na', 'q24_na', 'q25_na', 'q26_na', 'q27_na', 'q28_na', 'q29_na', 'q30_na',
        'q31_na', 'q32_na', 'q33_na', 'q34_na', 'q35_na', 'q36_na', 'q37_na', 'q38_na', 'q39_na', 'q40_na',
        'q41_na', 'q42_na', 'q43_na', 'q44_na', 'q45_na', 'q46_na', 'q47_na', 'q48_na', 'q49_na', 'q50_na',
        'q51_na', 'q52_na', 'q53_na', 'q54_na', 'q55_na', 'q56_na', 'q57_na', 'q58_na'
    ];
    column_name TEXT;
    sql_stmt TEXT;
BEGIN
    FOREACH column_name IN ARRAY na_columns
    LOOP
        BEGIN
            sql_stmt := format('ALTER TABLE survey_responses DROP COLUMN IF EXISTS %I', column_name);
            EXECUTE sql_stmt;
            RAISE NOTICE 'Dropped column: %', column_name;
        EXCEPTION
            WHEN undefined_column THEN
                RAISE NOTICE 'Column % does not exist, skipping', column_name;
            WHEN others THEN
                RAISE NOTICE 'Error dropping column %: %', column_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Verify N/A columns are removed
DO $$
DECLARE
    remaining_na_columns INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_na_columns
    FROM information_schema.columns 
    WHERE table_name = 'survey_responses' 
    AND column_name LIKE '%_na';
    
    IF remaining_na_columns > 0 THEN
        RAISE NOTICE 'Warning: % N/A columns still exist', remaining_na_columns;
    ELSE
        RAISE NOTICE 'Success: All N/A columns have been removed';
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
    
    RAISE NOTICE 'Table structure after N/A removal:';
    RAISE NOTICE '- Total columns: %', total_columns;
    RAISE NOTICE '- Rating columns: %', rating_columns;
    RAISE NOTICE '- N/A columns: %', na_columns;
    RAISE NOTICE '- Backup created: survey_responses_backup_na_removal';
END $$;

-- Commit the transaction
COMMIT;

-- Final confirmation
DO $$
BEGIN
    RAISE NOTICE 'N/A column removal completed successfully!';
    RAISE NOTICE 'Backup available in: survey_responses_backup_na_removal';
END $$;
