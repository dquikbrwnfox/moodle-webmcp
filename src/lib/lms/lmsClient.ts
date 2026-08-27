import { INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS, PERSONAS } from './mockData';
import { Course, Assignment, StudentSubmission, Persona, CourseAnnouncement } from '../../types/lms';

export class LmsClient {
  private courses: Course[] = [...INITIAL_COURSES];
  private assignments: Assignment[] = [...INITIAL_ASSIGNMENTS];
  private submissions: StudentSubmission[] = [...INITIAL_SUBMISSIONS];
  private activePersona: Persona = PERSONAS[0];

  public getActivePersona(): Persona {
    return this.activePersona;
  }

  public setPersona(personaId: string): Persona {
    const found = PERSONAS.find(p => p.id === personaId);
    if (found) {
      this.activePersona = found;
    }
    return this.activePersona;
  }

  public getCourses(): Course[] {
    return this.courses;
  }

  public getCourseById(courseId: number): Course | undefined {
    return this.courses.find(c => c.id === courseId);
  }

  public getAssignments(): Assignment[] {
    return this.assignments;
  }

  public getAssignmentById(assignmentId: number): Assignment | undefined {
    return this.assignments.find(a => a.id === assignmentId);
  }

  public getUpcomingDeadlines(daysAhead: number = 14): Assignment[] {
    const now = new Date('2026-08-27T00:00:00Z').getTime();
    const threshold = now + daysAhead * 24 * 60 * 60 * 1000;

    return this.assignments
      .filter(a => {
        const due = new Date(a.dueDate).getTime();
        return due >= now && due <= threshold;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  public getSubmissionsForCourse(courseId: number): StudentSubmission[] {
    const courseAssignmentIds = this.assignments.filter(a => a.courseId === courseId).map(a => a.id);
    return this.submissions.filter(s => courseAssignmentIds.includes(s.assignmentId));
  }

  public getSubmissionsForAssignment(assignmentId: number): StudentSubmission[] {
    return this.submissions.filter(s => s.assignmentId === assignmentId);
  }

  public addAnnouncement(courseId: number, title: string, content: string): CourseAnnouncement {
    const course = this.getCourseById(courseId);
    const newAnnouncement: CourseAnnouncement = {
      id: Date.now(),
      courseId,
      courseCode: course ? course.code : `Course ${courseId}`,
      title,
      author: this.activePersona.name,
      authorRole: this.activePersona.title,
      publishedAt: new Date().toISOString(),
      content,
      isPinned: false
    };

    if (course) {
      course.announcements.unshift(newAnnouncement);
    }
    return newAnnouncement;
  }

  public updateDraftText(assignmentId: number, draftText: string): void {
    const assignment = this.getAssignmentById(assignmentId);
    if (assignment) {
      assignment.draftText = draftText;
      assignment.submissionStatus = 'draft';
    }
  }
}

export const lmsClient = new LmsClient();

