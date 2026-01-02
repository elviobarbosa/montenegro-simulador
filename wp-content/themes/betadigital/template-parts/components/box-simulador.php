<?php
$image_id = get_field('marca_empreendimento');
$feature_image = get_the_post_thumbnail( get_the_ID(), 'full' );
?>
<div class="box-simulador">
  <div class="box-simulador__header">
    <div class="box-simulador__status">
      <span>Disponível</span>
      <span>Vendido</span>
    </div>

    <div class="box-simulador__percentagem">
      <div>
          <strong>00%</strong>
          <span>VENDIDO</span>
    </div>
    </div>

    <div class="box-simulador__logo">
      <?php
      if (isset($image_id)) {
        echo wp_get_attachment_image($image_id, 'full');
      }
      ?>
    </div>
  </div>

  <div class="box-simulador__content">
    <div class="box-simulador__start">
      <h3>Clique no lote<br><span>e Comece Sua Simulação</span></h3>
    </div>
  </div>
</div>