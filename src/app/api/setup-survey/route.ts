import { NextResponse } from 'next/server'
import { SurveyDatabase } from '@/lib/database/surveys'
import { SECTIONS } from '@/data/surveyData'

export async function POST() {
  try {
    // Create the survey record first
    const surveyData = {
      title: 'Delphi Survey on Acute Low Back Pain',
      description: 'Expert consensus survey on clinical practice guidelines',
      sections: SECTIONS,
      is_active: true
    }

    console.log('Creating survey with data:', JSON.stringify(surveyData, null, 2))

    const survey = await SurveyDatabase.createSurvey(surveyData)
    console.log('Survey created:', survey)

    return NextResponse.json({ 
      success: true, 
      message: 'Survey created successfully',
      data: survey 
    })
  } catch (error) {
    console.error('Survey creation error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Survey creation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get existing surveys
    const surveys = await SurveyDatabase.getAllSurveys(true)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Surveys retrieved successfully',
      data: surveys 
    })
  } catch (error) {
    console.error('Survey retrieval error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Survey retrieval failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
