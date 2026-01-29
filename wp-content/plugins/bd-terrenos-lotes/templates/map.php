<?php
global $post;
$slug_pagina = '';
$terreno_id = 0;

if ( isset( $post->post_name ) && $post->post_name ) {
  $slug_pagina = $post->post_name;
} else {
  $slug_pagina = get_post_field( 'post_name', get_queried_object_id() );
}

if ( !empty( $slug_pagina ) ) {
    $args = array(
      'post_type'      => 'terreno',
      'posts_per_page' => 1,
      'name'           => $slug_pagina,
      'post_status'    => 'publish',
      'fields'         => 'ids',
    );

    $query = new WP_Query( $args );

    if ( $query->have_posts() ) {
        $terreno_id = $query->posts[0];
    } else {
        echo 'Nenhum CPT com o mesmo slug encontrado.';
    }
    wp_reset_postdata();
} else {
    echo 'Slug da página não encontrado.';
}
?>
<div class="map__contaier" id="map">
  <div class="box-simulador__container">
    <?php
    box_simulador();
    ?>
  </div>
  <div class="map__wrapper">
    <?php 
    echo do_shortcode( '[terreno_mapa id="'.$terreno_id.'"]' );
    ?>
  </div>
  
</div>
