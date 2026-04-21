import { NextResponse } from 'next/server'
import { SECTIONS } from '@/data/surveyData'

export async function GET() {
  try {
    // Calculate total questions from SECTIONS
    const totalQuestions = SECTIONS.reduce((acc, section) => acc + section.qs.length, 0);
    
    // Count questions per section
    const sectionCounts = SECTIONS.map((section, index) => ({
      section: index + 1,
      title: section.title,
      questionCount: section.qs.length,
      questions: section.qs
    }));
    
    // Simulate response initialization to see how many responses would be created
    let questionNumber = 1;
    const simulatedResponses: string[] = [];
    
    SECTIONS.forEach((section) => {
      section.qs.forEach(() => {
        simulatedResponses.push(`q${questionNumber}`);
        questionNumber++;
      });
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalQuestions,
        simulatedResponseCount: simulatedResponses.length,
        finalQuestionNumber: questionNumber - 1,
        sectionCounts,
        allResponseKeys: simulatedResponses,
        discrepancy: {
          totalQuestions,
          simulatedResponses: simulatedResponses.length,
          difference: totalQuestions - simulatedResponses.length
        }
      }
    });
  } catch (error) {
    console.error('Debug count error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
