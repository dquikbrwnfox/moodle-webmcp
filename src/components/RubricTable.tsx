import React from 'react';
import { Rubric } from '../types/lms';
import { Award, CheckCircle2 } from 'lucide-react';

interface Props {
  rubric: Rubric;
}

export const RubricTable: React.FC<Props> = ({ rubric }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{rubric.title}</span>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Total: {rubric.totalPoints} Points
        </span>
      </div>

      <div className="space-y-4">
        {rubric.criteria.map((criterion, idx) => (
          <div key={criterion.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                {criterion.title}
              </h4>
              <span className="text-xs font-mono font-medium text-indigo-400">
                {criterion.weightPoints} pts
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{criterion.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {criterion.levels.map(level => (
                <div
                  key={level.id}
                  className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {level.label}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        {level.score} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

