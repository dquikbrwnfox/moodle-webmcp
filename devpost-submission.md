# Moodle WebMCP

## One-line Summary
An open in-browser WebMCP integration for Moodle LMS that turns passive course pages into intelligent, collaborative workspaces where students, teachers, and browser-based AI agents co-browse, evaluate assignment drafts against grading rubrics, and track deadlines with zero token setup.

## Problem
- **Fragmented LMS Navigation**: In systems like Moodle and OpenLMS, vital academic information—such as assignment rubrics, syllabus deadlines, and unsubmitted draft guidelines—is scattered across nested sub-menus. Students spend excessive time clicking through menus instead of focusing on coursework.
- **High Administrative Barriers**: Existing AI tools for Moodle require either central university IT admin installation of server-side plugins or manual user API token generation with local terminal daemons, which locked-down institutional LMS setups prevent.

## Solution
**Moodle WebMCP** implements the open WebMCP standard (`document.modelContext.registerTool`) directly inside active Moodle browser sessions. When students or educators open Moodle in ChatGPT's in-app browser or WebMCP-enabled Chrome (149+), the webpage immediately registers contextual, role-appropriate tools into the browser's model context:
- **Zero Token Setup**: Inherits the student's active browser session and CSRF `sesskey` automatically, working with university SSO and Active Directory.
- **In-Browser Co-Browsing**: AI agents can query deadlines, retrieve complex multi-criteria rubrics, evaluate draft essays before submission, and summarize lecture materials.
- **Dual Packaging**: Provides an installable Moodle local plugin (`local_webmcp`) for production servers, a 1-click client-side UserScript (`moodle-webmcp.user.js`) for everyday students, and a live containerized Moodle deployment on Render.

## Why This Matters
Higher education is one of the highest-friction enterprise software domains. Bringing the emerging WebMCP standard to Moodle—the world's most widely used open-source LMS—bridges the gap between passive educational portals and active academic copilots for over 300 million students and educators worldwide.

## How We Used AI
- **In-Browser Agent Co-Browsing**: The browser AI agent executes WebMCP tools on the active page to pull real-time course data, extract grading matrices, and evaluate unsubmitted drafts.
- **Rubric Alignment & Grading Feedback**: The agent cross-references student draft text against specific rubric performance levels (Exemplary, Proficient, Developing), providing granular criteria scoring and constructive revision suggestions.

## How We Used Codex
- **Architectural Planning**: Used Codex with the Devpost Hackathon build tool and `$grill-me` to stress-test the design tree, scoping out the WebMCP tool suite and Moodle reverse proxy TLS termination.
- **Full-Stack Implementation**: Built the complete Moodle local plugin (`local_webmcp`), AMD JavaScript modules, SQLite containerization, course auto-seeders, and Render Blueprint deployment.
- **Autonomous Troubleshooting**: Diagnosed and resolved reverse proxy TLS redirection loops (`SSLPROXY=true`) and CLI argument splitting on Render.

## Key Features
1. **In-Browser WebMCP Tool Registry**: Automatic registration of student and instructor tools on `document.modelContext`.
2. **Interactive Rubric Evaluation**: Instant analysis of unsubmitted essays/reports against official multi-tier rubrics.
3. **Production Moodle Local Plugin (`local_webmcp`)**: Official Moodle 4.x/5.x PHP plugin and AMD module.
4. **1-Click UserScript (`moodle-webmcp.user.js`)**: Client-side Tampermonkey script allowing students to use WebMCP on any university Moodle with `@grant none` security.
5. **Live Render Deployment**: Full Moodle 4.5 LMS with persistent SQLite storage and pre-seeded CS 101 & AI 202 courses.

## Architecture
- **WebMCP Standard Layer**: Client-side `document.modelContext.registerTool` runtime with dynamic role-based mounting.
- **Moodle Plugin Layer**: Moodle Local Plugin architecture (`local_webmcp`) injecting the AMD module into core layouts.
- **Deployment Tier**: Containerized Alpine Moodle with SQLite3 and `local_webmcp` deployed on Render Starter plan.

## Testing Instructions
1. Open the live deployment in **ChatGPT's in-app browser** (or **Google Chrome 149+** with `chrome://flags/#enable-webmcp-testing` enabled):
   - **Primary Live URL**: [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) (or [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com))
2. Log in with the demo credentials:
   - **Student Login**: `alex` / `MoodleStudent2026!`
   - **Admin / Instructor Login**: `admin` / `MoodleWebMCP2026!`
3. Prompt ChatGPT:
   - *"What assignments are due across my courses, and can you check if my draft for the CS101 Ethics Essay satisfies the grading rubric?"*
4. Observe the agent seamlessly call `get_upcoming_deadlines`, pull the rubric via `get_assignment_details`, and execute `evaluate_draft_against_rubric`.

## Public Demo Link
- Live Moodle LMS: [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) / [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com)

## Public Repository Link
- GitHub Repository: [https://github.com/dquikbrwnfox/moodle-webmcp](https://github.com/dquikbrwnfox/moodle-webmcp) (MIT Licensed)

## Demo Video Outline (< 3 Minutes)
1. **0:00 - 0:40 (Problem & Motivation)**: The pain of navigating fragmented university LMS menus and the barrier of existing backend-token MCPs.
2. **0:40 - 1:40 (Student Co-Browsing Demo)**: Opening Moodle in ChatGPT, asking for weekly deadlines, and having the agent evaluate a draft essay against the CS101 rubric.
3. **1:40 - 2:20 (Instructor Workflow & Plugin)**: Switching to instructor view, summarizing submissions, and showcasing the `local_webmcp` PHP plugin and UserScript.
4. **2:20 - 2:50 (Architecture & Conclusion)**: Explaining WebMCP in-page execution and zero-token security.

## Submission Readiness Notes
- Live Moodle instance deployed and running with SQLite on Render.
- Pre-seeded courses and student accounts active.
- Repository contains complete source code, UserScript, Docker setup, and MIT license.





