
import React, { useState, useRef, useEffect } from 'react';
import { startAssistantChat } from '../services/geminiService';

const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const toggleChat = () => {
    if (!isOpen && !chatRef.current) {
      chatRef.current = startAssistantChat();
      setMessages([{ role: 'ai', text: '¡Hola! Soy Scout AI. ¿Cómo puedo ayudarte hoy con tu búsqueda de negocios?' }]);
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userText });
      setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Perdona, he tenido un pequeño error. ¿Puedes repetir?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-28 z-50">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] glass rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-white/20 animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-robot"></i>
              </div>
              <span className="font-bold">Scout Assistant</span>
            </div>
            <button onClick={toggleChat} className="text-white/60 hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-white/5 animate-pulse text-xs uppercase font-black text-slate-500">Escribiendo...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntame algo..."
              className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center"><i className="fa-solid fa-paper-plane"></i></button>
          </form>
        </div>
      )}
      <button
        onClick={toggleChat}
        className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 active:scale-90 transition-all"
      >
        <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-comment-dots'}`}></i>
      </button>
    </div>
  );
};

export default AiChat;
