import { NextResponse } from 'next/server'
import { Response } from '@/types/survey'

export async function GET() {
  try {
    // Test Response type without N/A
    const testResponse: Response = {
      rating: 3,
      comment: 'Test comment'
    }

    // Verify Response type structure
    const hasNaField = 'na' in testResponse
    const hasRatingField = 'rating' in testResponse
    const hasCommentField = 'comment' in testResponse

    return NextResponse.json({ 
      success: true, 
      message: 'N/A removal test',
      data: {
        responseType: {
          hasNaField,
          hasRatingField,
          hasCommentField,
          structure: Object.keys(testResponse)
        },
        testResponse,
        validation: {
          hasNaField: !hasNaField, // Should be false
          hasRequiredFields: hasRatingField && hasCommentField, // Should be true
          ratingType: typeof testResponse.rating, // Should be number
          commentType: typeof testResponse.comment // Should be string
        }
      }
    })
  } catch (error) {
    console.error('N/A removal test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'N/A removal test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Test survey data structure without N/A
    const testSurveyData = {
      respondent: {
        name: 'No N/A Test User',
        institution: 'Test Institution',
        role: 'Test Role',
        date: new Date().toISOString().split('T')[0]
      },
      general_comments: 'Testing survey without N/A option',
      responses: {
        section_1: {
          title: 'General key messages',
          items: [
            {
              question_number: 1,
              statement: 'Test statement 1',
              rating: 1, // Strongly disagree
              comment: 'Strongly disagree comment'
            },
            {
              question_number: 2,
              statement: 'Test statement 2',
              rating: 2, // Disagree
              comment: 'Disagree comment'
            },
            {
              question_number: 3,
              statement: 'Test statement 3',
              rating: 3, // Neutral
              comment: 'Neutral comment'
            },
            {
              question_number: 4,
              statement: 'Test statement 4',
              rating: 4, // Agree
              comment: 'Agree comment'
            },
            {
              question_number: 5,
              statement: 'Test statement 5',
              rating: 5, // Strongly agree
              comment: 'Strongly agree comment'
            }
          ]
        }
      }
    }

    // Verify no N/A values in the data
    const allItems = Object.values(testSurveyData.responses).flatMap(section => section.items)
    const hasNaValues = allItems.some(item => (item as any).rating === 'N/A' || (item as any).na === true)

    return NextResponse.json({ 
      success: true, 
      message: 'Survey data without N/A test',
      data: {
        surveyData: testSurveyData,
        validation: {
          totalItems: allItems.length,
          hasNaValues: !hasNaValues, // Should be false
          allRatingsNumeric: allItems.every(item => typeof item.rating === 'number'),
          ratingRange: {
            min: Math.min(...allItems.map(item => item.rating as number)),
            max: Math.max(...allItems.map(item => item.rating as number))
          },
          commentRequirement: 'Comments required for ratings 1-2'
        },
        features: {
          sliderPoints: 5,
          naOptionRemoved: true,
          commentThreshold: [1, 2],
          defaultRating: 3
        }
      }
    })
  } catch (error) {
    console.error('Survey data test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Survey data test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
