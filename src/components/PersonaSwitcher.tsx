import React from 'react';
import { PERSONAS } from '../lib/lms/mockData';
import { Persona } from '../types/lms';
import { UserCheck, Shield, GraduationCap } from 'lucide-react';

interface Props {
  activePersona: Persona;
  onSelectPersona: (id: string) => void;
}

export const PersonaSwitcher: React.FC<Props> = ({ activePersona, onSelectPersona }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 backdrop-blur-md">
      <span className="text-xs font-medium text-slate-400 px-2 flex items-center gap-1.5">
        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
        Role:
      </span>
      {PERSONAS.map(p => {
        const isSelected = p.id === activePersona.id;
        const Icon = p.role === 'instructor' ? Shield : GraduationCap;
        return (
          <button
            key={p.id}
            onClick={() => onSelectPersona(p.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{p.name}</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">
              ({p.role === 'instructor' ? 'Faculty' : 'Student'})
            </span>
          </button>
        );
      })}
    </div>
  );
};

