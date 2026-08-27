# Build Checklist: OpenLMS WebMCP

## Build Preferences

- **Build mode:** Autonomous (Fast execution)
- **Comprehension checks:** No (Experienced builder)
- **Git:** Per-milestone commits
- **Verification:** Yes (End-to-end verified build with runnable dev server)
- **Check-in cadence:** Balanced

---

## Checklist

- [x] **1. Project Scaffold & Build Configuration**
  Spec ref: `spec.md > Stack` and `spec.md > File Structure`
  What to build: Initialize Vite + React 19 + TypeScript project with Tailwind CSS v4, Lucide React, and `wrangler.jsonc` configuration for Cloudflare Pages/Workers.
  Acceptance: Clean project build (`pnpm build`) with zero TypeScript errors.
  Verify: Run TypeScript typecheck and build command.

- [x] **2. LMS Data Models & Apex University Mock Data Engine**
  Spec ref: `spec.md > Components And Responsibilities > 5. Mock LMS Sandbox`
  What to build: Define TypeScript data interfaces in `src/types/lms.ts` and populate `src/lib/lms/mockData.ts` with rich courses (CS101, BIO200, HIST110), detailed multi-tier rubrics, upcoming deadlines, student submissions, and persona definitions (Alex: Student, Dr. Vance: Instructor).
  Acceptance: Complete data coverage for courses, modules, assignments, multi-criteria rubrics, and discussion topics.
  Verify: Data imports and models fully typed and verified.

- [x] **3. WebMCP Registry & Activity Event Bus**
  Spec ref: `spec.md > Components And Responsibilities > 1. WebMCP Registry`
  What to build: Implement `src/lib/webmcp/registry.ts` with standard `document.modelContext.registerTool` lifecycle management, dynamic role-based tool mounting/unmounting, fallback detection, and telemetry dispatch to `eventBus.ts`.
  Acceptance: Exposes valid WebMCP JSON Schemas on `document.modelContext`; emits start/finish events to `eventBus` upon execution.
  Verify: Tool registration and telemetry handlers verified in TypeScript strict mode.

- [x] **4. Student Tool Suite Implementation**
  Spec ref: `spec.md > Components And Responsibilities > 2. Student Tools Suite`
  What to build: Implement `src/lib/webmcp/tools/studentTools.ts` containing the 6 student tools (`get_enrolled_courses`, `get_upcoming_deadlines`, `get_assignment_details`, `evaluate_draft_against_rubric`, `generate_study_schedule`, `draft_forum_post`) with client-side rubric evaluation engine in `src/lib/lms/rubricEvaluator.ts`.
  Acceptance: All 6 tools execute correctly, return strongly-typed JSON, and evaluate draft text against rubric criteria with granular scores and suggestions.
  Verify: Typecheck and execution handlers verified.

- [x] **5. Instructor Tool Suite Implementation**
  Spec ref: `spec.md > Components And Responsibilities > 3. Instructor Tools Suite`
  What to build: Implement `src/lib/webmcp/tools/instructorTools.ts` with administrative tools (`get_course_submissions_summary`, `generate_rubric_feedback_draft`, `draft_course_announcement`).
  Acceptance: Instructor tools summarize submission stats, generate criteria-aligned feedback drafts, and stage announcements.
  Verify: TypeScript schemas and execution functions verified.

- [x] **6. In-Page UI & Floating Activity HUD**
  Spec ref: `spec.md > Components And Responsibilities > 4. In-Page Activity HUD`
  What to build: Build modern academic portal components: `Navbar.tsx`, `PersonaSwitcher.tsx`, `CourseGrid.tsx`, `CourseDetailView.tsx`, `AssignmentModal.tsx`, `RubricTable.tsx`, `WebMCPSimulatorDrawer.tsx`, and the glowing `ActivityHUD.tsx` in `src/components/`.
  Acceptance: Clean, responsive UI with interactive rubric viewer, assignment modal, live persona switcher, and real-time HUD notification badge on tool calls.
  Verify: UI components bundle and render cleanly in production build.

- [x] **7. Moodle Local Plugin Packaging (`local_webmcp`)**
  Spec ref: `spec.md > Components And Responsibilities > 6. Moodle Local Plugin`
  What to build: Package `moodle-plugin/local/webmcp/` with `version.php`, `lib.php`, `settings.php`, `lang/en/local_webmcp.php`, and AMD module `amd/src/webmcp_init.js` for self-hosted Moodle 4.x/5.x installations.
  Acceptance: Valid Moodle plugin directory structure conforming to Moodle Developer guidelines.
  Verify: Complete PHP plugin tree and AMD registration module packaged.

- [x] **8. End-to-End Build Verification & Devpost Handoff**
  Spec ref: `spec.md > Demo And Submission Flow` and `prd.md > Submission Proof Points`
  What to build: Run full production build, verify dev server, draft demo instructions, and prepare submission materials for `$prepare-submission`.
  Acceptance: Zero-error production build (`dist/` generated), working local dev configuration, and complete testing notes for hackathon judges.
  Verify: `pnpm build` completed cleanly with 0 errors.

