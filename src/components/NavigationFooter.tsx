'use client';

interface NavigationFooterProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  previousText?: string;
  nextText?: string;
  submitText?: string;
  infoText?: string;
  showPrevious?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  submitDisabled?: boolean;
}

export default function NavigationFooter({
  onPrevious,
  onNext,
  onSubmit,
  previousText = '‹ Previous',
  nextText = 'Next section ›',
  submitText = 'Review & submit ›',
  infoText,
  showPrevious = true,
  showNext = true,
  showSubmit = false,
  submitDisabled = false
}: NavigationFooterProps) {
  return (
    <div className="section-nav-footer">
      {showPrevious && onPrevious && (
        <button
          onClick={onPrevious}
          className="nav-btn nav-btn-prev"
        >
          {previousText}
        </button>
      )}
      
      {infoText && (
        <div className="nav-sec-info">
          {infoText}
        </div>
      )}
      
      {showSubmit && onSubmit && (
        <button
          onClick={onSubmit}
          disabled={submitDisabled}
          className="nav-btn nav-btn-submit"
        >
          {submitText}
        </button>
      )}
      
      {showNext && onNext && (
        <button
          onClick={onNext}
          className="nav-btn nav-btn-next"
        >
          {nextText}
        </button>
      )}
    </div>
  );
}
