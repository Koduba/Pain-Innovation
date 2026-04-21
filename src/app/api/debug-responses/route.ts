import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate the answeredCount calculation
    const sampleResponses = {
      q1: { rating: 3, comment: '' },
      q2: { rating: 3, comment: '' },
      // ... simulate all 57 responses
    };

    // Add an extra response to simulate the bug
    const buggyResponses = {
      ...sampleResponses,
      q58: { rating: 3, comment: '' } // This extra response causes the count to be 58
    };

    const normalCount = Object.values(sampleResponses).filter(r => r.rating !== null).length;
    const buggyCount = Object.values(buggyResponses).filter(r => r.rating !== null).length;

    return NextResponse.json({
      success: true,
      data: {
        normalCount,
        buggyCount,
        normalKeys: Object.keys(sampleResponses).length,
        buggyKeys: Object.keys(buggyResponses).length,
        explanation: "The bug occurs when there are more response objects than actual questions"
      }
    });
  } catch (error) {
    console.error('Debug responses error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
