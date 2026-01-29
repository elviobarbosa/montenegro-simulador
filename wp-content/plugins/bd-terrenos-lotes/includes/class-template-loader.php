<?php
/**
 * Template Loader para Terrenos e Lotes
 * Carrega templates do plugin em vez do tema
 */

if (!defined('ABSPATH')) {
    exit;
}

class TerrenosLotes_TemplateLoader {

    public function __construct() {
        $this->register_template_functions();
        $this->register_template_override();
    }

    /**
     * Sobrescreve o template do WordPress para usar o template do plugin
     */
    private function register_template_override() {
        add_filter('template_include', [$this, 'load_plugin_template'], 99);
    }

    /**
     * Carrega o template do plugin para CPT terreno
     */
    public function load_plugin_template($template) {
        if (is_singular('terreno')) {
            $plugin_template = plugin_dir_path(dirname(__FILE__)) . 'templates/single-terreno.php';

            if (file_exists($plugin_template)) {
                return $plugin_template;
            }
        }

        return $template;
    }

    /**
     * Registra funções auxiliares para carregar templates
     */
    private function register_template_functions() {

        // Função principal para carregar componentes do plugin
        if (!function_exists('terrenos_load_template')) {
            function terrenos_load_template($slug, $args = []) {
                if (!empty($args) && is_array($args)) {
                    extract($args, EXTR_SKIP);
                }

                $template_path = plugin_dir_path(dirname(__FILE__)) . "templates/{$slug}.php";

                if (file_exists($template_path)) {
                    include $template_path;
                } else {
                    // Fallback para o tema (retrocompatibilidade)
                    $theme_template = locate_template("template-parts/components/{$slug}.php");
                    if (!empty($theme_template)) {
                        include $theme_template;
                    }
                }
            }
        }

        // Função helper: Box Simulador
        if (!function_exists('box_simulador')) {
            function box_simulador($args = []) {
                terrenos_load_template('box-simulador', $args);
            }
        }

        // Função helper: Empreendimento Cover
        if (!function_exists('empreendimento_cover')) {
            function empreendimento_cover($args = []) {
                terrenos_load_template('empreendimento-cover', $args);
            }
        }

        // Função helper: Empreendimento Simulador Mini
        if (!function_exists('empreendimento_simulador_mini')) {
            function empreendimento_simulador_mini($args = []) {
                terrenos_load_template('empreendimento-simulador-mini', $args);
            }
        }

        // Função helper: Map
        if (!function_exists('map')) {
            function map($args = []) {
                terrenos_load_template('map', $args);
            }
        }

        // Função helper: Button (usada nos templates)
        if (!function_exists('button')) {
            function button($args = []) {
                $defaults = [
                    'label' => 'Clique aqui',
                    'url'   => '#',
                    'class' => '',
                    'alt'   => '',
                    'data-js' => ''
                ];

                $args = wp_parse_args($args, $defaults);

                $html = sprintf(
                    '<a href="%s" class="button %s" alt="%s" data-js="%s">%s</a>',
                    esc_url($args['url']),
                    esc_attr($args['class']),
                    esc_attr($args['alt']),
                    esc_html($args['data-js']),
                    esc_html($args['label']),
                );

                echo $html;
            }
        }
    }
}
