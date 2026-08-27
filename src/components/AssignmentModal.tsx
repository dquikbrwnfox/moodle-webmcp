import React, { useState } from 'react';
import { Assignment } from '../types/lms';
import { RubricTable } from './RubricTable';
import { evaluateDraftAgainstRubricLogic, RubricEvaluationReport } from '../lib/lms/rubricEvaluator';
import { eventBus } from '../lib/webmcp/eventBus';
import { X, Calendar, Award, Sparkles, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';

interface Props {
  assignment: Assignment;
  onClose: () => void;
  onUpdateDraft: (id: number, text: string) => void;
}

export const AssignmentModal: React.FC<Props> = ({ assignment, onClose, onUpdateDraft }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'rubric' | 'draft' | 'evaluation'>('prompt');
  const [draft, setDraft] = useState(assignment.draftText || '');
  const [evaluation, setEvaluation] = useState<RubricEvaluationReport | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleRunEvaluation = () => {
    if (!assignment.rubric || !draft.trim()) return;
    setIsEvaluating(true);

    const eventId = Math.random().toString(36).slice(2, 9);
    eventBus.emit({
      id: eventId,
      timestamp: new Date().toLocaleTimeString(),
      toolName: 'evaluate_draft_against_rubric',
      role: 'student',
      status: 'running',
      args: { assignment_id: assignment.id, draft_text: draft.slice(0, 100) + '...' }
    });

    setTimeout(() => {
      const result = evaluateDraftAgainstRubricLogic(assignment.rubric!, draft);
      setEvaluation(result);
      onUpdateDraft(assignment.id, draft);
      setActiveTab('evaluation');
      setIsEvaluating(false);

      eventBus.emit({
        id: eventId,
        timestamp: new Date().toLocaleTimeString(),
        toolName: 'evaluate_draft_against_rubric',
        role: 'student',
        status: 'success',
        args: { assignment_id: assignment.id },
        resultSummary: `Score: ${result.percentageScore}% (${result.totalEstimatedScore}/${result.totalPossiblePoints} pts)`,
        fullResult: result,
        executionTimeMs: 42
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {assignment.courseCode}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()} at {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{assignment.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-5 gap-1">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'prompt'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Prompt & Overview
          </button>
          {assignment.rubric && (
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'rubric'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Grading Rubric ({assignment.rubric.totalPoints} pts)
            </button>
          )}
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'draft'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Student Draft Editor
          </button>
          {evaluation && (
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'evaluation'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Agent Rubric Evaluation
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Instructions</h4>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {assignment.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Total Points</span>
                  <p className="text-sm font-bold text-slate-100">{assignment.pointsPossible} pts</p>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Status</span>
                  <p className="text-sm font-bold capitalize text-indigo-400">{assignment.submissionStatus}</p>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Rubric Attached</span>
                  <p className="text-sm font-bold text-emerald-400">{assignment.rubric ? 'Yes' : 'None'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rubric' && assignment.rubric && (
            <RubricTable rubric={assignment.rubric} />
          )}

          {activeTab === 'draft' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Write or paste your draft below. You can prompt ChatGPT or click "Evaluate Draft via WebMCP" to simulate live agent critique.
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {draft.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Type your essay or lab report draft here..."
                rows={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onUpdateDraft(assignment.id, draft)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Save Draft
                </button>

                {assignment.rubric && (
                  <button
                    onClick={handleRunEvaluation}
                    disabled={isEvaluating || !draft.trim()}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isEvaluating ? 'Evaluating via WebMCP...' : 'Evaluate Draft via WebMCP'}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && evaluation && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-slate-100">WebMCP Rubric Evaluation Summary</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                      {evaluation.totalEstimatedScore} / {evaluation.totalPossiblePoints} pts
                    </span>
                    <span className="text-xs text-indigo-300 ml-2 font-mono font-bold">
                      ({evaluation.percentageScore}%)
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  {evaluation.overallSummary}
                </p>
              </div>

              {/* Criteria breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Criteria Breakdown</h4>
                {evaluation.criteriaEvaluations.map(crit => (
                  <div key={crit.criterionId} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-slate-200">{crit.criterionTitle}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {crit.performanceLevel}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {crit.estimatedScore} / {crit.maxPoints} pts
                        </span>
                      </div>
                    </div>

                    {crit.strengths.length > 0 && (
                      <div className="flex items-start gap-2 text-xs text-emerald-300/90 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{crit.strengths.join(' ')}</span>
                      </div>
                    )}

                    {crit.growthAreas.length > 0 && (
                      <div className="flex items-start gap-2 text-xs text-amber-300/90 pt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{crit.growthAreas.join(' ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actionable recommendations */}
              {evaluation.actionableRecommendations.length > 0 && (
                <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Actionable Recommendations for Submission
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {evaluation.actionableRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

