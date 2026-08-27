# Project Scope: OpenLMS WebMCP

## Project Name Candidates
- **OpenLMS WebMCP** (Selected)
- Moodle WebMCP
- EduMCP: The Agent-Native LMS

## One-Line Summary
In-browser WebMCP integration for OpenLMS / Moodle that allows AI agents in ChatGPT and Chrome to co-browse with students, monitor deadlines, evaluate assignment drafts against rubrics, and plan study schedules directly within authenticated LMS sessions.

## Target User
University and college students navigating complex course portals (Moodle / OpenLMS) who want an academic co-pilot that can answer syllabus questions, cross-reference assignment rubrics, and organize study workloads without manual copy-pasting or server configuration.

## Problem
- Learning Management Systems (LMS) like Moodle are notoriously fragmented and click-heavy: rubrics are buried inside assignment sub-menus, syllabus dates are scattered across course tabs, and unsubmitted drafts are difficult to cross-check against grading criteria.
- Traditional MCP solutions require either central university IT administrative approval to install server plugins or manual API token creation with local terminal daemons, locking out ordinary students whose universities restrict token generation.

## Core Workflow
1. **Student opens OpenLMS / Moodle** in ChatGPT's in-app browser or WebMCP-enabled Chrome.
2. **WebMCP in-page tools auto-register** via `document.modelContext.registerTool`, inheriting the active authenticated student session.
3. **Student asks the agent** in natural language (e.g., *"What is due across my courses this week, and does my drafted biology essay meet the rubric requirements?"*).
4. **Agent executes WebMCP tools** (`get_upcoming_deadlines`, `get_assignment_details`, `evaluate_draft_against_rubric`).
5. **In-Page Activity HUD reacts live**, showing visual confirmation of data accessed and highlighting recommendations right in the student's view.

## What We Are Building
- **`local_webmcp` PHP / JS Plugin**: Lightweight Moodle plugin that injects WebMCP tool registrations into Moodle page templates.
- **Standalone Web App / Demo Sandbox**: Modern, high-performance web dashboard (React/Vite) with a 1-click pre-seeded "Apex University" demo environment (sample courses, detailed rubrics, deadlines, discussion forums) + live custom Moodle endpoint bridge.
- **6 Core WebMCP In-Browser Tools**:
  1. `get_enrolled_courses()`: Course codes, names, instructors, and completion status.
  2. `get_upcoming_deadlines(days_ahead)`: Chronological assignment/quiz deadlines across enrolled courses.
  3. `get_assignment_details(assignment_id)`: Full instructions, due dates, submission status, and structured grading rubrics.
  4. `evaluate_draft_against_rubric(assignment_id, draft_text)`: Analytical comparison of student draft text against multi-tier grading criteria.
  5. `generate_study_schedule(assignment_ids, daily_hours)`: Workload balancing and milestone generation.
  6. `draft_forum_post(course_id, forum_id, topic, draft_content)`: Interactive discussion drafting with in-page preview.
- **Floating Co-Browsing HUD**: Visual toast/indicator showing live tool invocations and action status.

## What We Are Not Building
- Full replacement of Moodle's backend database or LMS core functions.
- Automated grade submission without human verification (keeping human in the loop).
- Desktop daemon / local CLI configuration requirements (purely web-native).

## Inspiration And References
- Official WebMCP specification (`document.modelContext.registerTool`) and Chrome AI docs.
- Modern university LMS student workflows (OpenLMS / Moodle 4.x).
- Agent-native web co-browsing paradigms.

## Demo Path
1. Open the deployed **OpenLMS WebMCP** portal in ChatGPT's in-app browser or WebMCP-enabled Chrome.
2. 1-click launch into the pre-seeded "Apex University" demo with active student persona.
3. Prompt ChatGPT: *"Give me a briefing on my courses this week, check what assignments are urgent, and analyze my draft essay for CS101 against its rubric."*
4. Watch the agent call `get_upcoming_deadlines`, pull the detailed CS101 grading rubric, evaluate the text, and trigger the live in-page Activity HUD.

## Submission Story
Demonstrating how the emerging WebMCP standard transforms dense, legacy enterprise web software (educational LMSs) into intelligent, agent-collaborative workspaces with zero administrative install friction.

