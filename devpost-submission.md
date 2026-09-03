# Moodle WebMCP

## One-line Summary
A WebMCP runtime enablement plugin for Moodle LMS that turns passive course pages into intelligent, collaborative workspaces where students, teachers, and browser-based AI agents co-browse, evaluate assignment drafts against grading rubrics, plan study milestones, and track deadlines with zero token setup.

## Inspiration

In my time at university, which used an OpenLMS deployment based on Moodle, course content was often scattered and hard to dig through.

When OpenAI announced The WebMCP Challenge, the lightbulb went off. WebMCP moves tool execution right into the browser. So instead of fighting IT firewalls or using API keys, tools run inside the student's active browser session. I wanted to build a real WebMCP enablement plugin that turns standard Moodle course pages into active, agentic workspaces for both students and instructors, requiring no additional setup from them.

## What it does

moodle-webmcp is a Moodle plugin that enables a number of useful WebMCP tools primarily for students, with some extra tools useful for course admins.

When you open course pages in ChatGPT's in-app browser or Chrome 146+, the plugin automatically declares structured AI tools directly on the web page to:

- Retrieve upcoming assignments and labs in chronological order
- Fetch relevant lecture summaries and course materials
- Generate an adaptive day-by-day study schedule based on available daily hours
- Critique a student's draft essay based on the assignment's official grading rubrics

## How we built it

- **Moodle Plugin Core**: Developed `local_webmcp` in PHP, integrating with Moodle's navigation hooks and AMD loader.
- **Deployment**: Packaged Alpine Linux with PHP 8.3, Moodle 5.2.2, and SQLite3 on Render with persistent disk storage and a custom domain (`moodle-webmcp.akashgpt.me`).
- **Development Tooling**: Built and debugged the full stack with Codex and Chrome DevTools MCP.

## Challenges we ran into

Minimal issues overall. The main hurdles involved working through Moodle-specific quirks and container setup, such as aligning with Moodle 5.x's public document root structure and ensuring database gradebook items were properly registered for assignment activities.

## Accomplishments that we're proud of

- **True Zero-Token Authentication**: No API keys required. Tools inherit the student's existing authenticated web session and CSRF tokens automatically.
- **Real, Live Moodle Environment**: Built and deployed a full Moodle 5.2.2 LMS with seeded courses and working student/teacher roles rather than a static mockup.
- **Practical Student Utility**: Tools like adaptive study scheduling and rubric draft critique solve real, everyday student problems.

## What we learned

- **WebMCP vs. MCP**: For web applications, in-browser execution is fundamentally more secure and accessible than backend daemons for everyday users.
- **Defense-in-Depth in the Browser**: Constraining tool inputs with strict JSON schemas and enforcing read-only boundaries protects against indirect prompt injection from untrusted course forums or scraped HTML.
- **Moodle Plugin Internals**: Deepened our understanding of Moodle's local plugin architecture, AMD modules, and database hooks.

## What's next for moodle-webmcp

Expanding the number and types of tools available and integrating deeper with Moodle, including:

- **Two-Way Action Tools with Confirmation Gates**: Adding safe, human-confirmed write capabilities like `save_assignment_draft` and `post_forum_reply`.
- **Discussion Board & Workshop Integration**: Extending WebMCP tools to summarize peer reviews and handle complex forum threads.
- **Official Moodle Plugins Directory Release**: Packaging `local_webmcp` for official submission to the Moodle Plugins Directory so LMS administrators worldwide can install it in one click.

## Testing Instructions

1. Open the live deployment in **ChatGPT's in-app browser** (or **Google Chrome 146+** with `chrome://flags/#enable-webmcp-testing` enabled):
   - **Primary Live URL**: [https://moodle-webmcp.akashgpt.me](https://moodle-webmcp.akashgpt.me)
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

