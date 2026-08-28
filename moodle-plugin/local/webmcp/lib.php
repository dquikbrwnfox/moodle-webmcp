<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Ensures demo courses (CS101 & AI202) exist in database.
 */
function local_webmcp_ensure_demo_courses() {
    global $DB, $CFG;

    // Check if courses already exist
    if ($DB->record_exists('course', ['shortname' => 'CS101-WEBMCP']) &&
        $DB->record_exists('course', ['shortname' => 'AI202-SEC'])) {
        return;
    }

    require_once($CFG->dirroot . '/course/lib.php');

    // Create Category if missing
    $cat = $DB->get_record('course_categories', ['name' => 'Computer Science & AI']);
    if (!$cat) {
        $cat = new stdClass();
        $cat->name = 'Computer Science & AI';
        $cat->parent = 0;
        $cat->sortorder = 1;
        $cat->visible = 1;
        $cat->id = $DB->insert_record('course_categories', $cat);
    }

    // Create CS101
    if (!$DB->record_exists('course', ['shortname' => 'CS101-WEBMCP'])) {
        $c1 = new stdClass();
        $c1->category = $cat->id;
        $c1->fullname = 'CS 101: Agentic Web Development & WebMCP Standards';
        $c1->shortname = 'CS101-WEBMCP';
        $c1->summary = 'Explore emerging in-browser agent standards, tool calling via document.modelContext.registerTool, prompt injection threat models, and human-agent co-browsing architectures.';
        $c1->format = 'topics';
        $c1->numsections = 4;
        $c1->startdate = time() - (14 * 86400);
        $c1->visible = 1;
        create_course($c1);
    }

    // Create AI202
    if (!$DB->record_exists('course', ['shortname' => 'AI202-SEC'])) {
        $c2 = new stdClass();
        $c2->category = $cat->id;
        $c2->fullname = 'AI 202: Advanced Agent Architectures & Tool Security';
        $c2->shortname = 'AI202-SEC';
        $c2->summary = 'Defense-in-depth for client-side AI tools, indirect prompt injection mitigation, sandboxed browser DOMs, and session governance.';
        $c2->format = 'topics';
        $c2->numsections = 4;
        $c2->startdate = time() - (14 * 86400);
        $c2->visible = 1;
        create_course($c2);
    }
}

/**
 * Injects WebMCP tool registration script, ensures demo courses exist, and auto-enrolls learners.
 */
function local_webmcp_before_footer() {
    global $PAGE, $USER, $DB, $CFG;

    // Ensure demo courses exist in database
    try {
        local_webmcp_ensure_demo_courses();
    } catch (Exception $e) {
        // Fallback silently if table not ready
    }

    if (!isloggedin() || isguestuser()) {
        return '';
    }

    // Automatically enroll new learners into all demo courses on page load
    if (!is_siteadmin() && $USER->id > 2) {
        try {
            require_once($CFG->dirroot . '/lib/enrollib.php');
            $studentRole = $DB->get_record('role', ['shortname' => 'student']);
            $studentRoleId = $studentRole ? $studentRole->id : 5;
            $manualPlugin = enrol_get_plugin('manual');

            $courses = $DB->get_records_select('course', 'id > 1');
            foreach ($courses as $c) {
                $context = context_course::instance($c->id);
                if (!is_enrolled($context, $USER->id)) {
                    $instance = $DB->get_record('enrol', ['courseid' => $c->id, 'enrol' => 'manual', 'status' => 0]);
                    if ($instance && $manualPlugin) {
                        $manualPlugin->enrol_user($instance, $USER->id, $studentRoleId);
                    }
                }
            }
        } catch (Exception $e) {
            // Ignore if enrol plugins loading
        }
    }

    $PAGE->requires->js_call_amd('local_webmcp/webmcp_init', 'init', [
        'userId' => $USER->id,
        'userRole' => is_siteadmin() ? 'instructor' : 'student',
        'sesskey' => sesskey()
    ]);

    return '';
}

