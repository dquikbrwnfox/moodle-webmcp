FROM erseco/alpine-moodle:latest

USER root

# Copy local_webmcp plugin into a staging directory
COPY moodle-plugin/local/webmcp /opt/webmcp

# Install plugin on container startup
RUN printf '#!/bin/sh\nmkdir -p /var/www/html/local/webmcp\ncp -r /opt/webmcp/* /var/www/html/local/webmcp/\nchown -R nobody:nobody /var/www/html/local\n' > /docker-entrypoint-init.d/02-install-webmcp.sh \
    && chmod +x /docker-entrypoint-init.d/02-install-webmcp.sh

USER nobody

EXPOSE 8080

