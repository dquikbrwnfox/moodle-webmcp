# Moodle WebMCP

## One-line Summary
An open in-browser WebMCP integration for Moodle LMS that turns passive course pages into intelligent, collaborative workspaces where students, teachers, and browser-based AI agents co-browse, evaluate assignment drafts against grading rubrics, plan study milestones, and track deadlines with zero token setup.

## Problem
- **Fragmented LMS Navigation**: In systems like Moodle and OpenLMS, vital academic information—such as assignment rubrics, syllabus deadlines, and unsubmitted draft guidelines—is scattered across nested sub-menus. Students spend excessive time clicking through menus instead of focusing on coursework.
- **High Administrative Barriers**: Existing AI integrations for Moodle rely on traditional backend Model Context Protocol (MCP) daemons that require either central university IT admin installation of server-side plugins or manual user API token generation with local terminal daemons, which locked-down institutional LMS setups prevent.

## Solution: Two Paths, One Open Standard
**Moodle WebMCP** implements the open WebMCP standard (`document.modelContext.registerTool`) directly inside active Moodle browser sessions, offering two complementary delivery mechanisms:
1. **Deliverable 1: The Native Moodle Plugin (`local_webmcp`)**: A production-grade Moodle 4.x / 5.x PHP local plugin designed for university IT administrators and educators. It hooks natively into Moodle's navigation lifecycle and RequireJS AMD loaders to automatically enable in-browser WebMCP across all enrolled students and faculty.
2. **Deliverable 2: The 1-Click UserScript (`moodle-webmcp.user.js`)**: A client-side proof-of-ease / proof-of-concept running under strict `@grant none` sandboxing. It allows everyday students to bring WebMCP to *any* locked-down institutional Moodle portal worldwide in under 15 seconds without requiring IT admin approval.

- **Zero Token Setup**: Inherits the student's active browser session and CSRF `sesskey` automatically, working with university SSO, Google Workspace, and Microsoft Active Directory.
- **In-Browser Co-Browsing**: AI agents in **ChatGPT's in-app browser** and **Chrome 146+** query deadlines, retrieve multi-criteria rubrics, evaluate draft essays before submission, generate adaptive study schedules, and summarize lecture materials.

## Why This Matters
Higher education is one of the highest-friction enterprise software domains. Bringing the emerging WebMCP standard to Moodle—the world's most widely used open-source LMS—bridges the gap between passive educational portals and active academic copilots for over 300 million students and educators worldwide.

## How We Used AI
- **In-Browser Agent Co-Browsing**: The browser AI agent executes WebMCP tools on the active page to pull real-time course data, extract grading matrices, and evaluate unsubmitted drafts.
- **Rubric Alignment & Grading Feedback**: The agent cross-references student draft text against specific rubric performance levels, providing granular criteria scoring and constructive revision suggestions.
- **Adaptive Pacing**: The agent computes day-by-day milestone roadmaps for upcoming deadlines based on the student's available daily study hours.

## How We Used Codex
- **Architectural Planning**: Used Codex with the Devpost Hackathon build tool and `$grill-me` to stress-test the design tree, scoping out the 8-tool WebMCP suite and Moodle reverse proxy TLS termination.
- **Full-Stack Implementation**: Built the complete Moodle local plugin (`local_webmcp`), AMD JavaScript modules, SQLite containerization, self-healing course auto-seeders, and Render Blueprint deployment.
- **Autonomous Troubleshooting**: Diagnosed and resolved reverse proxy TLS redirection loops, Moodle 5.x document root structures (`/var/www/html/public/`), and gradebook item initialization.

## Key Features
1. **In-Browser WebMCP Tool Registry**: Automatic registration of 8 student and instructor tools on `document.modelContext`.
2. **Interactive Rubric Evaluation**: Instant analysis of unsubmitted essays/reports against official multi-tier rubrics.
3. **Adaptive Milestone Study Pacing**: Dynamic calculation of study blocks and checkpoints leading up to target assignment deadlines.
4. **Production Moodle Local Plugin (`local_webmcp`)**: Official Moodle 4.x/5.x PHP plugin and AMD module for server-side institutional deployment.
5. **1-Click UserScript (`moodle-webmcp.user.js`)**: Client-side Tampermonkey script allowing students to use WebMCP on any university Moodle with `@grant none` security.
6. **Live Render Deployment**: Full Moodle 5.2.2 LMS with persistent SQLite storage and pre-seeded CS 101 & AI 202 courses.

## Architecture
- **WebMCP Standard Layer**: Client-side `document.modelContext.registerTool` runtime with dynamic role-based mounting (Imperative WebMCP pattern).
- **Moodle Plugin Layer**: Moodle Local Plugin architecture (`local_webmcp`) injecting the AMD module and inline DOM bootstrapper into core layouts.
- **Deployment Tier**: Containerized Alpine Moodle 5.2.2 with SQLite3 and `local_webmcp` deployed on Render.

## Testing Instructions
1. Open the live deployment in **ChatGPT's in-app browser** (or **Google Chrome 146+** with `chrome://flags/#enable-webmcp-testing` enabled):
   - **Primary Live URL**: [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) (or [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com))
2. Log in with the demo credentials:
   - **Student Login**: `student1` / `MoodleStudent2026!`
   - **Teacher / Faculty Login**: `teacher1` / `MoodleTeacher2026!` (or `admin` / `MoodleWebMCP2026!`)
3. Prompt ChatGPT:
   - *"What assignments are due across my courses, and can you check if my draft for the CS101 Ethics Essay satisfies the grading rubric?"*
   - *"I have 2 hours a day to study. Can you generate an adaptive study schedule for my upcoming CS 101 assignment?"*
4. Observe the agent seamlessly call `get_upcoming_deadlines`, pull the rubric via `get_assignment_details`, execute `evaluate_draft_against_rubric`, and generate study milestones via `generate_study_schedule`.

## Public Demo Link
- Live Moodle LMS: [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) / [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com)

## Public Repository Link
- GitHub Repository: [https://github.com/dquikbrwnfox/moodle-webmcp](https://github.com/dquikbrwnfox/moodle-webmcp) (MIT Licensed)

## Demo Video Outline (< 3 Minutes)
1. **0:00 - 0:40 (Problem & Motivation)**: The pain of navigating fragmented university LMS menus and the barrier of existing backend-token MCPs.
2. **0:40 - 1:40 (Student Co-Browsing Demo)**: Opening Moodle in ChatGPT, asking for weekly deadlines, generating a study schedule, and having the agent evaluate a draft essay against the CS101 rubric.
3. **1:40 - 2:20 (Instructor Workflow & Plugin)**: Switching to instructor view, summarizing submissions, and showcasing the `local_webmcp` PHP plugin and 1-Click UserScript proof-of-ease.
4. **2:20 - 2:50 (Architecture & Conclusion)**: Explaining WebMCP in-page execution and zero-token security.

## Submission Readiness Notes
- Live Moodle instance deployed and running with SQLite on Render.
- Pre-seeded courses, syllabus, and student accounts active.
- Repository contains complete source code, UserScript, Docker setup, and MIT license.
