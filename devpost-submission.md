# Moodle WebMCP

## One-line Summary
An in-browser WebMCP integration for Moodle that turns passive course pages into intelligent, collaborative workspaces where students, teachers, and browser-based AI agents co-browse, evaluate assignment drafts against grading rubrics, and track deadlines.

## Problem
- **Dense, Fragmented LMS Navigation**: In systems like Moodle and OpenLMS, vital academic information—such as assignment rubrics, syllabus deadlines, and unsubmitted draft guidelines—is scattered across nested sub-menus. Students spend excessive time clicking through menus instead of focusing on coursework.
- **High Administrative Barriers**: Existing AI tools for Moodle require either central university IT admin installation of server-side plugins or manual user API token generation with local terminal daemons, which locked-down institutional LMS setups prevent.

## Solution
**Moodle WebMCP** implements the open WebMCP standard (`document.modelContext.registerTool`) directly inside active Moodle browser sessions. When students or educators open Moodle in ChatGPT's in-app browser or WebMCP-enabled Chrome (149+), the webpage immediately registers contextual, role-appropriate tools into the browser's model context:
- **Zero Token Setup**: Inherits the student's active browser session and CSRF `sesskey`.
- **In-Browser Co-Browsing**: AI agents can query deadlines, retrieve complex multi-criteria rubrics, evaluate draft essays before submission, and stage discussion posts.
- **Dual Packaging**: Provides an installable Moodle local plugin (`local_webmcp`) for production servers and a live containerized Moodle demo on Render.

## Why This Matters
Higher education is one of the highest-friction enterprise software domains. Enabling AI agents to navigate and reason over live LMS data right inside the student's browser tab bridges the gap between passive educational portals and active academic copilots.

## How We Used AI
- **In-Browser Agent Co-Browsing**: The browser AI agent executes WebMCP tools on the active page to pull real-time course data, extract grading matrices, and evaluate unsubmitted drafts.
- **Rubric Alignment & Grading Feedback**: The agent cross-references student draft text against specific rubric performance levels (Exemplary, Proficient, Developing), providing granular criteria scoring and constructive revision suggestions.

## How We Used Codex
- **Architectural Planning**: Used Codex with the Devpost Hackathon build tool and `$grill-me` to stress-test the design tree, scoping out the 6-tool WebMCP suite and Moodle reverse proxy TLS termination.
- **Full-Stack Implementation**: Built the complete React 19 + TypeScript + Vite companion frontend, the `local_webmcp` PHP plugin, SQLite containerization, and Render Blueprint deployment.
- **Autonomous Troubleshooting**: Diagnosed and resolved reverse proxy TLS redirection loops (`SSLPROXY=true`) and CLI argument splitting on Render.

## Key Features
1. **In-Browser WebMCP Tool Registry**: Automatic registration of 6 student tools and 3 instructor tools on `document.modelContext`.
2. **Interactive Rubric Evaluation**: Instant analysis of unsubmitted essays/reports against official multi-tier rubrics.
3. **Live Co-Browsing Activity HUD**: Glowing in-page telemetry badge displaying real-time tool executions, arguments, and return data.
4. **Interactive Tool Runner**: In-browser execution drawer enabling 1-click testing of any registered WebMCP tool.
5. **Production Moodle Local Plugin (`local_webmcp`)**: Official Moodle 4.x/5.x PHP plugin and AMD module.

## Architecture
- **WebMCP Standard Layer**: Client-side `document.modelContext.registerTool` runtime with dynamic role-based mounting.
- **Application Core**: React 19, TypeScript, Tailwind CSS v4, Lucide React.
- **Deployment Tier**: Containerized Alpine Moodle with SQLite3 and `local_webmcp` deployed on Render Starter plan.

## Testing Instructions
1. Open the live deployment in **ChatGPT's in-app browser** (or **Google Chrome 149+** with `chrome://flags/#enable-webmcp-testing` enabled):
   - **Primary Live URL**: [https://moodle-webmcp-9rzc.onrender.com](https://moodle-webmcp-9rzc.onrender.com)
2. Log in with the public demo credentials:
   - **Username**: `admin`
   - **Password**: `MoodleWebMCP2026!`
3. Prompt ChatGPT:
   - *"What assignments are due across my courses, and can you check if my draft for the CS101 Ethics Essay satisfies the grading rubric?"*
4. Observe the live in-page Activity HUD light up as the agent calls `get_upcoming_deadlines`, pulls the rubric via `get_assignment_details`, and executes `evaluate_draft_against_rubric`.

## Public Demo Link
- Live Moodle LMS: [https://moodle-webmcp-9rzc.onrender.com](https://moodle-webmcp-9rzc.onrender.com)
- Web Companion: [https://openlms-webmcp.onrender.com](https://openlms-webmcp.onrender.com)

## Public Repository Link
- GitHub Repository: [https://github.com/dquikbrwnfox/moodle-webmcp](https://github.com/dquikbrwnfox/moodle-webmcp) (Make public before final submission)

## Demo Video Outline (< 3 Minutes)
1. **0:00 - 0:40 (Problem & Motivation)**: The pain of navigating fragmented university LMS menus and the barrier of existing backend-token MCPs.
2. **0:40 - 1:40 (Student Co-Browsing Demo)**: Opening Moodle in ChatGPT, asking for weekly deadlines, and having the agent evaluate a draft essay against the CS101 rubric with visible in-page HUD pulses.
3. **1:40 - 2:20 (Instructor Workflow & Plugin)**: Switching to instructor view, summarizing submissions, and showcasing the `local_webmcp` PHP plugin.
4. **2:20 - 2:50 (Architecture & Conclusion)**: Explaining WebMCP in-page execution and zero-token security.

## Screenshot Shot List
1. **Course Dashboard with WebMCP Indicator**: Showing active courses and the floating Co-Browsing HUD.
2. **Assignment Rubric Matrix & Draft Editor**: Showing the multi-tier rubric criteria table and draft box.
3. **Agent Rubric Evaluation Breakdown**: Highlighting criteria scores, matched strengths, and revision steps.
4. **In-Page Activity HUD Telemetry**: Showing tool execution history and argument inspection modal.

## Submission Readiness Notes
- Live Moodle instance deployed and running with SQLite on Render.
- WebMCP tool definitions and event bus tested.
- Repository contains complete source code and open-source documentation.

