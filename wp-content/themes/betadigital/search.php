<?php
get_header();

$argsCat = array(
	'hide_title_if_empty' => true,
)
?>

<section <?php post_class('search-page') ?>>

    <div class="search-page__container">
        <div class="search-page__posts">
			<?php if ( have_posts() ) { while ( have_posts() ) : the_post(); ?>
				<article class="blog-block__wrapper">
                    
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

                    </div>
                    
                    <div class="blog-block__content">
                        <div class="blog-block__text">
                            <h2 class="blog-block__title">
                                <a href="<?php echo get_permalink(); ?>" alt="<?php the_title(); ?>">
                                    <?php the_title(); ?>
                                </a>
                            </h2>
                            <div class="blog-block__description">
								<a href="<?php echo get_permalink(); ?>" alt="<?php the_title(); ?>">
									<?php 
									echo get_excerpt(300, get_the_ID() );
									?>
								</a>
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
			<?php endwhile; 
			} else { ?>
			<h2><?php _e('¡Sin resultados!', 'beta_digital'); ?></h2>
			<p><?php _e('Sentimos mucho pero no hemos encontrado lo que estabas buscando.', 'beta_digital'); ?></p>
			
			<?php }; ?>            
        </div>
    </div>
	<?php
	the_posts_pagination( array(
		'prev_text' => __( '<', 'textdomain' ),
		'next_text' => __( '>', 'textdomain' ),
	) );
	?>
</section>

<?php
get_footer();
?>