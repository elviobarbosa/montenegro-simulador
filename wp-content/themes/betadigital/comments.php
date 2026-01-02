<?php
/**
 * Comments template
 *
 * @package WordPress
 * @subpackage beta_digital
 * @since beta_digital 1.0
 */

if (post_password_required()) {
	return;
}
?>

<div id="comments" class="comments__area">
    

	<?php if (have_comments()) : ?>
		<h2 class="comments__title">
			<?php
			$comments_number = get_comments_number();
			if (1 === $comments_number) {
				printf(
					/* translators: %s: Post title. */
					esc_html_e('One response to &ldquo;%s&rdquo;', 'beta_digital'),
					''
				);
			} else {
				printf(
					/* translators: 1: Number of comments, 2: Post title. */
					esc_html(_nx('%1$s comentario', '%1$s comentarios', $comments_number, 'comments title', 'beta_digital')),
					number_format_i18n($comments_number),
					''
				);
			}
			?>
		</h2>

        <?php comment_form(); ?>

		<?php the_comments_navigation(); ?>

		<ol class="comments__list">
			<?php
			wp_list_comments(array(
				'style'      => 'ol',
				'short_ping' => true,
			));
			?>
		</ol>

		<?php the_comments_navigation(); ?>

	<?php endif; // Check for have_comments(). ?>

	<?php
	if (!comments_open() && get_comments_number() && post_type_supports(get_post_type(), 'comments')) :
		?>
		<p class="comments__none"><?php esc_html_e('Comments are closed.', 'beta_digital'); ?></p>
	<?php endif; ?>

	

</div><!-- #comments -->
