<?php
/**
 * Helpers para carregar templates com parâmetros
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

if ( ! function_exists( 'empreendimento_cover' ) ) {
  function empreendimento_cover( $args = [] ) {
    load_component( 'empreendimento-cover', $args );
  }
}

if ( ! function_exists( 'empreendimento_simulador_mini' ) ) {
  function empreendimento_simulador_mini( $args = [] ) {
    load_component( 'empreendimento-simulador-mini', $args );
  }
}

if ( ! function_exists( 'vantagens_financiamento' ) ) {
  function vantagens_financiamento( $args = [] ) {
    load_component( 'vantagens-financiamento', $args );
  }
}

if ( ! function_exists( 'map' ) ) {
  function map( $args = [] ) {
    load_component( 'map', $args );
  }
}

if ( ! function_exists( 'box-simulador' ) ) {
  function box_simulador( $args = [] ) {
    load_component( 'box-simulador', $args );
  }
}

if ( ! function_exists( 'faq' ) ) {
  function faq( $args = [] ) {
    load_component( 'faq', $args );
  }
}
