'use client';

interface HeaderProps {
  answered: number;
  total: number;
}

export default function Header({ answered, total }: HeaderProps) {
  const percentage = Math.round((answered / total) * 100);

  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        <div className="top-bar-title">Delphi Survey · Round 1</div>
        <div className="top-bar-progress">
          <div className="top-bar-progress-track">
            <div 
              className="top-bar-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="top-bar-pct">{answered} of {total} answered</div>
        </div>
      </div>
    </div>
  );
}
