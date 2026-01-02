<?php 
function setup() {
    //limpa do wp_head removendo tags desnecessárias
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'start_post_rel_link');
    remove_action('wp_head', 'index_rel_link');
    remove_action('wp_head', 'adjacent_posts_rel_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');

    //remove smart quotes
    remove_filter('the_title', 'wptexturize');
    remove_filter('the_content', 'wptexturize');
    remove_filter('the_excerpt', 'wptexturize');
    remove_filter('comment_text', 'wptexturize');
    remove_filter('list_cats', 'wptexturize');
    remove_filter('single_post_title', 'wptexturize');

    add_filter( 'wp_mail_from', 'sender_email' );
    function sender_email( $original_email_address ) {
        $domain = str_replace(['http://', 'https://'], '', get_bloginfo('url'));
        return 'noreply@' . $domain;
    }

    add_filter( 'wp_mail_from_name', 'sender_name' );
    function sender_name( $original_email_from ) {
        return get_bloginfo('name');
    }

    // setup
    if (function_exists('acf_add_options_page')) :
        acf_add_options_page();
    endif;

    register_nav_menu('header-menu',__( 'Menu Principal' ));
    register_nav_menu('content-menu',__( 'Menu Content' ));
    register_nav_menu('footer-menu',__( 'Menu Rodapé' ));
	
}

function register_custom_image_sizes() {
    if ( ! current_theme_supports( 'post-thumbnails' ) ) {
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'main-image' );
        add_theme_support( 'main-image-mobile' );
        add_theme_support( 'main-image-tablet' );
        add_theme_support( 'square' );
    }
    add_image_size( 'full-image', 1920, 962, true);
    add_image_size( 'main-image', 1311, 657, true);
    add_image_size( 'main-image-mobile', 350, 263, true);
    add_image_size( 'main-image-tablet', 768, 576, true);
    add_image_size( 'square', 800, 800, true);
}
add_action( 'after_setup_theme', 'register_custom_image_sizes' );

function add_custom_image_sizes( $sizes ) {
    return array_merge( $sizes, array(
        'full-image' => __( 'Custom 1311x657' ),
        'main-image' => __( 'Custom 1311x657' ),
        'main-image-mobile' => __( 'Custom 350x263' ),
        'main-image-tablet' => __( 'Custom 768x576' ),
        'square' => __( 'Custom 800x800' ),
    ) );
}

function custom_wp_theme_json_theme( $theme_json ) {
    $newColorPalette = [
        [
            'name' => esc_attr__('Primary color', 'betaGutemberg'),
            'slug' => 'primary-color',
            'color' => '#133419',
        ],
        [
            'name' => esc_attr__('Secondary color', 'betaGutemberg'),
            'slug' => 'secondary-color',
            'color' => '#e6cf80',
        ],
        [
            'name' => esc_attr__('Marrom', 'betaGutemberg'),
            'slug' => 'color-1',
            'color' => '#a7542f',
        ],
        [
            'name' => esc_attr__('Verde claro', 'betaGutemberg'),
            'slug' => 'color-2',
            'color' => '#84bc8e',
        ],
        [
            'name' => esc_attr__('Dark 500', 'betaGutemberg'),
            'slug' => 'dark-500',
            'color' => '#061408',
        ],
        [
            'name' => esc_attr__('Gray 500', 'betaGutemberg'),
            'slug' => 'gray-500',
            'color' => '#707070',
        ],
        [
            'name' => esc_attr__('Gray 500', 'betaGutemberg'),
            'slug' => 'gray-200',
            'color' => '#a2a2a2',
        ],
    ];
    
	$parent_theme_json_data = $theme_json->get_data();
	$child_palette          = $newColorPalette;
	if ( isset( $parent_theme_json_data['settings']['color']['palette']['theme'] ) ) {
		$child_palette = array_merge(
			$parent_theme_json_data['settings']['color']['palette']['theme'],
			$child_palette,
		);
	}

	$new_data = array(
		'version'  => 2,
		'settings' => array(
			'color'  => array(
				'palette'  => $child_palette,
			),
		),
	);
	return $theme_json->update_with( $new_data );
}


function redirect_category_to_custom_page() {
    if (is_category()) {
        $category = get_queried_object();
        wp_redirect(home_url('/category/?cat=' . $category->slug));
        exit;
    }
}

add_action('template_redirect', 'redirect_category_to_custom_page');
// add_filter( 'wp_theme_json_data_theme', 'custom_wp_theme_json_theme' );
add_filter( 'image_size_names_choose', 'add_custom_image_sizes' );
add_action( 'init', 'setup' );