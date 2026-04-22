import { NextRequest, NextResponse } from 'next/server';
import { SurveyDatabaseV3 } from '@/lib/database/surveys-v3';
import { getActiveSurveyId } from '@/lib/get-survey';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG: Testing submission flow ===');
    
    // Test 1: Get active survey ID
    console.log('1. Getting active survey ID...');
    const surveyId = await getActiveSurveyId();
    console.log('Survey ID:', surveyId);
    
    // Test 2: Create test respondent data
    console.log('2. Creating test respondent...');
    const testRespondent = {
      name: 'Debug Test User',
      institution: 'Debug Institution',
      role: 'Debug Role',
      date: new Date().toISOString().split('T')[0],
      country: 'United States'
    };
    console.log('Test respondent:', testRespondent);
    
    // Test 3: Create test survey data
    console.log('3. Creating test survey data...');
    const testSurveyData = {
      respondent: testRespondent,
      general_comments: 'Debug test submission',
      responses: {
        section_1: {
          title: 'General key messages',
          items: [
            {
              question_number: 1,
              statement: 'Test question 1',
              rating: 4,
              comment: 'Test comment 1'
            },
            {
              question_number: 2,
              statement: 'Test question 2', 
              rating: 3,
              comment: 'Test comment 2',
              na: false
            }
          ]
        }
      }
    };
    console.log('Test survey data:', testSurveyData);
    
    // Test 4: Check if user has already submitted
    console.log('4. Checking if user has submitted...');
    const hasSubmitted = await SurveyDatabaseV3.hasUserSubmitted(surveyId);
    console.log('Has user submitted:', hasSubmitted);
    
    // Test 5: Attempt to save survey response
    console.log('5. Attempting to save survey response...');
    const result = await SurveyDatabaseV3.saveSurveyResponse(
      surveyId,
      testSurveyData.respondent,
      testSurveyData
    );
    console.log('Save result:', result);
    
    // Test 6: Verify the response was saved
    console.log('6. Verifying response was saved...');
    const savedResponse = await SurveyDatabaseV3.getUserResponse(surveyId);
    console.log('Saved response:', savedResponse);
    
    console.log('=== DEBUG: Submission test completed successfully ===');
    
    return NextResponse.json({
      success: true,
      message: 'Debug submission test completed successfully',
      results: {
        surveyId,
        hasSubmitted,
        saveResult: result,
        verifiedResponse: savedResponse
      }
    });
    
  } catch (error) {
    console.error('=== DEBUG: Submission test failed ===');
    console.error('Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Debug submission test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug submission endpoint. Use POST to test submission flow.',
    usage: 'POST /api/debug-submission'
  });
}
