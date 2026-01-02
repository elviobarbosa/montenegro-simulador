<?php
var_dump(get_template_directory());
function register_hero_slider_block() {
  register_block_type(__DIR__ . '/app/blocks/hero-slider');
}
add_action('init', 'register_hero_slider_block');


/*=====================
HERO
======================*/
function hero_slider_block_assets() {
  wp_enqueue_script(
    'hero-slider-block-script',
    get_template_directory_uri() . '/app/blocks/hero-slider/index.js',
    array('wp-blocks', 'wp-element', 'wp-editor'),
    filemtime(get_template_directory() . '/app/blocks/hero-slider/index.js')
  );
  
  wp_enqueue_style(
    'hero-slider-block-style',
    get_template_directory_uri() . '/app/blocks/hero-slider/style.css',
    array(),
    filemtime(get_template_directory() . '/app/blocks/hero-slider/style.css')
  );
}
add_action('enqueue_block_editor_assets', 'hero_slider_block_assets');
add_action('wp_enqueue_scripts', 'hero_slider_block_assets');