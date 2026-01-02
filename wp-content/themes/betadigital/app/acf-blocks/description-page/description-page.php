<?php
/**
 * Description Page Block template.
 *
 * @param array $block The block settings and attributes.
 */

 $title = get_field('title');
 $raw_variation = get_field('variation');
 $description = get_field('description');
 $image = get_field('image');
 $variation = 'description-page--' . $raw_variation;
 $hiden_on_desktop = ($raw_variation === 'about') ? 'hiden-on-desktop' : '';
 $contact = get_field('form');

?>
<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ) . ' ' . $variation; ?> description-page" style="<?php echo esc_attr( $style ); ?>">
			
    <div class="description-page__container">
        <div class="description-page__wrapper">
            <div class="description-page__title-wrapper">
                <h2 class="description-page__title">
                <?php
                if (empty($title)) {
                    echo 'Add a title';
                } else {
                    $strippedTitle = preg_replace('/<(?!br)[^>]*>(.*?)<\/(?!br)[^>]*>/s', '$1', $title);
                    echo $strippedTitle;
                }
                ?>
                </h2>

                <?php
                if ($raw_variation === 'about') :
                    ?>
                    <div class="description-page__image hiden-on-mobile">
                        <?php
                        if (!empty($image)) {
                            echo wp_get_attachment_image($image['id']);
                        }
                        ?>
                    </div>
                <?php
                endif;
                ?>
            </div>
                
            <div class="description-page__content">               
                <div class="description-page__description">
                    <div class="description-page__text">
                        <?php 
                        if (empty($description)) {
                            echo 'Add a description';
                        } else {
                            echo  $description;
                        }

                        if ($raw_variation === 'blog') :
                        ?>
                        <a class="btn btn--primary" href="<?php echo site_url('contacto') ?>"><?php _e('COLABORA CON NUESTRO BLOG') ?></a>
                        <?php
                        endif
                        ?>
                    </div>
                </div>
                
                <?php if(!empty($contact)) : ?>
                <div class="description-page__contact">
                    <?php
                    
                        echo $contact['post_title'];
                        echo do_shortcode('[contact-form-7 id="'.$contact[0]->ID.'" title="'.$contact[0]->post_title.'"]');
                    
                    ?>
                </div>
                <?php endif; ?>
            </div>

            <div class="description-page__image-wrapper <?php echo $hiden_on_desktop ?>">
                <div class="description-page__image">
                    <?php
                    if (!empty($image)) {
                        echo wp_get_attachment_image($image['id']);
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
