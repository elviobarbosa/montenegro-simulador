<?php
function prod_taxonomies() {
    $taxonomies = get_terms( array(
        'taxonomy' => 'prod_category',
        'parent'   => 0, 
    ) );
    $result = '';
    
    foreach ($taxonomies as $taxonomy) {
        if ($taxonomy->parent == 0) {
            $url = '/produtos-por-categoria/' . $taxonomy->slug;
            $result .= '<li class="taxonomy-list__item">
                <a 
                class="taxonomy-list__link" 
                href="'.esc_url( home_url( $url ) ) .'" 
                alt="'. $taxonomy->name .'">'. $taxonomy->name .'
                <svg class="" viewBox="0 0 23 14">
					<use href="'. SVGPATH .'arrow-red"></use>
				</svg></a></li>';
        }
    }
   
    return '<ul class="taxonomy-list">' .$result. '</ul>';
}
add_shortcode('prod-taxonomies', 'prod_taxonomies');