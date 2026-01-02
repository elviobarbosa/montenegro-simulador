<?php
$image_id = get_field('marca_empreendimento');
$feature_image = get_the_post_thumbnail( get_the_ID(), 'full' );
?>
<div class="empreendimento-cover">
  <div class="empreendimento-cover__container">
    <div class="empreendimento-cover__content">
        <h1>
          Financiamento Imobiliário<br>
          Montenegro Urbanismo
        </h1>
        <h3>Financie até 90% do valor do seu lote com a melhor condição do mercado.</h3>
    </div>

    <div class="empreendimento-cover__simulator">
      <div class="empreendimento-cover__logo">
      <?php
      if (isset($image_id)) {
        echo wp_get_attachment_image($image_id, 'full');
      }
      ?>
      </div>
      <p>Qual o valor da parcela?</p>
      <div class="empreendimento-cover__simulador-mini">
        <?php empreendimento_simulador_mini() ?>
        <div style="text-align: center">
          <?php button(['label' => 'Simular agora', 'class'=> 'button--normal button--secondary', 'data-js'=>'scroll-to-simulador', 'alt'=>'Simular agora']); ?>
        </div>
      </div>
    </div>
  </div>
  <?php echo $feature_image ; ?>
</div>