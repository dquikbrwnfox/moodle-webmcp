# Product Requirements Document (PRD): Moodle WebMCP

## Product Summary
**Moodle WebMCP** is an agent-native academic companion for Moodle and OpenLMS. By leveraging the emerging WebMCP standard (`document.modelContext.registerTool`), it turns passive learning management pages into intelligent, interactive workspaces where students, teachers, and browser-based AI agents collaborate directly within the active web session.

## Target Users

1. **Students**: Want an immediate academic copilot in ChatGPT's in-app browser or Chrome that can answer syllabus questions, track upcoming deadlines, assess unsubmitted assignment drafts against complex rubrics, and balance study schedules without clicking through dozens of nested LMS menus.
2. **Teachers / TAs / Course Instructors**: Want an assistant to review assignment submission status, identify overdue or struggling students, draft rubric-grounded constructive feedback, and broadcast course announcements.
3. **Hackathon Judges & Evaluators**: Want to test a live, authenticated deployment through ChatGPT in-app browser with zero installation, experiencing real-time agent co-browsing and tool execution.

---

## Core User Journeys

### Journey 1: Student Assignment & Rubric Copilot
1. Student opens OpenLMS in ChatGPT's in-app browser (or Chrome 149+ with WebMCP flag).
2. The webpage automatically registers student-scoped WebMCP tools on `document.modelContext`.
3. Student asks in chat: *"What assignments are due in the next 7 days, and can you check if my draft introduction for CS101 meets the rubric criteria?"*
4. The agent invokes `get_upcoming_deadlines` and `get_assignment_details(assignment_id)` to pull full criteria (e.g., Code Quality, Analytical Rigor, Formatting).
5. The agent invokes `evaluate_draft_against_rubric`, scoring each criterion and highlighting gaps.
6. The in-page **Activity HUD** pulses, displaying the exact rubric criteria inspected.

### Journey 2: Teacher Grading & Feedback Assistant
1. Instructor switches to or logs in as Course Teacher.
2. The page detects instructor permissions and registers administrative WebMCP tools.
3. Teacher asks: *"Give me a status breakdown of Assignment 2 submissions for BIO200 and prepare a draft feedback review for student John Doe based on the lab rubric."*
4. The agent calls `get_course_submissions_summary` and `generate_rubric_feedback_draft`.
5. The agent returns a balanced, criteria-aligned feedback draft, and the LMS page visually populates the draft area for instructor review and sign-off.

### Journey 3: Hackathon Judge 1-Click Verification
1. Judge opens the live URL protected by Cloudflare Access (using provided test credentials or 1-click guest access).
2. The judge sees the pre-seeded "Apex University" LMS environment.
3. Judge prompts ChatGPT with sample queries provided in the submission testing guide.
4. Judge observes instant tool discovery, real-time data retrieval, rubric evaluation, and live visual HUD feedback.

---

## Epics And User Stories

### Epic 1: In-Browser WebMCP Tool Discovery & Lifecycle
- **Story 1.1**: As a user (student or teacher), I want the LMS page to expose structured tools to my browser's AI agent on load so that the agent understands how to interact with my courses without manual plugin installation.
  - *Acceptance Criteria*:
    - `document.modelContext.registerTool` is invoked on page load for all active tools.
    - Each tool specifies a valid JSON Schema for inputs, clear operational descriptions, and an async execution handler.
    - Switching active user role dynamically updates registered tool set.

### Epic 2: Student Academic Intelligence & Rubric Evaluation
- **Story 2.1**: As a student, I want to ask about all upcoming deadlines across all my courses so I never miss an assignment.
  - *Acceptance Criteria*:
    - `get_upcoming_deadlines(days_ahead)` returns an array of objects containing `course_code`, `assignment_name`, `due_date_iso`, `points_possible`, and `submission_status`.
    - Results are sorted chronologically by due date.
- **Story 2.2**: As a student, I want to evaluate a draft paper against an assignment's official grading rubric before submitting.
  - *Acceptance Criteria*:
    - `get_assignment_details(assignment_id)` returns full instructions and nested rubric criteria (criterion name, max points, level descriptions).
    - `evaluate_draft_against_rubric(assignment_id, draft_text)` returns an assessment breakdown showing matched criteria, estimated score range, and actionable improvement recommendations.
- **Story 2.3**: As a student, I want to generate a multi-course study schedule based on upcoming due dates and estimated assignment weights.
  - *Acceptance Criteria*:
    - `generate_study_schedule(assignment_ids, daily_hours)` distributes study blocks leading up to deadlines without schedule collisions.

### Epic 3: Instructor Course Management & Grading Support
- **Story 3.1**: As an instructor, I want an overview of submission and grading status across my course.
  - *Acceptance Criteria*:
    - `get_course_submissions_summary(course_id)` returns total enrolled, submitted count, graded count, and average score.
- **Story 3.2**: As an instructor, I want to draft rubric-aligned feedback for student submissions to speed up grading while maintaining high instructional quality.
  - *Acceptance Criteria*:
    - `generate_rubric_feedback_draft(submission_id)` returns detailed feedback structured by rubric criteria with praise and constructive corrections.
- **Story 3.3**: As an instructor, I want to draft a course announcement for upcoming schedule changes.
  - *Acceptance Criteria*:
    - `draft_course_announcement(course_id, title, content)` generates an announcement and previews it in the page interface.

### Epic 4: Visual Co-Browsing Activity HUD
- **Story 4.1**: As a user, I want visual feedback on the webpage when the agent runs tools so that I can verify what LMS data the agent accessed.
  - *Acceptance Criteria*:
    - A non-intrusive floating HUD widget is rendered in the lower corner of the page.
    - Displays a live activity stream when a WebMCP tool executes (timestamp, tool name, parameters, result summary).
    - Clicking an activity item reveals details of the data exchanged.

### Epic 5: Zero-Friction Demo Sandbox & Cloudflare Access Protection
- **Story 5.1**: As a hackathon judge or tester, I want to explore the app with zero setup time.
  - *Acceptance Criteria*:
    - Live URL secured by Cloudflare Access with clear testing instructions / bypass credentials.
    - Pre-seeded with 3 realistic courses:
      - *CS101: Introduction to Artificial Intelligence* (Coding projects, algorithmic rubrics)
      - *BIO200: Molecular & Cellular Biology* (Lab reports, methodology rubrics)
      - *HIST110: Modern World History* (Essay prompts, citation & thesis rubrics)
    - 1-click toggle between Student ("John Doe") and Instructor ("Dr. Jane Doe") personas.

---

## Edge Cases

1. **Course with No Rubric**: If an assignment uses simple point grading instead of a structured rubric, `get_assignment_details` returns the point scale and description, and `evaluate_draft_against_rubric` assesses against general academic writing standards and prompt instructions.
2. **Empty Deadlines**: When no assignments are due within the requested window, `get_upcoming_deadlines` returns an empty list with an explicit summary message.
3. **Malformed Draft Text**: If empty or invalid text is supplied to rubric evaluation, the tool returns a descriptive error guiding the agent to ask the student for the draft text.
4. **Session Expiry / Auth Loss**: When the session expires, WebMCP tools return a clean auth error prompting the user to re-authenticate.

---

## What We Are Building
- Full in-browser WebMCP tool suite (Student + Instructor tools).
- Floating WebMCP Activity HUD with real-time visual feedback.
- Pre-seeded multi-course interactive demo sandbox (Apex University).
- `local_webmcp` installable Moodle/OpenLMS PHP plugin script for self-hosted instances.
- Cloudflare Access protected live edge deployment.

## What We Would Add With More Time
- Deep LTI 1.3 / IMS Global integration for automated Canvas/Blackboard/Brightspace parity.
- Direct assignment file attachment parsing (PDF/DOCX extraction inside browser worker).
- Multi-student batch grading workflows with automated gradebook push.

## Submission Proof Points
- **WebMCP Leverage**: Native `document.modelContext.registerTool` integration running in the user's active browser session with zero backend token setup.
- **Human + Agent Co-Browsing**: Agent reasoning over complex rubrics and student drafts with visible in-page HUD feedback.
- **Real-World Utility**: Solves a universal pain point for millions of students and educators navigating legacy LMS software.




