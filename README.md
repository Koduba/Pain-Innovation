# Delphi Survey - Next.js Application

A Next.js application for conducting Delphi consensus surveys on acute low back pain clinical practice guidelines.

## Features

- Multi-section survey with 58 questions across 7 sections
- Interactive slider interface for rating responses (1-7 scale)
- N/A option for questions that cannot be assessed
- Required comments for ratings 1-3
- Progress tracking and navigation
- Responsive design for mobile and desktop
- JSON export functionality
- Real-time validation and feedback

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main survey page
├── components/
│   ├── Cover.tsx           # Survey cover page
│   ├── Header.tsx          # Progress header
│   ├── Instructions.tsx     # Survey instructions
│   ├── Modal.tsx           # Summary modal
│   ├── NavigationFooter.tsx  # Section navigation
│   ├── Question.tsx        # Individual question component
│   ├── ScaleBar.tsx        # Rating scale legend
│   ├── SectionNavigation.tsx # Section tabs
│   └── Slider.tsx          # Interactive rating slider
├── data/
│   └── surveyData.ts       # Survey questions and configuration
└── types/
    └── survey.ts           # TypeScript type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Survey Sections

1. **Cover** - Respondent information and instructions
2. **General key messages** - Overarching principles (14 questions)
3. **Assessment & imaging** - Imaging guidelines (7 questions)
4. **Red flags / imaging criteria** - Warning signs (4 questions)
5. **Self-management (Rec. 1)** - First-line strategies (8 questions)
6. **If not improving (Rec. 2a)** - Additional treatments (9 questions)
7. **Radiculopathy-specific (Rec. 2b)** - Specific treatments (6 questions)
8. **Opioids (Rec. 3)** - Opioid guidelines (9 questions)
9. **Final comments** - General feedback

## Data Export

The survey exports responses in JSON format with the following structure:

```json
{
  "respondent": {
    "name": "Expert Name",
    "institution": "Institution",
    "role": "Specialty/Role",
    "date": "2024-01-01"
  },
  "general_comments": "Overall feedback...",
  "responses": {
    "section_1": {
      "title": "Section Title",
      "items": [
        {
          "question_number": 1,
          "statement": "Question text...",
          "rating": 5,
          "comment": "Optional comment..."
        }
      ]
    }
  }
}
```

## Build for Production

```bash
npm run build
npm start
```

## Notes

- The application is fully responsive and works on mobile devices
- All data is stored in component state (no external database)
- Progress is automatically saved during the session
- The survey requires completion of all questions for submission
