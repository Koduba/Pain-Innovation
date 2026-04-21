'use client';

export default function ScaleBar() {
  const items = [
    { num: '1', text: 'Strongly disagree' },
    { num: '2', text: 'Disagree' },
    { num: '3', text: 'Neutral' },
    { num: '4', text: 'Agree' },
    { num: '5', text: 'Strongly agree' }
  ];

  const bgColors = ['c1-bg', 'c2-bg', 'c3-bg', 'c4-bg', 'c5-bg'];
  const textColors = ['c1', 'c2', 'c3', 'c4', 'c5'];

  return (
    <div className="scale-bar">
      {items.map((item, index) => (
        <div key={item.num} className="sb-item">
          <span className="n">{item.num}</span>
          {item.text}
        </div>
      ))}
    </div>
  );
}
