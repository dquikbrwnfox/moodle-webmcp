export type UserRole = 'student' | 'instructor' | 'admin';

export interface Persona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  title: string;
  institution: string;
}

export interface RubricCriterionLevel {
  id: string;
  score: number;
  label: string; // e.g. "Exemplary", "Proficient", "Developing", "Unacceptable"
  description: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
  weightPoints: number;
  levels: RubricCriterionLevel[];
}

export interface Rubric {
  id: string;
  title: string;
  totalPoints: number;
  criteria: RubricCriterion[];
}

export interface Assignment {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string; // ISO String
  pointsPossible: number;
  submissionStatus: 'unsubmitted' | 'draft' | 'submitted' | 'graded';
  currentGrade?: number;
  submittedAt?: string;
  draftText?: string;
  rubric?: Rubric;
  attachments?: { name: string; size: string; url: string }[];
}

export interface CourseModuleItem {
  id: number;
  title: string;
  type: 'assignment' | 'reading' | 'quiz' | 'resource' | 'forum';
  url?: string;
  assignmentId?: number;
  isCompleted?: boolean;
}

export interface CourseSection {
  id: number;
  title: string;
  summary: string;
  items: CourseModuleItem[];
}

export interface CourseAnnouncement {
  id: number;
  courseId: number;
  courseCode: string;
  title: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  content: string;
  isPinned?: boolean;
}

export interface ForumPost {
  id: number;
  discussionId: number;
  author: string;
  authorRole: UserRole;
  createdAt: string;
  subject: string;
  message: string;
}

export interface ForumDiscussion {
  id: number;
  courseId: number;
  title: string;
  starter: string;
  replyCount: number;
  lastActivity: string;
  posts: ForumPost[];
}

export interface Course {
  id: number;
  code: string;
  name: string;
  term: string;
  instructor: string;
  instructorEmail: string;
  department: string;
  progressPercent: number;
  color: string;
  sections: CourseSection[];
  announcements: CourseAnnouncement[];
  forums: ForumDiscussion[];
}

export interface StudentSubmission {
  id: number;
  assignmentId: number;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  status: 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  rubricScores?: Record<string, { points: number; feedback: string }>;
}

