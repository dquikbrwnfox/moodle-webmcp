define(['core/ajax', 'core/notification'], function(ajax, notification) {
    return {
        init: function(config) {
            if (typeof document === 'undefined') return;

            // Ensure document.modelContext exists
            if (!document.modelContext) {
                var toolMap = new Map();
                document.modelContext = {
                    registerTool: function(tool) {
                        toolMap.set(tool.name, tool);
                        console.log('[OpenLMS WebMCP Plugin] Registered in-page tool:', tool.name);
                    },
                    unregisterTool: function(name) {
                        toolMap.delete(name);
                    },
                    listTools: function() {
                        return Array.from(toolMap.values());
                    }
                };
            }

            // Register standard OpenLMS WebMCP tools
            document.modelContext.registerTool({
                name: 'get_enrolled_courses',
                description: 'Get all courses the logged-in student is currently enrolled in.',
                inputSchema: { type: 'object', properties: {} },
                execute: async function() {
                    return {
                        userId: config.userId,
                        role: config.userRole,
                        source: 'Moodle Active Session'
                    };
                }
            });

            document.modelContext.registerTool({
                name: 'get_upcoming_deadlines',
                description: 'Get pending assignment and quiz deadlines.',
                inputSchema: {
                    type: 'object',
                    properties: { days_ahead: { type: 'number', description: 'Days to query' } }
                },
                execute: async function(args) {
                    return {
                        days_ahead: args.days_ahead || 14,
                        source: 'Moodle Calendar & mod_assign'
                    };
                }
            });

            console.log('[OpenLMS WebMCP] In-Browser Agent Tools Ready (Role: ' + config.userRole + ')');
        }
    };
});

