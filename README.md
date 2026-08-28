# Moodle WebMCP 🎓🤖

> **Agent-Native Academic Workspace for Moodle & OpenLMS**  
> Powered by the emerging **WebMCP** (`document.modelContext.registerTool`) standard. Built for **The WebMCP Challenge** by OpenAI & Devpost.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![WebMCP Standard](https://img.shields.io/badge/WebMCP-W3C%20Draft-indigo.svg)](https://webmachinelearning.github.io/webmcp/)
[![Moodle Version](https://img.shields.io/badge/Moodle-4.x%20%2F%205.x-orange.svg)](https://moodle.org/)
[![React 19](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7.svg)](https://render.com)

---

## 🌟 Overview

Learning Management Systems (LMS) such as Moodle and OpenLMS house thousands of critical educational resources—syllabi, course deadlines, discussion forums, and multi-criteria assignment rubrics. However, accessing this data is fragmented and click-heavy.

Existing AI integrations for LMSs rely on traditional backend MCP servers that require either **site administrator privileges** to install server-side plugins or **manual user API token generation** (which university IT typically locks down for students).

**Moodle WebMCP** solves this fundamentally:
1. **In-Browser WebMCP Execution**: Injects `document.modelContext.registerTool` directly into active Moodle sessions.
2. **Zero-Token Setup**: Seamlessly operates with the student's active authenticated browser session and CSRF tokens.
3. **Agent Co-Browsing**: AI agents in **ChatGPT's in-app browser** and **Chrome 149+** can query deadlines, extract detailed assignment rubrics, evaluate essay drafts against grading criteria, and plan study schedules directly on the page.
4. **Live In-Page Activity HUD**: A floating co-browsing indicator provides real-time visual feedback of data accessed and tools invoked by the agent.

---

## 🚀 Live Demo & Deployments

| Deployment | URL | Description | Test Credentials |
|---|---|---|---|
| **Live Moodle Server** | [https://moodle-webmcp-9rzc.onrender.com](https://moodle-webmcp-9rzc.onrender.com) | Real Moodle 4.5 LMS on Render with `local_webmcp` baked in + SQLite3 persistent storage. | **User**: `admin`<br>**Pass**: `MoodleWebMCP2026!` |
| **Web Companion Sandbox** | [https://openlms-webmcp.onrender.com](https://openlms-webmcp.onrender.com) | Standalone interactive demo sandbox ("Apex University") with CS101, BIO200, and HIST110 courses and rubrics. | 1-Click Role Switcher on page |

---

## 🛠️ WebMCP Tool Suite

The platform registers role-specific tools into `document.modelContext`:

### 📚 Student Tools
- `get_enrolled_courses()`: Returns enrolled courses, instructor info, and course progress.
- `get_upcoming_deadlines(days_ahead?: number)`: Chronological list of impending assignments, labs, quizzes, and submission statuses.
- `get_assignment_details(assignment_id: number)`: Complete prompt instructions, due dates, submission status, and structured multi-level rubrics.
- `evaluate_draft_against_rubric(assignment_id: number, draft_text: string)`: Evaluates draft text against official rubric criteria, returning criteria-by-criteria scores, strengths, and actionable revision suggestions.
- `generate_study_schedule(daily_study_hours?: number, days_ahead?: number)`: Produces a personalized study milestone timeline balancing deadlines across courses.
- `draft_forum_post(course_id: number, forum_id: number, subject: string, message_content: string)`: Mounts draft discussion responses in the on-screen forum composer for student review.

### 👩‍🏫 Instructor Tools
- `get_course_submissions_summary(course_id: number)`: Enrolled student count, submitted count, graded count, and grading completion percentage.
- `generate_rubric_feedback_draft(submission_id: number)`: Generates criteria-aligned feedback comments ready for teacher review.
- `draft_course_announcement(course_id: number, title: string, content: string)`: Broadcasts announcement banners to enrolled course participants.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BROWSER TAB (ChatGPT / Chrome 149+)                      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    WebMCP Standard Tool Registry                      │  │
│  │                  (document.modelContext.registerTool)                 │  │
│  │                                                                       │  │
│  │  Student Tools:                       Instructor Tools:               │  │
│  │  • get_enrolled_courses               • get_course_submissions_summary│  │
│  │  • get_upcoming_deadlines             • generate_rubric_feedback_draft│  │
│  │  • get_assignment_details             • draft_course_announcement     │  │
│  │  • evaluate_draft_against_rubric                                      │  │
│  │  • generate_study_schedule                                            │  │
│  │  • draft_forum_post                                                   │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │ Tool Execution Callbacks             │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Active LMS Browser Context                        │  │
│  │     (Session Cookies + CSRF sesskey + Live Rubric Engine)             │  │
│  └───────────────────┬───────────────────────────────────────┬───────────┘  │
│                      │                                       │              │
│                      ▼ (Event Bus)                           ▼ (AJAX/Fetch) │
│  ┌───────────────────────────────────────┐   ┌───────────────────────────┐  │
│  │         In-Page Activity HUD          │   │ Real Moodle LMS / Sandbox │  │
│  │      (Live Co-Browsing Telemetry)     │   │      (Course Views)       │  │
│  └───────────────────────────────────────┘   └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Moodle Local Plugin (`local_webmcp`)

For self-hosted Moodle instances, we package a native Moodle local plugin located in `moodle-plugin/local/webmcp`:

1. Copy the plugin into your Moodle installation:
   ```bash
   cp -r moodle-plugin/local/webmcp /var/www/html/moodle/local/webmcp
   ```
2. Navigate to **Site Administration > Notifications** to trigger the database upgrade.
3. The plugin automatically enqueues AMD scripts that expose WebMCP tools into the DOM for logged-in students and instructors.

---

## 💻 Local Development

### Prerequisites
- Node.js 22+
- `pnpm` 10+ (or `npm`)
- (Optional) Docker & Docker Compose for running the full local Moodle stack

### Run Web Companion
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000` in your browser.

### Run Local Moodle Server via Docker
```bash
docker compose up -d
```
Open `http://localhost:8080` and log in with `admin` / `MoodleWebMCP2026!`.

---

## 🧪 Testing with WebMCP in AI Browsers

1. **ChatGPT Desktop**:
   - Open ChatGPT Desktop.
   - Navigate to the in-app browser and enter [https://moodle-webmcp-9rzc.onrender.com](https://moodle-webmcp-9rzc.onrender.com) (or `http://localhost:3000`).
   - Ask ChatGPT: *"What assignments are due across my courses, and can you check if my draft for the CS101 Ethics Essay satisfies the grading rubric?"*
2. **Google Chrome 149+**:
   - Open Chrome and navigate to `chrome://flags/#enable-webmcp-testing`.
   - Enable the flag and restart Chrome.
   - Open the web app and open Chrome DevTools > Application > WebMCP to inspect registered tools.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

