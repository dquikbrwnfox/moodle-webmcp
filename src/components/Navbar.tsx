import React, { useState } from 'react';
import { Persona } from '../types/lms';
import { PersonaSwitcher } from './PersonaSwitcher';
import { WebMCPSimulatorDrawer } from './WebMCPSimulatorDrawer';
import { Bot, Sparkles, GraduationCap, Play, ExternalLink } from 'lucide-react';

interface Props {
  activePersona: Persona;
  onSelectPersona: (id: string) => void;
  activeTab: 'courses' | 'deadlines' | 'forums' | 'evaluator';
  onSelectTab: (tab: 'courses' | 'deadlines' | 'forums' | 'evaluator') => void;
}

export const Navbar: React.FC<Props> = ({ activePersona, onSelectPersona, activeTab, onSelectTab }) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Moodle WebMCP</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  WebMCP Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Apex University Demo Environment</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            <button
              onClick={() => onSelectTab('courses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'courses' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => onSelectTab('deadlines')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'deadlines' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upcoming Deadlines
            </button>
            <button
              onClick={() => onSelectTab('forums')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'forums' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Discussions
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <PersonaSwitcher activePersona={activePersona} onSelectPersona={onSelectPersona} />

            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700 transition-all shadow-sm"
              title="Test WebMCP tools in browser"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span className="hidden sm:inline">Tool Runner</span>
            </button>
          </div>
        </div>
      </div>

      <WebMCPSimulatorDrawer isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />
    </header>
  );
};



