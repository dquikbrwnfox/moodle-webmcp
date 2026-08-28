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

Learning Management Systems (LMS) such as Moodle and OpenLMS house thousands of critical educational resources—syllabi, course deadlines, discussion forums, and multi-criteria assignment rubrics. However, accessing and synthesizing this data is fragmented and click-heavy.

Existing AI integrations for LMSs rely on traditional backend Model Context Protocol (MCP) servers that require either **site administrator privileges** to install server-side plugins or **manual user API token generation** (which university IT typically disables for students).

**Moodle WebMCP** solves this fundamentally:
1. **In-Browser WebMCP Execution**: Implements the W3C/Chrome WebMCP standard (`document.modelContext.registerTool`) directly inside active Moodle web sessions.
2. **Zero-Token Setup**: Seamlessly operates with the student's active authenticated browser session, supporting single sign-on (SSO/Active Directory) with zero token generation friction.
3. **True Agent Co-Browsing**: AI agents in **ChatGPT's in-app browser** and **Chrome 149+** can query deadlines, retrieve complex multi-criteria rubrics, evaluate essay drafts against grading criteria, and plan study schedules directly on the page.
4. **Live In-Page Activity HUD & Visual Rubric Highlighting**: A floating co-browsing indicator provides real-time visual feedback of data accessed and dynamically highlights matching rubric criteria levels in the student's view.

---

## 🚀 Live Demo & Deployments

| Deployment | URL | Description | Test Credentials |
|---|---|---|---|
| **Live Moodle Server** | [https://moodle-webmcp-9rzc.onrender.com](https://moodle-webmcp-9rzc.onrender.com) | Real Moodle 4.5 LMS on Render with `local_webmcp` baked in + SQLite3 persistent storage. | **User**: `admin`<br>**Pass**: `MoodleWebMCP2026!` |
| **Web Companion Sandbox** | [https://openlms-webmcp.onrender.com](https://openlms-webmcp.onrender.com) | Standalone interactive demo sandbox ("Apex University") with CS101, BIO200, and HIST110 courses and rubrics. | 1-Click Role Switcher on page |

---

## 🧭 Judge & Evaluator Testing Guide

To test **Moodle WebMCP** in an AI browser:

### Step 1: Open the App
- Open **ChatGPT Desktop** (or **Google Chrome 149+** with `chrome://flags/#enable-webmcp-testing` enabled).
- In the in-app browser, open [https://moodle-webmcp-9rzc.onrender.com](https://moodle-webmcp-9rzc.onrender.com) (or [https://openlms-webmcp.onrender.com](https://openlms-webmcp.onrender.com)).

### Step 2: Try These Example Prompts in Chat

#### 1. Deadlines & Schedule Planning
> *"What assignments do I have coming up across all my courses this week, and can you generate a 3-day study schedule to prepare for them?"*
- **What happens**: The agent calls `get_upcoming_deadlines` and `generate_study_schedule`. The in-page HUD pulses to indicate live data access.

#### 2. Rubric Analysis & Draft Evaluation
> *"Can you fetch the grading rubric for CS 101 Assignment 2 (Ethics of Autonomous Agents) and evaluate my draft essay against each criterion?"*
- **What happens**: The agent executes `get_assignment_details` to retrieve the multi-tier rubric (Ethical Frameworks, Technical Depth, Governance, Clarity), executes `evaluate_draft_against_rubric`, and the web page dynamically highlights the evaluated performance levels in real time!

#### 3. Course Materials & Formula Retrieval
> *"What are the key formulas and readings for Heuristic Search in CS 101?"*
- **What happens**: The agent calls `get_course_materials` and returns the A* evaluation formula and chapter citations.

#### 4. Instructor Grading Assistant (Faculty View)
> *(Switch persona to Dr. Evelyn Vance)*  
> *"Give me a summary of submissions for CS 101, and draft a rubric-aligned feedback review for student Alex Rivera."*
- **What happens**: The agent invokes `get_course_submissions_summary` and `generate_rubric_feedback_draft`.

---

## 🛠️ Complete WebMCP Tool Surface

The platform registers role-specific tools into `document.modelContext`:

### 📚 Student Tools
- `get_enrolled_courses()`: Returns enrolled courses, instructor info, and course progress.
- `get_upcoming_deadlines(days_ahead?: number)`: Chronological list of impending assignments, labs, quizzes, and submission statuses.
- `get_assignment_details(assignment_id: number)`: Complete prompt instructions, due dates, submission status, and structured multi-level rubrics.
- `evaluate_draft_against_rubric(assignment_id: number, draft_text: string)`: Evaluates draft text against official rubric criteria, returning criteria-by-criteria scores, strengths, and actionable revision suggestions.
- `get_course_materials(course_id: number, topic?: string)`: Retrieves lecture summaries, formula sheets, and required reading citations.
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
│  │  • get_course_materials                                               │  │
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

## 📦 Delivery Models

### 1. Moodle Local Plugin (`local_webmcp`)
For institutional Moodle / OpenLMS servers, install the native plugin in `moodle-plugin/local/webmcp`:
```bash
cp -r moodle-plugin/local/webmcp /var/www/html/moodle/local/webmcp
```
Enables WebMCP across all courses for enrolled students and instructors.

### 2. 1-Click UserScript (`moodle-webmcp.user.js`)
For students whose universities have locked-down IT permissions, install the Tampermonkey / Violentmonkey user-script located in [`userscript/moodle-webmcp.user.js`](./userscript/moodle-webmcp.user.js) to inject WebMCP into any university Moodle portal directly from the client.

---

## 💻 Local Development

### Run Web Companion
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000` in your browser.

### Run Local Moodle Stack via Docker
```bash
docker compose up -d
```
Open `http://localhost:8080` and log in with `admin` / `MoodleWebMCP2026!`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

