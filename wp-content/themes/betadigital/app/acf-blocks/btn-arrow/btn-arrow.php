<?php
/**
 * Button Block template.
 *
 * @param array $block The block settings and attributes.
 */

 $link = get_field('link');
 $variation = get_field('variation');
?>
<section 
<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    <?php echo esc_attr( $anchor ); ?> 
    class="<?php echo esc_attr( $class_name ); ?> button-arrow" 
    style="<?php echo esc_attr( $style ); ?>">
    
    <div class="button-arrow__container">
        <?php
        if (!empty($link)) :
            ?>
            <a 
            href="<?php echo $link['url']; ?>" 
            title="<?php echo $link['title']; ?>" 
            target="<?php echo $link['target']; ?>"
            class="btn btn--<?php echo $variation; ?>">
                <?php echo $link['title']; ?>
            
            <?php if ($variation === 'secondary'): ?>
            <svg>
				<use href="<?php echo SVGPATH ?>arrow"></use>
			</svg>
            <?php endif; ?>
            </a>
            <?php
        else :
            ?>
            <a href="#" class="btn btn--<?php echo $variation; ?>">
                Add a link
            </a>
            <?php
        endif;
        ?>
    </div>
</section>

<?php
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents( get_template_directory() . '/dist/styles/frontend.css' ) . '</style>';
endif; 
