<?php
/**
 * Moodle WebMCP Demo Course & Auto-Enrollment Seeder
 * Enrolls all students in all courses and sets modern password hashes (password_hash).
 */

define('CLI_SCRIPT', true);
require_once('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/user/lib.php');
require_once($CFG->dirroot . '/mod/assign/lib.php');

global $DB, $CFG;

echo "=== Running Moodle WebMCP Auto-Enrollment & User Password Reset ===
";

$studentPassword = 'MoodleStudent2026!';
$hashedPassword = password_hash($studentPassword, PASSWORD_DEFAULT);

// 1. Create or Find Category
$cat = $DB->get_record('course_categories', ['name' => 'Computer Science & AI']);
if (!$cat) {
    $cat = new stdClass();
    $cat->name = 'Computer Science & AI';
    $cat->parent = 0;
    $cat->sortorder = 1;
    $cat->id = $DB->insert_record('course_categories', $cat);
    echo "✓ Category: Computer Science & AI created
";
}

// 2. Setup Courses
function setup_course($fullname, $shortname, $summary, $catId) {
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
        echo "✓ Created Course: {$fullname} ({$shortname})
";
    } else {
        echo "• Course {$shortname} exists.
";
    }

    $selfEnrol = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'self']);
    if ($selfEnrol) {
        $selfEnrol->status = 0;
        $selfEnrol->customint6 = 1;
        $DB->update_record('enrol', $selfEnrol);
    }

    $guestEnrol = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'guest']);
    if ($guestEnrol) {
        $guestEnrol->status = 0;
        $DB->update_record('enrol', $guestEnrol);
    }

    return $course;
}

$cs101 = setup_course(
    'CS 101: Agentic Web Development & WebMCP Standards',
    'CS101-WEBMCP',
    'Explore emerging in-browser agent standards, tool calling via document.modelContext.registerTool, prompt injection threat models, and human-agent co-browsing architectures.',
    $cat->id
);

$ai202 = setup_course(
    'AI 202: Advanced Agent Architectures & Tool Security',
    'AI202-SEC',
    'Defense-in-depth for client-side AI tools, indirect prompt injection mitigation, sandboxed browser DOMs, and session governance.',
    $cat->id
);

// 3. Create or Update Student Users
function upsert_student($username, $hashedPassword, $first, $last, $email) {
    global $DB, $CFG;
    $user = $DB->get_record('user', ['username' => $username, 'mnethostid' => $CFG->mnet_localhost_id]);
    if (!$user) {
        $u = new stdClass();
        $u->username = $username;
        $u->password = $hashedPassword;
        $u->firstname = $first;
        $u->lastname = $last;
        $u->email = $email;
        $u->auth = 'manual';
        $u->confirmed = 1;
        $u->suspended = 0;
        $u->deleted = 0;
        $u->mnethostid = $CFG->mnet_localhost_id;
        $userId = user_create_user($u);
        echo "✓ Created Student: {$username} ({$first} {$last})
";
        return $DB->get_record('user', ['id' => $userId]);
    } else {
        // Update password hash to modern bcrypt hash
        $user->password = $hashedPassword;
        $user->suspended = 0;
        $user->deleted = 0;
        $DB->update_record('user', $user);
        echo "✓ Updated password hash for {$username}
";
        return $user;
    }
}

$alex = upsert_student('alex', $hashedPassword, 'Alex', 'Rivera', 'alex.rivera@apex.edu');
$student1 = upsert_student('student1', $hashedPassword, 'Demo', 'Student', 'student1@apex.edu');
$student2 = upsert_student('student2', $hashedPassword, 'Jordan', 'Bell', 'jordan.bell@apex.edu');

// 4. Enroll ALL students in ALL courses
$courses = $DB->get_records('course', null, '', 'id, shortname');
$users = $DB->get_records_select('user', 'deleted = 0 AND id > 2', null, '', 'id, username');

foreach ($courses as $c) {
    if ($c->id == 1) continue;

    $enrol = $DB->get_record('enrol', ['courseid' => $c->id, 'enrol' => 'manual']);
    if (!$enrol) continue;

    foreach ($users as $u) {
        $userEnrolment = $DB->get_record('user_enrolments', ['enrolid' => $enrol->id, 'userid' => $u->id]);
        if (!$userEnrolment) {
            $ue = new stdClass();
            $ue->enrolid = $enrol->id;
            $ue->userid = $u->id;
            $ue->status = 0;
            $ue->timestart = time();
            $ue->timeend = 0;
            $ue->timecreated = time();
            $ue->timemodified = time();
            $DB->insert_record('user_enrolments', $ue);
            echo "✓ Enrolled {$u->username} into {$c->shortname}
";
        }
    }
}

echo "=== Seeding & Passwords Reset to 'MoodleStudent2026!' Successfully! ===
";

