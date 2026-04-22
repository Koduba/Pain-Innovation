-- Test script to check current column order of NA columns
-- This will help verify if NA columns are in the correct position

DO $$
DECLARE
    rating_position INTEGER;
    comment_position INTEGER;
    na_position INTEGER;
    errors TEXT[] := '{}';
BEGIN
    RAISE NOTICE 'Checking column order for NA columns...';
    
    FOR i IN 1..58 LOOP
        -- Get positions of rating, comment, and NA columns
        SELECT ordinal_position INTO rating_position
        FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = format('q%s_rating', i);
        
        SELECT ordinal_position INTO comment_position
        FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = format('q%s_comment', i);
        
        SELECT ordinal_position INTO na_position
        FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = format('q%s_na', i);
        
        IF na_position IS NOT NULL THEN
            IF na_position > comment_position THEN
                RAISE NOTICE 'Question %: NA column is AFTER comment column (position % vs %) - CORRECT', i, na_position, comment_position;
            ELSE
                RAISE NOTICE 'Question %: NA column is BEFORE comment column (position % vs %) - INCORRECT', i, na_position, comment_position;
                errors := array_append(errors, format('q%s: NA at %, comment at %', i, na_position, comment_position));
            END IF;
        ELSE
            RAISE NOTICE 'Question %: NA column does not exist', i;
            errors := array_append(errors, format('q%s: NA column missing', i));
        END IF;
    END LOOP;
    
    IF array_length(errors, 1) > 0 THEN
        RAISE NOTICE 'Found % ordering issues:', array_length(errors, 1);
        FOR i IN 1..array_length(errors, 1) LOOP
            RAISE NOTICE '  - %', errors[i];
        END LOOP;
    ELSE
        RAISE NOTICE 'All NA columns are in the correct position!';
    END IF;
END $$;

-- Show current column order for first few questions as example
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Current column order for questions 1-3:';
    FOR i IN 1..3 LOOP
        RAISE NOTICE 'Question %:', i;
        FOR col_name IN 
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'survey_responses' 
            AND column_name LIKE format('q%s%%', i)
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - %', col_name;
        END LOOP;
        RAISE NOTICE '';
    END LOOP;
END $$;
