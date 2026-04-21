import { NextResponse } from 'next/server'
import { LABELS, COLORS } from '@/data/surveyData'

export async function GET() {
  try {
    // Test 5-point scale configuration
    const scaleTest = {
      labels: LABELS,
      colors: COLORS,
      scalePoints: LABELS.length - 1, // Exclude empty string at index 0
      expectedLabels: ['', 'Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
      expectedColors: [
        null,
        { bg: "#fbe9e7", color: "#c62828", track: "#c62828" }, // 1 - Strongly disagree (red)
        { bg: "#fde8cc", color: "#bf360c", track: "#e64a19" }, // 2 - Disagree (orange)
        { bg: "#f5f5f5", color: "#555", track: "#9e9e9e" },     // 3 - Neutral (gray)
        { bg: "#e8f5e9", color: "#2e7d32", track: "#43a047" }, // 4 - Agree (green)
        { bg: "#81c784", color: "#1b5e20", track: "#1b5e20" }  // 5 - Strongly agree (dark green)
      ]
    }

    // Verify configuration
    const isCorrect = 
      scaleTest.scalePoints === 5 &&
      JSON.stringify(scaleTest.labels) === JSON.stringify(scaleTest.expectedLabels) &&
      JSON.stringify(scaleTest.colors) === JSON.stringify(scaleTest.expectedColors)

    return NextResponse.json({ 
      success: true, 
      message: '5-point scale configuration test',
      data: {
        scalePoints: scaleTest.scalePoints,
        labels: scaleTest.labels,
        colorsCount: scaleTest.colors.length,
        isCorrect,
        configuration: isCorrect ? 'CORRECT' : 'INCORRECT',
        details: {
          'Scale Points': `${scaleTest.scalePoints} points (1-5)`,
          'Labels': `${scaleTest.labels.length} labels configured`,
          'Colors': `${scaleTest.colors.length} colors configured`,
          'Comment Threshold': 'Comments required for ratings 1-2',
          'Default Rating': '3 (Neutral)'
        }
      }
    })
  } catch (error) {
    console.error('5-point scale test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: '5-point scale test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Test sample data with 5-point scale
    const testData = {
      surveyData: {
        respondent: {
          name: '5-Point Scale Test User',
          institution: 'Test Institution',
          role: 'Test Role',
          date: new Date().toISOString().split('T')[0]
        },
        general_comments: 'Testing 5-point scale functionality',
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
      },
      scaleValidation: {
        minRating: 1,
        maxRating: 5,
        middleRating: 3,
        commentRequired: [1, 2], // Comments required for ratings 1-2
        labels: {
          1: 'Strongly disagree',
          2: 'Disagree',
          3: 'Neutral',
          4: 'Agree',
          5: 'Strongly agree'
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: '5-point scale test data created',
      data: {
        testSummary: {
          totalQuestions: 5,
          ratingsRange: '1-5',
          commentsRequired: 'Ratings 1-2',
          middlePoint: '3 (Neutral)'
        },
        sampleData: testData,
        instructions: 'Test the 5-point scale by completing a survey in the browser'
      }
    })
  } catch (error) {
    console.error('5-point scale data test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: '5-point scale data test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
