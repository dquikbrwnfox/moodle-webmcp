FROM erseco/alpine-moodle:latest

USER root

# Install local_webmcp plugin directly into Moodle
COPY moodle-plugin/local/webmcp /var/www/html/local/webmcp
RUN chown -R nobody:nobody /var/www/html/local

USER nobody

EXPOSE 8080

