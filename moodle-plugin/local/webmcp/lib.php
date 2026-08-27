<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Injects WebMCP tool registration script into Moodle page layout.
 *
 * @param renderer_base $renderer
 * @return string HTML/JS to append
 */
function local_webmcp_before_footer() {
    global $PAGE, $USER;

    if (!isloggedin() || isguestuser()) {
        return '';
    }

    $PAGE->requires->js_call_amd('local_webmcp/webmcp_init', 'init', [
        'userId' => $USER->id,
        'userRole' => is_siteadmin() ? 'instructor' : 'student',
        'sesskey' => sesskey()
    ]);

    return '';
}

