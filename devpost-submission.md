# Moodle WebMCP

## One-line Summary
A WebMCP runtime enablement plugin for Moodle LMS that turns passive course pages into intelligent, collaborative workspaces where students, teachers, and browser-based AI agents co-browse, evaluate assignment drafts against grading rubrics, plan study milestones, and track deadlines with zero token setup.

## Inspiration
In my time at university, which used an OpenLMS deployment based on Moodle, course content was often scattered and painful to dig through. Syllabi, lecture notes, deadlines, and multi-tier grading rubrics were buried deep under layers of menus. 

When Model Context Protocol (MCP) started taking off, the existing integrations for Moodle all had the same fatal flaw: they required either central university IT administrators to install server-side background daemons, or students to manually generate and manage personal API tokens. In the real world, university IT departments lock those permissions down tight.

When OpenAI announced The WebMCP Challenge, the lightbulb went off. WebMCP moves tool execution right into the browser via `document.modelContext.registerTool`. Instead of fighting IT firewalls or passing around raw API tokens, tools run inside the student's active browser session. I wanted to build a real WebMCP enablement plugin that turns standard Moodle course pages into active, agentic workspaces for both students and instructors.

## What it does
**moodle-webmcp** is a lightweight Moodle local plugin (`local_webmcp`) that equips Moodle 4.x / 5.x and OpenLMS with an in-browser WebMCP runtime. 

When you open course pages in ChatGPT's in-app browser or Chrome 146+, the plugin automatically declares structured AI tools directly on the web page:
- **`get_upcoming_deadlines`**: Aggregates pending assignments, quizzes, and labs across enrolled courses in chronological order.
- **`get_course_materials`**: Extracts structured syllabus outlines, key concepts, and required reading citations without messy HTML scraping.
- **`generate_study_schedule`**: Computes an adaptive day-by-day study roadmap based on upcoming deadlines and the student's daily hour constraints.
- **`evaluate_draft_against_rubric`**: An interactive grading coach that reads the active assignment prompt and official rubric criteria, evaluating an unsubmitted draft essay and giving criteria-by-criteria scores (Ethical frameworks, Technical depth, Governance, Citations) before submission.
- **Instructor Tools**: Provides administrative summaries (`get_course_submissions_summary`) and rubric feedback drafting (`generate_rubric_feedback_draft`) to help teachers manage grading queues.
- **Bonus 1-Click UserScript**: A client-side Tampermonkey script (`moodle-webmcp.user.js`) that injects the identical WebMCP tool contract into third-party, locked-down university Moodle portals with zero server access needed.

## How we built it
- **Moodle Plugin Core**: Developed `local_webmcp` in PHP, hooking into Moodle's `local_webmcp_extend_navigation` lifecycle and compiling minified RequireJS AMD modules (`amd/build/webmcp_init.min.js`) alongside synchronous DOM bootstrapping.
- **Client Execution**: Implemented imperative tool handlers (`document.modelContext.registerTool`) with strict JSON input schemas, combining live DOM inspection on active assignment pages with structured LMS session fallback.
- **Containerized Deployment**: Packaged Alpine Linux with PHP 8.3, Moodle 5.2.2, and SQLite3 on Render with persistent disk storage and custom domain TLS routing (`moodle-webmcp.akashgpt.me`).
- **Development Tooling**: Built and debugged the full stack with Codex, Chrome DevTools MCP, and automated testing in ChatGPT's integrated desktop browser.

## Challenges we ran into
1. **Moodle 5.x Document Root Shift**: Alpine Moodle 5.x serves web traffic out of `/var/www/html/public/` rather than the traditional `/var/www/html/`. Initially, our plugin was staged in the root, causing Moodle to silently bypass discovery until we adjusted our container deployment paths.
2. **Gradebook Class Sync**: When programmatically creating assignment modules in Moodle, the assignment controller threw an unhandled exception (`Cannot load the grade item`) because Moodle expects corresponding gradebook records. We resolved this by integrating `assign_grade_item_update()` into our initialization routines.
3. **Agent Inspection Timing**: AI browsers inspect `document.modelContext` synchronously when opening pages. Relying strictly on asynchronous AMD module resolution caused discovery race conditions, which we solved by pairing AMD loading with immediate synchronous inline DOM bootstrapping.

## Accomplishments that we're proud of
- **True Zero-Token Authentication**: No API keys, no configuration files, and no IT permissions needed. Tools inherit the student's existing authenticated cookie session and CSRF `sesskey` out of the box, working seamlessly with university SSO and Active Directory.
- **Beyond Simple Retrieval**: The draft rubric evaluation tool proves that in-browser WebMCP isn't just for reading text—it acts as an active, private grading coach that understands multi-tier academic rubrics.
- **Universal Accessibility**: Delivering both a production-ready server plugin for institutions and a 1-click UserScript for everyday students who can't wait for IT approval.
- **Real, Live Moodle Environment**: Built and deployed a full Moodle 5.2.2 LMS with seeded courses and working student/teacher roles rather than an artificial mockup.

## What we learned
- **WebMCP vs. Backend MCP**: For web applications, in-browser execution is fundamentally more secure and accessible than backend daemons for everyday users. Operating in the client DOM eliminates credential exposure and brings immediate visual awareness of the active tab.
- **Defense-in-Depth in the Browser**: Constraining tool inputs with strict JSON schemas and enforcing read-only boundaries protects against indirect prompt injection from untrusted course forums or scraped HTML.
- **Moodle Plugin Internals**: Deepened our understanding of Moodle's local plugin architecture, AMD module lifecycle, and database gradebook hooks.

## What's next for moodle-webmcp
- **Two-Way Action Tools with Confirmation Gates**: Adding safe, human-confirmed write capabilities like `save_assignment_draft` and `post_forum_reply`.
- **Discussion Board & Workshop Integration**: Extending WebMCP tools to summarize peer review workshops and search complex forum threads.
- **Official Moodle Plugins Directory Release**: Packaging `local_webmcp` for official submission to the Moodle Plugins Directory so university administrators worldwide can install it in one click.

## Testing Instructions
1. Open the live deployment in **ChatGPT's in-app browser** (or **Google Chrome 146+** with `chrome://flags/#enable-webmcp-testing` enabled):
   - **Primary Live URL**: [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me) (or [https://moodle-webmcp.onrender.com](https://moodle-webmcp.onrender.com))
2. Log in with the demo credentials:
   - **Student Login**: `student1` / `MoodleStudent2026!`
   - **Teacher / Faculty Login**: `teacher1` / `MoodleTeacher2026!`
3. Prompt ChatGPT:
   - *"What assignments are due across my courses, and can you check if my draft for the CS101 Ethics Essay satisfies the grading rubric?"*
   - *"I have 2 hours a day to study. Can you generate an adaptive study schedule for my upcoming CS 101 assignment?"*
4. Observe the agent call `get_upcoming_deadlines`, pull the rubric via `get_assignment_details`, execute `evaluate_draft_against_rubric`, and generate study milestones via `generate_study_schedule`.

## Public Demo Link
- Live Moodle LMS: [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me)

## Public Repository Link
- GitHub Repository: [https://github.com/dquikbrwnfox/moodle-webmcp](https://github.com/dquikbrwnfox/moodle-webmcp) (MIT Licensed)

## Demo Video
- YouTube Video: [INSERT YOUTUBE URL HERE]

