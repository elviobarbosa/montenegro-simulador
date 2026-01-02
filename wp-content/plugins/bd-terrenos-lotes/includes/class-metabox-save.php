<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
class TerrenosLotes_MetaBoxSave {
    
    public function __construct() {
        add_action('save_post', array($this, 'save_meta_boxes'));
    }
    
    public function save_meta_boxes($post_id) {
        // Log para debug (temporário)
        error_log('=== TERRENO SAVE INICIADO ===');
        error_log('Post ID: ' . $post_id);
        
        try {
            // Verificar nonce
            if (!isset($_POST['terreno_mapa_nonce']) || !wp_verify_nonce($_POST['terreno_mapa_nonce'], 'terreno_mapa_nonce')) {
                error_log('ERRO: Nonce inválido ou ausente');
                return;
            }
            
            // Verificar autosave
            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
                error_log('AVISO: Ignorando autosave');
                return;
            }
            
            // Verificar permissões
            if (!current_user_can('edit_post', $post_id)) {
                error_log('ERRO: Usuário sem permissão');
                return;
            }
            
            // Verificar se é o tipo de post correto
            if (get_post_type($post_id) !== 'terreno') {
                error_log('AVISO: Tipo de post diferente de terreno');
                return;
            }
            
            // Salvar id do empreendimento
            if (isset($_POST['empreendimento_id'])) {
                $empreendimento_id = sanitize_text_field($_POST['empreendimento_id']);
                update_post_meta($post_id, '_empreendimento_id', $empreendimento_id);
                error_log('Empreendimento id salvo: ' . $empreendimento_id);
            }

            // Salvar endereço
            if (isset($_POST['terreno_endereco'])) {
                $endereco = sanitize_text_field($_POST['terreno_endereco']);
                update_post_meta($post_id, '_terreno_endereco', $endereco);
                error_log('Endereco salvo: ' . $endereco);
            }
            
            // Salvar latitude
            if (isset($_POST['terreno_latitude'])) {
                $latitude = sanitize_text_field($_POST['terreno_latitude']);
                update_post_meta($post_id, '_terreno_latitude', $latitude);
                error_log('Latitude salva: ' . $latitude);
            }
            
            // Salvar longitude
            if (isset($_POST['terreno_longitude'])) {
                $longitude = sanitize_text_field($_POST['terreno_longitude']);
                update_post_meta($post_id, '_terreno_longitude', $longitude);
                error_log('Longitude salva: ' . $longitude);
            }
            
            // Salvar zoom
            if (isset($_POST['terreno_zoom'])) {
                $zoom = sanitize_text_field($_POST['terreno_zoom']);
                update_post_meta($post_id, '_terreno_zoom', $zoom);
                error_log('Zoom salvo: ' . $zoom);
            }
            
            // Salvar dados dos lotes (mais cuidadoso)
            if (isset($_POST['terreno_lotes_data'])) {
                $raw = $_POST['terreno_lotes_data'];
                $lotes_data = $lotes_data = wp_unslash($_POST['terreno_lotes_data']);
                
                error_log('Dados lotes recebidos (raw): ' . substr($lotes_data, 0, 200) . '...');
                
                // Remover magic quotes se existir
                if (function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) {
                    $lotes_data = stripslashes($lotes_data);
                }
                
                // Validar se é JSON válido
                if (!empty($lotes_data)) {
                    $decoded = json_decode($lotes_data, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        update_post_meta($post_id, '_terreno_lotes', $lotes_data);
                        error_log('Lotes salvos com sucesso. Count: ' . count($decoded));
                    } else {
                        error_log('ERRO JSON: ' . json_last_error_msg());
                        error_log('JSON problemático: ' . $lotes_data);
                    }
                } else {
                    // Se vazio, limpar meta
                    update_post_meta($post_id, '_terreno_lotes', '[]');
                    error_log('Lotes limpos (dados vazios)');
                }
            }
            
            error_log('=== TERRENO SAVE CONCLUÍDO ===');
            
        } catch (Exception $e) {
            error_log('ERRO FATAL no save_meta_boxes: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
        }
    }
}