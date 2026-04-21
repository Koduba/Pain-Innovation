# Supabase Database Setup for Survey Responses

This guide will help you set up Supabase for collecting and storing survey responses in your Delphi survey application.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Setup Instructions

### 1. Environment Configuration

1. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   You can find these values in your Supabase project dashboard under Settings > API.

### 2. Database Schema Setup

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy and execute the SQL schema from `src/lib/database/schema.sql`
3. This will create:
   - `surveys` table for storing survey definitions
   - `survey_responses` table for storing user responses
   - Proper indexes and RLS policies
   - Automatic timestamp triggers

### 3. Install Dependencies

Install the Supabase client library:
```bash
npm install @supabase/supabase-js
```

## Usage Examples

### Creating a Survey

```typescript
import { SurveyDatabase } from '@/lib/database/surveys'

const newSurvey = {
  title: "Delphi Method Survey",
  description: "Expert opinion gathering survey",
  sections: [
    {
      title: "Section 1",
      desc: "Initial questions",
      qs: ["Question 1?", "Question 2?"]
    }
  ],
  is_active: true
}

const survey = await SurveyDatabase.createSurvey(newSurvey)
```

### Submitting Survey Responses

```typescript
import { SurveyDatabase } from '@/lib/database/surveys'

const respondentData = {
  name: "John Doe",
  institution: "University",
  role: "Expert",
  date: new Date().toISOString()
}

const responseData = {
  respondent: respondentData,
  general_comments: "Great survey!",
  responses: {
    section1: {
      title: "Section 1",
      items: [
        {
          question_number: 1,
          statement: "Question 1?",
          rating: 4,
          comment: "Good question"
        }
      ]
    }
  }
}

const response = await SurveyDatabase.submitSurveyResponse(
  surveyId,
  respondentData,
  responseData
)
```

### Retrieving Survey Responses

```typescript
// Get all responses for a specific survey
const responses = await SurveyDatabase.getSurveyResponses(surveyId)

// Get a specific response
const response = await SurveyDatabase.getSurveyResponse(responseId)

// Get survey statistics
const stats = await SurveyDatabase.getSurveyStats(surveyId)
console.log(`Total responses: ${stats.totalResponses}`)
```

## Database Structure

### Surveys Table
- `id`: UUID (Primary Key)
- `title`: Text (Survey title)
- `description`: Text (Optional description)
- `sections`: JSONB (Survey sections and questions)
- `is_active`: Boolean (Whether survey is active)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Survey Responses Table
- `id`: UUID (Primary Key)
- `survey_id`: UUID (Foreign key to surveys)
- `respondent_data`: JSONB (Respondent information)
- `response_data`: JSONB (Survey responses)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Security Notes

- Row Level Security (RLS) is enabled on both tables
- Current policies allow public access - modify these based on your security requirements
- Consider implementing authentication for more secure access control

## Next Steps

1. Set up authentication if needed
2. Customize RLS policies for your security requirements
3. Add validation for survey responses
4. Implement analytics and reporting features
