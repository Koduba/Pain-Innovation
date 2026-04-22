'use client';

import { Respondent } from '@/types/survey';

interface CoverProps {
  respondent: Respondent;
  onRespondentChange: (respondent: Respondent) => void;
  onBegin: () => void;
}

export default function Cover({ respondent, onRespondentChange, onBegin }: CoverProps) {
  const handleChange = (field: keyof Respondent, value: string) => {
    onRespondentChange({
      ...respondent,
      [field]: value
    });
  };

  return (
    <div className="cover">
      <span className="cover-badge">Round 1</span>
      <h1>Delphi Consensus Survey</h1>
      <p className="subtitle">Acute Low Back Pain Clinical Practice Guidelines</p>
      <div className="cover-fields">
        <div className="cover-field">
          <label>Expert name</label>
          <input
            type="text"
            value={respondent.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="cover-field">
          <label>Institution</label>
          <input
            type="text"
            value={respondent.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            placeholder="Your institution"
          />
        </div>
        <div className="cover-field">
          <label>Specialty / role</label>
          <input
            type="text"
            value={respondent.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="e.g. Physical Therapist"
          />
        </div>
        <div className="cover-field">
          <label>Country</label>
          <input
            type="text"
            value={respondent.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Your country"
          />
        </div>
        <div className="cover-field">
          <label>Date completed</label>
          <input
            type="date"
            value={respondent.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
