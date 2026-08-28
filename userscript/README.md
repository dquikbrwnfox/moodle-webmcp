# Moodle WebMCP UserScript (`moodle-webmcp.user.js`)

Use WebMCP on **any** institutional Moodle or OpenLMS university portal directly in your browser without requiring university IT administrator permissions!

## How It Works
- Runs client-side in your browser via [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
- Automatically executes when you open any Moodle site matching standard URL patterns.
- Uses `@grant none` security sandboxing—it cannot access external networks or exfiltrate credentials; it strictly declares `document.modelContext.registerTool` inside your active Moodle tab.
- Enables **ChatGPT's in-app browser** and **Google Chrome 149+** to co-browse, inspect syllabi, check deadlines, and evaluate assignment drafts against live course rubrics with zero token configuration.

## Installation (1-Click)
1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Click to install [`moodle-webmcp.user.js`](./moodle-webmcp.user.js).
3. If your university uses a custom domain (e.g. `https://mycourses.university.edu/*`), add it to the `@match` headers in Tampermonkey.
4. Navigate to your university Moodle portal—WebMCP tools are now active in the page!

