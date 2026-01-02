<?php
/**
 * Partners Block template.
 *
 * @param array $block The block settings and attributes.
 */


 $argsQuery = array(
    'post_type'         => 'post_partners',
    'post_status'       => 'publish',
    'posts_per_page'    => -1
);
$post_list = get_posts($argsQuery);
$images = '';
foreach ( $post_list as $post ) :
    setup_postdata($post);
    $post_thumbnail_id = get_post_thumbnail_id( $post->ID );
    $attachment = wp_get_attachment_image_src( $post_thumbnail_id );
    $width=$attachment[1];
    $height=$attachment[2];
    $images .= '<img src="' . get_the_post_thumbnail_url($post->ID) . '" title="' . get_the_title($post->ID) . '" width="' . $width . '" height="' . $height . '">';
endforeach;
wp_reset_postdata();
?>
<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ); ?> partners" style="<?php echo esc_attr( $style ); ?>">
    <div class="marquee partners__container">
        <div class="marquee-content">
        <?php
        echo $images . $images . $images . $images;
        
        ?>
        </div>
    </div>
</section>

<?php
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents( get_template_directory() . '/dist/styles/frontend.css' ) . '</style>';
endif; 
