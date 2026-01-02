<?php
/**
 * Cover Block template.
 *
 * @param array $block The block settings and attributes.
 */

 $description = get_field('description');
 $image = get_field('image');
 $raw_variation = get_field('variation');
 $variation = 'media-text--' . $raw_variation;
 
?>
<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ) . ' ' . esc_attr( $variation ); ?> media-text" style="<?php echo esc_attr( $style ); ?>">
			
    <div class="media-text__container">
        <div class="media-text__wrapper">
            <div class="media-text__content">
                <div class="media-text__text">
                    <?php 
                    if (empty($description)) {
                        echo 'Adicione uma descrição';
                    } else {
                        the_field('description');
                    }

                    ?>
                </div>
            </div>

            <div class="media-text__image">
                <div class="media-text__image-wrapper">
                <?php
                if (!empty($image)) {
                    echo wp_get_attachment_image($image['id'], 'large');
                }
                ?>
                </div>
            </div>

        </div>

    </div>

</section>

<?php
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents( get_template_directory() . '/dist/styles/frontend.css' ) . '</style>';
endif; 
