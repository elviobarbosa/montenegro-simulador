<?php
/**
 * Tools Block template.
 *
 * @param array $block The block settings and attributes.
 */

$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
$argsQuery = array(
    'post_type'         => 'post_tools',
    'post_status'       => 'publish',
    'posts_per_page'    => 12,
    'paged'             => $paged
);
$query = new WP_Query($argsQuery);
?>

<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ); ?> tools-block" style="<?php echo esc_attr( $style ); ?>">
    <div class="tools-block__container">
        <?php 
        if ($query->have_posts()) : 
            while ($query->have_posts()) : 
                $query->the_post(); 
                $urlObj = (get_field('tools_type', get_the_ID()) === 'link') ? get_field('url', get_the_ID()) : get_field('file', get_the_ID());
                ?>
                <div class="tools-block__wrapper">
                    <div class="tools-block__image">
                        <div class="tools-block__image-wrapper">
                            <div class="proportional__wrapper">
                                <?php
                                    $post_thumbnail_id = get_post_thumbnail_id(get_the_ID());
                                    echo wp_get_attachment_image($post_thumbnail_id, 'large');
                                ?>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tools-block__content">
                        <div class="tools-block__text">
                            <?php 
                            echo get_the_content();
                            ?>
                        </div>

                        <div class="tools-block__link">
                            <a class="btn btn--secondary" alt="<?php echo $urlObj['title']; ?>" href="<?php echo $urlObj['url']; ?>" target="_blank">
                                <?php echo _e('Leer más', 'beta_digital'); ?>
                                <svg>
                                    <use href="<?php echo SVGPATH ?>arrow"></use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <?php
            endwhile;
            wp_reset_postdata();
        else :
            echo '<p>' . __('No posts found', 'textdomain') . '</p>';
        endif;
        ?>
    </div>
    
    <div class="tools-block__pagination">
        <?php
        echo paginate_links(array(
            'total' => $query->max_num_pages,
            'current' => $paged,
            'prev_text' => __('&lt;', 'textdomain'),
            'next_text' => __('&gt;', 'textdomain'),
        ));
        ?>
    </div>
</section>

<?php
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents(get_template_directory() . '/dist/styles/frontend.css') . '</style>';
endif; 
?>
