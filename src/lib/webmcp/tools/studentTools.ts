import { WebMCPToolDefinition } from '../types';
import { lmsClient } from '../../lms/lmsClient';
import { evaluateDraftAgainstRubricLogic } from '../../lms/rubricEvaluator';

export const studentTools: WebMCPToolDefinition[] = [
  {
    name: 'get_course_materials',
    description: 'Retrieve lecture outlines, formula sheets, required readings, and key concepts for a course or specific topic.',
    inputSchema: {
      type: 'object',
      properties: {
        course_id: {
          type: 'number',
          description: 'The course ID to fetch materials for (e.g. 101 for CS 101).'
        },
        topic: {
          type: 'string',
          description: 'Optional topic query (e.g. "heuristics", "crispr", "industrial revolution").'
        }
      },
      required: ['course_id']
    },
    execute: async ({ course_id, topic }: { course_id: number; topic?: string }) => {
      const course = lmsClient.getCourseById(Number(course_id));
      if (!course) {
        throw new Error(`Course ${course_id} not found.`);
      }

      const materials = [
        {
          course_code: course.code,
          module: 'Module 1: Search & Problem Solving',
          topic: 'Heuristic Search & A*',
          summary: 'A* evaluation function f(n) = g(n) + h(n). For optimality, h(n) must be admissible (never overestimate true cost) and consistent.',
          key_formulas: ['f(n) = g(n) + h(n)', 'h(n) <= c(n, a, n\') + h(n\')'],
          required_readings: ['Russell & Norvig, Chapter 3.5: Informed Search Strategies']
        },
        {
          course_code: course.code,
          module: 'Module 2: Agent Protocols & Alignment',
          topic: 'WebMCP Standard & Prompt Injection Mitigation',
          summary: 'WebMCP specification details how in-browser DOM scripts expose structured tools to client agents via document.modelContext.registerTool. Separates read autonomy from confirmed write gates.',
          key_formulas: ['document.modelContext.registerTool({ name, inputSchema, execute })'],
          required_readings: ['W3C WebML Draft: Web Model Context Protocol (2026)', 'Chrome AI Security Guidelines']
        }
      ];

      const filtered = topic
        ? materials.filter(m => m.topic.toLowerCase().includes(topic.toLowerCase()) || m.summary.toLowerCase().includes(topic.toLowerCase()))
        : materials;

      return {
        course_code: course.code,
        course_name: course.name,
        materials_count: filtered.length,
        materials: filtered.length > 0 ? filtered : materials
      };
    }
  },

  {
    name: 'get_enrolled_courses',
    description: 'Retrieve all academic courses the current student is actively enrolled in, including course codes, instructors, department, and completion progress.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    },
    execute: async () => {
      const courses = lmsClient.getCourses();
      return {
        count: courses.length,
        student: lmsClient.getActivePersona().name,
        courses: courses.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          instructor: c.instructor,
          department: c.department,
          progressPercent: c.progressPercent,
          announcementCount: c.announcements.length
        }))
      };
    }
  },
  {
    name: 'get_upcoming_deadlines',
    description: 'Get all pending assignment, lab, and quiz deadlines across enrolled courses sorted by chronological urgency.',
    inputSchema: {
      type: 'object',
      properties: {
        days_ahead: {
          type: 'number',
          description: 'Number of days into the future to look for deadlines (default: 14).'
        }
      },
      required: []
    },
    execute: async ({ days_ahead = 14 }: { days_ahead?: number }) => {
      const deadlines = lmsClient.getUpcomingDeadlines(days_ahead);
      return {
        query_window_days: days_ahead,
        count: deadlines.length,
        deadlines: deadlines.map(d => ({
          assignment_id: d.id,
          course_code: d.courseCode,
          course_name: d.courseName,
          title: d.title,
          due_date: d.dueDate,
          points_possible: d.pointsPossible,
          submission_status: d.submissionStatus,
          has_rubric: !!d.rubric
        }))
      };
    }
  },
  {
    name: 'get_assignment_details',
    description: 'Fetch complete assignment prompt, instructions, due date, submission status, and full grading rubric (criteria, point values, performance level descriptions).',
    inputSchema: {
      type: 'object',
      properties: {
        assignment_id: {
          type: 'number',
          description: 'The unique numeric ID of the assignment to inspect (e.g. 1002).'
        }
      },
      required: ['assignment_id']
    },
    execute: async ({ assignment_id }: { assignment_id: number }) => {
      const assignment = lmsClient.getAssignmentById(Number(assignment_id));
      if (!assignment) {
        throw new Error(`Assignment with ID ${assignment_id} not found.`);
      }
      return {
        id: assignment.id,
        course_code: assignment.courseCode,
        course_name: assignment.courseName,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.dueDate,
        points_possible: assignment.pointsPossible,
        submission_status: assignment.submissionStatus,
        current_draft_preview: assignment.draftText ? assignment.draftText.slice(0, 300) + '...' : null,
        rubric: assignment.rubric ? {
          id: assignment.rubric.id,
          title: assignment.rubric.title,
          total_points: assignment.rubric.totalPoints,
          criteria: assignment.rubric.criteria.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            weight_points: c.weightPoints,
            levels: c.levels.map(l => ({
              label: l.label,
              score: l.score,
              description: l.description
            }))
          }))
        } : null
      };
    }
  },
  {
    name: 'evaluate_draft_against_rubric',
    description: 'Critically analyze a student essay or report draft against an assignment official grading rubric. Returns itemized scores, matched framework strengths, and actionable revision steps.',
    inputSchema: {
      type: 'object',
      properties: {
        assignment_id: {
          type: 'number',
          description: 'The assignment ID whose rubric will be used for evaluation.'
        },
        draft_text: {
          type: 'string',
          description: 'The text of the student draft to evaluate.'
        }
      },
      required: ['assignment_id', 'draft_text']
    },
    execute: async ({ assignment_id, draft_text }: { assignment_id: number; draft_text: string }) => {
      const assignment = lmsClient.getAssignmentById(Number(assignment_id));
      if (!assignment) {
        throw new Error(`Assignment with ID ${assignment_id} not found.`);
      }
      if (!assignment.rubric) {
        throw new Error(`Assignment "${assignment.title}" does not have an attached grading rubric.`);
      }

      // Update in-memory draft text for active LMS reflection
      lmsClient.updateDraftText(assignment.id, draft_text);

      const evaluation = evaluateDraftAgainstRubricLogic(assignment.rubric, draft_text);
      return evaluation;
    }
  },
  {
    name: 'generate_study_schedule',
    description: 'Calculate a balanced, collision-free study milestone calendar leading up to upcoming assignment deadlines.',
    inputSchema: {
      type: 'object',
      properties: {
        daily_study_hours: {
          type: 'number',
          description: 'Target study hours per day (default: 3).'
        },
        days_ahead: {
          type: 'number',
          description: 'Timeframe in days to schedule for (default: 10).'
        }
      },
      required: []
    },
    execute: async ({ daily_study_hours = 3, days_ahead = 10 }: { daily_study_hours?: number; days_ahead?: number }) => {
      const deadlines = lmsClient.getUpcomingDeadlines(days_ahead);
      const schedule = [
        {
          date: '2026-08-27 (Today)',
          allocated_hours: daily_study_hours,
          focus_blocks: [
            { course: 'CS 101', task: 'Finalize Assignment 2 Ethics Essay revision & cite Utilitarian/Deontological frameworks', duration: '2.0 hrs' },
            { course: 'BIO 200', task: 'Review CRISPR target sgRNA Cas9 cleavage protocol', duration: '1.0 hr' }
          ]
        },
        {
          date: '2026-08-28 (Tomorrow)',
          allocated_hours: daily_study_hours,
          focus_blocks: [
            { course: 'CS 101', task: 'Run final grammar & rubric check on Assignment 2 draft', duration: '1.5 hrs' },
            { course: 'HIST 110', task: 'Search British Library primary archive for Industrial Revolution wages', duration: '1.5 hrs' }
          ]
        },
        {
          date: '2026-08-29 (Saturday - CS 101 Due)',
          allocated_hours: 2,
          focus_blocks: [
            { course: 'CS 101', task: 'Submit Assignment 2 before 11:59 PM PT deadline', duration: '0.5 hr' },
            { course: 'BIO 200', task: 'Execute Lab 2 CRISPR off-target sequencing data synthesis', duration: '1.5 hrs' }
          ]
        }
      ];

      return {
        daily_hours_budget: daily_study_hours,
        upcoming_assignments_covered: deadlines.map(d => d.title),
        study_milestones: schedule
      };
    }
  },
  {
    name: 'draft_forum_post',
    description: 'Prepare a discussion forum contribution and populate the in-page composer draft area for student review before posting.',
    inputSchema: {
      type: 'object',
      properties: {
        course_id: {
          type: 'number',
          description: 'Course ID where the forum is located.'
        },
        forum_id: {
          type: 'number',
          description: 'Forum Discussion ID (e.g. 301).'
        },
        subject: {
          type: 'string',
          description: 'Subject title for the response.'
        },
        message_content: {
          type: 'string',
          description: 'The body of the forum reply.'
        }
      },
      required: ['course_id', 'forum_id', 'subject', 'message_content']
    },
    execute: async ({ course_id, forum_id, subject, message_content }: { course_id: number; forum_id: number; subject: string; message_content: string }) => {
      const course = lmsClient.getCourseById(Number(course_id));
      const forum = course?.forums.find(f => f.id === Number(forum_id));
      if (!forum) {
        throw new Error(`Forum discussion ${forum_id} not found in course ${course_id}.`);
      }

      return {
        status: 'draft_staged',
        course_code: course?.code,
        forum_title: forum.title,
        staged_subject: subject,
        staged_content: message_content,
        preview_notice: 'Draft successfully mounted in LMS forum editor. Review and click "Submit Post" on the page to finalize.'
      };
    }
  }
];



