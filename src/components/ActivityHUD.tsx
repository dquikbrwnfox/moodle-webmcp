import React, { useState, useEffect } from 'react';
import { eventBus } from '../lib/webmcp/eventBus';
import { ActivityEvent } from '../lib/webmcp/types';
import { Bot, ChevronUp, ChevronDown, CheckCircle2, Clock, AlertTriangle, Terminal, Sparkles, X } from 'lucide-react';

export const ActivityHUD: React.FC = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [latestEvent, setLatestEvent] = useState<ActivityEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe(event => {
      setEvents(prev => [event, ...prev.slice(0, 24)]);
      setLatestEvent(event);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end max-w-md w-full pointer-events-none">
      {/* Floating Mini Badge */}
      <div className="pointer-events-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-slate-100 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 ${
            latestEvent?.status === 'running' ? 'agent-active-glow border-indigo-400' : ''
          }`}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
                WebMCP Co-Browsing HUD
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                {events.length} events
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {latestEvent ? `${latestEvent.toolName}: ${latestEvent.resultSummary || latestEvent.status}` : 'Listening for agent tools...'}
            </p>
          </div>

          <div className="p-1 rounded-lg text-slate-400 group-hover:text-white transition-colors">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* Expanded Activity Drawer */}
      {isExpanded && (
        <div className="pointer-events-auto mt-3 w-full bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Real-Time WebMCP Activity Stream</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {events.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 space-y-1">
                <Sparkles className="w-5 h-5 mx-auto text-slate-600" />
                <p>No agent tools executed yet.</p>
                <p className="text-[10px] text-slate-600">Prompt ChatGPT or click "Evaluate Draft" to see live telemetry.</p>
              </div>
            ) : (
              events.map(e => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEvent(e)}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-300">{e.toolName}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>{e.timestamp}</span>
                      {e.status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {e.status === 'running' && <Clock className="w-3 h-3 text-amber-400 animate-spin" />}
                      {e.status === 'error' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">{e.resultSummary || e.status}</span>
                    {e.executionTimeMs !== undefined && (
                      <span className="font-mono text-[10px] text-slate-500">{e.executionTimeMs}ms</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-slate-100 font-mono">{selectedEvent.toolName}</span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Input Arguments:</span>
              <pre className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                {JSON.stringify(selectedEvent.args, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Tool Result:</span>
              <pre className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-60 border border-slate-800">
                {JSON.stringify(selectedEvent.fullResult || { status: selectedEvent.status }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

