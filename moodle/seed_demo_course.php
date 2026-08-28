<?php
/**
 * Standalone Moodle CLI Seed Script for Apex University Demo Courses & Rubrics
 * Run via: php moodle/seed_demo_course.php
 */

define('CLI_SCRIPT', true);
require_once('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/user/lib.php');

global $DB, $CFG;

echo "=== Moodle WebMCP Demo Course Seeder ===
";

// 1. Create or get Category
$cat = $DB->get_record('course_categories', ['name' => 'Computer Science']);
if (!$cat) {
    $cat = new stdClass();
    $cat->name = 'Computer Science';
    $cat->parent = 0;
    $cat->id = $DB->insert_record('course_categories', $cat);
    echo "Created category: Computer Science (ID: {$cat->id})
";
}

// 2. Create Course CS101
$course = $DB->get_record('course', ['shortname' => 'CS101']);
if (!$course) {
    $courseData = new stdClass();
    $courseData->category = $cat->id;
    $courseData->fullname = 'CS 101: Introduction to Artificial Intelligence';
    $courseData->shortname = 'CS101';
    $courseData->summary = 'Foundations of machine learning, WebMCP agent standards, and ethical governance of autonomous systems.';
    $courseData->format = 'topics';
    $courseData->numsections = 4;
    $courseData->startdate = time() - (7 * 86400);
    $course = create_course($courseData);
    echo "Created course: CS 101 (ID: {$course->id})
";
} else {
    echo "Course CS 101 already exists (ID: {$course->id})
";
}

// 3. Create Student User: student1 / password123
$user = $DB->get_record('user', ['username' => 'student1']);
if (!$user) {
    $userData = new stdClass();
    $userData->username = 'student1';
    $userData->password = hash_internal_user_password('password123');
    $userData->firstname = 'Alex';
    $userData->lastname = 'Rivera';
    $userData->email = 'alex.rivera@apex.edu';
    $userData->auth = 'manual';
    $userData->confirmed = 1;
    $userData->mnethostid = $CFG->mnet_localhost_id;
    $userId = user_create_user($userData);
    echo "Created student user: student1 (ID: {$userId})
";
} else {
    echo "Student user student1 already exists (ID: {$user->id})
";
}

echo "=== Demo Course Seeding Completed Successfully! ===
";

