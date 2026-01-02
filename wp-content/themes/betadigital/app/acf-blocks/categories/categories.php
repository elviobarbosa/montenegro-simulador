<?php
/**
 * Categories Block template.
 *
 * @param array $block The block settings and attributes.
 */
$current_category = sanitize_text_field($_GET['cat']);
?>

<section <?php echo esc_attr( $anchor ); ?> class="<?php echo esc_attr( $class_name ); ?>" style="<?php echo esc_attr( $style ); ?>">
    <ul class="block-categories">
        <li>
            <a 
            class="block-categories__link <?php echo ($current_category == '') ? 'active' : ''; ?>" 
            href="<?php echo site_url("/blog")?>">
                <?php _e('Ver todos', 'beta_digital'); ?>
            </a>
        </li>
    <?php
        $all_categories = get_categories();
        foreach ($all_categories as $category) {
            if ($category->category_parent == 0 && $category->count > 0) {
                $has_cat = ($current_category == $category->slug) ? 'active' : '';
                echo '<li><a href="' . get_category_link($category->term_id) . '" class="block-categories__link ' . $has_cat . '">' . $category->name . '</a></li>';
            }
        }
    ?>
    </ul>
</section>

<?php
if ($is_preview && is_admin()) :
    echo '<style scoped>' . file_get_contents(get_template_directory() . '/dist/styles/frontend.css') . '</style>';
endif; 
?>
