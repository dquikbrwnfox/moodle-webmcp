<?php
/**
 * Moodle WebMCP Database Seeder
 * Directly populates CS 101, AI 202, assignments, rubrics, and forums into Moodle.
 */

define('CLI_SCRIPT', true);
require_once('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/user/lib.php');
require_once($CFG->dirroot . '/lib/enrollib.php');

global $DB, $CFG;

echo "=== Starting Full Moodle WebMCP Content Seeder ===
";

// 1. Create Category: Computer Science & AI
$cat = $DB->get_record('course_categories', ['name' => 'Computer Science & AI']);
if (!$cat) {
    $cat = new stdClass();
    $cat->name = 'Computer Science & AI';
    $cat->parent = 0;
    $cat->sortorder = 1;
    $cat->visible = 1;
    $cat->id = $DB->insert_record('course_categories', $cat);
}

// 2. Helper to create course
function create_full_course($fullname, $shortname, $summary, $catId) {
    global $DB;
    $course = $DB->get_record('course', ['shortname' => $shortname]);
    if (!$course) {
        $c = new stdClass();
        $c->category = $catId;
        $c->fullname = $fullname;
        $c->shortname = $shortname;
        $c->summary = $summary;
        $c->format = 'topics';
        $c->numsections = 3;
        $c->startdate = time() - (14 * 86400);
        $c->visible = 1;
        $course = create_course($c);
        echo "✓ Created Course: {$fullname} ({$shortname})
";
    }
    return $course;
}

$cs101 = create_full_course(
    'CS 101: Agentic Web Development & WebMCP Standards',
    'CS101-WEBMCP',
    'Explore emerging in-browser agent standards, tool calling via document.modelContext.registerTool, prompt injection threat models, and human-agent co-browsing architectures.',
    $cat->id
);

$ai202 = create_full_course(
    'AI 202: Advanced Agent Architectures & Tool Security',
    'AI202-SEC',
    'Defense-in-depth for client-side AI tools, indirect prompt injection mitigation, sandboxed browser DOMs, and session governance.',
    $cat->id
);

// 3. Helper to create Assignment inside a course section
function create_course_assignment($course, $sectionNum, $name, $intro, $dueDateOffsetDays) {
    global $DB, $CFG;
    require_once($CFG->dirroot . '/mod/assign/lib.php');

    $existing = $DB->get_record('assign', ['course' => $course->id, 'name' => $name]);
    if ($existing) return;

    $assign = new stdClass();
    $assign->course = $course->id;
    $assign->name = $name;
    $assign->intro = $intro;
    $assign->introformat = FORMAT_HTML;
    $assign->alwaysshowdescription = 1;
    $assign->submissiondrafts = 1;
    $assign->requiresubmissionstatement = 0;
    $assign->sendnotifications = 0;
    $assign->sendlatenotifications = 0;
    $assign->duedate = time() + ($dueDateOffsetDays * 86400);
    $assign->allowsubmissionsfromdate = time() - (7 * 86400);
    $assign->grade = 100;
    $assign->timemodified = time();
    $assign->completionsubmit = 1;

    $assignId = $DB->insert_record('assign', $assign);

    // Create course module
    $module = $DB->get_record('modules', ['name' => 'assign']);
    if ($module) {
        $cm = new stdClass();
        $cm->course = $course->id;
        $cm->module = $module->id;
        $cm->instance = $assignId;
        $cm->section = $sectionNum;
        $cm->visible = 1;
        $cm->visibleold = 1;
        $cm->added = time();
        $cmId = $DB->insert_record('course_modules', $cm);

        // Update section sequence
        $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => $sectionNum]);
        if ($section) {
            $section->sequence = trim($section->sequence . ',' . $cmId, ',');
            $DB->update_record('course_sections', $section);
        }
        echo "✓ Created Assignment: {$name} in {$course->shortname}
";
    }
}

// Create CS101 Assignment
create_course_assignment(
    $cs101,
    2,
    'Assignment 1: Evaluating Autonomous Agent Boundaries',
    '<p>Write a 1,200 to 1,500-word critical analysis evaluating autonomous tool execution by LLMs in web browsers.</p><p><strong>Key Requirements:</strong></p><ul><li>Contrast Utilitarian efficiency gains with Deontological duties of informed consent.</li><li>Explain how client-side WebMCP execution differs from backend daemon architectures.</li><li>Propose a human-in-the-loop governance confirmation mechanism.</li></ul>',
    5
);

// Create AI202 Lab Assignment
create_course_assignment(
    $ai202,
    2,
    'Lab 2: Threat Modeling WebMCP Tools',
    '<p>Conduct a comprehensive STRIDE threat model on a multi-tool WebMCP implementation. Propose schema-level validations, capability restrictions, and an origin verification protocol.</p>',
    8
);

// 4. Enroll all non-admin users in all courses
$studentRole = $DB->get_record('role', ['shortname' => 'student']);
$studentRoleId = $studentRole ? $studentRole->id : 5;
$manualPlugin = enrol_get_plugin('manual');
$selfPlugin = enrol_get_plugin('self');

$courses = [$cs101, $ai202];
$users = $DB->get_records_select('user', 'deleted = 0 AND id > 2');

foreach ($courses as $c) {
    // Enable self enrollment
    $selfInstance = $DB->get_record('enrol', ['courseid' => $c->id, 'enrol' => 'self']);
    if ($selfInstance) {
        $selfInstance->status = 0;
        $selfInstance->customint6 = 1;
        $selfInstance->password = '';
        $DB->update_record('enrol', $selfInstance);
    } else if ($selfPlugin) {
        $selfPlugin->add_instance($c, ['status' => 0, 'customint6' => 1]);
    }

    // Manual enrollment for all existing users
    $manualInstance = $DB->get_record('enrol', ['courseid' => $c->id, 'enrol' => 'manual']);
    if ($manualInstance && $manualPlugin) {
        foreach ($users as $u) {
            $manualPlugin->enrol_user($manualInstance, $u->id, $studentRoleId);
            echo "✓ Auto-enrolled {$u->username} in {$c->shortname}
";
        }
    }
}

echo "=== Database Seeding Completed Successfully! ===
";

