import { supabase } from '../supabase'
import { SurveyResponseV2, convertToV2Format } from '@/types/survey-v2'
import { Respondent, SurveyData } from '@/types/survey'

export class SurveyDatabaseV2 {
  // Submit survey response with individual question columns
  static async submitSurveyResponse(
    surveyId: string,
    respondent: Respondent,
    surveyData: SurveyData
  ) {
    // Convert to V2 format
    const v2Response = convertToV2Format(surveyId, respondent, surveyData.general_comments, surveyData.responses)

    const { data, error } = await supabase
      .from('survey_responses')
      .insert([v2Response])
      .select()
      .single()

    if (error) {
      console.error('Error submitting survey response:', error)
      throw error
    }

    return data
  }

  // Get all survey responses in the new format
  static async getSurveyResponses(surveyId: string) {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching survey responses:', error)
      throw error
    }

    return data
  }

  // Get a specific response
  static async getSurveyResponse(responseId: string) {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('id', responseId)
      .single()

    if (error) {
      console.error('Error fetching survey response:', error)
      throw error
    }

    return data
  }

  // Get all survey responses
  static async getAllSurveyResponses() {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all survey responses:', error)
      throw error
    }

    return data
  }

  // Get survey statistics
  static async getSurveyStats(surveyId: string) {
    const { data: responses, error } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('survey_id', surveyId)

    if (error) {
      console.error('Error fetching survey stats:', error)
      throw error
    }

    return {
      totalResponses: responses?.length || 0,
      surveyId
    }
  }

  // Get question statistics for analysis
  static async getQuestionStats(surveyId: string, questionNumber: number) {
    const columnName = `q${questionNumber}_rating`
    
    const { data, error } = await supabase
      .from('survey_responses')
      .select(columnName)
      .eq('survey_id', surveyId)
      .not(columnName, 'is', null)

    if (error) {
      console.error('Error fetching question stats:', error)
      throw error
    }

    const ratings = data.map((row: any) => row[columnName]).filter((rating: any) => rating !== null)
    
    return {
      questionNumber,
      totalResponses: ratings.length,
      average: ratings.length > 0 ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length : 0,
      distribution: this.calculateDistribution(ratings)
    }
  }

  // Calculate rating distribution
  private static calculateDistribution(ratings: number[]) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }
    
    ratings.forEach(rating => {
      if (rating >= 1 && rating <= 7) {
        distribution[rating as keyof typeof distribution]++
      }
    })

    return distribution
  }

  // Get all question statistics for a survey
  static async getAllQuestionStats(surveyId: string) {
    const stats = []
    
    for (let i = 1; i <= 58; i++) {
      try {
        const stat = await this.getQuestionStats(surveyId, i)
        stats.push(stat)
      } catch (error) {
        console.error(`Error getting stats for question ${i}:`, error)
      }
    }

    return stats
  }

  // Export data for analysis
  static async exportForAnalysis(surveyId: string) {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error exporting data:', error)
      throw error
    }

    return data
  }
}
