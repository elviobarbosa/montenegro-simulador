<?php
$query = new WP_Query([
    'post_type' => 'post',
    'posts_per_page' => 6,
    'paged' => 1,
]);

$max_pages = $query->max_num_pages;

?>

<div id="ultimos-posts-container" data-paged="1" data-max-pages="<?php echo $max_pages; ?>">
	<div class="ultimos-posts__container">
    <?php
    if ($query->have_posts()) :
        while ($query->have_posts()) : $query->the_post();
            ?>
						<article class="item-post">
							<a href="<?php echo the_permalink() ?>" alt="Leia mais sobre: <?php echo get_the_title(); ?>">
								<?php
								if (has_post_thumbnail()) : ?>
									<div class="item-post__thumb">
										<figure>
											<?php the_post_thumbnail('medium'); ?>
										</figure>
									</div>
									<?php
								endif; ?>
								<div class="item-post__content-wrapper">
									<h2 class="item-post__title"><?php the_title(); ?></h2>
									<time class="item-post__time"><?php echo get_the_date(); ?></time>
									<p class="item-post__content"><?php echo get_the_excerpt(); ?></p>
								</div>
							</a>
						</article>
					<?php
        endwhile;
    endif;

    wp_reset_postdata();
    ?>
</div>
    <?php if ($max_pages > 1) : ?>
        <div class="ultimos-posts__carregar-mais-wrapper" data-js="carregar-mais-wrapper">
            <button id="carregar-mais-posts" data-js="carregar-mais-posts" class="button button--tertiary ultimos-posts__carregar-mais-posts">Mais Notícias</button>
        </div>
    <?php endif; ?>
</div>
