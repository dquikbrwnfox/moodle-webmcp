#!/bin/sh

# Copy WebMCP plugin and seeder to web root on every boot
mkdir -p /var/www/html/local/webmcp
cp -r /opt/webmcp/* /var/www/html/local/webmcp/
cp /opt/seed_demo_courses.php /var/www/html/seed_demo_courses.php
chown -R nobody:nobody /var/www/html/local

# Background daemon to run upgrade and seeding once Moodle is online
(
    echo "[WebMCP Entrypoint] Waiting for Moodle config.php..."
    for i in $(seq 1 40); do
        if [ -f /var/www/html/config.php ]; then
            echo "[WebMCP Entrypoint] Found config.php! Running upgrade and seeder..."
            sleep 4
            php /var/www/html/admin/cli/upgrade.php --non-interactive || true
            php /var/www/html/seed_demo_courses.php || true
            php /var/www/html/admin/cli/purge_caches.php || true
            echo "[WebMCP Entrypoint] WebMCP initialization finished successfully!"
            break
        fi
        sleep 2
    done
) &

# Delegate to original entrypoint
if [ -f /docker-entrypoint.sh ]; then
    exec /docker-entrypoint.sh "$@"
elif [ -f /entrypoint.sh ]; then
    exec /entrypoint.sh "$@"
else
    exec "$@"
fi

