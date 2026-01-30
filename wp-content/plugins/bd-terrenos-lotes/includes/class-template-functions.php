<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Funções de templates para carregar as seções
 */
class TerrenosLotes_TemplateFunctions {

    public function __construct() {
        // Registra as funções globalmente
        add_action('init', array($this, 'register_template_functions'));
    }

    /**
     * Registra as funções de template
     */
    public function register_template_functions() {
        // Nada a registrar no hook, as funções já estão disponíveis
    }
}

/**
 * Carrega o template de vantagens de financiamento
 */
if (!function_exists('vantagens_financiamento')) {
    function vantagens_financiamento() {
        $template_path = plugin_dir_path(dirname(__FILE__)) . 'templates/vantagens-financiamento.php';

        if (file_exists($template_path)) {
            include $template_path;
        }
    }
}

/**
 * Carrega o template de FAQ
 */
if (!function_exists('faq')) {
    function faq() {
        $template_path = plugin_dir_path(dirname(__FILE__)) . 'templates/faq.php';

        if (file_exists($template_path)) {
            include $template_path;
        }
    }
}
