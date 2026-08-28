FROM erseco/alpine-moodle:latest

USER root

# Copy local_webmcp plugin and seeder into container
COPY moodle-plugin/local/webmcp /opt/webmcp
COPY moodle/seed_demo_courses.php /opt/seed_demo_courses.php

# Startup script to install plugin and run database seeder on boot
RUN printf '#!/bin/sh\nmkdir -p /var/www/html/local/webmcp\ncp -r /opt/webmcp/* /var/www/html/local/webmcp/\nchown -R nobody:nobody /var/www/html/local\nsleep 3\nphp /opt/seed_demo_courses.php || true\n' > /docker-entrypoint-init.d/02-install-webmcp.sh \
    && chmod +x /docker-entrypoint-init.d/02-install-webmcp.sh

USER nobody

EXPOSE 8080

