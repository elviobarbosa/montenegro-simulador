<?php 
$the_query = new WP_Query([
    'post_type'      => 'post_features',
    'posts_per_page' => -1,
]);

if ( $the_query->have_posts() ) : ?>
  
  <div class="vantagens">
    <?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
      
      <div class="vantagens__item">
        <div class="vantagens__content">
          <div class="vantagens__content-wrapper">
            <h2 class="vantagens__title"><?php the_title(); ?></h2>
            <div class="vantagens__description">
              <?php the_content(); ?>
            </div>
            <div class="vantagens__link">
            
            <?php
              button([
                'label'=>'Simular agora',
                'class'=>'button--primary button--normal'
              ])
            ?>
            </div>
          </div>
        </div>

        <div class="vantagens__image">
          <?php if ( has_post_thumbnail() ) : ?>
            <?php the_post_thumbnail( 'large' ); ?>
          <?php endif; ?>
        </div>
      </div>

    <?php endwhile; ?>
  </div>

<?php else : ?>
  <p><?php esc_html_e( 'Não há vantagens cadastradas.', 'seu-text-domain' ); ?></p>
<?php endif;

wp_reset_postdata();
?>
