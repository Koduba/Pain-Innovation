'use client';

import { Response } from '@/types/survey';
import Slider from './Slider';

interface QuestionProps {
  id: string;
  number: number;
  text: string;
  response: Response;
  onResponseChange: (response: Response) => void;
}

export default function Question({ id, number, text, response, onResponseChange }: QuestionProps) {
  const handleSliderChange = (value: number) => {
    onResponseChange({
      ...response,
      rating: value
    });
  };

  const handleCommentChange = (comment: string) => {
    onResponseChange({
      ...response,
      comment
    });
  };

  const handleNAChange = (na: boolean) => {
    onResponseChange({
      ...response,
      na,
      rating: na ? 3 : response.rating // Default to neutral when N/A
    });
  };

  const showWarning = response.rating !== null && response.rating <= 2 && !response.na;

  return (
    <div className="question">
      <div className="q-text">
        <span className="q-num">{number}.</span>
        {text}
      </div>
      
      <Slider
        id={id}
        value={response.rating || 3}
        onChange={handleSliderChange}
        disabled={response.na}
      />
      
      <div className="q-na-option">
        <label className="q-na-checkbox">
          <input
            type="checkbox"
            checked={response.na || false}
            onChange={(e) => handleNAChange(e.target.checked)}
          />
          <span>Not Applicable</span>
        </label>
      </div>
      
      <div className="q-comment">
        <div className={`q-comment-hint ${showWarning ? 'warn' : ''}`}>
          {showWarning ? 'A comment is required for ratings 1-2 - please explain below.' : ''}
        </div>
        <textarea
          value={response.comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          placeholder="Comments..."
        />
      </div>
    </div>
  );
}
