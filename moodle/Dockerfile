FROM erseco/alpine-moodle:latest

USER root

# Install local_webmcp plugin directly into Moodle codebase
COPY moodle-plugin/local/webmcp /var/www/html/public/local/webmcp
COPY moodle-plugin/local/webmcp /var/www/html/local/webmcp
RUN chown -R nobody:nobody /var/www/html/public/local /var/www/html/local 2>/dev/null || true

USER nobody

EXPOSE 8080

