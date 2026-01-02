<?php
/**
 * Timeline Block template.
 *
 * @param array $block The block settings and attributes.
 */

$data = [
    'slidesPerView' => 'auto',
    'spaceBetween'  => 100,
    'navigation' => [
        'nextEl' => '.swiper-button-next',
        'prevEl' => '.swiper-button-prev'
    ]
];
$argsQuery = array(
    'post_type'         => 'post_timeline',
    'post_status'       => 'publish',
    'posts_per_page'    => -1
);
$title = get_field('title');
$description = get_field('description');
$post_list = get_posts($argsQuery);
$params = 'data-params=\''. wp_json_encode( $data )  .'\'';
if (count($post_list) > 0):
?>
<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ); ?> timeline" style="<?php echo esc_attr( $style ); ?>">
    <div class="timeline__container">
        <div><h2 class="timeline__title"><?php echo $title ?></h2></div>
        <div class="timeline__description"><?php echo $description ?></div>
        <div class="swiper" <?php echo $params ?>>
            <div class="swiper-wrapper timeline__wrapper">
                <?php
                foreach ( $post_list as $post ) :
                    setup_postdata($post);
                    $postContent = get_the_content($post->ID);
                    $postYear = get_the_title($post->ID);
                    ?>
                    <div class="swiper-slide timeline__slider">
                        <div class="timeline__year"><span><?php echo $postYear ?></span></div>
                        <div class="timeline__content"><?php echo  $postContent ?></div>
                    </div>
                    <?php
                endforeach;
                wp_reset_postdata();
                ?>
                
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
        
    </div>
</section>
<?php
endif;
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents( get_template_directory() . '/dist/styles/frontend.css' ) . '</style>';
endif; 
