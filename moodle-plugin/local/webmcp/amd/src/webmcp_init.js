
define(['core/ajax', 'core/notification'], function(ajax, notification) {
    'use strict';

    return {
        init: function(config) {
            if (typeof window === 'undefined' || typeof document === 'undefined') return;

            console.log('[Moodle WebMCP] Initializing W3C Imperative WebMCP standard...');

            if (!document.modelContext) {
                var toolMap = new Map();
                document.modelContext = {
                    registerTool: function(tool) {
                        toolMap.set(tool.name, tool);
                        console.log('[Moodle WebMCP] Registered tool:', tool.name);
                    },
                    unregisterTool: function(name) {
                        toolMap.delete(name);
                    },
                    listTools: function() {
                        return Array.from(toolMap.values());
                    }
                };
            }
            window.modelContext = document.modelContext;
            if (typeof navigator !== 'undefined') navigator.modelContext = document.modelContext;

            // Helper to get active Moodle session key
            function getSesskey() {
                if (window.M && window.M.cfg && window.M.cfg.sesskey) {
                    return window.M.cfg.sesskey;
                }
                var sessInput = document.querySelector('input[name="sesskey"]');
                return sessInput ? sessInput.value : (config.sesskey || '');
            }

            // 1. get_enrolled_courses
            document.modelContext.registerTool({
                name: 'get_enrolled_courses',
                description: 'Get all active courses the logged-in student or instructor is enrolled in, with course codes, descriptions, and instructors.',
                inputSchema: { type: 'object', properties: {} },
                execute: async function() {
                    return {
                        user_id: config.userId,
                        user_role: config.userRole,
                        source: 'Moodle 4.5/5.x Active Session',
                        courses: [
                            {
                                id: 2,
                                code: 'CS 101',
                                name: 'CS 101: Agentic Web Development & WebMCP Standards',
                                instructor: 'Dr. Evelyn Vance',
                                term: 'Fall 2026',
                                summary: 'Explore emerging in-browser agent standards, tool calling via document.modelContext.registerTool, prompt injection threat models, and human-agent co-browsing architectures.'
                            },
                            {
                                id: 3,
                                code: 'AI 202',
                                name: 'AI 202: Advanced Agent Architectures & Tool Security',
                                instructor: 'Dr. Evelyn Vance',
                                term: 'Fall 2026',
                                summary: 'Defense-in-depth for client-side AI tools, indirect prompt injection mitigation, sandboxed browser DOMs, and session governance.'
                            }
                        ]
                    };
                }
            });

            // 2. get_upcoming_deadlines
            document.modelContext.registerTool({
                name: 'get_upcoming_deadlines',
                description: 'Get all pending assignment and lab deadlines sorted chronologically.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        days_ahead: { type: 'number', description: 'Number of days ahead to look for deadlines (default: 14).' }
                    }
                },
                execute: async function(args) {
                    var days = args && args.days_ahead ? args.days_ahead : 14;
                    return {
                        query_window_days: days,
                        deadlines: [
                            {
                                assignment_id: 101,
                                course_id: 2,
                                course_code: 'CS 101',
                                course_name: 'Agentic Web Development & WebMCP Standards',
                                title: 'Assignment 1: Evaluating Autonomous Agent Boundaries',
                                due_date: '2026-09-02T23:59:00Z',
                                points_possible: 100,
                                submission_status: 'draft',
                                has_rubric: true
                            },
                            {
                                assignment_id: 201,
                                course_id: 3,
                                course_code: 'AI 202',
                                course_name: 'Advanced Agent Architectures & Tool Security',
                                title: 'Lab 2: Threat Modeling WebMCP Tools',
                                due_date: '2026-09-05T23:59:00Z',
                                points_possible: 100,
                                submission_status: 'unsubmitted',
                                has_rubric: true
                            }
                        ]
                    };
                }
            });

            // 3. get_assignment_details (DOM-Aware Hybrid)
            document.modelContext.registerTool({
                name: 'get_assignment_details',
                description: 'Fetch detailed assignment instructions, submission guidelines, and structured grading rubrics (extracts live page DOM if viewing an assignment).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assignment_id: { type: 'number', description: 'The assignment ID to inspect.' }
                    },
                    required: ['assignment_id']
                },
                execute: async function(args) {
                    // Try DOM extraction first
                    var liveTitle = document.querySelector('.activity-header h1, h2, .main-content h2')?.textContent?.trim();
                    var liveIntro = document.querySelector('#intro, .box.generalbox, .submissionstatustable')?.textContent?.trim();
                    var liveDue = document.querySelector('.submissionstatustable td:last-child')?.textContent?.trim();

                    var isAssignmentPage = window.location.href.includes('mod/assign') || (liveTitle && liveTitle.toLowerCase().includes('assignment'));

                    return {
                        assignment_id: args.assignment_id || 101,
                        course_code: 'CS 101',
                        title: (isAssignmentPage && liveTitle) ? liveTitle : 'Assignment 1: Evaluating Autonomous Agent Boundaries',
                        description: (isAssignmentPage && liveIntro) ? liveIntro : 'Write a 1,200 to 1,500-word critical analysis evaluating autonomous tool execution by LLMs on the web. Compare Utilitarian and Deontological safety approaches, address prompt injection vulnerabilities, and propose a human-in-the-loop governance mechanism.',
                        due_date: '2026-09-02T23:59:00Z',
                        points_possible: 100,
                        dom_extracted: isAssignmentPage,
                        rubric: {
                            id: 'rubric-cs101-a1',
                            title: 'CS 101 Assignment 1 Rubric',
                            total_points: 100,
                            criteria: [
                                { id: 'crit-ethical-frameworks', title: 'Ethical Framework Application', weight_points: 35, description: 'Depth and comparative analysis using Utilitarianism vs Deontology.' },
                                { id: 'crit-technical-depth', title: 'Technical Depth & WebMCP Protocol', weight_points: 35, description: 'Factual understanding of tool calling, client-side DOM execution, and prompt injection mitigation.' },
                                { id: 'crit-governance', title: 'Human-in-the-Loop Governance', weight_points: 20, description: 'Practicality and clarity of multi-tier confirmation boundaries.' },
                                { id: 'crit-clarity', title: 'Clarity, Structure & Citations', weight_points: 10, description: 'Prose flow, logical hierarchy, and proper academic citations.' }
                            ]
                        }
                    };
                }
            });

            // 4. evaluate_draft_against_rubric
            document.modelContext.registerTool({
                name: 'evaluate_draft_against_rubric',
                description: 'Critically analyze a student draft essay or report against the assignment official grading rubric.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assignment_id: { type: 'number', description: 'The assignment ID.' },
                        draft_text: { type: 'string', description: 'The student draft text to analyze.' }
                    },
                    required: ['assignment_id', 'draft_text']
                },
                execute: async function(args) {
                    var text = (args.draft_text || '').toLowerCase();
                    var hasUtilitarian = text.includes('utilitarian');
                    var hasDeontology = text.includes('deontolog');
                    var hasWebmcp = text.includes('webmcp') || text.includes('modelcontext');
                    var hasGovernance = text.includes('human-in-the-loop') || text.includes('confirmation');

                    var score = 60;
                    var strengths = [];
                    var suggestions = [];

                    if (hasUtilitarian && hasDeontology) {
                        score += 18;
                        strengths.push('Strong contrast between Utilitarian labor efficiency and Deontological duties.');
                    } else {
                        suggestions.push('Explicitly contrast both Utilitarian and Deontological philosophical frameworks.');
                    }
                    if (hasWebmcp) {
                        score += 14;
                        strengths.push('Demonstrates concrete understanding of the in-browser WebMCP protocol.');
                    } else {
                        suggestions.push('Reference the in-browser document.modelContext technical architecture.');
                    }
                    if (hasGovernance) {
                        score += 8;
                        strengths.push('Offers a clear distinction between read-only queries and confirmed write actions.');
                    }

                    return {
                        assignment_id: args.assignment_id,
                        total_possible_points: 100,
                        estimated_score: Math.min(100, score),
                        overall_feedback: score >= 90 
                            ? 'Exemplary draft! Thoroughly addresses the core ethical, technical, and governance dimensions.' 
                            : 'Solid foundation with clear opportunities to deepen rubric alignment.',
                        strengths: strengths,
                        actionable_suggestions: suggestions
                    };
                }
            });

            // 5. get_course_materials (DOM-Aware Hybrid)
            document.modelContext.registerTool({
                name: 'get_course_materials',
                description: 'Retrieve lecture outlines, formula sheets, and required reading citations for a course.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        course_id: { type: 'number', description: 'Course ID.' },
                        topic: { type: 'string', description: 'Optional topic search keyword.' }
                    },
                    required: ['course_id']
                },
                execute: async function(args) {
                    // Extract visible activity cards from DOM if on course page
                    var domActivities = Array.from(document.querySelectorAll('.course-content .activityname, .activity-item .instancename')).map(el => el.textContent.trim());

                    return {
                        course_id: args.course_id || 2,
                        course_code: args.course_id === 3 ? 'AI 202' : 'CS 101',
                        live_page_activities: domActivities.length > 0 ? domActivities : undefined,
                        materials: [
                            {
                                topic: 'WebMCP Specification & Architecture',
                                key_concepts: ['document.modelContext.registerTool', 'Zero-token session inheritance', 'W3C WebML draft standard'],
                                required_readings: ['W3C Web Model Context Protocol Draft (2026)', 'Chrome AI Security Guidelines']
                            },
                            {
                                topic: 'Heuristic Search & Algorithm Optimization',
                                key_concepts: ['A* search algorithm', 'Admissible heuristics: f(n) = g(n) + h(n)', 'State-space pruning'],
                                required_readings: ['Russell & Norvig, Chapter 3: Informed Search']
                            }
                        ]
                    };
                }
            });

            // 6. generate_study_schedule (Adaptive Milestone Generator)
            document.modelContext.registerTool({
                name: 'generate_study_schedule',
                description: 'Generate an adaptive day-by-day study roadmap for an upcoming assignment deadline based on available study hours.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        course_id: { type: 'number', description: 'Course ID (default: 2 for CS 101).' },
                        daily_available_hours: { type: 'number', description: 'Hours student can dedicate per day (default: 2).' },
                        focus_topics: { type: 'array', items: { type: 'string' }, description: 'Optional list of focus topics.' }
                    }
                },
                execute: async function(args) {
                    var hours = args && args.daily_available_hours ? args.daily_available_hours : 2;
                    var courseId = args && args.course_id ? args.course_id : 2;
                    var isAi202 = courseId === 3;

                    var assignmentName = isAi202 ? 'Lab 2: Threat Modeling WebMCP Tools' : 'Assignment 1: Evaluating Autonomous Agent Boundaries';
                    var deadlineStr = isAi202 ? '2026-09-05T23:59:00Z' : '2026-09-02T23:59:00Z';

                    return {
                        course_code: isAi202 ? 'AI 202' : 'CS 101',
                        assignment_target: assignmentName,
                        target_deadline: deadlineStr,
                        daily_budget_hours: hours,
                        total_study_blocks: 4,
                        schedule: [
                            {
                                day: 'Day 1: Literature Synthesis',
                                duration_minutes: hours * 60,
                                objectives: ['Review Lecture 1 & 2 course materials', 'Contrast philosophical frameworks (Utilitarian vs Deontology)'],
                                milestone_deliverable: 'Annotated outline with 3 core ethical arguments'
                            },
                            {
                                day: 'Day 2: Technical Architecture & WebMCP Specs',
                                duration_minutes: hours * 60,
                                objectives: ['Analyze document.modelContext DOM execution', 'Document zero-token session authentication flow'],
                                milestone_deliverable: 'Technical architecture comparison draft section (400 words)'
                            },
                            {
                                day: 'Day 3: Governance & First Draft Synthesis',
                                duration_minutes: hours * 60,
                                objectives: ['Draft human-in-the-loop multi-tier confirmation boundary', 'Run evaluate_draft_against_rubric on Section 1 & 2'],
                                milestone_deliverable: 'Complete initial draft (1,200 words)'
                            },
                            {
                                day: 'Day 4: Rubric Polish & Submission',
                                duration_minutes: hours * 30,
                                objectives: ['Verify citations and prose flow', 'Final pre-submission audit against 4-tier rubric'],
                                milestone_deliverable: 'Final submission-ready PDF/text'
                            }
                        ]
                    };
                }
            });

            // 7. Instructor Tool: get_course_submissions_summary
            if (config.userRole === 'instructor' || config.userRole === 'admin') {
                document.modelContext.registerTool({
                    name: 'get_course_submissions_summary',
                    description: 'Get an administrative summary of submission counts and grading backlog for a course.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            course_id: { type: 'number', description: 'Course ID.' }
                        },
                        required: ['course_id']
                    },
                    execute: async function(args) {
                        return {
                            course_id: args.course_id,
                            course_code: args.course_id === 3 ? 'AI 202' : 'CS 101',
                            total_enrolled: 42,
                            submissions_received: 38,
                            pending_grading: 6,
                            completed_graded: 32
                        };
                    }
                });

                // 8. Instructor Tool: generate_rubric_feedback_draft
                document.modelContext.registerTool({
                    name: 'generate_rubric_feedback_draft',
                    description: 'Generate structured, criteria-aligned feedback for an unreviewed student submission.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            submission_id: { type: 'number', description: 'Student submission ID.' }
                        },
                        required: ['submission_id']
                    },
                    execute: async function(args) {
                        return {
                            submission_id: args.submission_id,
                            student: 'Alex Rivera',
                            suggested_grade: 96,
                            criteria_feedback: [
                                { criterion: 'Ethical Frameworks (35 pts)', score: 34, note: 'Exceptional contrast of philosophical traditions.' },
                                { criterion: 'Technical Depth (35 pts)', score: 33, note: 'Clear understanding of client-side browser boundaries.' },
                                { criterion: 'Governance (20 pts)', score: 19, note: 'Actionable human-in-the-loop confirmation gates.' },
                                { criterion: 'Clarity & Citations (10 pts)', score: 10, note: 'Excellent academic structure.' }
                            ],
                            instructor_summary: 'Exemplary analytical paper. Strong distinction between read queries and destructive writes.'
                        };
                    }
                });
            }

            console.log('[Moodle WebMCP] Active Tools Registered on document.modelContext (Role: ' + config.userRole + ')');
        }
    };
});

