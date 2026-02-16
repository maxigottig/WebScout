
import React from 'react';

const CATEGORIES = [
  { label: 'Panaderías', icon: 'fa-bread-slice' },
  { label: 'Ferreterías', icon: 'fa-hammer' },
  { label: 'Zapaterías', icon: 'fa-shoe-prints' },
  { label: 'Talleres', icon: 'fa-car-wrench' },
  { label: 'Floristerías', icon: 'fa-seedling' },
  { label: 'Peluquerías', icon: 'fa-scissors' }
];

interface Props { onCategorySelect: (query: string) => void; }

const CategorySection: React.FC<Props> = ({ onCategorySelect }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest opacity-50 text-center">Categorías Populares</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onCategorySelect(cat.label)}
            className="glass px-6 py-4 rounded-2xl flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 font-bold group"
          >
            <i className={`fa-solid ${cat.icon} group-hover:scale-125 transition-transform`}></i>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
