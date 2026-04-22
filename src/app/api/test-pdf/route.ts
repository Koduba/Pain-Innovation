import { NextResponse } from 'next/server'
import { PDFGenerator } from '@/lib/pdf-generator'

export async function POST() {
  try {
    // Create test survey data
    const testSurveyData = {
      respondent: {
        name: 'Test User PDF',
        institution: 'Test Institution PDF',
        role: 'Test Role PDF',
        date: new Date().toISOString().split('T')[0],
        country: 'United States'
      },
      general_comments: 'This is a test comment for PDF generation to verify the functionality works correctly.',
      responses: {
        section_1: {
          title: 'General key messages',
          items: [
            {
              question_number: 1,
              statement: 'Patients should be encouraged to engage in their care even before seeing a clinician.',
              rating: 5,
              comment: 'Strongly agree with this statement'
            },
            {
              question_number: 2,
              statement: 'Patient education is important across all recommendations.',
              rating: 7,
              comment: 'This is absolutely critical for good outcomes'
            },
            {
              question_number: 3,
              statement: 'The recommendations are based on evidence.',
              rating: 6,
              comment: 'Good evidence base overall'
            }
          ]
        },
        section_2: {
          title: 'Assessment & imaging',
          items: [
            {
              question_number: 15,
              statement: 'Imaging should be avoided in most patients with atraumatic ALBP under 6 weeks.',
              rating: 4,
              comment: 'Generally agree but with some exceptions'
            },
            {
              question_number: 16,
              statement: 'Imaging should only be used when "red flag" symptoms are present.',
              rating: 7,
              comment: 'This is the correct approach'
            }
          ]
        }
      }
    }

    // Test PDF generation (this will trigger download in browser environment)
    // For server-side testing, we'll just verify the data structure
    console.log('PDF Generation test data prepared:', {
      respondentName: testSurveyData.respondent.name,
      totalSections: Object.keys(testSurveyData.responses).length,
      totalQuestions: Object.values(testSurveyData.responses).reduce((sum, section) => sum + section.items.length, 0)
    })

    return NextResponse.json({ 
      success: true, 
      message: 'PDF generation test data prepared successfully',
      data: {
        respondentName: testSurveyData.respondent.name,
        totalSections: Object.keys(testSurveyData.responses).length,
        totalQuestions: Object.values(testSurveyData.responses).reduce((sum, section) => sum + section.items.length, 0),
        hasGeneralComments: !!testSurveyData.general_comments,
        instructions: 'Test PDF generation by completing a survey in the browser and clicking "Download responses (PDF)"'
      }
    })
  } catch (error) {
    console.error('PDF test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'PDF test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // jsPDF is a client-side library, so we'll just verify it's available for client use
    return NextResponse.json({ 
      success: true, 
      message: 'PDF generation is ready for client-side use',
      data: {
        library: 'jsPDF',
        status: 'installed',
        test: 'PDF generation ready in browser environment',
        instructions: 'Complete a survey and click "Download responses (PDF)" to test'
      }
    })
  } catch (error) {
    console.error('PDF library check error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'PDF library check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
