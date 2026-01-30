<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Custom Post Type para FAQ
 */
class TerrenosLotes_CPT_FAQ {

    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
    }

    public function register_post_type() {
        $labels = array(
            'name'                => __('FAQ', 'terrenos-lotes'),
            'singular_name'       => __('FAQ', 'terrenos-lotes'),
            'menu_name'           => __('FAQ', 'terrenos-lotes'),
            'parent_item_colon'   => __('FAQ', 'terrenos-lotes'),
            'all_items'           => __('FAQ', 'terrenos-lotes'),
            'view_item'           => __('View', 'terrenos-lotes'),
            'add_new_item'        => __('Add new', 'terrenos-lotes'),
            'add_new'             => __('Add new', 'terrenos-lotes'),
            'edit_item'           => __('Edit', 'terrenos-lotes'),
            'update_item'         => __('Update', 'terrenos-lotes'),
            'search_items'        => __('Search', 'terrenos-lotes'),
            'not_found'           => __('Not found', 'terrenos-lotes'),
            'not_found_in_trash'  => __('Not found', 'terrenos-lotes')
        );

        register_post_type('post_faq',
            array(
                'show_ui'           => true,
                'menu_icon'         => 'dashicons-editor-help',
                'labels'            => $labels,
                'public'            => true,
                'show_in_menu'      => 'edit.php?post_type=terreno',
                'show_in_nav_menus' => true,
                'has_archive'       => false,
                'hierarchical'      => true,
                'rewrite'           => array('slug' => 'faq'),
                'supports'          => array('title', 'editor'),
            )
        );
    }
}
