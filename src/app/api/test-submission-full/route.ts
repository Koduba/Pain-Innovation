import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Create minimal test data (no N/A fields)
    const testData = {
      survey_id: 'f44315e6-66a7-4ef4-8347-1057f8c717fd',
      respondent_name: 'Test User',
      respondent_institution: 'Test',
      respondent_role: 'Test',
      respondent_date: '2026-04-21',
      general_comments: 'Test',
      q1_rating: 3,
      q1_comment: 'Test comment',
      user_identifier: 'test-user',
      user_ip: '127.0.0.1',
      user_session_id: 'test-session',
      is_completed: true
    }

    console.log('Attempting to insert test data:', testData)

    // Try direct database insert
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([testData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'Database insert failed',
        error: error.message,
        details: error,
        testData
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test submission successful',
      data
    })
  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Test submission failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
