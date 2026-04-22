'use client';

import { useState, useEffect } from 'react';
import { COLORS, LABELS } from '@/data/surveyData';

interface SliderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function Slider({ id, value, onChange, disabled = false }: SliderProps) {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleSlide = (newValue: number) => {
    setSliderValue(newValue);
    onChange(newValue);
  };

  const colorConfig = COLORS[sliderValue];
  const percentage = ((sliderValue - 1) / 4) * 100;

  return (
    <div className="slider-widget">
      <div className="slider-top">
        <span
          className="slider-label-pill"
          style={{
            background: colorConfig?.bg,
            color: colorConfig?.color,
            borderColor: `${colorConfig?.track}55`
          }}
        >
          {`${sliderValue} — ${LABELS[sliderValue]}`}
        </span>
      </div>
      
      <div className="slider-track-wrap">
        <input
          type="range"
          min="1"
          max="5"
          value={sliderValue}
          step="1"
          disabled={disabled}
          style={{
            background: `linear-gradient(to right, ${colorConfig?.track} 0%, ${colorConfig?.track} ${percentage}%, #dde0e4 ${percentage}%, #dde0e4 100%)`,
            opacity: disabled ? 0.5 : 1
          }}
          onChange={(e) => handleSlide(parseInt(e.target.value))}
        />
      </div>
      
      <div className="slider-ticks">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="tick-item">
            <div className="tick-line" />
            <div className="tick-num">{num}</div>
            <div className="tick-word">
              {['Strongly\ndisagree', 'Disagree', 'Neutral', 'Agree', 'Strongly\nagree'][num - 1].replace('\\n', '\n')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
