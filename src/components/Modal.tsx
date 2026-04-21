'use client';

import { SurveyData } from '@/types/survey';
import { PDFGenerator } from '@/lib/pdf-generator';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyData: SurveyData;
  onDownload: () => void;
}

export default function Modal({ isOpen, onClose, surveyData, onDownload }: ModalProps) {
  if (!isOpen) return null;

  const answered = Object.values(surveyData.responses).reduce((acc, section) => 
    acc + section.items.filter(item => item.rating !== 'N/A').length, 0);
  
  const total = Object.values(surveyData.responses).reduce((acc, section) => 
    acc + section.items.length, 0);
  
  const skipped = total - answered;
  
  const ratings = Object.values(surveyData.responses)
    .flatMap(section => section.items)
    .filter(item => item.rating !== 'N/A')
    .map(item => Number(item.rating));
  
  const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';

  return (
    <div className="modal-bg show">
      <div className="modal">
        <h2>Survey summary</h2>
        <p>Review your responses before downloading. All submissions are confidential.</p>
        
        <div className="modal-stats">
          <div className="modal-stat">
            <div className="val">{answered}</div>
            <div className="lbl">Answered</div>
          </div>
          <div className="modal-stat">
            <div className="val">{skipped}</div>
            <div className="lbl">Unanswered</div>
          </div>
          <div className="modal-stat">
            <div className="val">{avg}</div>
            <div className="lbl">Avg rating</div>
          </div>
        </div>
        
        <div className="modal-sections">
          {Object.entries(surveyData.responses).map(([key, section]) => {
            const sectionRatings = section.items
              .filter(item => item.rating !== 'N/A')
              .map(item => Number(item.rating));
            
            const sectionAvg = sectionRatings.length 
              ? (sectionRatings.reduce((a, b) => a + b, 0) / sectionRatings.length).toFixed(1)
              : '—';
            
            const percentage = Math.round((sectionRatings.length / section.items.length) * 100);
            const dot = sectionRatings.length === section.items.length ? '🟢' : 
                       sectionRatings.length > 0 ? '🔵' : '⚪';
            
            return (
              <div key={key} className="modal-sec-row">
                <span>{dot} {section.title}</span>
                <span>Avg {sectionAvg} · {percentage}%</span>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={() => PDFGenerator.generateSurveyPDF(surveyData)}
          className="modal-dl-btn"
        >
          Download responses (PDF)
        </button>
        
        <button
          onClick={onClose}
          className="modal-close"
        >
          Edit survey
        </button>
      </div>
    </div>
  );
}
