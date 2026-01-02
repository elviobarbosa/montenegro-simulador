<?php
$theme_dir = get_template_directory();
$scan_dir = $theme_dir . '/app/admin/editor/';
$files = scandir($scan_dir);

foreach ($files as &$file) {
    if ( is_file( $scan_dir . $file ) ):
        require_once $scan_dir . $file;
    endif;
}