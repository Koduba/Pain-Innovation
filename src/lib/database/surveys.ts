import { supabase } from '../supabase'
import { SurveyDB, SurveyResponseDB, SurveyData, Respondent } from '@/types/survey'

export class SurveyDatabase {
  // Survey CRUD operations
  static async createSurvey(survey: Omit<SurveyDB, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('surveys')
      .insert([survey])
      .select()
      .single()

    if (error) {
      console.error('Error creating survey:', error)
      throw error
    }

    return data
  }

  static async getSurvey(id: string) {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching survey:', error)
      throw error
    }

    return data
  }

  static async getAllSurveys(activeOnly: boolean = true) {
    let query = supabase.from('surveys').select('*')
    
    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching surveys:', error)
      throw error
    }

    return data
  }

  static async updateSurvey(id: string, updates: Partial<SurveyDB>) {
    const { data, error } = await supabase
      .from('surveys')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating survey:', error)
      throw error
    }

    return data
  }

  static async deleteSurvey(id: string) {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting survey:', error)
      throw error
    }

    return true
  }

  // Survey Response CRUD operations
  static async submitSurveyResponse(
    surveyId: string,
    respondentData: Respondent,
    responseData: SurveyData
  ) {
    const response: Omit<SurveyResponseDB, 'id' | 'created_at' | 'updated_at'> = {
      survey_id: surveyId,
      respondent_data: respondentData,
      response_data: responseData
    }

    const { data, error } = await supabase
      .from('survey_responses')
      .insert([response])
      .select()
      .single()

    if (error) {
      console.error('Error submitting survey response:', error)
      throw error
    }

    return data
  }

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

  static async deleteSurveyResponse(responseId: string) {
    const { error } = await supabase
      .from('survey_responses')
      .delete()
      .eq('id', responseId)

    if (error) {
      console.error('Error deleting survey response:', error)
      throw error
    }

    return true
  }

  // Analytics and aggregation functions
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

  static async getResponsesByDateRange(
    surveyId: string,
    startDate: string,
    endDate: string
  ) {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching responses by date range:', error)
      throw error
    }

    return data
  }
}
