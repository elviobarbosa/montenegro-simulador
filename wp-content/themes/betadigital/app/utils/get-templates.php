<?php
/**
 * Helpers para carregar templates com parâmetros
 *
 * IMPORTANTE: As funções relacionadas ao plugin Terrenos e Lotes
 * (empreendimento_cover, empreendimento_simulador_mini, map, box_simulador)
 * foram movidas para o plugin em: plugins/bd-terrenos-lotes/includes/class-template-loader.php
 */

if ( ! function_exists( 'load_component' ) ) {
  function load_component( $slug, $args = [] ) {
    if ( ! empty( $args ) && is_array( $args ) ) {
      extract( $args, EXTR_SKIP );
    }

    $template = locate_template( "template-parts/components/{$slug}.php" );

    if ( ! empty( $template ) ) {
      include $template;
    }
  }
}

// Funções do tema (não relacionadas ao plugin)

if ( ! function_exists( 'vantagens_financiamento' ) ) {
  function vantagens_financiamento( $args = [] ) {
    load_component( 'vantagens-financiamento', $args );
  }
}

if ( ! function_exists( 'faq' ) ) {
  function faq( $args = [] ) {
    load_component( 'faq', $args );
  }
}
