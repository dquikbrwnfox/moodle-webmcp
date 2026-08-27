import { WebMCPToolDefinition } from '../types';
import { lmsClient } from '../../lms/lmsClient';

export const instructorTools: WebMCPToolDefinition[] = [
  {
    name: 'get_course_submissions_summary',
    description: 'Get an overview of submission, grading, and backlog metrics across an active course offering.',
    inputSchema: {
      type: 'object',
      properties: {
        course_id: {
          type: 'number',
          description: 'The course ID to inspect (e.g. 101).'
        }
      },
      required: ['course_id']
    },
    execute: async ({ course_id }: { course_id: number }) => {
      const course = lmsClient.getCourseById(Number(course_id));
      if (!course) {
        throw new Error(`Course with ID ${course_id} not found.`);
      }
      const submissions = lmsClient.getSubmissionsForCourse(Number(course_id));
      const submitted = submissions.filter(s => s.status === 'submitted');
      const graded = submissions.filter(s => s.status === 'graded');

      return {
        course_code: course.code,
        course_name: course.name,
        total_enrolled: 42,
        submissions_received: submissions.length,
        pending_grading: submitted.length,
        completed_graded: graded.length,
        recent_submissions: submissions.map(s => ({
          submission_id: s.id,
          student: s.studentName,
          submitted_at: s.submittedAt,
          status: s.status,
          grade: s.grade || null
        }))
      };
    }
  },
  {
    name: 'generate_rubric_feedback_draft',
    description: 'Generate structured, criteria-aligned feedback for a student submission based on course grading rubrics.',
    inputSchema: {
      type: 'object',
      properties: {
        submission_id: {
          type: 'number',
          description: 'The student submission ID to evaluate (e.g. 501).'
        }
      },
      required: ['submission_id']
    },
    execute: async ({ submission_id }: { submission_id: number }) => {
      return {
        submission_id: Number(submission_id),
        student_name: 'Alex Rivera',
        assignment_title: 'CS 101: Assignment 2 (Ethics of Autonomous Agent Systems)',
        suggested_grade: 96,
        criteria_feedback: [
          {
            criterion: 'Ethical Framework Application (35 pts)',
            score: 34,
            comment: 'Exceptional contrast between Utilitarian labor reduction and Deontological informed consent duties.'
          },
          {
            criterion: 'Technical Depth & Web Protocol (35 pts)',
            score: 33,
            comment: 'Clear understanding of WebMCP client boundaries and prompt injection vectors.'
          },
          {
            criterion: 'Governance & Human-in-the-loop (20 pts)',
            score: 19,
            comment: 'Practical recommendation on separating optimistic read queries from confirmed write actions.'
          },
          {
            criterion: 'Clarity & Citations (10 pts)',
            score: 10,
            comment: 'Clean Markdown hierarchy, excellent academic tone.'
          }
        ],
        draft_instructor_note: 'Alex, this is an exemplary piece of analytical writing. Your distinction between read vs write autonomy in browser agents provides a viable path forward for real-world governance. Grade: 96/100 (A).'
      };
    }
  },
  {
    name: 'draft_course_announcement',
    description: 'Broadcast a course announcement banner to all enrolled students.',
    inputSchema: {
      type: 'object',
      properties: {
        course_id: {
          type: 'number',
          description: 'The target course ID.'
        },
        title: {
          type: 'string',
          description: 'Announcement headline.'
        },
        content: {
          type: 'string',
          description: 'Announcement body text.'
        }
      },
      required: ['course_id', 'title', 'content']
    },
    execute: async ({ course_id, title, content }: { course_id: number; title: string; content: string }) => {
      const announcement = lmsClient.addAnnouncement(Number(course_id), title, content);
      return {
        status: 'published',
        announcement_id: announcement.id,
        course_code: announcement.courseCode,
        title: announcement.title,
        published_at: announcement.publishedAt,
        author: announcement.author
      };
    }
  }
];

