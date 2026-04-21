'use client'

import { useState } from 'react'
import { SurveyDatabase } from '@/lib/database/surveys'
import { SurveyDB, SurveyData, Respondent } from '@/types/survey'

export default function SurveyExample() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const createSampleSurvey = async () => {
    setLoading(true)
    setMessage('')

    try {
      const sampleSurvey: Omit<SurveyDB, 'id' | 'created_at' | 'updated_at'> = {
        title: 'Delphi Method Expert Survey',
        description: 'A survey to gather expert opinions on future trends',
        sections: [
          {
            title: 'Technology Trends',
            desc: 'Questions about emerging technologies',
            qs: [
              'How impactful will AI be in the next 5 years?',
              'What is the adoption rate of quantum computing?',
              'Which emerging technology shows most promise?'
            ]
          },
          {
            title: 'Economic Impact',
            desc: 'Questions about economic implications',
            qs: [
              'What is the projected economic growth rate?',
              'Which sectors will be most disrupted?',
              'What are the biggest economic challenges?'
            ]
          }
        ],
        is_active: true
      }

      const result = await SurveyDatabase.createSurvey(sampleSurvey)
      setMessage(`Survey created successfully with ID: ${result.id}`)
    } catch (error) {
      setMessage(`Error creating survey: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const submitSampleResponse = async () => {
    setLoading(true)
    setMessage('')

    try {
      const respondentData: Respondent = {
        name: 'Dr. Jane Smith',
        institution: 'Tech Research Institute',
        role: 'Senior Researcher',
        date: new Date().toISOString()
      }

      const responseData: SurveyData = {
        respondent: respondentData,
        general_comments: 'This survey provides valuable insights into future trends.',
        responses: {
          'technology-trends': {
            title: 'Technology Trends',
            items: [
              {
                question_number: 1,
                statement: 'How impactful will AI be in the next 5 years?',
                rating: 5,
                comment: 'AI will transform multiple industries significantly.'
              },
              {
                question_number: 2,
                statement: 'What is the adoption rate of quantum computing?',
                rating: 2,
                comment: 'Still in early stages, limited practical applications.'
              },
              {
                question_number: 3,
                statement: 'Which emerging technology shows most promise?',
                rating: 4,
                comment: 'AI and machine learning have the most immediate potential.'
              }
            ]
          },
          'economic-impact': {
            title: 'Economic Impact',
            items: [
              {
                question_number: 1,
                statement: 'What is the projected economic growth rate?',
                rating: 3,
                comment: 'Moderate growth expected with sector-specific variations.'
              },
              {
                question_number: 2,
                statement: 'Which sectors will be most disrupted?',
                rating: 4,
                comment: 'Healthcare, finance, and transportation will see major changes.'
              },
              {
                question_number: 3,
                statement: 'What are the biggest economic challenges?',
                rating: 4,
                comment: 'Workforce displacement and skill gaps are major concerns.'
              }
            ]
          }
        }
      }

      // You would need to replace 'your-survey-id' with an actual survey ID
      const surveyId = 'your-survey-id'
      const result = await SurveyDatabase.submitSurveyResponse(
        surveyId,
        respondentData,
        responseData
      )
      setMessage(`Response submitted successfully with ID: ${result.id}`)
    } catch (error) {
      setMessage(`Error submitting response: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchSurveys = async () => {
    setLoading(true)
    setMessage('')

    try {
      const surveys = await SurveyDatabase.getAllSurveys()
      setMessage(`Found ${surveys.length} surveys`)
      console.log('Surveys:', surveys)
    } catch (error) {
      setMessage(`Error fetching surveys: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchResponses = async () => {
    setLoading(true)
    setMessage('')

    try {
      const responses = await SurveyDatabase.getAllSurveyResponses()
      setMessage(`Found ${responses.length} total responses`)
      console.log('Responses:', responses)
    } catch (error) {
      setMessage(`Error fetching responses: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Survey Database Examples</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Database Operations</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={createSampleSurvey}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Create Sample Survey
            </button>
            
            <button
              onClick={submitSampleResponse}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Submit Sample Response
            </button>
            
            <button
              onClick={fetchSurveys}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Fetch All Surveys
            </button>
            
            <button
              onClick={fetchResponses}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Fetch All Responses
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Setup Required</h3>
          <p className="text-yellow-700 text-sm">
            Make sure to configure your Supabase credentials in .env.local and run the schema.sql 
            file in your Supabase SQL editor before testing these examples.
          </p>
        </div>
      </div>
    </div>
  )
}
