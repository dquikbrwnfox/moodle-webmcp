import React from 'react';
import { Course } from '../types/lms';
import { BookOpen, User, Bell, ArrowRight } from 'lucide-react';

interface Props {
  course: Course;
  onOpenCourse: (courseId: number) => void;
}

export const CourseCard: React.FC<Props> = ({ course, onOpenCourse }) => {
  return (
    <div
      onClick={() => onOpenCourse(course.id)}
      className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${course.color}`} />

      <div>
        <div className="flex items-center justify-between mb-3 pt-1">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
            {course.code}
          </span>
          <span className="text-xs text-slate-400 font-medium">{course.term}</span>
        </div>

        <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2">
          {course.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>{course.instructor}</span>
        </div>
      </div>

      <div>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
            <span>Course Progress</span>
            <span className="font-mono text-indigo-400">{course.progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400/90 font-medium">
            <Bell className="w-3.5 h-3.5" />
            <span>{course.announcements.length} updates</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
            <span>View Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

