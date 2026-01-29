<?php
/**
 * Template para exibir o simulador do terreno
 * Template INDEPENDENTE - Usa header e footer do plugin
 */

// Carrega header do plugin (não do tema)
include plugin_dir_path(__FILE__) . 'header-terreno.php';

$post_id = get_the_ID();
?>

<!-- Wrapper para isolar CSS do plugin -->
<div class="terrenos-lotes-wrapper">

    <?php
    // Empreendimento Cover (topo)
    if (function_exists('empreendimento_cover')) {
        empreendimento_cover();
    }
    ?>

    <!-- Mapa e Simulador -->
    <div class="map__contaier" id="map">
        <div class="box-simulador__container">
            <?php
            if (function_exists('box_simulador')) {
                box_simulador();
            }
            ?>
        </div>
        <div class="map__wrapper">
            <?php echo do_shortcode('[terreno_mapa id="' . $post_id . '"]'); ?>
        </div>
    </div>

    <?php
    // Seções adicionais (se as funções existirem no tema customizado)
    if (function_exists('vantagens_financiamento')) {
        vantagens_financiamento();
    }

    if (function_exists('faq')) {
        faq();
    }
    ?>

</div>

<?php
// Carrega footer do plugin (não do tema)
include plugin_dir_path(__FILE__) . 'footer-terreno.php';
?>
