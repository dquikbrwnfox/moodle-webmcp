import React, { useState } from 'react';
import { webmcpRegistry } from '../lib/webmcp/registry';
import { WebMCPToolDefinition } from '../lib/webmcp/types';
import { Play, Sparkles, Terminal, X, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WebMCPSimulatorDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedTool, setSelectedTool] = useState<WebMCPToolDefinition | null>(null);
  const [argsJson, setArgsJson] = useState('{}');
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const tools = webmcpRegistry.getRegisteredTools();

  const handleSelectTool = (tool: WebMCPToolDefinition) => {
    setSelectedTool(tool);
    setResult(null);
    if (tool.name === 'evaluate_draft_against_rubric') {
      setArgsJson(JSON.stringify({ assignment_id: 1002, draft_text: "Our analysis contrasts Utilitarian optimization with Deontological consent boundaries in autonomous WebMCP agents." }, null, 2));
    } else if (tool.name === 'get_assignment_details') {
      setArgsJson(JSON.stringify({ assignment_id: 1002 }, null, 2));
    } else if (tool.name === 'get_upcoming_deadlines') {
      setArgsJson(JSON.stringify({ days_ahead: 14 }, null, 2));
    } else if (tool.name === 'get_course_submissions_summary') {
      setArgsJson(JSON.stringify({ course_id: 101 }, null, 2));
    } else if (tool.name === 'generate_rubric_feedback_draft') {
      setArgsJson(JSON.stringify({ submission_id: 501 }, null, 2));
    } else {
      setArgsJson('{}');
    }
  };

  const handleExecute = async () => {
    if (!selectedTool) return;
    setIsRunning(true);
    try {
      const parsedArgs = JSON.parse(argsJson);
      const res = await selectedTool.execute(parsedArgs);
      setResult(res);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-slate-100">WebMCP Tool Interactive Runner</h3>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Test any of the active WebMCP tools exposed on <code className="text-indigo-300 font-mono">document.modelContext</code> with 1 click.
          </p>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Tools ({tools.length})</span>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {tools.map(t => (
                <button
                  key={t.name}
                  onClick={() => handleSelectTool(t)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                    selectedTool?.name === t.name
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono font-semibold">{t.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {selectedTool && (
            <div className="space-y-3 pt-2">
              <div>
                <span className="text-xs font-semibold text-slate-300">Arguments JSON:</span>
                <textarea
                  value={argsJson}
                  onChange={e => setArgsJson(e.target.value)}
                  rows={4}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleExecute}
                disabled={isRunning}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isRunning ? 'Executing...' : `Run ${selectedTool.name}`}
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300">Output Response:</span>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-300 max-h-48 overflow-y-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

