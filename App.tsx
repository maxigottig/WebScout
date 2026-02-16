
import React, { useState, useEffect } from 'react';
import SearchInput from './components/SearchInput';
import ResultDisplay from './components/ResultDisplay';
import CategorySection from './components/CategorySection';
import SavedSearches from './components/SavedSearches';
import WhatsAppBubble from './components/WhatsAppBubble';
import { searchBusinessesWithoutWebsites, generateIllustrativeImage } from './services/geminiService';
import { AppState, Location } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ loading: false, error: null, results: null });
  const [lastQuery, setLastQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('scout_saved_searches');
    if (saved) setSavedQueries(JSON.parse(saved));
    
    // Theme initialization
    document.documentElement.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleBack = () => {
    setState({ loading: false, error: null, results: null });
    setHeroImage(null);
    setLastQuery('');
  };

  const handleSearch = async (query: string, useLocation: boolean) => {
    setState({ ...state, loading: true, error: null });
    setLastQuery(query);
    setHeroImage(null);

    // Persist search
    const updated = Array.from(new Set([query, ...savedQueries])).slice(0, 5);
    setSavedQueries(updated);
    localStorage.setItem('scout_saved_searches', JSON.stringify(updated));

    let location: Location | undefined;
    if (useLocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000 });
        });
        location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) { 
        console.warn("Geo fail", e); 
      }
    }

    try {
      const [data, img] = await Promise.all([
        searchBusinessesWithoutWebsites(query, location),
        generateIllustrativeImage(query)
      ]);
      setHeroImage(img);
      setState({ loading: false, results: data, error: null });
    } catch (err: any) {
      setState({ loading: false, results: null, error: err.message });
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-12 pb-24 transition-colors duration-500">
      {/* Theme Toggle & Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-xl transition-transform active:scale-90 shadow-xl"
        >
          {isDarkMode ? <i className="fa-solid fa-sun text-amber-400"></i> : <i className="fa-solid fa-moon text-indigo-600"></i>}
        </button>
      </div>

      <header className="pt-20 pb-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-black uppercase tracking-widest text-blue-500 mb-8 animate-bounce">
          <i className="fa-solid fa-radar"></i> WebScout
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          Web<span className="text-blue-600">Scout</span><span className="text-indigo-500">.</span>
        </h1>
        <p className="text-xl opacity-60 max-w-2xl mx-auto font-medium">
          Mapeamos comercios locales sin sitio web y proyectamos el valor de su transformación digital con WebScout.
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        <div className="sticky top-6 z-40">
          <SearchInput onSearch={handleSearch} isLoading={state.loading} />
        </div>

        {!state.results && !state.loading && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <CategorySection onCategorySelect={(q) => handleSearch(q, true)} />
            <SavedSearches queries={savedQueries} onSelect={(q) => handleSearch(q, true)} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
               {[
                 { icon: 'fa-globe', title: 'Oportunidades Web', desc: 'Negocios sin presencia digital detectados.' },
                 { icon: 'fa-rocket', title: 'Crecimiento Digital', desc: 'Análisis de ventajas competitivas para la red.' },
                 { icon: 'fa-location-dot', title: 'Conexión Maps', desc: 'Enlace directo a perfiles de Google Maps.' }
               ].map((item, i) => (
                 <div key={i} className="glass p-8 rounded-[2rem] hover:scale-105 transition-transform cursor-default border-white/5">
                    <i className={`fa-solid ${item.icon} text-3xl text-blue-500 mb-4`}></i>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-sm opacity-50">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {state.loading && (
          <div className="py-32 text-center animate-pulse">
            <div className="inline-block w-24 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4"></div>
            <p className="font-black text-2xl uppercase tracking-tighter">Analizando datos del mercado...</p>
          </div>
        )}

        {state.results && !state.loading && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="mb-6 flex justify-start">
              <button 
                onClick={handleBack}
                className="glass px-8 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl"
              >
                <i className="fa-solid fa-chevron-left"></i> Nueva Búsqueda
              </button>
            </div>
            
            {heroImage && (
              <div className="mb-12 rounded-[3.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] glass border-0 relative h-64 md:h-[450px]">
                <img src={heroImage} className="w-full h-full object-cover opacity-60 transition-transform duration-10000 hover:scale-110" alt="Generated context" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end p-12">
                   <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl uppercase tracking-tighter">{lastQuery}</h2>
                </div>
              </div>
            )}
            <ResultDisplay result={state.results} query={lastQuery} />
          </div>
        )}
      </main>

      <WhatsAppBubble />
    </div>
  );
};

export default App;
