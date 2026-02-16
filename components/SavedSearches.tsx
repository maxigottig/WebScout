
import React from 'react';

interface Props { queries: string[]; onSelect: (q: string) => void; }

const SavedSearches: React.FC<Props> = ({ queries, onSelect }) => {
  if (queries.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-2 opacity-50">
        <i className="fa-solid fa-clock-rotate-left text-xs"></i>
        <span className="text-xs font-black uppercase tracking-tighter">Búsquedas Recientes</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {queries.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches;
