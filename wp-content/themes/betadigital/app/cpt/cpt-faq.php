<?php

function posttype_faq() 
{    
    $labels = array(
        'name'                => ( 'FAQ'),
        'singular_name'       => ( 'FAQ'),
        'menu_name'           => ( 'FAQ'),
        'parent_item_colon'   => ( 'FAQ'),
        'all_items'           => ( 'All'),
        'view_item'           => ( 'View'),
        'add_new_item'        => ( 'Add new'),
        'add_new'             => ( 'Add new'),
        'edit_item'           => ( 'Edit'),
        'update_item'         => ( 'Update'),
        'search_items'        => ( 'Search'),
        'not_found'           => ( 'Not found'),
        'not_found_in_trash'  => ( 'Not found')
    );
    
    register_post_type( 'post_faq',
        array(
            'show_ui' => true,
            'menu_icon'         => 'dashicons-editor-help',
            'labels'            => $labels,
            'public'            => true,
            'show_in_menu'      => true,
            'show_in_nav_menus' => true,
            'menu_position'     => 5,
            'has_archive'       => false,
            'hierarchical'      => true,
            'rewrite'           => array('slug' => 'faq'),
            'supports'          => array( 'title', 'editor'),
        )
    );
}

add_action( 'init', 'posttype_faq' );