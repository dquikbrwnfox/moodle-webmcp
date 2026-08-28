FROM erseco/alpine-moodle:latest

USER root

# Copy our local_webmcp plugin into Moodle's local plugin directory
COPY moodle-plugin/local/webmcp /var/www/html/local/webmcp

# Copy course seeder scripts
COPY moodle/seed_demo_courses.php /var/www/html/moodle/seed_demo_courses.php
COPY moodle/init_seed.sh /docker-entrypoint-init.d/04-seed-courses.sh
RUN chmod +x /docker-entrypoint-init.d/04-seed-courses.sh

# Set correct ownership for user nobody (UID 65534) and switch back
RUN chown -R nobody:nobody /var/www/html /docker-entrypoint-init.d

USER nobody

EXPOSE 8080

