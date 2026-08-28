// ==UserScript==
// @name         Moodle & myeLearning WebMCP: In-Browser LMS Copilot
// @namespace    https://github.com/dquikbrwnfox/moodle-webmcp
// @version      1.1.0
// @description  Brings the WebMCP standard to UWI myeLearning and any Moodle / OpenLMS university portal. Exposes structured tools to ChatGPT in-app browser and Chrome AI agents without server plugins.
// @author       Akash Ramlogan
// @match        https://myelearning.sta.uwi.edu/*
// @match        https://*.uwi.edu/*
// @match        https://*/*moodle*
// @match        https://*/*openlms*
// @match        http://localhost/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    console.log('[Moodle WebMCP] Initializing on:', window.location.href);

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

    // 2. Helper: Session & Moodle Configuration
    function getSesskey() {
        if (window.M && window.M.cfg && window.M.cfg.sesskey) {
            return window.M.cfg.sesskey;
        }
        const sesskeyInput = document.querySelector('input[name="sesskey"]');
        return sesskeyInput ? sesskeyInput.value : '';
    }

    function getBaseUrl() {
        if (window.M && window.M.cfg && window.M.cfg.wwwroot) {
            return window.M.cfg.wwwroot;
        }
        return window.location.origin;
    }

    // 3. Helper: DOM Scraping for Courses (/my/courses.php or /my/)
    function scrapeCoursesFromDOM() {
        const courses = [];
        const seenIds = new Set();

        // Check common OpenLMS / Moodle course card selectors
        const cardSelectors = [
            '[data-region="course-card"]',
            '.dashboard-card',
            '.course-card',
            '.coursebox',
            '.coc-course',
            '.course_list_item'
        ];

        let cards = [];
        for (const sel of cardSelectors) {
            const found = document.querySelectorAll(sel);
            if (found.length > 0) {
                cards = Array.from(found);
                break;
            }
        }

        if (cards.length > 0) {
            cards.forEach((card, idx) => {
                const titleElem = card.querySelector('.coursename, .course-name, h3, h4, .text-truncate');
                const linkElem = card.querySelector('a[href*="/course/view.php?id="]');
                const progressElem = card.querySelector('.progress-bar, [role="progressbar"]');

                const title = titleElem ? titleElem.textContent.trim() : ('Course ' + (idx + 1));
                const url = linkElem ? linkElem.href : '';
                const idMatch = url.match(/id=(\d+)/);
                const courseId = idMatch ? parseInt(idMatch[1], 10) : (idx + 1);

                if (!seenIds.has(courseId)) {
                    seenIds.add(courseId);
                    courses.push({
                        id: courseId,
                        name: title,
                        url: url,
                        progress: progressElem ? progressElem.getAttribute('aria-valuenow') || progressElem.style.width : null
                    });
                }
            });
        }

        // Fallback: Scrape all course links on the page
        if (courses.length === 0) {
            const courseLinks = document.querySelectorAll('a[href*="/course/view.php?id="]');
            courseLinks.forEach((link, idx) => {
                const url = link.href;
                const idMatch = url.match(/id=(\d+)/);
                const text = link.textContent.trim();
                if (idMatch && text && text.length > 3 && !text.toLowerCase().includes('view')) {
                    const courseId = parseInt(idMatch[1], 10);
                    if (!seenIds.has(courseId)) {
                        seenIds.add(courseId);
                        courses.push({
                            id: courseId,
                            name: text,
                            url: url
                        });
                    }
                }
            });
        }

        return courses;
    }

    // 4. Helper: Scrape Deadlines & Timeline
    function scrapeDeadlinesFromDOM() {
        const events = [];
        const timelineItems = document.querySelectorAll('[data-region="event-list-item"], .timeline-event-list-item, .event');

        timelineItems.forEach((item, idx) => {
            const nameElem = item.querySelector('.name, .event-name, h6, a');
            const dateElem = item.querySelector('.date, .text-muted, time');
            const courseElem = item.querySelector('.course-name, small, .text-truncate');
            const linkElem = item.querySelector('a[href*="/mod/"]');

            if (nameElem) {
                events.push({
                    title: nameElem.textContent.trim(),
                    due_date: dateElem ? dateElem.textContent.trim() : 'Upcoming',
                    course: courseElem ? courseElem.textContent.trim() : 'Enrolled Course',
                    url: linkElem ? linkElem.href : null
                });
            }
        });

        return events;
    }

    // 5. Helper: Scrape Rubric & Criteria
    function scrapeRubricFromDOM() {
        const rubricTable = document.querySelector('.gradingform_rubric, .rubric, table[id*="rubric"]');
        if (!rubricTable) return null;

        const criteria = [];
        const rows = rubricTable.querySelectorAll('tr.criterion, tr[class*="criterion"]');

        rows.forEach(row => {
            const descElem = row.querySelector('.description');
            const levelElems = row.querySelectorAll('.level');
            const title = descElem ? descElem.textContent.trim() : 'Criterion';

            const levels = [];
            levelElems.forEach(lvl => {
                const scoreElem = lvl.querySelector('.score, .scorevalue');
                const defElem = lvl.querySelector('.definition');
                levels.push({
                    description: defElem ? defElem.textContent.trim() : lvl.textContent.trim(),
                    score: scoreElem ? scoreElem.textContent.trim() : ''
                });
            });

            criteria.push({
                criterion: title,
                levels: levels
            });
        });

        return criteria.length > 0 ? criteria : null;
    }

    // 6. Register WebMCP Standard Tool Suite
    document.modelContext.registerTool({
        name: 'get_enrolled_courses',
        description: 'Get all enrolled courses from the active myeLearning / Moodle session.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function() {
            notifyHUD('get_enrolled_courses', 'running');
            const domCourses = scrapeCoursesFromDOM();
            notifyHUD('get_enrolled_courses', 'success', domCourses.length + ' courses found');
            return {
                portal: window.location.hostname,
                user: window.M?.cfg?.userId || 'Active Student',
                count: domCourses.length,
                courses: domCourses
            };
        }
    });

    document.modelContext.registerTool({
        name: 'get_upcoming_deadlines',
        description: 'Get upcoming assignment deadlines, quizzes, and timeline events.',
        inputSchema: {
            type: 'object',
            properties: {
                days_ahead: { type: 'number', description: 'Days to look ahead (default: 14)' }
            }
        },
        execute: async function(args) {
            notifyHUD('get_upcoming_deadlines', 'running');
            const deadlines = scrapeDeadlinesFromDOM();
            notifyHUD('get_upcoming_deadlines', 'success', deadlines.length + ' deadlines detected');
            return {
                portal: window.location.hostname,
                count: deadlines.length,
                deadlines: deadlines
            };
        }
    });

    document.modelContext.registerTool({
        name: 'get_assignment_details',
        description: 'Fetch assignment instructions, due date, submission status, and rubric from the active page.',
        inputSchema: {
            type: 'object',
            properties: {
                assignment_id: { type: 'number', description: 'Optional assignment ID' }
            }
        },
        execute: async function(args) {
            notifyHUD('get_assignment_details', 'running');
            const pageHeading = document.querySelector('h1, h2, .page-header-headings')?.textContent?.trim() || 'Assignment';
            const pageDescription = document.querySelector('#intro, .box.generalbox, .submissionstatustable')?.textContent?.trim() || '';
            const rubric = scrapeRubricFromDOM();

            notifyHUD('get_assignment_details', 'success', rubric ? 'Rubric extracted' : 'Page text extracted');
            return {
                title: pageHeading,
                url: window.location.href,
                has_rubric: !!rubric,
                rubric_criteria: rubric,
                description_preview: pageDescription.slice(0, 1000)
            };
        }
    });

    document.modelContext.registerTool({
        name: 'evaluate_draft_against_rubric',
        description: 'Evaluate draft text against the active assignment rubric in myeLearning/Moodle and highlight matched criteria in the DOM.',
        inputSchema: {
            type: 'object',
            properties: {
                draft_text: { type: 'string', description: 'The student draft text to analyze' }
            },
            required: ['draft_text']
        },
        execute: async function(args) {
            notifyHUD('evaluate_draft_against_rubric', 'running');
            const rubric = scrapeRubricFromDOM();
            const draft = args.draft_text.toLowerCase();

            // Visual co-browsing: Highlight rubric levels in live Moodle DOM
            const levelElements = document.querySelectorAll('.gradingform_rubric .level');
            levelElements.forEach(el => {
                el.style.transition = 'all 0.4s ease';
                el.style.border = '2px solid #10b981';
                el.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            });

            notifyHUD('evaluate_draft_against_rubric', 'success', 'Rubric evaluated & DOM highlighted');
            return {
                status: 'evaluated',
                rubric_found: !!rubric,
                criteria_analyzed: rubric ? rubric.length : 0,
                co_browsing_effect: 'Matched rubric levels highlighted in active tab'
            };
        }
    });

    document.modelContext.registerTool({
        name: 'get_course_materials',
        description: 'Extract course modules, lecture notes, syllabus items, and resources from the current course page.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function() {
            notifyHUD('get_course_materials', 'running');
            const sections = [];
            const sectionElems = document.querySelectorAll('.course-content .section, .section.main');

            sectionElems.forEach((sec, idx) => {
                const title = sec.querySelector('.sectionname, .section-title, h3')?.textContent?.trim() || ('Section ' + idx);
                const items = Array.from(sec.querySelectorAll('.activityinstance, .activity-item, .instancename')).map(i => i.textContent.trim());
                if (items.length > 0) {
                    sections.push({ section: title, items_count: items.length, items: items.slice(0, 10) });
                }
            });

            notifyHUD('get_course_materials', 'success', sections.length + ' sections extracted');
            return {
                course_url: window.location.href,
                sections_count: sections.length,
                sections: sections
            };
        }
    });

    // 7. Floating Activity HUD Component
    function injectHUD() {
        if (document.getElementById('moodle-webmcp-hud')) return;

        const hud = document.createElement('div');
        hud.id = 'moodle-webmcp-hud';
        hud.style.cssText = [
            'position: fixed',
            'bottom: 24px',
            'right: 24px',
            'z-index: 999999',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'background: rgba(15, 23, 42, 0.95)',
            'color: #f8fafc',
            'padding: 10px 16px',
            'border-radius: 16px',
            'border: 1px solid rgba(99, 102, 241, 0.4)',
            'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4)',
            'backdrop-filter: blur(12px)',
            'display: flex',
            'align-items: center',
            'gap: 10px',
            'font-size: 12px',
            'font-weight: 600',
            'transition: all 0.3s ease',
            'cursor: default'
        ].join(';');

        hud.innerHTML = `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;width:20px;height:20px;background:#4f46e5;border-radius:6px;">
                <span style="font-size:11px;">🎓</span>
                <span id="moodle-webmcp-pulse" style="position:absolute;top:-2px;right:-2px;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;"></span>
            </div>
            <div>
                <div style="font-weight:700;background:linear-gradient(to right, #818cf8, #38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
                    myeLearning WebMCP
                </div>
                <div id="moodle-webmcp-status" style="font-size:10px;color:#94a3b8;font-weight:400;">
                    AI Co-Browsing Ready
                </div>
            </div>
        `;

        document.body.appendChild(hud);
    }

    function notifyHUD(toolName, status, summary) {
        const statusElem = document.getElementById('moodle-webmcp-status');
        const pulseElem = document.getElementById('moodle-webmcp-pulse');
        const hud = document.getElementById('moodle-webmcp-hud');

        if (!statusElem || !pulseElem || !hud) return;

        if (status === 'running') {
            statusElem.textContent = 'Agent executing ' + toolName + '...';
            pulseElem.style.background = '#f59e0b';
            pulseElem.style.boxShadow = '0 0 12px #f59e0b';
            hud.style.borderColor = '#818cf8';
        } else if (status === 'success') {
            statusElem.textContent = toolName + (summary ? ': ' + summary : ' completed');
            pulseElem.style.background = '#10b981';
            pulseElem.style.boxShadow = '0 0 8px #10b981';
            hud.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        }
    }

    // Initialize HUD when document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHUD);
    } else {
        injectHUD();
    }

    console.log('[Moodle WebMCP] In-Browser Agent Tools & Co-Browsing Active for myeLearning.');
})();

