<?php
function register_acf_blocks() {
    /**
     * We register our block's with WordPress's handy
     * register_block_type();
     *
     * @link https://developer.wordpress.org/reference/functions/register_block_type/
     */

	 $blocks = array(
		'cover', 
		// 'lettering',
		// 'media-text',
		// 'mission',
		// 'btn-arrow',
		// 'partners',
		// 'description-page',
		// 'timeline',
		// 'tools',
		// 'blog',
		// 'categories',
	);
	
	 foreach ($blocks as &$block) {
		register_block_type( __DIR__ . '/' . $block );
	 }
	
} 

function block_categories( $categories, $post ) {
	if ( 'page' !== $post->post_type ) {
		return $categories;
	}
	return array_merge(
		$categories,
		array(
			array(
				'slug'  => 'floresta-blocks',
				'title' => '- Blocos',
			),
		)
	);
}

add_filter( 'block_categories_all' , function( $categories ) {
	$categories[] = array(
		'slug'  => 'floresta-blocks',
		'title' => 'Floresta Blocks'
	);

	return $categories;
} );

add_action( 'init',  'register_acf_blocks' );
