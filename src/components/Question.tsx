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

  const showWarning = response.rating !== null && response.rating <= 2;

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
      />
      
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
