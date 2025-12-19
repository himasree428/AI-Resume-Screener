
import React from 'react';

interface MatchBadgeProps {
  type: 'Strong Fit' | 'Moderate Fit' | 'Weak Fit';
}

const MatchBadge: React.FC<MatchBadgeProps> = ({ type }) => {
  const styles = {
    'Strong Fit': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Moderate Fit': 'bg-amber-100 text-amber-700 border-amber-200',
    'Weak Fit': 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${styles[type]}`}>
      {type}
    </span>
  );
};

export default MatchBadge;
