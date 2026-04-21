import { SurveyDatabase } from './database/surveys'

export async function getActiveSurveyId() {
  try {
    const surveys = await SurveyDatabase.getAllSurveys(true)
    
    if (surveys && surveys.length > 0) {
      return surveys[0].id
    }
    
    throw new Error('No active surveys found')
  } catch (error) {
    console.error('Error getting active survey:', error)
    throw error
  }
}
