
import React from 'react';
import { UrgencyLevel } from '../types';

interface Props {
  level: UrgencyLevel;
}

const UrgencyBadge: React.FC<Props> = ({ level }) => {
  const styles = {
    [UrgencyLevel.CRITICAL]: 'bg-red-600 text-white animate-pulse',
    [UrgencyLevel.URGENT]: 'bg-orange-500 text-white',
    [UrgencyLevel.MONITOR]: 'bg-yellow-400 text-gray-900',
    [UrgencyLevel.STABLE]: 'bg-emerald-500 text-white',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${styles[level]}`}>
      {level}
    </span>
  );
};

export default UrgencyBadge;
