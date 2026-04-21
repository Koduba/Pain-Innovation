// New types for individual question columns structure

export interface SurveyResponseV2 {
  id?: string;
  survey_id: string;
  
  // Respondent information
  respondent_name?: string;
  respondent_institution?: string;
  respondent_role?: string;
  respondent_date?: string;
  general_comments?: string;
  
  // Question responses (58 questions total)
  // Each question has: rating (1-7), comment, and na flag
  
  // Section 1: General key messages (q1-q14)
  q1_rating?: number | null;
  q1_comment?: string;
  q1_na?: boolean;
  q2_rating?: number | null;
  q2_comment?: string;
  q2_na?: boolean;
  q3_rating?: number | null;
  q3_comment?: string;
  q3_na?: boolean;
  q4_rating?: number | null;
  q4_comment?: string;
  q4_na?: boolean;
  q5_rating?: number | null;
  q5_comment?: string;
  q5_na?: boolean;
  q6_rating?: number | null;
  q6_comment?: string;
  q6_na?: boolean;
  q7_rating?: number | null;
  q7_comment?: string;
  q7_na?: boolean;
  q8_rating?: number | null;
  q8_comment?: string;
  q8_na?: boolean;
  q9_rating?: number | null;
  q9_comment?: string;
  q9_na?: boolean;
  q10_rating?: number | null;
  q10_comment?: string;
  q10_na?: boolean;
  q11_rating?: number | null;
  q11_comment?: string;
  q11_na?: boolean;
  q12_rating?: number | null;
  q12_comment?: string;
  q12_na?: boolean;
  q13_rating?: number | null;
  q13_comment?: string;
  q13_na?: boolean;
  q14_rating?: number | null;
  q14_comment?: string;
  q14_na?: boolean;
  
  // Section 2: Assessment & imaging (q15-q21)
  q15_rating?: number | null;
  q15_comment?: string;
  q15_na?: boolean;
  q16_rating?: number | null;
  q16_comment?: string;
  q16_na?: boolean;
  q17_rating?: number | null;
  q17_comment?: string;
  q17_na?: boolean;
  q18_rating?: number | null;
  q18_comment?: string;
  q18_na?: boolean;
  q19_rating?: number | null;
  q19_comment?: string;
  q19_na?: boolean;
  q20_rating?: number | null;
  q20_comment?: string;
  q20_na?: boolean;
  q21_rating?: number | null;
  q21_comment?: string;
  q21_na?: boolean;
  
  // Section 3: Red flags / imaging criteria (q22-q25)
  q22_rating?: number | null;
  q22_comment?: string;
  q22_na?: boolean;
  q23_rating?: number | null;
  q23_comment?: string;
  q23_na?: boolean;
  q24_rating?: number | null;
  q24_comment?: string;
  q24_na?: boolean;
  q25_rating?: number | null;
  q25_comment?: string;
  q25_na?: boolean;
  
  // Section 4: Self-management (Rec. 1) (q26-q33)
  q26_rating?: number | null;
  q26_comment?: string;
  q26_na?: boolean;
  q27_rating?: number | null;
  q27_comment?: string;
  q27_na?: boolean;
  q28_rating?: number | null;
  q28_comment?: string;
  q28_na?: boolean;
  q29_rating?: number | null;
  q29_comment?: string;
  q29_na?: boolean;
  q30_rating?: number | null;
  q30_comment?: string;
  q30_na?: boolean;
  q31_rating?: number | null;
  q31_comment?: string;
  q31_na?: boolean;
  q32_rating?: number | null;
  q32_comment?: string;
  q32_na?: boolean;
  q33_rating?: number | null;
  q33_comment?: string;
  q33_na?: boolean;
  
  // Section 5: If not improving (Rec. 2a) (q34-q42)
  q34_rating?: number | null;
  q34_comment?: string;
  q34_na?: boolean;
  q35_rating?: number | null;
  q35_comment?: string;
  q35_na?: boolean;
  q36_rating?: number | null;
  q36_comment?: string;
  q36_na?: boolean;
  q37_rating?: number | null;
  q37_comment?: string;
  q37_na?: boolean;
  q38_rating?: number | null;
  q38_comment?: string;
  q38_na?: boolean;
  q39_rating?: number | null;
  q39_comment?: string;
  q39_na?: boolean;
  q40_rating?: number | null;
  q40_comment?: string;
  q40_na?: boolean;
  q41_rating?: number | null;
  q41_comment?: string;
  q41_na?: boolean;
  q42_rating?: number | null;
  q42_comment?: string;
  q42_na?: boolean;
  
  // Section 6: Radiculopathy-specific (Rec. 2b) (q43-q48)
  q43_rating?: number | null;
  q43_comment?: string;
  q43_na?: boolean;
  q44_rating?: number | null;
  q44_comment?: string;
  q44_na?: boolean;
  q45_rating?: number | null;
  q45_comment?: string;
  q45_na?: boolean;
  q46_rating?: number | null;
  q46_comment?: string;
  q46_na?: boolean;
  q47_rating?: number | null;
  q47_comment?: string;
  q47_na?: boolean;
  q48_rating?: number | null;
  q48_comment?: string;
  q48_na?: boolean;
  
  // Section 7: Opioids (Rec. 3) (q49-q58)
  q49_rating?: number | null;
  q49_comment?: string;
  q49_na?: boolean;
  q50_rating?: number | null;
  q50_comment?: string;
  q50_na?: boolean;
  q51_rating?: number | null;
  q51_comment?: string;
  q51_na?: boolean;
  q52_rating?: number | null;
  q52_comment?: string;
  q52_na?: boolean;
  q53_rating?: number | null;
  q53_comment?: string;
  q53_na?: boolean;
  q54_rating?: number | null;
  q54_comment?: string;
  q54_na?: boolean;
  q55_rating?: number | null;
  q55_comment?: string;
  q55_na?: boolean;
  q56_rating?: number | null;
  q56_comment?: string;
  q56_na?: boolean;
  q57_rating?: number | null;
  q57_comment?: string;
  q57_na?: boolean;
  q58_rating?: number | null;
  q58_comment?: string;
  q58_na?: boolean;
  
  created_at?: string;
  updated_at?: string;
  last_updated_at?: string;
}

// Helper function to convert old format to new format
export function convertToV2Format(
  surveyId: string,
  respondent: any,
  generalComments: string,
  responses: any
): SurveyResponseV2 {
  const v2Response: SurveyResponseV2 = {
    survey_id: surveyId,
    respondent_name: respondent.name,
    respondent_institution: respondent.institution,
    respondent_role: respondent.role,
    respondent_date: respondent.date,
    general_comments: generalComments
  };

  // Convert all responses to individual columns
  let questionNumber = 1;
  
  // Process each section
  Object.values(responses).forEach((section: any) => {
    if (section.items) {
      section.items.forEach((item: any) => {
        const qKey = `q${questionNumber}`;
        const ratingKey = `${qKey}_rating` as keyof SurveyResponseV2;
        const commentKey = `${qKey}_comment` as keyof SurveyResponseV2;
        const naKey = `${qKey}_na` as keyof SurveyResponseV2;
        
        (v2Response as any)[ratingKey] = item.rating === 'N/A' ? null : item.rating;
        (v2Response as any)[commentKey] = item.comment || '';
        (v2Response as any)[naKey] = item.rating === 'N/A';
        
        questionNumber++;
      });
    }
  });

  return v2Response;
}
