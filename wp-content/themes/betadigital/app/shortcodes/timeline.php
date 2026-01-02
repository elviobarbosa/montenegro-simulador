<?php
function timeline($atts) {
    $empresa = $atts['empresa'];
    $argsQuery = array(
        'post_type'         => 'post_timeline',
        'post_status'       => 'publish',
        'posts_per_page'    => -1,
        'meta_query'     => array(
            array(
                'key'   => 'empresa', 
                'value' => $empresa,
            ),
        ),
    );
    $post_list = get_posts($argsQuery);
    $data = [
        'slidesPerView' => 'auto',
        'spaceBetween'  => 30,
        'pagination' => [
            'el' => '.swiper-pagination',
            'clickable' => true
        ]
    ];
    $result = '<div class="swiper timeline" data-params=\''. wp_json_encode( $data )  .'\'>';
    $result .= '<div class="swiper-wrapper timeline__wrapper">';
    foreach ( $post_list as $post ) :
        setup_postdata($post);
        $postContent = get_the_content($post->ID);
        $postYear = get_field('ano', ($post->ID));
        $result .= '<div class="swiper-slide timeline__slider">';
        $result .= '<div class="timeline__year">'. $postYear .'</div>';
        $result .= '<div class="timeline__content">' . $postContent .'</div>';
        $result .= '</div>';
    endforeach;
    wp_reset_postdata();
    
    $result .= '</div><div class="swiper-pagination"></div></div>';

    return $result;
}
add_shortcode('timeline', 'timeline');