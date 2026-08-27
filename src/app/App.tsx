import React from 'react';
import { useLmsStore } from '../lib/store/useLmsStore';
import { Navbar } from '../components/Navbar';
import { CourseCard } from '../components/CourseCard';
import { CourseDetailView } from '../components/CourseDetailView';
import { AssignmentModal } from '../components/AssignmentModal';
import { ActivityHUD } from '../components/ActivityHUD';
import { Sparkles, Calendar, BookOpen, Clock, Award, Shield, CheckCircle2, Bot, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const {
    persona,
    courses,
    assignments,
    selectedCourseId,
    selectedAssignmentId,
    activeTab,
    setActiveTab,
    switchPersona,
    selectCourse,
    selectAssignment,
    refreshData
  } = useLmsStore();

  const activeCourse = courses.find(c => c.id === selectedCourseId);
  const activeAssignment = assignments.find(a => a.id === selectedAssignmentId);

  const upcomingAssignments = assignments
    .filter(a => new Date(a.dueDate) >= new Date('2026-08-26T00:00:00Z'))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Navbar
        activePersona={persona}
        onSelectPersona={switchPersona}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner: WebMCP Co-browsing Explainer */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>WebMCP Active: `document.modelContext` Registered</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {persona.role === 'instructor' ? (
                <>Welcome, {persona.name} — Instructor Copilot Ready</>
              ) : (
                <>Welcome, {persona.name} — Academic Workspace</>
              )}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {persona.role === 'instructor' ? (
                <>Your browser agent has administrative tools registered on this page: summarize submissions, generate rubric-aligned student feedback, and broadcast announcements.</>
              ) : (
                <>This webpage exposes structured WebMCP tools directly to ChatGPT or Chrome agents. Ask your agent in chat to <strong className="text-indigo-300 font-semibold">check your upcoming deadlines</strong> or <strong className="text-cyan-300 font-semibold">evaluate your assignment drafts against the grading rubric</strong>.</>
              )}
            </p>
          </div>
        </div>

        {/* Course Detail View if selected */}
        {selectedCourseId && activeCourse ? (
          <CourseDetailView
            course={activeCourse}
            onBack={() => selectCourse(null)}
            onOpenAssignment={id => selectAssignment(id)}
          />
        ) : (
          <>
            {/* Dashboard Tabs Content */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-slate-100">Enrolled Courses (Fall 2026)</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">3 active courses</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onOpenCourse={id => selectCourse(id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'deadlines' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-slate-100">Upcoming Academic Deadlines</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{upcomingAssignments.length} deadlines pending</span>
                </div>

                <div className="space-y-3">
                  {upcomingAssignments.map(a => (
                    <div
                      key={a.id}
                      onClick={() => selectAssignment(a.id)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-mono font-bold text-indigo-300">{a.courseCode}</span>
                            <span className="text-xs text-slate-400 font-semibold">{a.courseName}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-200 transition-colors">
                            {a.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(a.dueDate).toLocaleDateString()}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 capitalize">{a.submissionStatus}</span>
                        </div>

                        <button className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white transition-colors">
                          Inspect & Rubric
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'forums' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-slate-100">Course Discussion Forums</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.flatMap(c => c.forums).map(forum => (
                    <div key={forum.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-base font-bold text-slate-100">{forum.title}</h3>
                      <div className="space-y-2">
                        {forum.posts.map(post => (
                          <div key={post.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
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
              </div>
            )}
          </>
        )}
      </main>

      {/* Assignment & Rubric Modal */}
      {selectedAssignmentId && activeAssignment && (
        <AssignmentModal
          assignment={activeAssignment}
          onClose={() => selectAssignment(null)}
          onUpdateDraft={(id, text) => {
            activeAssignment.draftText = text;
            refreshData();
          }}
        />
      )}

      {/* Persistent Co-Browsing Activity HUD */}
      <ActivityHUD />
    </div>
  );
};

