<?php
/**
 * Blog Block template.
 *
 * @param array $block The block settings and attributes.
 */

 $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
 if (isset($_GET['cat'])) {
    $category = get_category_by_slug(sanitize_text_field($_GET['cat']));
    if ($category) {
        $cat_id = $category->term_id;
        $argsQuery = array(
            'cat'               => $cat_id,
            'post_type'         => 'post',
            'posts_per_page'    => 12,
            'paged'             => $paged
        );
    
    } else {
        echo '<p>' . __('No se han encontrado publicaciones', 'beta_digital') . '</p>';
    }
} else {
    $argsQuery = array(
        'post_type'         => 'post',
        'post_status'       => 'publish',
        'posts_per_page'    => 12,
        'paged'             => $paged
    );
}

$query = new WP_Query($argsQuery);
?>

<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ); ?> blog-block" style="<?php echo esc_attr( $style ); ?>">
    <div class="blog-block__container grid" data-js="masonry">
        <?php 
        if ($query->have_posts()) : 
            while ($query->have_posts()) : 
                $query->the_post(); ?>
                <article class="blog-block__wrapper grid-item">
                    
                    <div class="blog-block__image">
                        <div class="blog-block__image-wrapper">
                            <div class="proportional__wrapper">
                                <a href="<?php echo get_permalink(); ?>" alt="<?php the_title(); ?>">
                                <?php
                                    $post_thumbnail_id = get_post_thumbnail_id(get_the_ID());
                                    echo wp_get_attachment_image($post_thumbnail_id, 'large');
                                ?>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="blog-block__header">
                        <div class="blog-block__writer">
                            <div class="blog-block__avatar">
                                <?php
                                echo get_avatar(get_the_author_meta('ID'));
                                ?>
                            </div>
                            <div class="blog-block__date">
                                <strong>
                                <?php
                                echo get_the_author();
                                ?>
                                </strong><br>
                                <?php
                                echo get_the_date();
                                ?>
                            </div>
                        </div>

                        <div class="blog-block__share" data-js="share">
                            <?php _e('Compartir', 'beta_digital'); ?>
                            <svg>
                                <use href="<?php echo SVGPATH ?>ico-share"></use>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="blog-block__content">
                        <div class="blog-block__text">
                            <h2 class="blog-block__title">
                                <a href="<?php echo get_permalink(); ?>" alt="<?php the_title(); ?>">
                                    <?php the_title(); ?>
                                </a>
                            </h2>
                            <div class="blog-block__description">
                            <?php 
                            echo get_excerpt(100, get_the_ID() );
                            ?>
                            </div>
                        </div>
                    </div>

                    <div class="blog-block__comments">
                        <?php
                        $comments_count = get_comments_number();
                        $comments = sprintf( _n( '%s comentário', '%s comentários', $comments_count, 'beta_digital' ), $comments_count );
                        echo '<p>' . $comments . ' </p>';
                        ?>
                    </div>
            </article>
                <?php
            endwhile;
            wp_reset_postdata();
        else :
            echo '<p>' . __('No posts found', 'textdomain') . '</p>';
        endif;
        ?>
    </div>
    
    <div class="blog-block__pagination">
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
