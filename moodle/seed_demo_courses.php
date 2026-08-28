<?php
/**
 * Moodle WebMCP Auto-Enrollment & Course Config
 * Enrolls all users in all courses using standard Moodle enrol APIs and role assignments.
 */

define('CLI_SCRIPT', true);
require_once('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/user/lib.php');
require_once($CFG->dirroot . '/lib/enrollib.php');

global $DB, $CFG;

echo "=== Moodle WebMCP Universal Course Enrollment ===
";

// 1. Get Student role ID (default 5 in Moodle)
$studentRole = $DB->get_record('role', ['shortname' => 'student']);
$studentRoleId = $studentRole ? $studentRole->id : 5;

// 2. Fetch all courses (excluding frontpage)
$courses = $DB->get_records_select('course', 'id > 1');
if (empty($courses)) {
    echo "No courses found to enroll.
";
    exit(0);
}

// 3. Fetch all active non-admin users
$users = $DB->get_records_select('user', 'deleted = 0 AND id > 2');

$manualPlugin = enrol_get_plugin('manual');
$selfPlugin = enrol_get_plugin('self');

foreach ($courses as $course) {
    echo "Processing course: {$course->fullname} (ID: {$course->id})
";

    // A. Ensure Manual Enrolment Instance exists
    $manualInstance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'manual']);
    if (!$manualInstance) {
        $manualId = $manualPlugin->add_instance($course);
        $manualInstance = $DB->get_record('enrol', ['id' => $manualId]);
    }

    // B. Ensure Self Enrolment Instance is enabled with NO enrollment key
    $selfInstance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'self']);
    if (!$selfInstance && $selfPlugin) {
        $selfId = $selfPlugin->add_instance($course, ['status' => 0, 'customint6' => 1]);
        $selfInstance = $DB->get_record('enrol', ['id' => $selfId]);
    } else if ($selfInstance) {
        $selfInstance->status = 0;
        $selfInstance->customint6 = 1;
        $selfInstance->password = '';
        $DB->update_record('enrol', $selfInstance);
    }

    // C. Get Course Context for Role Assignments
    $context = context_course::instance($course->id);

    // D. Enroll every user as a Student in this course
    foreach ($users as $user) {
        if ($manualInstance && $manualPlugin) {
            $manualPlugin->enrol_user($manualInstance, $user->id, $studentRoleId);
            echo "  ✓ Enrolled {$user->username} ({$user->firstname} {$user->lastname}) in {$course->shortname}
";
        }
    }
}

echo "=== All Users Successfully Enrolled as Students in All Courses ===
";

