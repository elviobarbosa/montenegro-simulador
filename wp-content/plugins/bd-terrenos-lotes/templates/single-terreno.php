<?php
/**
 * Template para exibir o simulador do terreno
 */

get_header();

$post_id = get_the_ID();

// Carrega as funções de templates do tema se existirem
if (function_exists('empreendimento_cover')) {
    empreendimento_cover();
}
?>

<div class="map__contaier" id="map">
    <div class="box-simulador__container">
        <?php
        if (function_exists('box_simulador')) {
            box_simulador();
        } else {
            get_template_part('template-parts/components/box-simulador');
        }
        ?>
    </div>
    <div class="map__wrapper">
        <?php echo do_shortcode('[terreno_mapa id="' . $post_id . '"]'); ?>
    </div>
</div>

<?php
if (function_exists('vantagens_financiamento')) {
    vantagens_financiamento();
}

if (function_exists('faq')) {
    faq();
}

get_footer();
?>
