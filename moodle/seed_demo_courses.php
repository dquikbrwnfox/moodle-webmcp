<?php
/**
 * Moodle CLI Course Seeder
 * Run via: php /var/www/html/local/webmcp/seed_demo_courses.php
 */

define('CLI_SCRIPT', true);
require_once('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/user/lib.php');
require_once($CFG->dirroot . '/lib/enrollib.php');

global $DB, $CFG;

// Create category
$cat = $DB->get_record('course_categories', ['name' => 'Computer Science & AI']);
if (!$cat) {
    $cat = new stdClass();
    $cat->name = 'Computer Science & AI';
    $cat->parent = 0;
    $cat->sortorder = 1;
    $cat->id = $DB->insert_record('course_categories', $cat);
}

// Helper to create course
function create_demo_course($fullname, $shortname, $summary, $catId) {
    global $DB;
    $course = $DB->get_record('course', ['shortname' => $shortname]);
    if (!$course) {
        $c = new stdClass();
        $c->category = $catId;
        $c->fullname = $fullname;
        $c->shortname = $shortname;
        $c->summary = $summary;
        $c->format = 'topics';
        $c->numsections = 4;
        $c->startdate = time() - (14 * 86400);
        $course = create_course($c);
    }
    return $course;
}

$cs101 = create_demo_course(
    'CS 101: Agentic Web Development & WebMCP Standards',
    'CS101-WEBMCP',
    'Explore emerging in-browser agent standards, tool calling via document.modelContext.registerTool, prompt injection threat models, and human-agent co-browsing architectures.',
    $cat->id
);

$ai202 = create_demo_course(
    'AI 202: Advanced Agent Architectures & Tool Security',
    'AI202-SEC',
    'Defense-in-depth for client-side AI tools, indirect prompt injection mitigation, sandboxed browser DOMs, and session governance.',
    $cat->id
);

// Enroll all non-admin users as students
$studentRole = $DB->get_record('role', ['shortname' => 'student']);
$studentRoleId = $studentRole ? $studentRole->id : 5;
$manualPlugin = enrol_get_plugin('manual');

$courses = [$cs101, $ai202];
$users = $DB->get_records_select('user', 'deleted = 0 AND id > 2');

foreach ($courses as $course) {
    $instance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'manual']);
    if ($instance && $manualPlugin) {
        foreach ($users as $user) {
            $manualPlugin->enrol_user($instance, $user->id, $studentRoleId);
        }
    }
}

