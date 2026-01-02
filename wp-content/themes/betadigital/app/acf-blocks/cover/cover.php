<?php
/**
 * Slide Destaque Block template.
 *
 * @param array $block The block settings and attributes.
 */

 $anchor = '';
 if ( ! empty( $block['anchor'] ) ) {
     $anchor = 'id="' . esc_attr( $block['anchor'] ) . '" ';
 }
 $dataSlide = [
    'slidesPerView' => 'auto',
    'spaceBetween'  => 30,
    'pagination' => [
        'el' => '.swiper-pagination',
        'clickable' => true
    ],
    'navigation' => [
        'nextEl' => '.swiper-button-next',
        'prevEl' => '.swiper-button-prev',
    ]
];
$swiper = 'data-params=\''. wp_json_encode( $dataSlide )  .'\'';
 ?>
 <section <?php echo $anchor ?> class="cover-slider <?php echo esc_attr( $class_name ); ?>" style="<?php echo esc_attr( $style ); ?>">
	<div class="swiper" <?php echo $swiper ?>>
        <div class="swiper-wrapper">
            <?php
            if ($is_preview && !have_rows('slide')) {
                echo '<h2 class="title__heading title--medium title--text-white">No painel a direita adicione as informações necessárias.</h2>';
            }
            ?>
            <?php 
            if ( have_rows('slide') ) : 
                while( have_rows('slide') ) : the_row();
                    $title = get_sub_field('titulo');
                    $description = get_sub_field('descricao');
                    $picture = get_sub_field('imagem');
                    $picture_mobile = get_sub_field('imagem_mobile');
                    $link = get_sub_field('link');
                    ?>
                    <div class="swiper-slide">
                        <?php if ($picture) : 
                            ?>
                            <picture class="cover-slider__picture is--desktop">
                                <a href="<?php echo $link; ?>">
                                    <?php echo wp_get_attachment_image($picture, '', array( "class" => "img")); ?>
                                </a>
                            </picture>

                            <picture class="cover-slider__picture is--mobile">
                                <a href="<?php echo $link; ?>">
                                    <?php echo wp_get_attachment_image($picture_mobile, '', array( "class" => "img")); ?>
                                </a>
                            </picture>
                            <?php 
                            endif 
                        ?>
                    </div>
                    <?php 
                endwhile;
                ?>
                <?php 
            endif 
            ?>
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
	</div>
</section>
