# Technical Specification: OpenLMS WebMCP

## Overview
**OpenLMS WebMCP** is an in-browser agent-native academic companion for Moodle and OpenLMS. It registers structured tools directly into the browser's model context via the emerging WebMCP standard (`document.modelContext.registerTool`), enabling browser AI agents (ChatGPT in-app browser, Chrome 149+) to co-browse with students and instructors inside active web sessions without external token configuration or IT admin installation.

---

## Stack

- **Frontend Runtime & UI**: React 19, TypeScript (strict mode), Vite 6, Tailwind CSS v4, Lucide React icons.
- **WebMCP Standard Implementation**: Native `document.modelContext.registerTool` with dynamic role-based lifecycle management and fallback polyfill detection.
- **State Management & Events**: Lightweight custom store (`useLmsStore`) + EventEmitter for real-time In-Page Activity HUD notifications.
- **Edge Deployment & Proxy**: Cloudflare Pages / Workers (`wrangler.jsonc`) for global hosting and CORS-free Moodle API proxying.
- **Moodle PHP Plugin Packaging**: Moodle Local Plugin architecture (`local_webmcp`) with AMD module loading for native Moodle 4.x/5.x compatibility.
- **Security & Access**: Cloudflare Access integration for test instance protection with 1-click bypass/test access for judges.

---

## Architecture

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
│  │                         LMS Client Bridge                             │  │
│  │  (Session Management + Rubric Engine + In-Memory / REST Provider)     │  │
│  └───────────────────┬───────────────────────────────────────┬───────────┘  │
│                      │                                       │              │
│                      ▼ (Event Bus)                           ▼ (HTTP/AJAX)  │
│  ┌───────────────────────────────────────┐   ┌───────────────────────────┐  │
│  │       In-Page Activity HUD            │   │ Real Moodle or Pre-Seeded │  │
│  │   (Live Visual Co-Browsing Badge)     │   │ Demo Sandbox (Apex Univ)  │  │
│  └───────────────────────────────────────┘   └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ Deployed on
┌─────────────────────────────────────────────────────────────────────────────┐
│            Cloudflare Pages / Workers (with Cloudflare Access)              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```text
Z:\webmcp\
├── docs\
│   └── hackathon-build\
│       ├── learner-profile.md
│       ├── scope.md
│       ├── prd.md
│       ├── spec.md
│       ├── checklist.md
│       └── build-notes.md
├── src\
│   ├── app\
│   │   ├── App.tsx                # Main portal view + persona routing
│   │   ├── main.tsx               # Application entrypoint
│   │   └── index.css              # Tailwind CSS styling
│   ├── components\
│   │   ├── Navbar.tsx             # Global navigation + role indicator
│   │   ├── PersonaSwitcher.tsx    # 1-click switch (Alex: Student / Dr. Vance: Instructor)
│   │   ├── CourseGrid.tsx         # Active course dashboard cards
│   │   ├── CourseDetailView.tsx   # Course modules, syllabus, assignments
│   │   ├── AssignmentModal.tsx    # Assignment prompt & interactive rubric view
│   │   ├── RubricTable.tsx        # Multi-level grading criteria table
│   │   ├── ActivityHUD.tsx        # Floating live co-browsing activity indicator
│   │   └── ForumView.tsx          # Discussion forum + in-page draft area
│   ├── lib\
│   │   ├── webmcp\
│   │   │   ├── registry.ts        # document.modelContext.registerTool registration engine
│   │   │   ├── tools\
│   │   │   │   ├── studentTools.ts    # Student tool definitions & schemas
│   │   │   │   └── instructorTools.ts # Instructor tool definitions & schemas
│   │   │   ├── types.ts           # WebMCP tool input/output types
│   │   │   └── eventBus.ts        # PubSub bus dispatching HUD notifications
│   │   ├── lms\
│   │   │   ├── mockData.ts        # Pre-seeded Apex University data (CS101, BIO200, HIST110)
│   │   │   ├── lmsClient.ts       # Unified LMS data provider (Mock vs Live Moodle API)
│   │   │   └── rubricEvaluator.ts # Client-side rubric alignment & scoring engine
│   │   └── store\
│   │       └── useLmsStore.ts     # Zustand/React state for active user, courses, submissions
│   └── types\
│       └── lms.ts                 # Course, Assignment, Rubric, Submission, Persona models
├── moodle-plugin\
│   └── local\
│       └── webmcp\
│           ├── db\
│           │   └── access.php     # Moodle capabilities definition
│           ├── lang\
│           │   └── en\
│           │       └── local_webmcp.php # English language strings
│           ├── amd\
│           │   └── src\
│           │       └── webmcp_init.js   # AMD script injecting WebMCP into Moodle pages
│           ├── version.php        # Moodle plugin version & dependencies
│           ├── lib.php            # Hook for injecting header/footer scripts
│           └── settings.php       # Plugin admin configuration
├── public\
│   └── favicon.svg
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc
```

---

## Components And Responsibilities

### 1. WebMCP Registry (`src/lib/webmcp/registry.ts`)
- **Implements**: `prd.md > Epic 1 (In-Browser WebMCP Tool Discovery & Lifecycle)`
- **Responsibilities**:
  - Detects `window.modelContext` or `document.modelContext`.
  - Registers tool definitions using standard `registerTool({ name, description, inputSchema, execute })`.
  - Dynamically switches registered tools when user toggles persona (Student vs Instructor).
  - Emits telemetry events to `eventBus` upon tool execution start and finish.

### 2. Student Tools Suite (`src/lib/webmcp/tools/studentTools.ts`)
- **Implements**: `prd.md > Epic 2 (Student Academic Intelligence & Rubric Evaluation)`
- **Tool Definitions**:
  1. `get_enrolled_courses`: Returns array of active courses, codes, instructors, and completion percentages.
  2. `get_upcoming_deadlines`: Takes `days_ahead` (default 14), returns sorted list of impending assignments, point weights, and submission status.
  3. `get_assignment_details`: Takes `assignment_id`, returns prompt text, attachments, deadlines, and structured rubric matrix (criteria, points, level descriptions).
  4. `evaluate_draft_against_rubric`: Takes `assignment_id` and `draft_text`, parses text against all rubric dimensions, returns itemized score estimates, matched strengths, and constructive revision steps.
  5. `generate_study_schedule`: Takes optional `assignment_ids` and `daily_hours`, calculates realistic study blocks avoiding deadline crunches.
  6. `draft_forum_post`: Takes `course_id`, `forum_id`, `topic`, `draft_content`, populates the on-screen forum composer for student review.

### 3. Instructor Tools Suite (`src/lib/webmcp/tools/instructorTools.ts`)
- **Implements**: `prd.md > Epic 3 (Instructor Course Management & Grading Support)`
- **Tool Definitions**:
  1. `get_course_submissions_summary`: Takes `course_id`, returns enrolled count, submitted count, graded count, and grading completion percentage.
  2. `generate_rubric_feedback_draft`: Takes `submission_id`, returns a criteria-by-criteria grading sheet with targeted feedback comments ready for teacher review.
  3. `draft_course_announcement`: Takes `course_id`, `title`, `content`, stages an announcement banner in the LMS view.

### 4. In-Page Activity HUD (`src/components/ActivityHUD.tsx`)
- **Implements**: `prd.md > Epic 4 (Visual Co-Browsing Activity HUD)`
- **Responsibilities**:
  - Renders a floating indicator in the bottom-right viewport.
  - Displays real-time tool execution pulses (e.g. `⚡ WebMCP Tool Called: evaluate_draft_against_rubric`).
  - Allows expanding the activity log to inspect the structured arguments and returned JSON.

### 5. Mock LMS Sandbox & Data Store (`src/lib/lms/mockData.ts` & `useLmsStore.ts`)
- **Implements**: `prd.md > Epic 5 (Zero-Friction Demo Sandbox)`
- **Responsibilities**:
  - Pre-loads rich, realistic data for "Apex University":
    - **CS101 (Intro to AI)**: Assignment 1 (Neural Net Exploration), Assignment 2 (Ethics of LLMs) with 4-tier rubrics.
    - **BIO200 (Molecular Genetics)**: Lab 1 (CRISPR Gene Editing Protocol), Lab 2 (Protein Folding Analysis).
    - **HIST110 (Modern World History)**: Essay 1 (Industrial Revolution Socioeconomic Impacts).
  - Maintains state for student submissions, drafts, and announcements.

### 6. Moodle Local Plugin (`moodle-plugin/local/webmcp/`)
- **Implements**: Production Moodle installable package.
- **Responsibilities**:
  - Registers Moodle hooks in `lib.php` (`local_webmcp_before_footer`).
  - Enqueues AMD JavaScript module (`webmcp_init.js`) on all student-facing course and assignment views.
  - Queries active user role from Moodle's global `$USER` context and registers the matching WebMCP tools.

---

## Data Flow: WebMCP Rubric Evaluation Workflow

1. **User asks agent**: *"Can you review my draft for the CS101 Ethics Essay against the rubric?"*
2. **Browser Agent detects tools**: Discovers `get_assignment_details` and `evaluate_draft_against_rubric` on `document.modelContext`.
3. **Agent invokes `get_assignment_details({ assignment_id: 101 })`**:
   - Registry dispatches event to `eventBus` -> **Activity HUD** displays `🔍 Reading CS101 Assignment Rubric`.
   - Returns structured rubric containing:
     - Criterion 1: Argumentative Clarity (30 pts)
     - Criterion 2: Ethical Framework Application (40 pts)
     - Criterion 3: Citation & Academic Integrity (30 pts)
4. **Agent invokes `evaluate_draft_against_rubric({ assignment_id: 101, draft_text: "..." })`**:
   - Registry dispatches event to `eventBus` -> **Activity HUD** displays `⚖️ Evaluating Draft against Rubric`.
   - Returns scored evaluation matrix, criterion-by-criterion assessment, and revision suggestions.
5. **Agent presents answer in chat**: Clear, structured feedback mapping directly to the LMS rubric visible on the screen.

---

## External APIs And Dependencies

- **WebMCP Browser Standard**: Follows official `document.modelContext.registerTool` specification.
- **Lucide Icons**: UI iconography for courses, rubrics, calendar, and activity feeds.
- **Cloudflare Access**: Secures live preview deployment while allowing seamless judge evaluation via test credentials.

---

## Risks And Verification

| Risk | Mitigation | Verification Check |
|---|---|---|
| Browser does not yet support `document.modelContext` | Graceful fallback banner detecting WebMCP API + clear setup instructions for Chrome `#enable-webmcp-testing` | Test in Chrome with flag enabled and disabled; verify fallback banner renders appropriately. |
| Large essay draft payload | WebMCP runs in-process inside browser JS; fast memory processing without network roundtrips | Test with a 3,000-word draft; verify response latency < 50ms. |
| Complex multi-level rubric serialization | Strongly-typed TypeScript interfaces ensuring clean JSON Schema serialization for agent consumption | Run schema validator against all tool definitions. |

---

## Demo And Submission Flow

1. **Deploy**: Ship web app to Cloudflare Pages with live URL.
2. **Judge Experience**:
   - Judge opens URL in ChatGPT in-app browser or Chrome 149+ with WebMCP flag.
   - Persona is pre-selected as "Alex Rivera (Student)".
   - Judge pastes sample query from submission testing notes.
   - Judge observes instant tool discovery, real-time rubric retrieval, and live visual HUD confirmation.
3. **Moodle Plugin Package**: Include `local_webmcp` zip/directory in repository with installation instructions for real Moodle administrators.

