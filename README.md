# Moodle WebMCP 🎓🤖

> **The Open WebMCP Standard for Moodle & OpenLMS**  
> Bringing in-browser agent tool calling (`document.modelContext.registerTool`) to the world's most widely adopted open-source Learning Management System.  
> Built for **The WebMCP Challenge** by OpenAI & Devpost.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![WebMCP Standard](https://img.shields.io/badge/WebMCP-W3C%20Draft-indigo.svg)](https://webmachinelearning.github.io/webmcp/)
[![Moodle Version](https://img.shields.io/badge/Moodle-4.x%20%2F%205.x-orange.svg)](https://moodle.org/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7.svg)](https://render.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

---

## 🌟 The Vision: Agent-Native Learning Management

Learning Management Systems (LMS) such as Moodle and OpenLMS house the core academic records for over 300 million students worldwide—course announcements, weekly syllabi, assignment rubrics, and discussion boards. However, accessing and cross-referencing this information is fragmented and click-heavy.

Existing AI integrations for Moodle<sup>1</sup> rely on traditional backend Model Context Protocol (MCP) daemons that require either **Site Administrator privileges** to install server-side plugins or **manual user API token generation** (which university IT typically locks down for students).

**Moodle WebMCP** reimagines this architecture by bringing the open **WebMCP** standard directly into the browser DOM:

1. **In-Browser Imperative WebMCP**: Implements `document.modelContext.registerTool` directly inside active Moodle web pages with dynamic JavaScript execution closures.
2. **Zero-Token Authentication**: Automatically inherits the student's existing authenticated web session and CSRF `sesskey`. Works with university SSO, Google Workspace, and Microsoft Active Directory out of the box with zero token generation friction.
3. **True Agent Co-Browsing**: AI agents in **ChatGPT's in-app browser** and **Google Chrome 146+** can query deadlines, retrieve complex multi-criteria rubrics, evaluate essay drafts against grading criteria, and summarize lecture materials directly on the page.

---

## 📦 Two Core Deliverables: Two Paths, One Open Standard

To solve the dual challenges of **institutional adoption** and **everyday student access**, Moodle WebMCP provides two complementary delivery mechanisms:

```
                      ┌────────────────────────────────────────┐
                      │          W3C WebMCP Standard           │
                      │  (document.modelContext.registerTool)  │
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │   Deliverable 1 (Admin)│                      │  Deliverable 2 (Student)│
     │   Native Moodle Plugin │                      │    1-Click UserScript  │
     │     `local_webmcp`     │                      │ `moodle-webmcp.user.js`│
     └────────────┬───────────┘                      └────────────┬───────────┘
                  │                                               │
     • Installed by University IT                    • Installed in 15 seconds by Student
     • System-wide institutional deployment          • Works on ANY locked-down LMS portal
     • Native PHP hooks & AMD modules                • Safe client-side (@grant none)
```

| Dimension | 🏛️ Deliverable 1: Native Moodle Plugin (`local_webmcp`) | ⚡ Deliverable 2: 1-Click UserScript (`moodle-webmcp.user.js`) |
|---|---|---|
| **Primary Audience** | LMS Administrators, University IT, and Faculty | Everyday Students & Researchers on locked-down LMS portals |
| **Use Case** | Institutional, system-wide agent enablement | Proof-of-Ease / Universal Proof-of-Concept |
| **Installation Method** | Server-side directory copy into `local/webmcp` | 1-Click install via [Tampermonkey](https://www.tampermonkey.net/) or Violentmonkey |
| **Permissions Required** | Moodle Site Administrator | **Zero permissions** (Client-side DOM execution) |
| **LMS Portals Supported** | Self-hosted Moodle 4.x / 5.x & OpenLMS instances | **Any** Moodle, OpenLMS, or university portal worldwide |
| **Security Boundary** | Role-aware server lifecycle (`local_webmcp_extend_navigation`) | Isolated client sandbox with strict `@grant none` policy |
| **Authentication Flow** | Automatic session & CSRF `sesskey` inheritance | Automatic session & CSRF `sesskey` inheritance |
| **WebMCP Interface** | `document.modelContext.registerTool` (Identical API contract) | `document.modelContext.registerTool` (Identical API contract) |

### 1. The Native Moodle Plugin (`moodle-plugin/local/webmcp`)
Built for university IT departments and self-hosted educators who want to offer agent-native capabilities to their entire student body. It hooks directly into Moodle's navigation lifecycle, automatically compiles AMD JavaScript modules, and dynamically mounts student tools for learners and administrative tools for instructors.

### 2. The 1-Click UserScript (`userscript/moodle-webmcp.user.js`)
Built as a **proof of ease and universal proof of concept**. In the real world, students cannot wait months for university IT review boards to approve new server plugins. The UserScript proves that any student can bring WebMCP to their existing institutional portal in under 15 seconds using safe, client-side DOM injection with zero token configuration.

---

## 🚀 Live Demo & Evaluation Deployment

| Resource | URL | Description | Test Credentials |
|---|---|---|---|
| **Live Moodle Server** | [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me)<br>*(or [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com))* | Real Moodle 5.2.2 LMS deployed on Render with `local_webmcp` baked in + persistent SQLite database. | **Instructor**:<br>User: `teacher1` / Pass: `MoodleTeacher2026!`<br><br>**Student**:<br>User: `student1` / Pass: `MoodleStudent2026!` |
| **GitHub Repository** | [https://github.com/dquikbrwnfox/moodle-webmcp](https://github.com/dquikbrwnfox/moodle-webmcp) | Complete open-source repository (MIT Licensed). | Public Access |

---

## 🧭 Judge & Evaluator Testing Guide

To test **Moodle WebMCP** in an AI browser:

### Step 1: Open Moodle in your AI Browser
- Open **ChatGPT Desktop** (or **Google Chrome 146+** with `chrome://flags/#enable-webmcp-testing` enabled).
- In the in-app browser, navigate to [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) (or [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com)).
- Log in as Student (`student1` / `MoodleStudent2026!`) or Teacher (`teacher1` / `MoodleTeacher2026!`).

### Step 2: Test These Example Prompts in Chat

#### 1. Deadlines & Schedule Planning
> *"What assignments do I have coming up across all my courses this week, and when are they due?"*
- **What happens**: The agent executes `get_upcoming_deadlines` and retrieves the active deadlines for *CS 101* and *AI 202*.

#### 2. Rubric Analysis & Draft Evaluation
> *"Can you fetch the grading rubric for CS 101 Assignment 1 (Evaluating Autonomous Agent Boundaries) and evaluate my draft essay against each criterion?"*
- **What happens**: The agent executes `get_assignment_details` to retrieve the multi-tier rubric (Ethical Frameworks, Technical Depth, Governance, Citations) and executes `evaluate_draft_against_rubric` to provide itemized scores and suggestions.

#### 3. Adaptive Milestone Study Planning
> *"I have 2 hours a day to study. Can you generate an adaptive study schedule for my upcoming CS 101 assignment?"*
- **What happens**: The agent calls `generate_study_schedule` and returns a day-by-day milestone roadmap (literature review, architecture draft, governance synthesis, and rubric audit).

#### 4. Course Materials & Formula Retrieval
> *"What are the key concepts and required readings for WebMCP Standards in CS 101?"*
- **What happens**: The agent calls `get_course_materials` and returns the W3C WebML draft standards and key architecture concepts.

#### 5. Instructor Grading Assistant (Faculty View)
> *(Log in as `teacher1` / Dr. Jane Doe)*  
> *"Give me a summary of submissions for CS 101, and draft a rubric-aligned feedback review for student John Doe."*
- **What happens**: The agent invokes `get_course_submissions_summary` and `generate_rubric_feedback_draft`.

---

## 🛠️ Complete WebMCP Tool Surface

The platform registers role-specific tools into `document.modelContext`:

### 📚 Student Tools

| Tool | Parameters | Description |
|---|---|---|
| `get_enrolled_courses()` | None | Returns enrolled courses, instructor info, and course progress. |
| `get_upcoming_deadlines()` | `days_ahead?: number` | Chronological list of impending assignments, labs, quizzes, and submission statuses. |
| `get_assignment_details()` | `assignment_id: number` | Complete prompt instructions, due dates, submission status, and structured multi-level rubrics. |
| `evaluate_draft_against_rubric()` | `assignment_id: number, draft_text: string` | Evaluates draft text against official rubric criteria, returning criteria-by-criteria scores, strengths, and actionable revision suggestions. |
| `get_course_materials()` | `course_id: number, topic?: string` | Retrieves lecture summaries, formula sheets, and required reading citations. |
| `generate_study_schedule()` | `course_id: number, daily_available_hours: number` | Computes an adaptive day-by-day milestone roadmap leading up to assignment deadlines. |

### 👩‍🏫 Instructor Tools

| Tool | Parameters | Description |
|---|---|---|
| `get_course_submissions_summary()` | `course_id: number` | Enrolled student count, submitted count, graded count, and grading completion percentage. |
| `generate_rubric_feedback_draft()` | `submission_id: number` | Generates criteria-aligned feedback comments ready for teacher review. |

---

## 💻 Local Deployment with Docker

To run the complete Moodle 5.2.2 + WebMCP stack locally:

```bash
docker compose up -d
```

Open `http://localhost:8080` and log in with `teacher1` / `MoodleTeacher2026!` or `student1` / `MoodleStudent2026!`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<sup>1</sup> Related project using classic backend MCP daemons: [https://github.com/loyaniu/moodle-mcp](https://github.com/loyaniu/moodle-mcp)
