import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test current database structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('survey_responses')
      .select('*')
      .limit(1)

    if (tableError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection error',
        error: tableError.message
      })
    }

    // Check if N/A columns exist
    const sampleRow = tableInfo?.[0]
    const naColumns = Object.keys(sampleRow || {}).filter(key => key.includes('_na'))
    const ratingColumns = Object.keys(sampleRow || {}).filter(key => key.includes('_rating'))

    return NextResponse.json({ 
      success: true, 
      message: 'Database structure analysis',
      data: {
        currentStructure: {
          totalColumns: Object.keys(sampleRow || {}).length,
          ratingColumns: ratingColumns.length,
          naColumns: naColumns.length,
          sampleColumns: Object.keys(sampleRow || {}).slice(0, 10)
        },
        migrationStatus: {
          needsMigration: naColumns.length > 0,
          currentScale: ratingColumns.length > 0 ? '7-point (likely)' : 'Unknown',
          targetScale: '5-point',
          naColumnsFound: naColumns,
          ratingColumnsFound: ratingColumns.slice(0, 5)
        },
        recommendations: {
          ifNaColumnsExist: 'Run V4 migration to remove N/A columns',
          ifRatingColumnsExist: 'Run V4 migration to convert to 5-point scale',
          backupAvailable: 'Check for survey_responses_backup_v4 table'
        }
      }
    })
  } catch (error) {
    console.error('Database analysis error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Database analysis failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Test 5-point scale validation
    const testValidation = async () => {
      // This would test the validation constraints after migration
      const testResponse = {
        survey_id: 'f44315e6-66a7-4ef4-8347-1057f8c717fd',
        respondent_name: 'Validation Test',
        respondent_institution: 'Test',
        respondent_role: 'Test',
        respondent_date: '2026-04-21',
        general_comments: 'Testing 5-point scale validation',
        q1_rating: 3, // Valid (1-5)
        q2_rating: 5, // Valid (1-5)
        q3_rating: 1, // Valid (1-5)
        q4_rating: 0, // Invalid (below 1)
        q5_rating: 6  // Invalid (above 5)
      }

      return testResponse
    }

    const testData = await testValidation()

    return NextResponse.json({ 
      success: true, 
      message: '5-point scale validation test',
      data: {
        testData,
        validationRules: {
          validRange: '1-5',
          invalidValues: [0, 6, 7, null, 'N/A'],
          defaultValue: 3,
          commentRequirement: 'Comments required for ratings 1-2'
        },
        testResults: {
          q1_rating: { value: testData.q1_rating, valid: testData.q1_rating >= 1 && testData.q1_rating <= 5 },
          q2_rating: { value: testData.q2_rating, valid: testData.q2_rating >= 1 && testData.q2_rating <= 5 },
          q3_rating: { value: testData.q3_rating, valid: testData.q3_rating >= 1 && testData.q3_rating <= 5 },
          q4_rating: { value: testData.q4_rating, valid: testData.q4_rating >= 1 && testData.q4_rating <= 5 },
          q5_rating: { value: testData.q5_rating, valid: testData.q5_rating >= 1 && testData.q5_rating <= 5 }
        },
        migrationRequired: 'Run V4 migration to apply validation constraints'
      }
    })
  } catch (error) {
    console.error('Validation test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Validation test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
