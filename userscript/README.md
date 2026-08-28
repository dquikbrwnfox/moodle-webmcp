# Moodle WebMCP UserScript (`moodle-webmcp.user.js`)

Use WebMCP on **any** institutional Moodle / OpenLMS site directly in your browser without requiring university IT administrator permissions!

## How It Works
- Runs in your browser via [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
- Automatically executes when you open your university's Moodle portal.
- Injects `document.modelContext.registerTool` into the page, allowing **ChatGPT's in-app browser** and **Chrome 149+** to co-browse with you inside your active session.

## Installation (1-Click)
1. Install the Tampermonkey or Violentmonkey extension in your browser.
2. Click to install [`moodle-webmcp.user.js`](./moodle-webmcp.user.js).
3. Navigate to your university's Moodle portal—the floating **WebMCP Active** badge will appear in the bottom-right corner!

