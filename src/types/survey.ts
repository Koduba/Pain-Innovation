export interface SurveySection {
  title: string;
  desc: string;
  qs: string[];
}

export interface Response {
  rating: number;
  comment: string;
  na?: boolean;
}

export interface Responses {
  [key: string]: Response;
}

export interface Respondent {
  name: string;
  institution: string;
  role: string;
  date: string;
  country: string;
}

export interface SurveyData {
  respondent: Respondent;
  general_comments: string;
  responses: {
    [key: string]: {
      title: string;
      items: {
        question_number: number;
        statement: string;
        rating: string | number;
        comment: string;
      }[];
    };
  };
}

export interface ColorConfig {
  bg: string;
  color: string;
  track: string;
}

// Supabase database interfaces
export interface SurveyResponseDB {
  id?: string
  survey_id: string
  respondent_data: Respondent
  response_data: SurveyData
  created_at?: string
  updated_at?: string
}

export interface SurveyDB {
  id?: string
  title: string
  description?: string
  sections: SurveySection[]
  is_active: boolean
  created_at?: string
  updated_at?: string
}
