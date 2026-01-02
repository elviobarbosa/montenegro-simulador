<?php
/**
 * Cover Block template.
 *
 * @param array $block The block settings and attributes.
 */

 $title = get_field('title');
 $description = get_field('description');
 $image = get_field('image');
 
?>
<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ); ?> block-mission" style="<?php echo esc_attr( $style ); ?>">
			
    <div class="block-mission__container">
        <div class="block-mission__wrapper">
            <div class="block-mission__title-wrapper">
                <h2 class="block-mission__title">
                <?php
                if (empty($title)) {
                    echo 'Add a title';
                } else {
                    echo strip_tags($title);;
                }
                ?>
                </h2>
            </div>
                
            <div class="block-mission__content">               
                <div class="block-mission__description">
                    <?php 
                    if (empty($description)) {
                        echo 'Add a description';
                    } else {
                        echo  $description;
                    }
                    ?>
                </div>
            </div>

            <div class="block-mission__image-wrapper">
                <div class="block-mission__image">
                
                </div>
            </div>

        </div>

    </div>

</section>

<?php
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents( get_template_directory() . '/dist/styles/frontend.css' ) . '</style>';
endif; 
