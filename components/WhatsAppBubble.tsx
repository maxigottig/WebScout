
import React from 'react';

const WhatsAppBubble: React.FC = () => {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 active:scale-90 transition-all z-50 group"
    >
      <i className="fa-brands fa-whatsapp"></i>
      <span className="absolute right-20 bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Contáctanos por WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppBubble;
