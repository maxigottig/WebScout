
import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string, useLocation: boolean) => void;
  isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [useLocation, setUseLocation] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, useLocation);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: panaderías, ferreterías, talleres..."
            className="w-full px-6 py-5 pl-14 bg-slate-900/80 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-xl transition-all"
            disabled={isLoading}
          />
          <i className="fa-solid fa-magnifying-glass absolute left-5 text-slate-500 text-lg"></i>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <>
                <span className="hidden sm:inline">Explorar</span>
                <i className="fa-solid fa-bolt"></i>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 text-sm">
        <label className="flex items-center cursor-pointer group select-none">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="peer appearance-none w-5 h-5 border border-slate-700 rounded-md bg-slate-900 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
            />
            <i className="fa-solid fa-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
          </div>
          <span className="ml-3 text-slate-400 group-hover:text-slate-200 transition-colors">Usar mi ubicación actual</span>
        </label>
      </div>
    </form>
  );
};

export default SearchInput;
