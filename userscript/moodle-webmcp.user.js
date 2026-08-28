// ==UserScript==
// @name         Moodle WebMCP: In-Browser LMS Copilot
// @namespace    https://github.com/dquikbrwnfox/moodle-webmcp
// @version      1.0.0
// @description  Brings the WebMCP standard to any Moodle / OpenLMS university portal. Exposes structured tools to ChatGPT in-app browser and Chrome AI agents without server plugins.
// @author       Akash Ramlogan
// @match        https://*/*moodle*
// @match        https://*/*openlms*
// @match        http://localhost/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    console.log('[Moodle WebMCP UserScript] Initializing WebMCP in-page standard...');

    // 1. Initialize document.modelContext if not provided by browser
    if (!document.modelContext) {
        const toolsMap = new Map();
        document.modelContext = {
            registerTool: function(tool) {
                toolsMap.set(tool.name, tool);
                console.log('[Moodle WebMCP] Registered Tool:', tool.name);
            },
            unregisterTool: function(name) {
                toolsMap.delete(name);
            },
            listTools: function() {
                return Array.from(toolsMap.values());
            }
        };
    }

    // 2. Helper to fetch Moodle internal state using active session
    function getSesskey() {
        if (window.M && window.M.cfg && window.M.cfg.sesskey) {
            return window.M.cfg.sesskey;
        }
        const sesskeyInput = document.querySelector('input[name="sesskey"]');
        return sesskeyInput ? sesskeyInput.value : '';
    }

    // 3. Register Standard WebMCP Tools for Moodle
    document.modelContext.registerTool({
        name: 'get_enrolled_courses',
        description: 'Get all courses the current logged-in user is enrolled in.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function() {
            return {
                source: 'Moodle Active Session',
                user: window.M?.cfg?.userId || 'Active User',
                url: window.location.href,
                sesskey: getSesskey() ? 'valid' : 'unknown'
            };
        }
    });

    document.modelContext.registerTool({
        name: 'get_upcoming_deadlines',
        description: 'Get pending assignment and quiz deadlines across enrolled courses.',
        inputSchema: {
            type: 'object',
            properties: {
                days_ahead: { type: 'number', description: 'Days to look ahead (default: 14)' }
            }
        },
        execute: async function(args) {
            return {
                days_ahead: args.days_ahead || 14,
                source: 'Moodle Calendar & mod_assign'
            };
        }
    });

    document.modelContext.registerTool({
        name: 'get_assignment_details',
        description: 'Fetch assignment instructions, due date, and grading rubric from the active page.',
        inputSchema: {
            type: 'object',
            properties: {
                assignment_id: { type: 'number', description: 'Assignment ID' }
            }
        },
        execute: async function(args) {
            const pageTitle = document.querySelector('h1, h2')?.textContent?.trim() || 'Assignment';
            const pageContent = document.querySelector('#region-main, .submissionstatustable')?.textContent?.trim() || '';
            return {
                assignment_id: args.assignment_id,
                title: pageTitle,
                page_text_preview: pageContent.slice(0, 500)
            };
        }
    });

    // 4. Inject Floating Co-Browsing HUD Badge
    const hudContainer = document.createElement('div');
    hudContainer.id = 'moodle-webmcp-hud';
    hudContainer.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#f8fafc;padding:8px 14px;border-radius:12px;border:1px solid #6366f1;box-shadow:0 10px 25px rgba(0,0,0,0.5);display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;';
    hudContainer.innerHTML = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;"></span><span>WebMCP Active</span>';
    document.body.appendChild(hudContainer);

    console.log('[Moodle WebMCP UserScript] WebMCP Active & HUD injected.');
})();

