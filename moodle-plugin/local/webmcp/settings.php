<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $settings = new admin_settingpage('local_webmcp', get_string('pluginname', 'local_webmcp'));
    $ADMIN->add('localplugins', $settings);

    $settings->add(new admin_setting_configcheckbox(
        'local_webmcp/enable_agent_hud',
        get_string('enable_agent_hud', 'local_webmcp'),
        get_string('enable_agent_hud_desc', 'local_webmcp'),
        1
    ));
}

