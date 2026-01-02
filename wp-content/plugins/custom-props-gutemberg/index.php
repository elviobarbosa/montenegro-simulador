<?php
/**
 * Plugin Name: Block Customization System
 * Description: Sistema modular para adicionar customizações aos blocos nativos do WordPress Gutenberg
 * Version: 1.0.0
 * Author: Elvio Barbosa
 */

// Previne acesso direto
if (!defined('ABSPATH')) {
    exit;
}

class BlockCustomizationSystem {
    
    private $block_customizations = array();
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        $this->register_customizations();
    }
    
    public function init() {
        // Registra os scripts do editor
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
        
        // Adiciona CSS no frontend
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_styles'));
    }
    
    /**
     * Registra todas as customizações de blocos
     */
    private function register_customizations() {
        // Customizações para o bloco de imagem
        $this->add_block_customization('core/image', array(
            'hiddenOnMobile' => array(
                'type' => 'boolean',
                'default' => false,
                'control' => 'toggle',
                'label' => 'Ocultar no mobile',
                'help' => array(
                    'checked' => 'Imagem será ocultada em dispositivos móveis',
                    'unchecked' => 'Imagem será visível em todos os dispositivos'
                ),
                'css_class' => 'hidden-on-mobile'
            )
        ));
        
        // Customizações para blocos de texto (paragraph, heading)
        $text_alignment_config = array(
            'mobileTextAlign' => array(
                'type' => 'string',
                'default' => 'default',
                'control' => 'select',
                'label' => 'Alinhamento no Mobile',
                'help' => 'Escolha como o texto será alinhado em dispositivos móveis',
                'options' => array(
                    'default' => 'Padrão',
                    'left' => 'Esquerda',
                    'center' => 'Centro',
                    'right' => 'Direita',
                    'justify' => 'Justificado'
                ),
                'css_class_prefix' => 'mobile-text-align-'
            )
        );
        
        $this->add_block_customization('core/paragraph', $text_alignment_config);
        $this->add_block_customization('core/heading', $text_alignment_config);
        $this->add_block_customization('core/list', $text_alignment_config);
        
        // Permite outros plugins adicionarem customizações
        do_action('block_customization_register', $this);
    }
    
    /**
     * Adiciona customização para um bloco específico
     */
    public function add_block_customization($block_name, $attributes) {
        if (!isset($this->block_customizations[$block_name])) {
            $this->block_customizations[$block_name] = array();
        }
        
        $this->block_customizations[$block_name] = array_merge(
            $this->block_customizations[$block_name],
            $attributes
        );
    }
    
    /**
     * Retorna todas as customizações registradas
     */
    public function get_customizations() {
        return $this->block_customizations;
    }
    
    /**
     * Enfileira scripts do editor Gutenberg
     */
    public function enqueue_block_editor_assets() {
        wp_enqueue_script(
            'block-customization-editor',
            plugin_dir_url(__FILE__) . 'editor.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-compose', 'wp-data'),
            '1.0.0',
            true
        );
        
        // Passa as configurações para o JavaScript
        wp_localize_script('block-customization-editor', 'blockCustomizations', array(
            'customizations' => $this->block_customizations
        ));
        
        wp_enqueue_style(
            'block-customization-editor-style',
            plugin_dir_url(__FILE__) . 'editor.css',
            array(),
            '1.0.0'
        );
    }
    
    /**
     * Enfileira estilos do frontend
     */
    public function enqueue_frontend_styles() {
        wp_enqueue_style(
            'block-customization-frontend',
            plugin_dir_url(__FILE__) . 'frontend.css',
            array(),
            '1.0.0'
        );
    }
}

// Inicializa o plugin
$block_customization_system = new BlockCustomizationSystem();