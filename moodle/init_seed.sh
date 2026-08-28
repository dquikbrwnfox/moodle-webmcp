#!/bin/sh
echo "=== Running WebMCP Demo Seeder on Startup ==="
sleep 3
php /var/www/html/moodle/seed_demo_courses.php || true

