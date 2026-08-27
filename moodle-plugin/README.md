# OpenLMS WebMCP Moodle Local Plugin (`local_webmcp`)

A lightweight Moodle local plugin that integrates the **WebMCP standard** (`document.modelContext.registerTool`) directly into Moodle 4.x / 5.x and OpenLMS page headers.

## Features
- **In-Browser WebMCP Registration**: Exposes student and instructor tools to ChatGPT's in-app browser and WebMCP-enabled Chrome instances automatically.
- **Zero-Token Friction**: Runs inside the student's active web session; no manual API token generation required.
- **Role-Aware Security**: Dynamically mounts student tools for learners and administrative tools for instructors.

## Installation
1. Copy the `moodle-plugin/local/webmcp` directory into your Moodle installation's `local/webmcp` folder:
   ```bash
   cp -r moodle-plugin/local/webmcp /var/www/html/moodle/local/webmcp
   ```
2. Navigate to **Site Administration > Notifications** to complete the database upgrade.
3. Verify that the plugin is active under **Site Administration > Plugins > Local plugins > OpenLMS WebMCP Integration**.

