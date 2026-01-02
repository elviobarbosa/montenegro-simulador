<?php
class TerrenosLotes_Enqueue {
    public function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend']);
    }

    public function enqueue_admin($hook) {
        global $post_type;
        
        // Debug
        error_log('Hook: ' . $hook . ', Post Type: ' . $post_type);
        
        if (('post-new.php' == $hook || 'post.php' == $hook) && 'terreno' == $post_type) {
            $api_key = get_option('terreno_google_maps_api_key', '');
            
            if (!empty($api_key)) {
                try {
                    // Google Maps API
                    wp_enqueue_script(
                        'google-maps-api', 
                        "https://maps.googleapis.com/maps/api/js?key={$api_key}&libraries=places,geometry,drawing", 
                        array(), 
                        null, 
                        true
                    );
                    
                    // Verificar se o arquivo existe
                    $js_file = plugin_dir_path(__FILE__) . '../assets/js/terreno-google-maps-admin.js';
                    if (!file_exists($js_file)) {
                        error_log('ERRO: Arquivo JS não encontrado: ' . $js_file);
                        return;
                    }
                    
                    // Script customizado
                    wp_enqueue_script(
                        'terreno-google-maps-admin', 
                        plugin_dir_url(dirname(__FILE__)) . 'assets/js/terreno-google-maps-admin.js', 
                        array('google-maps-api', 'jquery'), 
                        '1.0', 
                        true
                    );
                    
                    wp_localize_script('terreno-google-maps-admin', 'terreno_ajax', array(
                        'ajax_url' => admin_url('admin-ajax.php'),
                        'nonce' => wp_create_nonce('terreno_ajax_nonce')
                    ));
                    
                    error_log('Scripts carregados com sucesso');
                    
                } catch (Exception $e) {
                    error_log('ERRO ao carregar scripts: ' . $e->getMessage());
                }
            } else {
                error_log('AVISO: API Key do Google Maps não configurada');
            }
        }
    }

    public function enqueue_frontend() {
        
        global $post;
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
                
                error_log('Scripts frontend carregados com sucesso');
            }
        }
    }
}
// class TerrenosLotes_Enqueue {
//     public function __construct() {
//         add_action('admin_enqueue_scripts', [$this, 'enqueue_admin']);
//     }

//     public function enqueue_admin($hook) {
//         global $post_type;
        
//         if (('post-new.php' == $hook || 'post.php' == $hook) && 'terreno' == $post_type) {
//             $api_key = get_option('terreno_google_maps_api_key', '');
            
//             if (!empty($api_key)) {
//                 // Google Maps API
//                 wp_enqueue_script(
//                     'google-maps-api', 
//                     "https://maps.googleapis.com/maps/api/js?key={$api_key}&libraries=places,geometry,drawing", 
//                     array(), 
//                     null, 
//                     true
//                 );
                
//                 // Script customizado
//                 wp_enqueue_script('terreno-google-maps-admin', plugin_dir_url(__FILE__) . '../assets/js/terreno-google-maps-admin.js', array('google-maps-api', 'jquery'), '1.0', true);
                
//                 wp_localize_script('terreno-google-maps-admin', 'terreno_ajax', array(
//                     'ajax_url' => admin_url('admin-ajax.php'),
//                     'nonce' => wp_create_nonce('terreno_ajax_nonce')
//                 ));
//             }
//         }
//     }
// }

// class TerrenosLotes_Enqueue {
//     public function __construct() {
//         add_action('admin_enqueue_scripts', [$this, 'enqueue_admin']);
//     }

//     public function enqueue_scripts($hook) {
//         global $post_type;
        
//         if (('post-new.php' == $hook || 'post.php' == $hook) && 'terreno' == $post_type) {
//             $api_key = get_option('terreno_google_maps_api_key', '');
            
//             if (!empty($api_key)) {
//                 // Google Maps API
//                 wp_enqueue_script(
//                     'google-maps-api', 
//                     "https://maps.googleapis.com/maps/api/js?key={$api_key}&libraries=places,geometry,drawing", 
//                     array(), 
//                     null, 
//                     true
//                 );
                
//                 // Script customizado
//                 wp_enqueue_script('terreno-google-maps-admin', plugin_dir_url(__FILE__) . 'terreno-google-maps-admin.js', array('google-maps-api', 'jquery'), '1.0', true);
                
//                 wp_localize_script('terreno-google-maps-admin', 'terreno_ajax', array(
//                     'ajax_url' => admin_url('admin-ajax.php'),
//                     'nonce' => wp_create_nonce('terreno_ajax_nonce')
//                 ));
//             }
//         }
//     }
// }

