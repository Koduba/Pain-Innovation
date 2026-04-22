import { NextResponse } from 'next/server'
import { SurveyDatabase } from '@/lib/database/surveys'
import { Respondent, SurveyData } from '@/types/survey'

export async function POST() {
  try {
    // Create test data that matches the survey structure
    const testRespondent: Respondent = {
      name: 'Test User',
      institution: 'Test Institution',
      role: 'Test Role',
      date: new Date().toISOString().split('T')[0],
      country: 'United States'
    }

    const testSurveyData: SurveyData = {
      respondent: testRespondent,
      general_comments: 'Test submission for debugging',
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

    console.log('Testing submission with data:', JSON.stringify(testSurveyData, null, 2))

    const result = await SurveyDatabase.submitSurveyResponse(
      'f44315e6-66a7-4ef4-8347-1057f8c717fd',
      testRespondent,
      testSurveyData
    )

    console.log('Submission result:', result)

    return NextResponse.json({ 
      success: true, 
      message: 'Test submission successful',
      data: result 
    })
  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Test submission failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
