<?php

function posttype_partners() 
{    
    $labels = array(
        'name'                => ( 'Socios'),
        'singular_name'       => ( 'Socios'),
        'menu_name'           => ( 'Socios'),
        'parent_item_colon'   => ( 'Socios'),
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
    
    register_post_type( 'post_partners',
        array(
            'show_ui' => true,
            'menu_icon'         => 'dashicons-groups',
            'labels'            => $labels,
            'public'            => true,
            'show_in_menu'      => true,
            'show_in_nav_menus' => true,
            'menu_position'     => 5,
            'has_archive'       => false,
            'hierarchical'      => true,
            'rewrite'           => array('slug' => 'partners'),
            'supports'          => array( 'title', 'thumbnail'),
        )
    );
}

add_action( 'init', 'posttype_partners' );