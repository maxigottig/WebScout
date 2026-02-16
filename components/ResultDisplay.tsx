
import React from 'react';
import { SearchResult } from '../types';

interface ResultDisplayProps {
  result: SearchResult;
  query: string;
  radius: number;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, query, radius }) => {
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400 font-bold">$1</strong>');
      
      if (line.trim().startsWith('##')) {
        const title = line.replace('##', '').trim();
        const isOpportunity = title.toLowerCase().includes('oportunidades') || title.toLowerCase().includes('sin');
        return (
          <h3 key={i} className={`text-2xl font-extrabold mt-10 mb-6 flex items-center gap-3 ${isOpportunity ? 'text-amber-400' : 'text-emerald-400'}`}>
            <i className={`fa-solid ${isOpportunity ? 'fa-rocket' : 'fa-check-double'}`}></i>
            {title}
          </h3>
        );
      }

      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <li key={i} className="ml-5 mb-4 text-slate-300 list-none flex items-start group">
            <i className="fa-solid fa-arrow-right text-blue-500/40 mt-1.5 mr-3 text-xs group-hover:text-blue-400 transition-colors"></i>
            <span className="text-lg md:text-xl font-medium" dangerouslySetInnerHTML={{ __html: processedLine.substring(1).trim() }} />
          </li>
        );
      }
      
      if (!line.trim()) return <div key={i} className="h-4" />;

      return (
        <p key={i} className="mb-6 text-slate-400 leading-relaxed text-base md:text-lg" dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
    });
  };

  const mapSources = result.sources.filter(s => s.maps);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
      
      {/* Reporte Principal Centrado */}
      <div className="glass rounded-[3rem] p-8 md:p-14 shadow-2xl overflow-hidden relative border-white/5">
        <div className="absolute -top-12 -right-12 p-4 opacity-[0.02] rotate-12">
          <i className="fa-solid fa-lightbulb text-[20rem]"></i>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12 relative z-10 border-b border-white/10 pb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-blue-900/40 transform -rotate-3">
            <i className="fa-solid fa-wand-magic-sparkles text-3xl"></i>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Estrategia Digital</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-slate-500 font-bold text-lg">Resultados para "{query}"</p>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-tighter">Radio: {radius}km</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {formatText(result.text)}
        </div>
      </div>

      {/* Enlaces a Google Maps */}
      <div className="space-y-6">
        <h4 className="text-center text-sm font-black uppercase tracking-[0.3em] text-slate-500">Perfiles en Google Maps</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mapSources.map((source, idx) => (
            <a
              key={idx}
              href={source.maps?.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-8 rounded-3xl flex items-center gap-6 group hover:bg-blue-600/[0.05] hover:border-blue-500/50 transition-all active:scale-[0.98] border-white/5 shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                <i className="fa-solid fa-map-pin text-xl"></i>
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-black text-slate-100 text-lg truncate group-hover:text-blue-400 transition-colors">{source.maps?.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-blue-500 font-black uppercase tracking-widest">Abrir Ubicación</span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>
                </div>
              </div>
              <i className="fa-solid fa-arrow-up-right-from-square text-slate-700 group-hover:text-blue-500 text-sm transition-colors"></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
