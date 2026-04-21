import { supabase } from '../supabase'
import { SurveyResponseV2, convertToV2Format } from '@/types/survey-v2'
import { Respondent, SurveyData } from '@/types/survey'
import { UserTracker } from '../user-tracking'

export class SurveyDatabaseV3 {
  // Check if user has already submitted
  static async hasUserSubmitted(surveyId: string): Promise<boolean> {
    const userSession = await UserTracker.getInstance().getUserSession()
    
    const { data, error } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('survey_id', surveyId)
      .eq('user_identifier', userSession.identifier)
      .limit(1)

    if (error) {
      console.error('Error checking user submission:', error)
      throw error
    }

    return data && data.length > 0
  }

  // Get user's existing response
  static async getUserResponse(surveyId: string): Promise<SurveyResponseV2 | null> {
    const userSession = await UserTracker.getInstance().getUserSession()
    
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .eq('user_identifier', userSession.identifier)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting user response:', error)
      throw error
    }

    return data
  }

  // Submit new survey response (only if user hasn't submitted)
  static async submitSurveyResponse(
    surveyId: string,
    respondent: Respondent,
    surveyData: SurveyData
  ) {
    // Check if user has already submitted
    const hasSubmitted = await this.hasUserSubmitted(surveyId)
    if (hasSubmitted) {
      throw new Error('You have already submitted this survey. You can edit your existing response instead.')
    }

    const userSession = await UserTracker.getInstance().getUserSession()
    
    // Convert to V2 format
    const v2Response = convertToV2Format(surveyId, respondent, surveyData.general_comments, surveyData.responses)
    
    // Add user tracking data
    const responseWithUser = {
      ...v2Response,
      user_identifier: userSession.identifier,
      user_ip: userSession.ip,
      user_session_id: userSession.sessionId,
      is_completed: true
    }

    const { data, error } = await supabase
      .from('survey_responses')
      .insert([responseWithUser])
      .select()
      .single()

    if (error) {
      console.error('Error submitting survey response:', error)
      throw error
    }

    return data
  }

  // Update existing survey response
  static async updateSurveyResponse(
    responseId: string,
    respondent: Respondent,
    surveyData: SurveyData
  ) {
    const userSession = await UserTracker.getInstance().getUserSession()
    
    // Verify user owns this response
    const existingResponse = await this.getUserResponseBy(responseId, userSession.identifier)
    if (!existingResponse) {
      throw new Error('You can only edit your own responses.')
    }

    // Convert to V2 format
    const v2Response = convertToV2Format(existingResponse.survey_id, respondent, surveyData.general_comments, surveyData.responses)
    
    // Prepare update data (exclude system fields)
    const updateData: Partial<SurveyResponseV2> = { ...v2Response }
    delete (updateData as any).id
    delete (updateData as any).survey_id
    delete (updateData as any).created_at
    delete (updateData as any).updated_at

    const { data, error } = await supabase
      .from('survey_responses')
      .update(updateData)
      .eq('id', responseId)
      .eq('user_identifier', userSession.identifier)
      .select()
      .single()

    if (error) {
      console.error('Error updating survey response:', error)
      throw error
    }

    return data
  }

  // Get response by ID and user verification
  static async getUserResponseBy(responseId: string, userIdentifier: string): Promise<SurveyResponseV2 | null> {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('id', responseId)
      .eq('user_identifier', userIdentifier)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user response by ID:', error)
      throw error
    }

    return data
  }

  // Save or update survey response (handles both new and edit cases)
  static async saveSurveyResponse(
    surveyId: string,
    respondent: Respondent,
    surveyData: SurveyData
  ) {
    const existingResponse = await this.getUserResponse(surveyId)
    
    if (existingResponse) {
      // Update existing response
      return await this.updateSurveyResponse(existingResponse.id!, respondent, surveyData)
    } else {
      // Create new response
      return await this.submitSurveyResponse(surveyId, respondent, surveyData)
    }
  }

  // Get all survey responses (for admin use)
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

  // Calculate rating distribution (5-point scale)
  private static calculateDistribution(ratings: number[]) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    ratings.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++
      }
    })

    return distribution
  }

  // Delete user's response
  static async deleteUserResponse(surveyId: string) {
    const userSession = await UserTracker.getInstance().getUserSession()
    
    const { error } = await supabase
      .from('survey_responses')
      .delete()
      .eq('survey_id', surveyId)
      .eq('user_identifier', userSession.identifier)

    if (error) {
      console.error('Error deleting user response:', error)
      throw error
    }

    return true
  }
}
