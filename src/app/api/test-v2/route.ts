import { NextResponse } from 'next/server'
import { SurveyDatabaseV2 } from '@/lib/database/surveys-v2'
import { getActiveSurveyId } from '@/lib/get-survey'

export async function POST() {
  try {
    // Get the active survey ID
    const surveyId = await getActiveSurveyId()
    
    // Create test data for V2 format
    const testRespondent = {
      name: 'Test User V2',
      institution: 'Test Institution V2',
      role: 'Test Role V2',
      date: new Date().toISOString().split('T')[0]
    }

    const testSurveyData = {
      respondent: testRespondent,
      general_comments: 'Test submission for V2 schema',
      responses: {
        section_1: {
          title: 'General key messages',
          items: [
            {
              question_number: 1,
              statement: 'Test question 1',
              rating: 5,
              comment: 'Test comment 1'
            },
            {
              question_number: 2,
              statement: 'Test question 2',
              rating: 4,
              comment: 'Test comment 2'
            },
            {
              question_number: 3,
              statement: 'Test question 3',
              rating: 'N/A',
              comment: 'Not applicable'
            }
          ]
        }
      }
    }

    console.log('Testing V2 submission with data:', JSON.stringify(testSurveyData, null, 2))

    const result = await SurveyDatabaseV2.submitSurveyResponse(
      surveyId,
      testRespondent,
      testSurveyData
    )

    console.log('V2 submission result:', result)

    return NextResponse.json({ 
      success: true, 
      message: 'V2 test submission successful',
      data: result 
    })
  } catch (error) {
    console.error('V2 test submission error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'V2 test submission failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const surveyId = await getActiveSurveyId()
    
    // Test getting question statistics
    const questionStats = await SurveyDatabaseV2.getQuestionStats(surveyId, 1)
    
    // Test getting all responses
    const allResponses = await SurveyDatabaseV2.getAllSurveyResponses()
    
    return NextResponse.json({ 
      success: true, 
      message: 'V2 data retrieval successful',
      data: {
        questionStats,
        totalResponses: allResponses.length,
        sampleResponse: allResponses[0] || null
      }
    })
  } catch (error) {
    console.error('V2 retrieval error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'V2 retrieval failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
