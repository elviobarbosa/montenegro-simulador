<?php

function posttype_features() 
{    
    $labels = array(
        'name'                => ( 'Vantagens financiamento'),
        'singular_name'       => ( 'Vantagens financiamento'),
        'menu_name'           => ( 'Vantagens financiamento'),
        'parent_item_colon'   => ( 'Vantagens financiamento'),
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
    
    register_post_type( 'post_features',
        array(
            'show_ui' => true,
            'menu_icon'         => 'dashicons-heart',
            'labels'            => $labels,
            'public'            => true,
            'show_in_menu'      => true,
            'show_in_nav_menus' => true,
            'menu_position'     => 5,
            'has_archive'       => false,
            'hierarchical'      => true,
            'rewrite'           => array('slug' => 'vantagens-financiamento'),
            'supports'          => array( 'title', 'editor', 'thumbnail'),
        )
    );
}

add_action( 'init', 'posttype_features' );