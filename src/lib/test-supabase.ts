import { supabase } from './supabase'

// Test function to verify Supabase connection
export async function testSupabaseConnection() {
  try {
    // Test basic connection by checking if we can access the tables
    const { data: surveysData, error: surveysError } = await supabase
      .from('surveys')
      .select('count')
      .limit(1)

    const { data: responsesData, error: responsesError } = await supabase
      .from('survey_responses')
      .select('count')
      .limit(1)

    if (surveysError || responsesError) {
      console.error('Supabase connection error:', { surveysError, responsesError })
      return { success: false, error: surveysError || responsesError }
    }

    console.log('Supabase connection successful:', { surveysData, responsesData })
    return { success: true, data: { surveysData, responsesData } }
  } catch (error) {
    console.error('Unexpected error testing Supabase:', error)
    return { success: false, error }
  }
}
