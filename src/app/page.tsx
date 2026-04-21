'use client';

import { useState, useEffect } from 'react';
import { SECTIONS } from '@/data/surveyData';
import { Respondent, Response, Responses, SurveyData } from '@/types/survey';
import { SurveyDatabaseV3 } from '@/lib/database/surveys-v3';
import { getActiveSurveyId } from '@/lib/get-survey';
import { UserTracker } from '@/lib/user-tracking';
import Header from '@/components/Header';
import SectionNavigation from '@/components/SectionNavigation';
import Cover from '@/components/Cover';
import Instructions from '@/components/Instructions';
import ScaleBar from '@/components/ScaleBar';
import Question from '@/components/Question';
import NavigationFooter from '@/components/NavigationFooter';
import Modal from '@/components/Modal';

export default function SurveyPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [respondent, setRespondent] = useState<Respondent>({
    name: '',
    institution: '',
    role: '',
    date: ''
  });
  const [generalComments, setGeneralComments] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingResponseId, setExistingResponseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const totalQuestions = SECTIONS.reduce((acc, section) => acc + section.qs.length, 0);

  useEffect(() => {
    // Initialize responses
    const initialResponses: Responses = {};
    let questionNumber = 1;
    
    SECTIONS.forEach((section) => {
      section.qs.forEach(() => {
        initialResponses[`q${questionNumber}`] = {
          rating: 3,
          comment: ''
        };
        questionNumber++;
      });
    });
    
    setResponses(initialResponses);
    
    // Check for existing user response
    checkExistingResponse();
  }, []);

  const checkExistingResponse = async () => {
    try {
      setIsLoading(true);
      const surveyId = await getActiveSurveyId();
      const existingResponse = await SurveyDatabaseV3.getUserResponse(surveyId);
      
      if (existingResponse) {
        setIsEditMode(true);
        setExistingResponseId(existingResponse.id!);
        
        // Load existing data into form
        if (existingResponse.respondent_name) {
          setRespondent({
            name: existingResponse.respondent_name,
            institution: existingResponse.respondent_institution || '',
            role: existingResponse.respondent_role || '',
            date: existingResponse.respondent_date || ''
          });
        }
        
        setGeneralComments(existingResponse.general_comments || '');
        
        // Load existing responses
        const loadedResponses: Responses = {};
        for (let i = 1; i <= 58; i++) {
          const rating = (existingResponse as any)[`q${i}_rating`];
          const comment = (existingResponse as any)[`q${i}_comment`] || '';
          
          loadedResponses[`q${i}`] = {
            rating: rating || 3,
            comment
          };
        }
        
        setResponses(loadedResponses);
      }
    } catch (error) {
      console.error('Error checking existing response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const answeredCount = Object.values(responses).filter(r => r.rating !== null).length;

  const getNavItems = () => {
    const items = [
      { id: 0, title: '', status: 'done' as 'done' | 'partial' | 'empty' }
    ];

    let questionOffset = 1;
    SECTIONS.forEach((section, index) => {
      const sectionResponses = [];
      for (let i = 0; i < section.qs.length; i++) {
        const response = responses[`q${questionOffset + i}`];
        if (response && response.rating !== null) {
          sectionResponses.push(response);
        }
      }
      
      const status: 'done' | 'partial' | 'empty' = sectionResponses.length === section.qs.length ? 'done' :
                   sectionResponses.length > 0 ? 'partial' : 'empty';
      
      items.push({
        id: index + 1,
        title: section.title,
        status
      });
      
      questionOffset += section.qs.length;
    });

    items.push({ id: 8, title: '', status: 'empty' as 'done' | 'partial' | 'empty' });
    
    return items;
  };

  const handleResponseChange = (questionId: string, newResponse: Response) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: newResponse
    }));
  };

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Note: Download functionality is now handled by PDFGenerator in Modal component
  const handleDownload = () => {
    // This function is kept for compatibility but PDF generation is handled in Modal
    console.log('Download handled by PDFGenerator in Modal');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the survey data
      const surveyData: SurveyData = {
        respondent,
        general_comments: generalComments,
        responses: {}
      };

      let questionOffset = 1;
      SECTIONS.forEach((section, index) => {
        surveyData.responses[`section_${index + 1}`] = {
          title: section.title,
          items: []
        };

        for (let i = 0; i < section.qs.length; i++) {
          const response = responses[`q${questionOffset + i}`];
          surveyData.responses[`section_${index + 1}`].items.push({
            question_number: questionOffset + i,
            statement: section.qs[i],
            rating: response?.rating || 3,
            comment: response?.comment || ''
          });
        }

        questionOffset += section.qs.length;
      });

      // Save to Supabase
      const surveyId = await getActiveSurveyId();
      await SurveyDatabaseV3.saveSurveyResponse(
        surveyId,
        respondent,
        surveyData
      );

      setShowModal(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCoverSection = () => (
    <div className="section-view active">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your survey...</p>
          </div>
        </div>
      ) : (
        <>
          <Cover 
            respondent={respondent}
            onRespondentChange={setRespondent}
            onBegin={() => handleSectionChange(1)}
          />
          
          {isEditMode && (
            <div className="mx-6 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 text-sm">
                <strong>Welcome back!</strong> You are editing your existing survey response. 
                Make any changes you'd like and update your submission at the end.
              </p>
            </div>
          )}
          
          <Instructions />
          
          <ScaleBar />
          
          <NavigationFooter
            showPrevious={false}
            nextText={isEditMode ? "Continue Editing" : "Begin survey"}
            onNext={() => handleSectionChange(1)}
            infoText="Start by reviewing the instructions above"
          />
        </>
      )}
    </div>
  );

  const renderQuestionSection = (sectionIndex: number) => {
    const section = SECTIONS[sectionIndex - 1];
    let questionOffset = 1;
    
    for (let i = 0; i < sectionIndex - 1; i++) {
      questionOffset += SECTIONS[i].qs.length;
    }

    return (
      <div className={`section-view ${currentSection === sectionIndex ? 'active' : ''}`}>
        <div className="section-header">
          <h2>Section {sectionIndex}: {section.title}</h2>
          <p>{section.desc}</p>
        </div>
        
        <div className="section-body">
          {section.qs.map((question, index) => {
            const questionId = `q${questionOffset + index}`;
            return (
              <Question
                key={questionId}
                id={questionId}
                number={questionOffset + index}
                text={question}
                response={responses[questionId] || { rating: 3, comment: '' }}
                onResponseChange={(response) => handleResponseChange(questionId, response)}
              />
            );
          })}
        </div>
        
        <NavigationFooter
          onPrevious={() => handleSectionChange(sectionIndex - 1)}
          onNext={() => handleSectionChange(sectionIndex === SECTIONS.length ? 8 : sectionIndex + 1)}
          previousText="‹ Previous"
          nextText={sectionIndex === SECTIONS.length ? "Final comments ›" : "Next section ›"}
          infoText={`Section ${sectionIndex} of ${SECTIONS.length}`}
        />
      </div>
    );
  };

  const renderFinalSection = () => (
    <div className={`section-view ${currentSection === 8 ? 'active' : ''}`}>
      <div className="final-section">
        <h2>
          {isEditMode ? "Edit Your Response" : "General comments & feedback"}
        </h2>
        
        {isEditMode && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 text-sm">
              You are editing your existing survey response. Your changes will be saved when you submit.
            </p>
          </div>
        )}
        
        <p>
          {isEditMode 
            ? "Update your overall comments and suggestions below." 
            : "Any overall comments, suggestions for rewording, or topics you feel are missing from this survey."
          }
        </p>
        
        <textarea
          value={generalComments}
          onChange={(e) => setGeneralComments(e.target.value)}
          placeholder="Enter your comments here..."
          disabled={isLoading}
        />
        
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium">Error submitting survey:</p>
            <p className="text-red-600 text-sm mt-1">{submitError}</p>
          </div>
        )}
      </div>
      
      <NavigationFooter
        onPrevious={() => handleSectionChange(7)}
        onSubmit={handleSubmit}
        showSubmit={true}
        previousText="Previous"
        infoText="Final section"
        submitDisabled={isSubmitting || isLoading}
        submitText={
          isLoading 
            ? "Loading..." 
            : isSubmitting 
              ? "Saving..." 
              : isEditMode 
                ? "Update Response" 
                : "Submit Survey"
        }
      />
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderCoverSection();
      case 8:
        return renderFinalSection();
      default:
        return renderQuestionSection(currentSection);
    }
  };

  return (
    <div className="min-h-screen">
      <Header answered={answeredCount} total={totalQuestions} />
      
      <SectionNavigation
        items={getNavItems()}
        activeSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      <div className="survey-wrap">
        {renderCurrentSection()}
      </div>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        surveyData={{
          respondent,
          general_comments: generalComments,
          responses: (() => {
            const data: any = {};
            let questionOffset = 1;
            SECTIONS.forEach((section, index) => {
              data[`section_${index + 1}`] = {
                title: section.title,
                items: []
              };
              
              for (let i = 0; i < section.qs.length; i++) {
                const response = responses[`q${questionOffset + i}`];
                data[`section_${index + 1}`].items.push({
                  question_number: questionOffset + i,
                  statement: section.qs[i],
                  rating: response?.rating || 3,
                  comment: response?.comment || ''
                });
              }
              
              questionOffset += section.qs.length;
            });
            return data;
          })()
        }}
        onDownload={handleDownload}
      />
    </div>
  );
}
