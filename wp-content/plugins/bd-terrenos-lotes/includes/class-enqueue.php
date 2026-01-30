<?php
class TerrenosLotes_Enqueue {
    public function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend']);
    }

    public function enqueue_admin($hook) {
        global $post_type;

        if (('post-new.php' == $hook || 'post.php' == $hook) && 'terreno' == $post_type) {
            wp_enqueue_media();

            $api_key = get_option('terreno_google_maps_api_key', '');

            if (!empty($api_key)) {
                wp_enqueue_script(
                    'google-maps-api',
                    "https://maps.googleapis.com/maps/api/js?key={$api_key}&libraries=places,geometry,drawing",
                    array(),
                    null,
                    true
                );

                $bundle_file = plugin_dir_path(__FILE__) . '../assets/js/dist/terreno-admin.bundle.js';
                if (!file_exists($bundle_file)) {
                    return;
                }

                wp_enqueue_script(
                    'terreno-admin-bundle',
                    plugin_dir_url(dirname(__FILE__)) . 'assets/js/dist/terreno-admin.bundle.js',
                    array('google-maps-api', 'jquery'),
                    '2.0.0',
                    true
                );

                wp_localize_script('terreno-admin-bundle', 'terreno_ajax', array(
                    'ajax_url' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('terreno_ajax_nonce')
                ));
            }
        }
    }

    public function enqueue_frontend() {
        global $post;

        // Carrega fonte Kumbh Sans do Google Fonts
        wp_enqueue_style(
            'terrenos-lotes-font',
            'https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap',
            array(),
            null
        );

        // Carrega CSS e JS do plugin em todas as páginas (para uso em qualquer tema)
        wp_enqueue_style(
            'terrenos-lotes-frontend',
            plugin_dir_url(dirname(__FILE__)) . 'assets/css/frontend.css',
            array('terrenos-lotes-font'),
            '1.0.1'
        );

        wp_enqueue_script(
            'terrenos-lotes-frontend',
            plugin_dir_url(dirname(__FILE__)) . 'assets/js/frontend/index.js',
            array(),
            '1.0.1',
            true
        );

        wp_enqueue_script(
            'terrenos-lotes-faq',
            plugin_dir_url(dirname(__FILE__)) . 'assets/js/frontend/faq.js',
            array(),
            '1.0.0',
            true
        );

        if (is_singular()) {
            $api_key = get_option('terreno_google_maps_api_key', '');

            if (!empty($api_key)) {
                wp_enqueue_script(
                    'google-maps-api-frontend',
                    "https://maps.googleapis.com/maps/api/js?key={$api_key}&libraries=geometry,drawing",
                    array(),
                    null,
                    true
                );
            }

            if (is_singular('terreno')) {
                wp_enqueue_style(
                    'terreno-simulador-page',
                    plugin_dir_url(dirname(__FILE__)) . 'assets/css/simulador-page.css',
                    array(),
                    '1.0.0'
                );
            }
        }
    }
}
