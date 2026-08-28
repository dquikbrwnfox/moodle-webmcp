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

Existing AI integrations for Moodle rely on traditional backend Model Context Protocol (MCP) daemons that require either **Site Administrator privileges** to install server-side plugins or **manual user API token generation** (which university IT typically locks down for students).

**Moodle WebMCP** bridges this gap using the open **WebMCP** standard:
1. **In-Browser WebMCP Execution**: Implements `document.modelContext.registerTool` directly inside active Moodle web pages.
2. **Zero-Token Authentication**: Inherits the student's existing authenticated web session and CSRF `sesskey` automatically. Works with university SSO, Google Workspace, and Microsoft Active Directory out of the box with zero token generation friction.
3. **True Agent Co-Browsing**: AI agents in **ChatGPT's in-app browser** and **Chrome 149+** can query deadlines, retrieve complex multi-criteria rubrics, evaluate essay drafts against grading criteria, and summarize lecture materials directly on the page.
4. **Dual Delivery Paths**: An official **Moodle Local Plugin (`local_webmcp`)** for LMS administrators, and a **1-Click UserScript (`moodle-webmcp.user.js`)** for everyday students whose universities have restricted IT permissions.

---

## 🚀 Live Demo & Deployments

| Resource | URL | Description | Test Credentials |
|---|---|---|---|
| **Live Moodle Server** | [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me)<br>*(or [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com))* | Real Moodle 4.5 LMS deployed on Render with `local_webmcp` baked in + persistent SQLite database. | **Admin / Instructor**:<br>User: `admin` / Pass: `MoodleWebMCP2026!`<br><br>**Student Account**:<br>User: `student1` (or `student1`) / Pass: `MoodleStudent2026!` |
| **GitHub Repository** | [https://github.com/dquikbrwnfox/moodle-webmcp](https://github.com/dquikbrwnfox/moodle-webmcp) | Complete open-source repository (MIT Licensed). | Public Access |

---

## 🧭 Judge & Evaluator Testing Guide

To test **Moodle WebMCP** in an AI browser:

### Step 1: Open Moodle in your AI Browser
- Open **ChatGPT Desktop** (or **Google Chrome 149+** with `chrome://flags/#enable-webmcp-testing` enabled).
- In the in-app browser, navigate to [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) (or [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com)).
- Log in as student (`student1` / `MoodleStudent2026!`) or admin (`admin` / `MoodleWebMCP2026!`).

### Step 2: Test These Example Prompts in Chat

#### 1. Deadlines & Schedule Planning
> *"What assignments do I have coming up across all my courses this week, and when are they due?"*
- **What happens**: The agent executes `get_upcoming_deadlines` and retrieves the active deadlines for *CS 101* and *AI 202*.

#### 2. Rubric Analysis & Draft Evaluation
> *"Can you fetch the grading rubric for CS 101 Assignment 1 (Evaluating Autonomous Agent Boundaries) and evaluate my draft essay against each criterion?"*
- **What happens**: The agent executes `get_assignment_details` to retrieve the multi-tier rubric (Ethical Frameworks, Technical Depth, Governance, Citations) and executes `evaluate_draft_against_rubric` to provide itemized scores and suggestions.

#### 3. Course Materials & Formula Retrieval
> *"What are the key concepts and required readings for WebMCP Standards in CS 101?"*
- **What happens**: The agent calls `get_course_materials` and returns the W3C WebML draft standards and key architecture concepts.

#### 4. Instructor Grading Assistant (Faculty View)
> *(Log in as `admin` / Dr. Jane Doe)*  
> *"Give me a summary of submissions for CS 101, and draft a rubric-aligned feedback review for student John Doe."*
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

### 👩‍🏫 Instructor Tools
- `get_course_submissions_summary(course_id: number)`: Enrolled student count, submitted count, graded count, and grading completion percentage.
- `generate_rubric_feedback_draft(submission_id: number)`: Generates criteria-aligned feedback comments ready for teacher review.

---

## 📦 Delivery Models

### 1. Official Moodle Local Plugin (`moodle-plugin/local/webmcp`)
For self-hosted Moodle & OpenLMS server administrators:
```bash
cp -r moodle-plugin/local/webmcp /var/www/html/local/webmcp
```
1. Navigate to **Site Administration > Notifications** to complete installation.
2. The plugin automatically injects the WebMCP AMD module into all student and instructor page layouts.

### 2. 1-Click UserScript (`userscript/moodle-webmcp.user.js`)
For everyday students whose universities do not have the server plugin installed:
1. Install [Tampermonkey](https://www.tampermonkey.net/) or Violentmonkey.
2. Click to install [`moodle-webmcp.user.js`](./userscript/moodle-webmcp.user.js).
3. The script uses safe `@grant none` client-side execution to inject `document.modelContext.registerTool` into any institutional Moodle tab automatically.

---

## 💻 Local Deployment with Docker

To run the complete Moodle 4.5 + WebMCP stack locally:
```bash
docker compose up -d
```
Open `http://localhost:8080` and log in with `admin` / `MoodleWebMCP2026!` or `student1` / `MoodleStudent2026!`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.






