import { NextResponse } from 'next/server'
import { SurveyDatabaseV3 } from '@/lib/database/surveys-v3'

export async function POST() {
  try {
    // Create test survey data
    const testSurveyData = {
      respondent: {
        name: 'Debug Test User',
        institution: 'Test Institution',
        role: 'Test Role',
        date: '2026-04-21'
      },
      general_comments: 'Debug test submission',
      responses: {
        section_1: {
          title: 'General key messages',
          items: [
            {
              question_number: 1,
              statement: 'Test statement 1',
              rating: 3, // 5-point scale
              comment: 'Test comment'
            }
          ]
        }
      }
    }

    // Test the conversion function
    const { convertToV2Format } = await import('@/types/survey-v2')
    const v2Response = convertToV2Format(
      'test-survey-id',
      testSurveyData.respondent,
      testSurveyData.general_comments,
      testSurveyData.responses
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Debug test submission analysis',
      data: {
        testSurveyData,
        v2Response,
        v2ResponseKeys: Object.keys(v2Response),
        hasNaFields: Object.keys(v2Response).some(key => key.includes('_na')),
        ratingFields: Object.keys(v2Response).filter(key => key.includes('_rating')),
        sampleRating: v2Response.q1_rating,
        sampleComment: v2Response.q1_comment,
        sampleNa: v2Response.q1_na
      }
    })
  } catch (error) {
    console.error('Debug submission error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Debug submission failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
