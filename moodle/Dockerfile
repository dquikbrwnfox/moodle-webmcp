FROM erseco/alpine-moodle:latest

USER root

# Copy local_webmcp plugin and seeder directly into container
COPY moodle-plugin/local/webmcp /opt/webmcp
COPY moodle/seed_demo_courses.php /opt/seed_demo_courses.php

# Pre-populate /var/www/html/local/webmcp
RUN mkdir -p /var/www/html/local/webmcp \
    && cp -r /opt/webmcp/* /var/www/html/local/webmcp/ \
    && cp /opt/seed_demo_courses.php /var/www/html/seed_demo_courses.php \
    && chown -R nobody:nobody /var/www/html/local

# Startup script to ensure plugin installation, CLI upgrade, database seeding, and cache purge
RUN printf '#!/bin/sh\n\
mkdir -p /var/www/html/local/webmcp\n\
cp -r /opt/webmcp/* /var/www/html/local/webmcp/\n\
cp /opt/seed_demo_courses.php /var/www/html/seed_demo_courses.php\n\
chown -R nobody:nobody /var/www/html/local\n\
echo "[WebMCP Boot] Running Moodle CLI upgrade and seeder..."\n\
sleep 2\n\
php /var/www/html/admin/cli/upgrade.php --non-interactive || true\n\
php /var/www/html/seed_demo_courses.php || true\n\
php /var/www/html/admin/cli/purge_caches.php || true\n\
echo "[WebMCP Boot] Seeder and cache purge complete."\n\
' > /docker-entrypoint-init.d/02-install-webmcp.sh \
    && chmod +x /docker-entrypoint-init.d/02-install-webmcp.sh

USER nobody

EXPOSE 8080

