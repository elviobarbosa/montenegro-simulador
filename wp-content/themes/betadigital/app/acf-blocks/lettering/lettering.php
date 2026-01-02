<?php
/**
 * Lettering Block template.
 *
 * @param array $block The block settings and attributes.
 */

 $description = get_field('description');

 
?>
<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ); ?> block-lettring" style="<?php echo esc_attr( $style ); ?>">

    <div class="block-lettring__text">
        <?php 
        if (empty($description)) {
            echo 'Add a description';
        } else {
            echo $description;
        }

        ?>
    </div>

</section>

<?php
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents( get_template_directory() . '/dist/styles/frontend.css' ) . '</style>';
endif; 
