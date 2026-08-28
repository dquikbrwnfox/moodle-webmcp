<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Injects WebMCP tool registration script and ensures automatic course enrollment for learners.
 */
function local_webmcp_before_footer() {
    global $PAGE, $USER, $DB;

    if (!isloggedin() || isguestuser()) {
        return '';
    }

    // Automatically enroll new learners into demo courses on page load
    if (!is_siteadmin() && $USER->id > 2) {
        require_once($GLOBALS['CFG']->dirroot . '/lib/enrollib.php');
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
    }

    $PAGE->requires->js_call_amd('local_webmcp/webmcp_init', 'init', [
        'userId' => $USER->id,
        'userRole' => is_siteadmin() ? 'instructor' : 'student',
        'sesskey' => sesskey()
    ]);

    return '';
}

