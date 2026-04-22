import { NextResponse } from 'next/server'
import { SurveyDatabaseV3 } from '@/lib/database/surveys-v3'
import { Respondent } from '@/types/survey'

export async function POST() {
  try {
    // Create test respondent with country field
    const testRespondent: Respondent = {
      name: 'Test User with Country',
      institution: 'Test Institution',
      role: 'Test Role',
      date: '2026-04-21',
      country: 'United States'
    }

    // Test the convertToV2Format function with country
    const { convertToV2Format } = await import('@/types/survey-v2')
    
    const testSurveyData = {
      responses: {
        section_1: {
          title: 'Test Section',
          items: [
            {
              question_number: 1,
              statement: 'Test statement',
              rating: 3,
              comment: 'Test comment'
            }
          ]
        }
      }
    }

    const v2Response = convertToV2Format(
      'test-survey-id',
      testRespondent,
      'Test general comments',
      testSurveyData.responses
    )

    return NextResponse.json({
      success: true,
      message: 'Country field test successful',
      data: {
        testRespondent,
        v2Response,
        hasCountryField: 'respondent_country' in v2Response,
        countryValue: v2Response.respondent_country,
        expectedCountry: testRespondent.country,
        countryMatch: v2Response.respondent_country === testRespondent.country
      }
    })
  } catch (error) {
    console.error('Country field test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
