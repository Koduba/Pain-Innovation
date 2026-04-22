import { NextResponse } from 'next/server'
import { SurveyDatabaseV3 } from '@/lib/database/surveys-v3'
import { getActiveSurveyId } from '@/lib/get-survey'
import { UserTracker } from '@/lib/user-tracking'

export async function POST() {
  try {
    const surveyId = await getActiveSurveyId()
    const userSession = await UserTracker.getInstance().getUserSession()
    
    // Step 1: Check if user has an existing response
    const existingResponse = await SurveyDatabaseV3.getUserResponse(surveyId)
    
    if (!existingResponse) {
      return NextResponse.json({ 
        success: false, 
        message: 'No existing response found. Please submit a survey first.',
        instructions: 'Call POST /api/test-v3 to create a test response first.'
      })
    }
    
    console.log('Found existing response:', existingResponse.id)
    
    // Step 2: Create updated data
    const updatedRespondent = {
      name: 'Edited User Name',
      institution: 'Edited Institution',
      role: 'Edited Role',
      date: new Date().toISOString().split('T')[0],
      country: 'United States'
    }

    const updatedSurveyData = {
      respondent: updatedRespondent,
      general_comments: 'This is an edited comment - ' + new Date().toISOString(),
      responses: {
        section_1: {
          title: 'General key messages',
          items: [
            {
              question_number: 1,
              statement: 'Patients should be encouraged to engage in their care even before seeing a clinician.',
              rating: 7, // Changed from previous rating
              comment: 'Edited comment for question 1'
            },
            {
              question_number: 2,
              statement: 'Patient education is important across all recommendations.',
              rating: 1, // Changed from previous rating
              comment: 'Edited comment for question 2'
            }
          ]
        }
      }
    }

    // Step 3: Update the response
    const updatedResponse = await SurveyDatabaseV3.saveSurveyResponse(
      surveyId,
      updatedRespondent,
      updatedSurveyData
    )
    
    console.log('Response updated successfully:', updatedResponse.id)
    
    // Step 4: Verify the update
    const verifiedResponse = await SurveyDatabaseV3.getUserResponse(surveyId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Edit test completed successfully',
      data: {
        originalResponse: {
          id: existingResponse.id,
          respondent_name: existingResponse.respondent_name,
          general_comments: existingResponse.general_comments,
          q1_rating: (existingResponse as any).q1_rating,
          q2_rating: (existingResponse as any).q2_rating
        },
        updatedResponse: {
          id: updatedResponse.id,
          respondent_name: updatedResponse.respondent_name,
          general_comments: updatedResponse.general_comments,
          q1_rating: (updatedResponse as any).q1_rating,
          q2_rating: (updatedResponse as any).q2_rating,
          last_updated_at: updatedResponse.last_updated_at
        },
        verifiedResponse: {
          id: verifiedResponse?.id,
          respondent_name: verifiedResponse?.respondent_name,
          general_comments: verifiedResponse?.general_comments,
          q1_rating: (verifiedResponse as any)?.q1_rating,
          q2_rating: (verifiedResponse as any)?.q2_rating
        },
        userSession
      }
    })
  } catch (error) {
    console.error('Edit test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Edit test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const surveyId = await getActiveSurveyId()
    const userSession = await UserTracker.getInstance().getUserSession()
    
    // Check current state
    const hasSubmitted = await SurveyDatabaseV3.hasUserSubmitted(surveyId)
    const existingResponse = await SurveyDatabaseV3.getUserResponse(surveyId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Current edit state check',
      data: {
        userSession,
        hasSubmitted,
        existingResponse: existingResponse ? {
          id: existingResponse.id,
          respondent_name: existingResponse.respondent_name,
          general_comments: existingResponse.general_comments,
          created_at: existingResponse.created_at,
          last_updated_at: existingResponse.last_updated_at
        } : null
      }
    })
  } catch (error) {
    console.error('State check error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'State check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
