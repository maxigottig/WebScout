
import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string, useLocation: boolean, radius: number) => void;
  isLoading: boolean;
  radius: number;
  setRadius: (r: number) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading, radius, setRadius }) => {
  const [query, setQuery] = useState('');
  const [useLocation, setUseLocation] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, useLocation, radius);
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

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 glass p-6 rounded-2xl border-white/5 shadow-inner">
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
          <span className="ml-3 text-slate-400 group-hover:text-slate-200 transition-colors text-sm font-medium">Ubicación actual</span>
        </label>

        <div className="flex flex-col w-full md:w-64 space-y-2">
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
            <span>Radio de búsqueda</span>
            <span className="text-blue-500 font-bold">{radius} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </form>
  );
};

export default SearchInput;
