<?php
//================== STYLES e SCRIPTS ====================

function wpdocs_theme_name_scripts() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style( 'font-site', 'https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap' );
    function prefix_add_footer_styles() {
        wp_enqueue_style('site-style', get_stylesheet_directory_uri() . '/dist/styles/frontend.css?' . rand(), array());
               
    };
    
    //scripts
    wp_enqueue_script( 'jquery' );
    wp_enqueue_script('js-site', get_stylesheet_directory_uri() . '/dist/scripts/frontend-bundle.js?' . rand(), array(), '1.0', true);
    wp_localize_script('js-site', 'ajaxData', array( 'url' => admin_url('admin-ajax.php') ));
 }

function admin_style() {
    //styles
    wp_enqueue_style('autem-style-admin', get_stylesheet_directory_uri() . '/dist/styles/admin.css', array(), '1.0', true);

    //script
    // wp_enqueue_script( 'jquery' );
    wp_enqueue_script('autem-script-admin', get_stylesheet_directory_uri() . '/dist/scripts/admin-bundle.js', array(), '1.0', true);
}

function be_gutenberg_scripts() {
	wp_enqueue_style('editor-assets-test', get_stylesheet_directory_uri() . '/dist/styles/admin.css');
	//wp_enqueue_script( 'be-editor', get_stylesheet_directory_uri() . '/dist/scripts/admin-bundle.js', array( 'wp-blocks', 'wp-dom' ), filemtime( get_stylesheet_directory() . '/dist/scripts/admin-bundle.js' ), true );
    // wp_enqueue_script(
	// 	'beta-digital-blocks-editor',
	// 	get_template_directory_uri() . '/app/blocks/extension-heading.js',
	// 	[ 'wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-components', 'wp-element', 'wp-hooks' ],
	// 	null,
	// 	true
	// );
}

add_action( 'enqueue_block_editor_assets', 'be_gutenberg_scripts' );
add_action( 'get_footer', 'prefix_add_footer_styles' );
add_action('admin_enqueue_scripts', 'admin_style');
add_action( 'wp_enqueue_scripts', 'wpdocs_theme_name_scripts' );

add_filter( 'wp_script_attributes', static function ( array $attr ) : array {
    if ( 'js-site' !== $attr['id'] ) {
        return $attr;
    }

    $attr['type'] = 'module';

    return $attr;
} );
 
 //================== STYLES e SCRIPTS ====================