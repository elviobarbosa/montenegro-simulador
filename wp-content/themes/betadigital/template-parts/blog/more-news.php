<div class="single-blog__container">
    <div class="">
        <div class="read-more">
            <?php
                $orig_post = $post;
                global $post;
                $tags = wp_get_post_categories($post->ID, array( 'fields' => 'all' ));
                
                if ($tags) :
            ?>
                    <h2 class="read-more__title">Leia Também</h2>

                    <div class="read-more__body">
                        <?php
                            $tag_ids = array();
                            foreach($tags as $individual_tag) $tag_ids[] = $individual_tag->term_id;
                            $args = array(
                                'category__in' => $tag_ids,
                                'post__not_in' => array($post->ID),
                                'posts_per_page'=>2,
                                'caller_get_posts'=>1
                            );
                            $my_query = new wp_query( $args );
                            
                            while( $my_query->have_posts() ) :
                                $my_query->the_post();
                            ?>
                            <div class="read-more__item">
                                <time 
                                    class="read-more__date" 
                                    datetime="<?php echo get_the_date( 'Y-d-m' ) ?> <?php the_time( 'H:i:s' ) ?>">
                                    <?php echo get_the_date( 'j M Y' ) ?>
                                </time>
                                <h3 class="read-more__subtitle"><a href="<?php the_permalink() ?>"><?php the_title() ?></a></h3>
                                <p class="read-more__text"><?php echo getExcerpt(200, $post->ID) ?></p>
                            </div>
                            <?php endwhile;
                        endif;
                        $post = $orig_post;
                        wp_reset_query();
                    ?>
            </div><!--read-more__body-->
        </div><!--read-more-->
    </div><!--container-->
</div><!--single-blog__container-->