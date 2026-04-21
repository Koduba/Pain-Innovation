'use client';

interface NavItem {
  id: number;
  title: string;
  status: 'done' | 'partial' | 'empty';
}

interface SectionNavigationProps {
  items: NavItem[];
  activeSection: number;
  onSectionChange: (section: number) => void;
}

export default function SectionNavigation({ items, activeSection, onSectionChange }: SectionNavigationProps) {
  return (
    <div className="section-nav">
      <div className="section-nav-inner">
        {items.map((item) => (
          <button
            key={item.id}
            className={`snav-btn ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className={`snav-dot ${item.status === 'done' ? 'done' : item.status === 'partial' ? 'partial' : ''}`} />
            {item.id === 0 ? 'Cover' : item.id === 8 ? 'Comments' : `${item.id}. ${item.title}`}
          </button>
        ))}
      </div>
    </div>
  );
}
