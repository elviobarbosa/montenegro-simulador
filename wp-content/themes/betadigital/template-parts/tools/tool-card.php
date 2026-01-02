<div class="tool-card">
    <div class="tool-card__image">
        <?php echo wp_get_attachment_image($args['image_id']); ?>
    </div>
    <div class="tool-card__content">
        <div class="tool-card__description">
            <?php echo $args['description']; ?>
        </div>
        <div class="tool-card__link">
            <a 
            href="<?php echo $args['link']; ?>">
                <img src="<?php echo get_template_directory_uri() . '/assets/images/arrow-right.svg'; ?>" alt="<?php echo $args['title']; ?>">
                <?php echo $args['cta']; ?>
                </a>
        </div>
    </div>
</div>