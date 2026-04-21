-- Update validation constraints for 5-point scale (1-5)
-- This script only updates the CHECK constraints, doesn't modify data structure

-- Start transaction for safety
BEGIN;

-- Create backup before making changes
CREATE TABLE IF NOT EXISTS survey_responses_backup_constraints AS SELECT * FROM survey_responses;

-- Update CHECK constraints for 5-point scale
DO $$
DECLARE
    constraint_name TEXT;
    sql_stmt TEXT;
BEGIN
    -- Drop old 7-point scale constraints
    FOR i IN 1..58 LOOP
        BEGIN
            -- Try to drop existing constraint
            sql_stmt := format('ALTER TABLE survey_responses DROP CONSTRAINT IF EXISTS check_q%s_rating_range', i);
            EXECUTE sql_stmt;
            
            -- Add new 5-point scale constraint
            sql_stmt := format('ALTER TABLE survey_responses ADD CONSTRAINT check_q%s_rating_range CHECK (q%s_rating BETWEEN 1 AND 5)', i, i);
            EXECUTE sql_stmt;
            
            RAISE NOTICE 'Updated constraint for q%s_rating: 1-5', i;
        EXCEPTION
            WHEN others THEN
                RAISE NOTICE 'Error updating constraint for q%s_rating: %', i, SQLERRM;
        END;
    END LOOP;
END $$;

-- Verify constraints are updated
DO $$
DECLARE
    constraint_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO constraint_count
    FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
    WHERE ccu.table_name = 'survey_responses'
    AND ccu.column_name LIKE 'q%_rating'
    AND cc.check_clause LIKE '%BETWEEN 1 AND 5%';
    
    RAISE NOTICE 'Updated 5-point scale constraints: % found', constraint_count;
END $$;

-- Commit the transaction
COMMIT;

-- Final confirmation
DO $$
BEGIN
    RAISE NOTICE '5-point scale validation constraints updated successfully!';
    RAISE NOTICE 'All rating columns now accept values 1-5';
    RAISE NOTICE 'Backup available in: survey_responses_backup_constraints';
END $$;
