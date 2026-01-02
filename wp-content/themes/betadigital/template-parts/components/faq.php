<?php
$query = new WP_Query([
	'post_type' => 'post_faq',
	'posts_per_page' => -1,
]);

if ($query->have_posts()) :
	echo '<div class="faq-bloco" data-js="faq">';
  echo '<h2>Perguntas frequentes sobre Financiamento de lotes</h2>';

	while ($query->have_posts()) : $query->the_post();
		?>
		<article class="faq-bloco__item" data-js="faq-item">
			<div class="faq-bloco__wrapper">
				<div data-js="faq-question">
					<h3 class="faq-bloco__question"><?php the_title(); ?></h3>
					<div class="faq-bloco__buttons">
						<svg role="img" aria-labelledby="minus button" data-js="faq-collapse" style="display:none; width:50px; height:50px;">
								<title id="minus">Minimizar</title>
								<use href="<?php echo SVGPATH ?>minus"></use>
						</svg>
						<svg role="img" aria-labelledby="plus button" data-js="faq-expand" style="width:50px; height:50px;">
								<title id="plus">Expandir</title>
								<use href="<?php echo SVGPATH ?>plus"></use>
						</svg>
					</div>
				</div>
				<div class="faq-bloco__answer" data-js="faq-answer"  style="display:none"><?php the_content(); ?></div>
			</div>
		</article>
		<?php
	endwhile;

	echo '</div>';
endif;

wp_reset_postdata();