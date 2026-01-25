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

            // Salvar código da tabela de preços
            if (isset($_POST['tabela_preco_id'])) {
                $tabela_preco_id = sanitize_text_field($_POST['tabela_preco_id']);
                update_post_meta($post_id, '_tabela_preco_id', $tabela_preco_id);
                error_log('Tabela de preços ID salvo: ' . $tabela_preco_id);
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

            // Salvar Facebook Pixel ID
            if (isset($_POST['facebook_pixel_id'])) {
                $pixel_id = sanitize_text_field($_POST['facebook_pixel_id']);
                update_post_meta($post_id, '_facebook_pixel_id', $pixel_id);
                error_log('Facebook Pixel ID salvo: ' . $pixel_id);
            } else {
                delete_post_meta($post_id, '_facebook_pixel_id');
            }

            // Salvar Facebook Pixel Token
            if (isset($_POST['facebook_pixel_token'])) {
                $pixel_token = sanitize_text_field($_POST['facebook_pixel_token']);
                update_post_meta($post_id, '_facebook_pixel_token', $pixel_token);
                error_log('Facebook Pixel Token salvo');
            } else {
                delete_post_meta($post_id, '_facebook_pixel_token');
            }

            // Salvar Logo do Empreendimento
            if (isset($_POST['logo_empreendimento'])) {
                $logo_id = absint($_POST['logo_empreendimento']);
                if ($logo_id > 0) {
                    update_post_meta($post_id, '_logo_empreendimento', $logo_id);
                    error_log('Logo do empreendimento salvo: ' . $logo_id);
                } else {
                    delete_post_meta($post_id, '_logo_empreendimento');
                    error_log('Logo do empreendimento removido');
                }
            } else {
                delete_post_meta($post_id, '_logo_empreendimento');
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

            // ========================================
            // Salvar dados do SVG Overlay
            // ========================================

            // SVG Content (pode ser grande, usar sanitização adequada)
            if (isset($_POST['terreno_svg_content'])) {
                $svg_content = wp_unslash($_POST['terreno_svg_content']);
                // Sanitiza SVG removendo scripts e eventos maliciosos
                $svg_content = $this->sanitize_svg_content($svg_content);
                update_post_meta($post_id, '_terreno_svg_content', $svg_content);
                error_log('SVG Content salvo: ' . strlen($svg_content) . ' bytes');
            }

            // SVG Bounds (JSON com coordenadas)
            if (isset($_POST['terreno_svg_bounds'])) {
                $svg_bounds = wp_unslash($_POST['terreno_svg_bounds']);
                if (!empty($svg_bounds)) {
                    $decoded_bounds = json_decode($svg_bounds, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        update_post_meta($post_id, '_terreno_svg_bounds', $svg_bounds);
                        error_log('SVG Bounds salvos');
                    }
                } else {
                    delete_post_meta($post_id, '_terreno_svg_bounds');
                }
            }

            // SVG Rotation
            if (isset($_POST['terreno_svg_rotation'])) {
                $svg_rotation = floatval($_POST['terreno_svg_rotation']);
                update_post_meta($post_id, '_terreno_svg_rotation', $svg_rotation);
                error_log('SVG Rotation salvo: ' . $svg_rotation);
            }

            // Shape Mapping (JSON com mapeamento shape_index -> lote_id)
            if (isset($_POST['terreno_shape_mapping'])) {
                $shape_mapping = wp_unslash($_POST['terreno_shape_mapping']);
                if (!empty($shape_mapping)) {
                    $decoded_mapping = json_decode($shape_mapping, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        update_post_meta($post_id, '_terreno_shape_mapping', $shape_mapping);
                        error_log('Shape Mapping salvo: ' . count($decoded_mapping) . ' vínculos');
                    }
                } else {
                    update_post_meta($post_id, '_terreno_shape_mapping', '{}');
                }
            }

            // ========================================
            // Salvar dados da Planta Humanizada (Image Overlay)
            // ========================================

            // Image URL
            if (isset($_POST['terreno_image_url'])) {
                $image_url = esc_url_raw(wp_unslash($_POST['terreno_image_url']));
                if (!empty($image_url)) {
                    update_post_meta($post_id, '_terreno_image_url', $image_url);
                    error_log('Image URL salva: ' . $image_url);
                } else {
                    delete_post_meta($post_id, '_terreno_image_url');
                }
            }

            // Image Bounds (JSON com coordenadas)
            if (isset($_POST['terreno_image_bounds'])) {
                $image_bounds = wp_unslash($_POST['terreno_image_bounds']);
                if (!empty($image_bounds)) {
                    $decoded_bounds = json_decode($image_bounds, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        update_post_meta($post_id, '_terreno_image_bounds', $image_bounds);
                        error_log('Image Bounds salvos');
                    }
                } else {
                    delete_post_meta($post_id, '_terreno_image_bounds');
                }
            }

            // Image Rotation
            if (isset($_POST['terreno_image_rotation'])) {
                $image_rotation = floatval($_POST['terreno_image_rotation']);
                update_post_meta($post_id, '_terreno_image_rotation', $image_rotation);
                error_log('Image Rotation salva: ' . $image_rotation);
            }

            // Image Opacity
            if (isset($_POST['terreno_image_opacity'])) {
                $image_opacity = floatval($_POST['terreno_image_opacity']);
                if ($image_opacity < 0) $image_opacity = 0;
                if ($image_opacity > 1) $image_opacity = 1;
                update_post_meta($post_id, '_terreno_image_opacity', $image_opacity);
                error_log('Image Opacity salva: ' . $image_opacity);
            }

            error_log('=== TERRENO SAVE CONCLUÍDO ===');
            
        } catch (Exception $e) {
            error_log('ERRO FATAL no save_meta_boxes: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
        }
    }

    /**
     * Sanitiza conteúdo SVG removendo elementos potencialmente perigosos
     *
     * @param string $svg_content Conteúdo SVG a ser sanitizado
     * @return string SVG sanitizado
     */
    private function sanitize_svg_content($svg_content) {
        if (empty($svg_content)) {
            return '';
        }

        // Remove tags script
        $svg_content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $svg_content);

        // Remove event handlers (onclick, onload, onerror, etc.)
        $svg_content = preg_replace('/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $svg_content);

        // Remove javascript: URLs
        $svg_content = preg_replace('/href\s*=\s*["\']javascript:[^"\']*["\']/i', '', $svg_content);

        // Remove tags de elementos externos perigosos
        $svg_content = preg_replace('/<(foreignObject|use|animate|animateTransform|set)[^>]*>.*?<\/\1>/is', '', $svg_content);
        $svg_content = preg_replace('/<(foreignObject|use|animate|animateTransform|set)[^>]*\/>/is', '', $svg_content);

        return $svg_content;
    }
}