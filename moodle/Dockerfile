FROM erseco/alpine-moodle:latest

USER root

# Copy local_webmcp plugin, seeder, and entrypoint wrapper
COPY moodle-plugin/local/webmcp /opt/webmcp
COPY moodle/seed_demo_courses.php /opt/seed_demo_courses.php
COPY moodle/entrypoint.sh /entrypoint-webmcp.sh
RUN chmod +x /entrypoint-webmcp.sh

# Pre-populate /var/www/html/local/webmcp
RUN mkdir -p /var/www/html/local/webmcp \
    && cp -r /opt/webmcp/* /var/www/html/local/webmcp/ \
    && cp /opt/seed_demo_courses.php /var/www/html/seed_demo_courses.php \
    && chown -R nobody:nobody /var/www/html/local

USER nobody

EXPOSE 8080

ENTRYPOINT ["/entrypoint-webmcp.sh"]

