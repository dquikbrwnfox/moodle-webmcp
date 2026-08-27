import React, { useState } from 'react';
import { Course } from '../types/lms';
import { BookOpen, Calendar, Award, ArrowLeft, Bell, MessageSquare, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  course: Course;
  onBack: () => void;
  onOpenAssignment: (assignmentId: number) => void;
}

export const CourseDetailView: React.FC<Props> = ({ course, onBack, onOpenAssignment }) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'announcements' | 'forums'>('modules');

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {course.code}
            </span>
            <span className="text-xs text-slate-400">{course.term}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">{course.name}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'modules' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Course Modules & Syllabus
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'announcements' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          Announcements ({course.announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('forums')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'forums' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Discussion Forums ({course.forums.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {course.sections.map(sec => (
            <div key={sec.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">{sec.title}</h3>
                <p className="text-xs text-slate-400">{sec.summary}</p>
              </div>

              <div className="space-y-2">
                {sec.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                        <span className="text-[10px] ml-2 font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    {item.assignmentId && (
                      <button
                        onClick={() => onOpenAssignment(item.assignmentId!)}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all"
                      >
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>Inspect & Rubric</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {course.announcements.map(ann => (
            <div key={ann.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  {ann.title}
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(ann.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {ann.content}
              </p>
              <div className="text-[11px] text-slate-400">
                Posted by: <span className="font-semibold text-slate-300">{ann.author}</span> ({ann.authorRole})
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'forums' && (
        <div className="space-y-4">
          {course.forums.map(forum => (
            <div key={forum.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  {forum.title}
                </h4>
                <span className="text-xs text-slate-400">{forum.replyCount} replies</span>
              </div>
              <div className="space-y-2">
                {forum.posts.map(post => (
                  <div key={post.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400 font-semibold mb-1">
                      <span>{post.author} ({post.authorRole})</span>
                      <span className="text-[10px] text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{post.message}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

