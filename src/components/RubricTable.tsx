import React from 'react';
import { Rubric } from '../types/lms';
import { Award, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  rubric: Rubric;
  highlightedLevels?: Record<string, string>; // criterionId -> level label (e.g. "Exemplary")
}

export const RubricTable: React.FC<Props> = ({ rubric, highlightedLevels = {} }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{rubric.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {Object.keys(highlightedLevels).length > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
              Agent Co-Browsing Active
            </span>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            Total: {rubric.totalPoints} Points
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {rubric.criteria.map((criterion, idx) => {
          const matchedLevelLabel = highlightedLevels[criterion.id];

          return (
            <div
              key={criterion.id}
              className={`bg-slate-900/60 border rounded-2xl p-4 transition-all duration-300 ${
                matchedLevelLabel
                  ? 'border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  {criterion.title}
                  {matchedLevelLabel && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold animate-pulse">
                      Evaluated: {matchedLevelLabel}
                    </span>
                  )}
                </h4>
                <span className="text-xs font-mono font-medium text-indigo-400">
                  {criterion.weightPoints} pts
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{criterion.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {criterion.levels.map(level => {
                  const isHighlighted = matchedLevelLabel === level.label;

                  return (
                    <div
                      key={level.id}
                      className={`rounded-xl p-3 flex flex-col justify-between transition-all duration-300 border ${
                        isHighlighted
                          ? 'bg-gradient-to-br from-indigo-950/80 to-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/50'
                          : 'bg-slate-950/60 border-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-bold flex items-center gap-1 ${
                            isHighlighted ? 'text-emerald-300 font-extrabold' : 'text-slate-200'
                          }`}>
                            <CheckCircle2 className={`w-3.5 h-3.5 ${
                              isHighlighted ? 'text-emerald-400' : 'text-slate-500'
                            }`} />
                            {level.label}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            {level.score} pts
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${
                          isHighlighted ? 'text-slate-200 font-medium' : 'text-slate-400'
                        }`}>
                          {level.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

