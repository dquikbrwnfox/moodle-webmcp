<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Standard Moodle navigation hook to register in-browser WebMCP tools and ensure demo courses.
 *
 * @param global_navigation $navigation
 */
function local_webmcp_extend_navigation(global_navigation $navigation) {
    global $PAGE, $USER, $CFG;

    static $initialized = false;
    if ($initialized) {
        return;
    }
    $initialized = true;

    // 1. Ensure demo courses, sections, page resources, and assignments exist
    local_webmcp_ensure_demo_courses();

    // 2. Determine active user context
    $isLogged = isloggedin() && !isguestuser();
    $role = $isLogged ? (is_siteadmin() ? 'instructor' : 'student') : 'guest';
    $userId = $isLogged ? $USER->id : 0;
    $sesskey = $isLogged ? sesskey() : '';

    $config = [
        'userId' => $userId,
        'userRole' => $role,
        'sesskey' => $sesskey,
        'wwwroot' => $CFG->wwwroot
    ];

    // 3. AMD loader requirement for standard Moodle JS lifecycle
    $PAGE->requires->js_call_amd('local_webmcp/webmcp_init', 'init', [$config]);

    // 4. Synchronous in-page WebMCP registration for instant agent discovery
    $jsonConfig = json_encode($config);
    $inlineScript = "
    (function() {
        var cfg = " . $jsonConfig . ";
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

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

        // 1. get_enrolled_courses
        document.modelContext.registerTool({
            name: 'get_enrolled_courses',
            description: 'Get all active courses the logged-in student or instructor is enrolled in, with course codes, descriptions, and instructors.',
            inputSchema: { type: 'object', properties: {} },
            execute: async function() {
                return {
                    user_id: cfg.userId,
                    user_role: cfg.userRole,
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
                var liveTitle = document.querySelector('.activity-header h1, h2, .main-content h2')?.textContent?.trim();
                var liveIntro = document.querySelector('#intro, .box.generalbox, .submissionstatustable')?.textContent?.trim();

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

        // 7 & 8: Instructor/Admin Tools
        if (cfg.userRole === 'instructor' || cfg.userRole === 'admin') {
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

        console.log('[Moodle WebMCP] Active Tools Registered on document.modelContext (Role: ' + cfg.userRole + ')');
    })();
    ";

    $PAGE->requires->js_init_code($inlineScript);
}

function local_webmcp_before_http_headers() {
    global $PAGE;
    static $injected = false;
    if (!$injected && isset($PAGE) && isset($PAGE->requires)) {
        $injected = true;
        local_webmcp_extend_navigation(new stdClass());
    }
}

function local_webmcp_before_footer() {
    return '';
}

/**
 * Self-healing seeder: ensures Category, CS 101, AI 202, modules, syllabus, and student enrollments exist.
 */
function local_webmcp_ensure_demo_courses() {
    global $DB, $CFG;

    // Check if pages already seeded in CS101
    $cs101 = $DB->get_record('course', ['shortname' => 'CS101-WEBMCP']);
    $ai202 = $DB->get_record('course', ['shortname' => 'AI202-SEC']);

    require_once($CFG->dirroot . '/course/lib.php');
    require_once($CFG->dirroot . '/lib/enrollib.php');
    require_once($CFG->dirroot . '/mod/assign/lib.php');

    // 1. Create or get Category
    $cat = $DB->get_record('course_categories', ['name' => 'Computer Science & AI']);
    if (!$cat) {
        $cat = new stdClass();
        $cat->name = 'Computer Science & AI';
        $cat->parent = 0;
        $cat->sortorder = 1;
        $cat->visible = 1;
        $cat->id = $DB->insert_record('course_categories', $cat);
    }

    // 2. Create Courses if missing
    $createCourse = function($fullname, $shortname, $summary) use ($DB, $cat) {
        $c = new stdClass();
        $c->category = $cat->id;
        $c->fullname = $fullname;
        $c->shortname = $shortname;
        $c->summary = $summary;
        $c->summaryformat = FORMAT_HTML;
        $c->format = 'topics';
        $c->numsections = 4;
        $c->startdate = time() - (14 * 86400);
        $c->visible = 1;
        return create_course($c);
    };

    if (!$cs101) {
        $cs101 = $createCourse(
            'CS 101: Agentic Web Development & WebMCP Standards',
            'CS101-WEBMCP',
            '<p>Explore emerging in-browser agent standards, tool calling via <code>document.modelContext.registerTool</code>, prompt injection threat models, and human-agent co-browsing architectures.</p>'
        );
    }

    if (!$ai202) {
        $ai202 = $createCourse(
            'AI 202: Advanced Agent Architectures & Tool Security',
            'AI202-SEC',
            '<p>Defense-in-depth for client-side AI tools, indirect prompt injection mitigation, sandboxed browser DOMs, and session governance.</p>'
        );
    }

    // 3. Helper to update section names
    $setSection = function($courseId, $secNum, $name, $summary) use ($DB) {
        $sec = $DB->get_record('course_sections', ['course' => $courseId, 'section' => $secNum]);
        if ($sec) {
            $sec->name = $name;
            $sec->summary = $summary;
            $sec->summaryformat = FORMAT_HTML;
            $DB->update_record('course_sections', $sec);
        }
    };

    $setSection($cs101->id, 0, 'Course Overview & WebMCP Architecture', '<p>Welcome to CS 101! Explore in-browser agent protocols and co-browsing standards.</p>');
    $setSection($cs101->id, 1, 'Module 1: In-Browser Agent Standards & Tool Declarations', '<p>Foundational principles of client-side tool calling via <code>document.modelContext</code>.</p>');
    $setSection($cs101->id, 2, 'Module 2: Agent Autonomy, Rubrics & Tool Safety', '<p>Evaluating ethical boundaries, structured assignment rubrics, and automated draft evaluation.</p>');
    $setSection($cs101->id, 3, 'Module 3: Defense-in-Depth & Client-Side Verification', '<p>Mitigating indirect prompt injections and designing multi-tier human confirmation gates.</p>');

    $setSection($ai202->id, 0, 'Course Overview & Security Protocol', '<p>Welcome to AI 202! Review security policies and laboratory requirements.</p>');
    $setSection($ai202->id, 1, 'Module 1: STRIDE Threat Modeling for In-Browser Tools', '<p>Analyzing threat surfaces in client-side agent tool calling.</p>');
    $setSection($ai202->id, 2, 'Module 2: Sandboxing, CSP & Origin Isolation', '<p>Hands-on vulnerability assessments and security boundaries.</p>');
    $setSection($ai202->id, 3, 'Module 3: Durable Agent Execution & Multi-Agent Systems', '<p>State machines, durable execution, and autonomous workflows.</p>');

    // 4. Helper to add Page module
    $addPage = function($course, $sectionNum, $name, $content) use ($DB) {
        $existing = $DB->get_record('page', ['course' => $course->id, 'name' => $name]);
        if ($existing) return $existing->id;

        $page = new stdClass();
        $page->course = $course->id;
        $page->name = $name;
        $page->intro = '<p>' . htmlspecialchars($name) . '</p>';
        $page->introformat = FORMAT_HTML;
        $page->content = $content;
        $page->contentformat = FORMAT_HTML;
        $page->legacyfiles = 0;
        $page->display = 5;
        $page->revision = 1;
        $page->timemodified = time();
        $pageId = $DB->insert_record('page', $page);

        $mod = $DB->get_record('modules', ['name' => 'page']);
        if ($mod) {
            $cm = new stdClass();
            $cm->course = $course->id;
            $cm->module = $mod->id;
            $cm->instance = $pageId;
            $cm->section = $sectionNum;
            $cm->visible = 1;
            $cm->visibleold = 1;
            $cm->added = time();
            $cmId = $DB->insert_record('course_modules', $cm);

            $sec = $DB->get_record('course_sections', ['course' => $course->id, 'section' => $sectionNum]);
            if ($sec) {
                $sec->sequence = trim($sec->sequence . ',' . $cmId, ',');
                $DB->update_record('course_sections', $sec);
            }
        }
        return $pageId;
    };

    // Helper to add Assignment
    $addAssign = function($course, $sectionNum, $name, $intro, $dueDateDays) use ($DB) {
        $existing = $DB->get_record('assign', ['course' => $course->id, 'name' => $name]);
        if ($existing) return $existing->id;

        $assign = new stdClass();
        $assign->course = $course->id;
        $assign->name = $name;
        $assign->intro = $intro;
        $assign->introformat = FORMAT_HTML;
        $assign->alwaysshowdescription = 1;
        $assign->submissiondrafts = 1;
        $assign->duedate = time() + ($dueDateDays * 86400);
        $assign->allowsubmissionsfromdate = time() - (7 * 86400);
        $assign->grade = 100;
        $assign->timemodified = time();
        $assignId = $DB->insert_record('assign', $assign);

        $mod = $DB->get_record('modules', ['name' => 'assign']);
        if ($mod) {
            $cm = new stdClass();
            $cm->course = $course->id;
            $cm->module = $mod->id;
            $cm->instance = $assignId;
            $cm->section = $sectionNum;
            $cm->visible = 1;
            $cm->visibleold = 1;
            $cm->added = time();
            $cmId = $DB->insert_record('course_modules', $cm);

            $sec = $DB->get_record('course_sections', ['course' => $course->id, 'section' => $sectionNum]);
            if ($sec) {
                $sec->sequence = trim($sec->sequence . ',' . $cmId, ',');
                $DB->update_record('course_sections', $sec);
            }
        }
        return $assignId;
    };

    // Add CS 101 Page Resources
    $addPage($cs101, 0, 'Syllabus & Course Architecture Guide', '
<div class="alert alert-info">
    <h4>Welcome to CS 101: Agentic Web Development & WebMCP Standards</h4>
    <p><strong>Instructor:</strong> Dr. Evelyn Vance | <strong>Term:</strong> Fall 2026</p>
</div>
<h3>Course Description</h3>
<p>This course investigates the next paradigm of human-AI collaboration on the open web: <strong>In-Browser Agent Protocols (WebMCP)</strong>. Learn to declare semantic tools via <code>document.modelContext.registerTool</code>, evaluate student drafts with AI rubrics, and design human-in-the-loop confirmation gates.</p>
');

    $addPage($cs101, 1, 'Lecture 1: Evolution of In-Browser WebMCP Protocols', '
<h3>The WebMCP Shift</h3>
<p>Traditional MCP daemons require server-side installations and manual API tokens. WebMCP allows web applications to declare in-browser tools natively on <code>document.modelContext</code>, inheriting authenticated sessions without token friction.</p>
');

    $addPage($cs101, 2, 'Lecture 2: Ethical Frameworks for Agent Autonomy', '
<h3>Utilitarianism vs Deontology in AI Agents</h3>
<p>Contrast labor-saving automated tool execution (Utilitarian) with duties of user consent and academic integrity (Deontology).</p>
');

    $addAssign($cs101, 2, 'Assignment 1: Evaluating Autonomous Agent Boundaries', '
<div class="alert alert-warning"><strong>Deadline:</strong> September 2, 2026 | <strong>Points:</strong> 100</div>
<h3>Assignment Overview</h3>
<p>Write a 1,200 to 1,500-word critical analysis evaluating autonomous tool execution by LLMs in web browsers using WebMCP.</p>
<h4>Grading Criteria</h4>
<ul>
    <li><strong>Ethical Frameworks (35 pts):</strong> Utilitarianism vs Deontology.</li>
    <li><strong>Technical Depth (35 pts):</strong> document.modelContext architecture and DOM execution.</li>
    <li><strong>Governance (20 pts):</strong> Human-in-the-loop confirmation gates.</li>
    <li><strong>Clarity & Citations (10 pts):</strong> Academic structure.</li>
</ul>
', 5);

    $addPage($cs101, 3, 'Lecture 3: Defense-in-Depth & Prompt Injection Mitigation', '
<h3>Mitigating Indirect Prompt Injections</h3>
<p>Explore schema-level validation, DOM sanitization, and native browser confirmation dialogs to prevent unauthorized tool execution.</p>
');

    // Add AI 202 Page Resources
    $addPage($ai202, 0, 'Course Syllabus & Security Lab Protocol', '
<div class="alert alert-info"><h4>AI 202: Advanced Agent Architectures & Tool Security</h4><p>Prerequisite: CS 101 or equivalent.</p></div>
<p>Hands-on vulnerability assessments and security boundaries for client-side AI agent integrations.</p>
');

    $addPage($ai202, 1, 'Module 1: STRIDE Threat Modeling for In-Browser Tools', '
<h3>STRIDE Framework for WebMCP</h3>
<p>Analyze Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege across DOM-based AI tools.</p>
');

    $addAssign($ai202, 2, 'Lab 2: Threat Modeling WebMCP Tools', '
<div class="alert alert-warning"><strong>Deadline:</strong> September 5, 2026 | <strong>Points:</strong> 100</div>
<p>Conduct an end-to-end STRIDE threat model on a multi-tool WebMCP implementation. Submit a technical audit report (1,000–1,200 words).</p>
', 8);

    $addPage($ai202, 3, 'Module 3: Durable Agent Execution & Multi-Agent Systems', '
<h3>Durable State Machines</h3>
<p>Fault-tolerant agent handoffs, durable workflows, and multi-agent coordination patterns.</p>
');

    // Auto-enroll non-admin users
    $studentRole = $DB->get_record('role', ['shortname' => 'student']);
    $studentRoleId = $studentRole ? $studentRole->id : 5;
    $manualPlugin = enrol_get_plugin('manual');
    $users = $DB->get_records_select('user', 'deleted = 0 AND id > 2');

    foreach ([$cs101, $ai202] as $c) {
        $manualInstance = $DB->get_record('enrol', ['courseid' => $c->id, 'enrol' => 'manual']);
        if ($manualInstance && $manualPlugin) {
            foreach ($users as $u) {
                $manualPlugin->enrol_user($manualInstance, $u->id, $studentRoleId);
            }
        }
        rebuild_course_cache($c->id, true);
    }
}
