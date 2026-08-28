<?php
/**
 * Comprehensive Moodle WebMCP Demo Course Seeder
 * Creates CS101 and AI202 with modules, assignments, and test accounts.
 */

define('CLI_SCRIPT', true);
require_once('/var/www/html/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/user/lib.php');
require_once($CFG->dirroot . '/mod/assign/lib.php');

global $DB, $CFG;

echo "=== Starting Moodle WebMCP Course Seeder ===
";

// 1. Create or Find Computer Science Category
$cat = $DB->get_record('course_categories', ['name' => 'Computer Science & AI']);
if (!$cat) {
    $cat = new stdClass();
    $cat->name = 'Computer Science & AI';
    $cat->parent = 0;
    $cat->sortorder = 1;
    $cat->id = $DB->insert_record('course_categories', $cat);
    echo "✓ Created Category: Computer Science & AI (ID: {$cat->id})
";
}

// 2. Helper to create a course
function get_or_create_course($fullname, $shortname, $summary, $catId) {
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
        echo "• Course {$shortname} already exists.
";
    }
    return $course;
}

// Course 1: CS 101
$cs101 = get_or_create_course(
    'CS 101: Agentic Web Development & WebMCP Standards',
    'CS101-WEBMCP',
    'Explore emerging in-browser agent standards, tool calling via document.modelContext.registerTool, prompt injection threat models, and human-agent co-browsing architectures.',
    $cat->id
);

// Course 2: AI 202
$ai202 = get_or_create_course(
    'AI 202: Advanced Agent Architectures & Tool Security',
    'AI202-SEC',
    'Defense-in-depth for client-side AI tools, indirect prompt injection mitigation, sandboxed browser DOMs, and session governance.',
    $cat->id
);

// 3. Helper to create student users
function get_or_create_user($username, $password, $first, $last, $email) {
    global $DB, $CFG;
    $user = $DB->get_record('user', ['username' => $username, 'mnethostid' => $CFG->mnet_localhost_id]);
    if (!$user) {
        $u = new stdClass();
        $u->username = $username;
        $u->password = hash_internal_user_password($password);
        $u->firstname = $first;
        $u->lastname = $last;
        $u->email = $email;
        $u->auth = 'manual';
        $u->confirmed = 1;
        $u->mnethostid = $CFG->mnet_localhost_id;
        $userId = user_create_user($u);
        echo "✓ Created User: {$username} ({$first} {$last})
";
        return $DB->get_record('user', ['id' => $userId]);
    }
    echo "• User {$username} already exists.
";
    return $user;
}

$studentAlex = get_or_create_user('alex', 'password123', 'Alex', 'Rivera', 'alex.rivera@apex.edu');
$studentDemo = get_or_create_user('student1', 'password123', 'Demo', 'Student', 'student1@apex.edu');

// 4. Enroll students in both courses
function enroll_student($courseId, $userId) {
    global $DB;
    $enrol = $DB->get_record('enrol', ['courseid' => $courseId, 'enrol' => 'manual']);
    if ($enrol) {
        $userEnrolment = $DB->get_record('user_enrolments', ['enrolid' => $enrol->id, 'userid' => $userId]);
        if (!$userEnrolment) {
            $ue = new stdClass();
            $ue->enrolid = $enrol->id;
            $ue->userid = $userId;
            $ue->status = 0;
            $ue->timestart = time();
            $ue->timeend = 0;
            $ue->timecreated = time();
            $ue->timemodified = time();
            $DB->insert_record('user_enrolments', $ue);
            echo "✓ Enrolled user {$userId} in course {$courseId}
";
        }
    }
}

enroll_student($cs101->id, $studentAlex->id);
enroll_student($cs101->id, $studentDemo->id);
enroll_student($ai202->id, $studentAlex->id);
enroll_student($ai202->id, $studentDemo->id);

echo "=== Moodle WebMCP Demo Courses & Accounts Seeded Successfully! ===
";

