'use client';

export default function Instructions() {
  return (
    <div className="instructions">
      <h2>Instructions</h2>
      <div className="inst-grid">
        <div className="inst-item">
          <strong>Purpose</strong>
          Expert consensus on ALBP management statements
        </div>
        <div className="inst-item">
          <strong>Confidentiality</strong>
          Individual responses are confidential; only aggregates are shared
        </div>
        <div className="inst-item">
          <strong>Rating scale</strong>
          5-point Likert scale: 1 (Strongly disagree) to 5 (Strongly agree)
        </div>
        <div className="inst-item">
          <strong>Consensus threshold</strong>
          75% of respondents rating a statement 4 or 5
        </div>
        <div className="inst-item">
          <strong>Comments</strong>
          Required for any rating of 1-2
        </div>
        <div className="inst-item">
          <strong>Completion time</strong>
          58 statements · 7 sections · 15-20 min
        </div>
      </div>
    </div>
  );
}
