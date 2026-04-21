import { NextResponse } from 'next/server'
import { SurveyDatabaseV3 } from '@/lib/database/surveys-v3'
import { getActiveSurveyId } from '@/lib/get-survey'
import { UserTracker } from '@/lib/user-tracking'

export async function POST() {
  try {
    const surveyId = await getActiveSurveyId()
    
    // Test user session
    const userSession = await UserTracker.getInstance().getUserSession()
    console.log('User session:', userSession)
    
    // Check if user has submitted
    const hasSubmitted = await SurveyDatabaseV3.hasUserSubmitted(surveyId)
    console.log('Has user submitted:', hasSubmitted)
    
    // Get existing response if any
    const existingResponse = await SurveyDatabaseV3.getUserResponse(surveyId)
    console.log('Existing response:', existingResponse)
    
    if (!hasSubmitted) {
      // Create test submission
      const testRespondent = {
        name: 'Test User V3',
        institution: 'Test Institution V3',
        role: 'Test Role V3',
        date: new Date().toISOString().split('T')[0]
      }

      const testSurveyData = {
        respondent: testRespondent,
        general_comments: 'Test submission for V3 one-response-per-user system',
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
              }
            ]
          }
        }
      }

      const result = await SurveyDatabaseV3.saveSurveyResponse(
        surveyId,
        testRespondent,
        testSurveyData
      )
      
      return NextResponse.json({ 
        success: true, 
        message: 'V3 new submission successful',
        data: {
          userSession,
          hasSubmitted: false,
          result
        }
      })
    } else {
      // Test updating existing response
      const updatedRespondent = {
        name: 'Test User V3 - Updated',
        institution: 'Test Institution V3 - Updated',
        role: 'Test Role V3 - Updated',
        date: new Date().toISOString().split('T')[0]
      }

      const updatedSurveyData = {
        respondent: updatedRespondent,
        general_comments: 'Updated test submission for V3 system',
        responses: {
          section_1: {
            title: 'General key messages',
            items: [
              {
                question_number: 1,
                statement: 'Test question 1',
                rating: 6, // Changed rating
                comment: 'Updated test comment 1'
              },
              {
                question_number: 2,
                statement: 'Test question 2',
                rating: 3, // Changed rating
                comment: 'Updated test comment 2'
              }
            ]
          }
        }
      }

      const result = await SurveyDatabaseV3.saveSurveyResponse(
        surveyId,
        updatedRespondent,
        updatedSurveyData
      )
      
      return NextResponse.json({ 
        success: true, 
        message: 'V3 update submission successful',
        data: {
          userSession,
          hasSubmitted: true,
          existingResponse,
          result
        }
      })
    }
  } catch (error) {
    console.error('V3 test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'V3 test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const surveyId = await getActiveSurveyId()
    const userSession = await UserTracker.getInstance().getUserSession()
    
    // Test user tracking
    const hasSubmitted = await SurveyDatabaseV3.hasUserSubmitted(surveyId)
    const existingResponse = await SurveyDatabaseV3.getUserResponse(surveyId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'V3 user tracking check successful',
      data: {
        userSession,
        hasSubmitted,
        existingResponse: existingResponse ? {
          id: existingResponse.id,
          respondent_name: existingResponse.respondent_name,
          created_at: existingResponse.created_at
        } : null
      }
    })
  } catch (error) {
    console.error('V3 tracking check error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'V3 tracking check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
