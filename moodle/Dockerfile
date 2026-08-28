FROM erseco/alpine-moodle:latest

USER root

# Copy plugin and seeder to staging directory (keeps /var/www/html clean for Moodle core initialization)
COPY moodle-plugin/local/webmcp /opt/webmcp
COPY moodle/seed_demo_courses.php /opt/seed_demo_courses.php

# Create startup script in /docker-entrypoint-init.d/ to copy plugin into Moodle at runtime
RUN printf '#!/bin/sh\nmkdir -p /var/www/html/local/webmcp\ncp -r /opt/webmcp/* /var/www/html/local/webmcp/\nchown -R nobody:nobody /var/www/html/local\n' > /docker-entrypoint-init.d/02-install-webmcp.sh \
    && chmod +x /docker-entrypoint-init.d/02-install-webmcp.sh

USER nobody

EXPOSE 8080

