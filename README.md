# Moodle WebMCP 🎓🤖

> **WebMCP Runtime Enablement Plugin for Moodle & OpenLMS**  
> Bringing in-browser agent tool calling (`document.modelContext.registerTool`) to the world's most widely adopted open-source Learning Management System.  
> _Built for **The WebMCP Challenge** by OpenAI & Devpost._

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![WebMCP Standard](https://img.shields.io/badge/WebMCP-W3C%20Draft-indigo.svg)](https://webmachinelearning.github.io/webmcp/)
[![Moodle Version](https://img.shields.io/badge/Moodle-4.x%20%2F%205.x-orange.svg)](https://moodle.org/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7.svg)](https://render.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

---

**Moodle WebMCP** is a lightweight, standard-compliant Moodle local plugin (`local_webmcp`) that equips Moodle 4.x / 5.x and OpenLMS with an in-browser **WebMCP runtime**. The plugin hooks directly into Moodle navigation system to declare structured AI tools directly on the web page (`document.modelContext.registerTool`).

When students and teachers open course pages in **ChatGPT's in-app browser** or WebMCP-enabled **Chrome 146+**, the AI assistant instantly becomes an active academic copilot that can co-browse, track upcoming assignment deadlines, pull syllabus materials, generate adaptive study schedules, and evaluate draft essays against official grading rubrics.

### Why In-Browser WebMCP Matters for Education

Existing AI integrations for Moodle<sup>1</sup> rely on traditional backend Model Context Protocol (MCP) daemons. While functional, that architecture creates immense friction in university environments:

- **Token Barrier**: Demands manual API token generation, which university IT locks down for students.
- **Firewall & Security**: Requires opening backend daemon ports or hosting separate microservices.
- **DOM Blindness**: Backend daemons have no visibility into the student's live viewport.

**Moodle WebMCP fixes this with in-browser execution:**

- **Zero Token Setup**: Tools execute inside the active web session, seamlessly using authenticated user session.
- **Role-Aware Security**: Automatically exposes student tools for learners and administrative tools for instructors.

---

## 🚀 Live Demo

| Resource               | URL                                                                    | Description                                                        | Test Credentials                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Live Moodle Server** | [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) | Moodle 5.2.2 LMS deployed on Render with `local_webmcp` installed. | **Instructor**:<br>User: `teacher1` / Pass: `MoodleTeacher2026!`<br><br>**Student**:<br>User: `student1` / Pass: `MoodleStudent2026!` |

---

## 🛠️ WebMCP Tools provided

The plugin registers 8 contextual tools onto `document.modelContext`:

### 📚 Student Tools

| Tool                              | Parameters                                         | Description                                                                                                     |
| --------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `get_enrolled_courses()`          | None                                               | Returns enrolled courses, instructor info, term, and course summaries.                                          |
| `get_upcoming_deadlines()`        | `days_ahead?: number`                              | Chronological list of impending assignments, labs, quizzes, and submission statuses.                            |
| `get_assignment_details()`        | `assignment_id: number`                            | Detailed prompt instructions, due dates, submission status, and structured 4-tier grading rubrics.              |
| `evaluate_draft_against_rubric()` | `assignment_id: number, draft_text: string`        | Evaluates draft text against official rubric criteria, returning scores, strengths, and actionable suggestions. |
| `get_course_materials()`          | `course_id: number, topic?: string`                | Retrieves lecture outlines, key concepts, and required reading citations.                                       |
| `generate_study_schedule()`       | `course_id: number, daily_available_hours: number` | Computes an adaptive day-by-day milestone roadmap leading up to assignment deadlines.                           |

### 👩‍🏫 Instructor Tools

| Tool                               | Parameters              | Description                                                                            |
| ---------------------------------- | ----------------------- | -------------------------------------------------------------------------------------- |
| `get_course_submissions_summary()` | `course_id: number`     | Enrolled student count, submitted count, pending grading count, and completion status. |
| `generate_rubric_feedback_draft()` | `submission_id: number` | Generates criteria-aligned feedback comments ready for faculty review.                 |

---

## 🧭 Walkthrough Examples

### Step 1: Open the Live LMS in your AI Browser

- Open **ChatGPT Desktop** (or **Google Chrome 146+** with `chrome://flags/#enable-webmcp-testing` enabled).
- In the in-app browser, navigate to [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me).
- Log in as Student (`student1` / `MoodleStudent2026!`) or Teacher (`teacher1` / `MoodleTeacher2026!`).

### Step 2: Try These Live Prompts in Chat

#### 1. Deadlines & Pacing

> _"What assignments do I have coming up across all my courses this week, and when are they due?"_

- The agent executes `get_upcoming_deadlines` and retrieves active deadlines across _CS 101_ and _AI 202_.

#### 2. Rubric Analysis & Draft Evaluation

> _"Can you fetch the grading rubric for CS 101 Assignment 1 and evaluate my draft essay against each criterion?"_

- The agent calls `get_assignment_details` to retrieve the multi-tier rubric (Ethical Frameworks, Technical Depth, Governance, Citations) and runs `evaluate_draft_against_rubric` to provide itemized scores and suggestions.

#### 3. Adaptive Milestone Study Planning

> _"I have 2 hours a day to study. Can you generate an adaptive study schedule for my upcoming CS 101 assignment?"_

- The agent calls `generate_study_schedule` and returns a day-by-day milestone roadmap (literature review, architecture draft, governance synthesis, and rubric audit).

#### 4. Course Materials & Formula Retrieval

> _"What are the key concepts and required readings for WebMCP Standards in CS 101?"_

- The agent calls `get_course_materials` and returns W3C WebML draft standards and key lecture takeaways.

#### 5. Faculty Grading Assistant (Instructor View)

> _Log in as `teacher1`_  
> _"Give me a summary of submissions for CS 101, and draft a rubric-aligned feedback review for student1."_

- The agent invokes `get_course_submissions_summary` and `generate_rubric_feedback_draft`.

---

## 📦 Plugin Installation (Self-Hosted Moodle)

To install the `local_webmcp` plugin on any standard Moodle or OpenLMS instance:

1. Copy the plugin directory into your Moodle installation's `local` directory:
   ```bash
   cp -r moodle-plugin/local/webmcp /var/www/html/local/webmcp
   # (For Moodle 5.x with public docroot: /var/www/html/public/local/webmcp)
   ```
2. Visit **Site Administration > Notifications** as admin to complete the automated schema/version check.
3. The plugin will immediately begin registering WebMCP tools on all page views for authenticated users.

---

## 🎁 Bonus: 1-Click UserScript Proof-of-Concept

As an extra demonstration of WebMCP's accessibility, we also built [`moodle-webmcp.user.js`](./userscript/moodle-webmcp.user.js)—a 1-click Tampermonkey script.

While the **Moodle plugin** is the primary solution for university IT and self-hosted instances, the UserScript serves as a lightweight proof-of-concept showing how easily WebMCP can be brought directly to students on locked-down third-party university portals without waiting for central IT approval. It runs client-side, injecting the identical WebMCP tool contract into any Moodle tab.

---

## 💻 Local Docker Stack

To run the complete Moodle 5.2.2 + WebMCP environment locally:

```bash
docker compose up -d
```

Open `http://localhost:8080` and log in with `teacher1` / `MoodleTeacher2026!` or `student1` / `MoodleStudent2026!`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<sup>1</sup> Related project using classic backend MCP daemons: [https://github.com/loyaniu/moodle-mcp](https://github.com/loyaniu/moodle-mcp)
