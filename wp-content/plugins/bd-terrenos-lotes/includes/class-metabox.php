<?php
class TerrenosLotes_MetaBox {
  public function __construct() {
    add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
  }
  
  public function add_meta_boxes() {
    add_meta_box(
      'terreno_mapa',
      'Configuração do Terreno e Lotes',
      array($this, 'mapa_meta_box_callback'),
      'terreno',
      'normal',
      'high'
    );

    add_meta_box(
      'terreno_sidebar',
      'Configurações',
      array($this, 'sidebar_meta_box_callback'),
      'terreno',
      'side',
      'default'
    );
  }

  public function sidebar_meta_box_callback($post) {
    $facebook_pixel_id = get_post_meta($post->ID, '_facebook_pixel_id', true);
    $facebook_pixel_token = get_post_meta($post->ID, '_facebook_pixel_token', true);
    $logo_empreendimento = get_post_meta($post->ID, '_logo_empreendimento', true);
    $tabela_preco_id = get_post_meta($post->ID, '_tabela_preco_id', true);

    // Dados da Planta Humanizada
    $image_url = get_post_meta($post->ID, '_terreno_image_url', true);

    // Dados do SVG
    $svg_content = get_post_meta($post->ID, '_terreno_svg_content', true);
    ?>
    <!-- Código da Tabela de Preços -->
    <div style="margin-bottom: 20px;">
        <label for="tabela_preco_id" style="display: block; margin-bottom: 5px; font-weight: 600;">
            Código da Tabela de Preços
        </label>
        <input type="text" id="tabela_preco_id" name="tabela_preco_id"
            value="<?php echo esc_attr($tabela_preco_id); ?>"
            placeholder="Ex: 252"
            style="width: 100%;" />
        <p style="font-size: 11px; color: #666; margin-top: 5px;">
            ID da tabela de preços do CV CRM para buscar valores das unidades.
        </p>
    </div>
    <hr style="margin: 20px 0;">

    <!-- Logo do Empreendimento -->
    <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600;">
            Logo do Empreendimento
        </label>
        <div id="logo_empreendimento_preview" style="margin-bottom: 10px;">
            <?php if ($logo_empreendimento): ?>
                <?php echo wp_get_attachment_image($logo_empreendimento, 'medium', false, ['style' => 'max-width: 100%; height: auto;']); ?>
            <?php endif; ?>
        </div>
        <input type="hidden" id="logo_empreendimento" name="logo_empreendimento" value="<?php echo esc_attr($logo_empreendimento); ?>" />
        <button type="button" class="button" id="logo_empreendimento_button" style="width: 100%;">
            <?php echo $logo_empreendimento ? 'Alterar Logo' : 'Selecionar Logo'; ?>
        </button>
        <?php if ($logo_empreendimento): ?>
            <button type="button" class="button" id="logo_empreendimento_remove" style="width: 100%; margin-top: 5px;">
                Remover Logo
            </button>
        <?php endif; ?>
    </div>
<hr>
    <!-- Facebook Pixel -->
    <div style="margin-bottom: 15px;">
        <label for="facebook_pixel_id" style="display: block; margin-bottom: 5px; font-weight: 600;">
            Facebook Pixel ID
        </label>
        <input type="text" id="facebook_pixel_id" name="facebook_pixel_id"
            value="<?php echo esc_attr($facebook_pixel_id); ?>"
            placeholder="Ex: 1423368039304251"
            style="width: 100%;" />
    </div>

    <div style="margin-bottom: 15px;">
        <label for="facebook_pixel_token" style="display: block; margin-bottom: 5px; font-weight: 600;">
            Facebook Access Token
        </label>
        <input type="text" id="facebook_pixel_token" name="facebook_pixel_token"
            value="<?php echo esc_attr($facebook_pixel_token); ?>"
            placeholder="Cole o token aqui"
            style="width: 100%;" />
    </div>

    <hr style="margin: 20px 0;">

    <!-- Planta Humanizada -->
    <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600;">
            Planta Humanizada
        </label>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">
            Adicione uma imagem de planta humanizada como overlay no mapa.
        </p>
        <button type="button" class="button button-primary" id="btn_importar_planta" style="width: 100%; margin-bottom: 5px;">
            <span class="dashicons dashicons-format-image" style="margin-top: 3px;"></span>
            Selecionar Imagem
        </button>
        <button type="button" class="button" id="btn_ajustar_planta" style="width: 100%;" <?php echo empty($image_url) ? 'disabled' : ''; ?>>
            <span class="dashicons dashicons-move" style="margin-top: 3px;"></span>
            Ajustar Posicao
        </button>
    </div>

    <hr style="margin: 20px 0;">

    <!-- Importar SVG -->
    <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600;">
            Importar Lotes de SVG
        </label>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">
            Importe lotes a partir de um arquivo SVG da planta do loteamento.
        </p>
        <button type="button" class="button button-primary" id="btn_importar_svg" style="width: 100%; margin-bottom: 5px;">
            <span class="dashicons dashicons-upload" style="margin-top: 3px;"></span>
            Importar SVG
        </button>
        <button type="button" class="button" id="btn_ajustar_svg" style="width: 100%; margin-bottom: 5px;" <?php echo empty($svg_content) ? 'disabled' : ''; ?>>
            <span class="dashicons dashicons-move" style="margin-top: 3px;"></span>
            Ajustar Posicao
        </button>
        <?php if (!empty($svg_content)): ?>
        <button type="button" class="button" id="btn_remover_svg" style="width: 100%; color: #b32d2e; border-color: #b32d2e;">
            <span class="dashicons dashicons-trash" style="margin-top: 3px;"></span>
            Remover SVG
        </button>
        <?php endif; ?>
    </div>

    <script>
    jQuery(document).ready(function($) {
        var logoMediaUploader;

        $('#logo_empreendimento_button').on('click', function(e) {
            e.preventDefault();

            if (logoMediaUploader) {
                logoMediaUploader.open();
                return;
            }

            logoMediaUploader = wp.media({
                title: 'Selecionar Logo do Empreendimento',
                button: {
                    text: 'Usar esta imagem'
                },
                multiple: false
            });

            logoMediaUploader.on('select', function() {
                var attachment = logoMediaUploader.state().get('selection').first().toJSON();
                $('#logo_empreendimento').val(attachment.id);
                $('#logo_empreendimento_preview').html('<img src="' + attachment.url + '" style="max-width: 100%; height: auto;">');
                $('#logo_empreendimento_button').text('Alterar Logo');

                if ($('#logo_empreendimento_remove').length === 0) {
                    $('#logo_empreendimento_button').after('<button type="button" class="button" id="logo_empreendimento_remove" style="width: 100%; margin-top: 5px;">Remover Logo</button>');
                }
            });

            logoMediaUploader.open();
        });

        $(document).on('click', '#logo_empreendimento_remove', function(e) {
            e.preventDefault();
            $('#logo_empreendimento').val('');
            $('#logo_empreendimento_preview').html('');
            $('#logo_empreendimento_button').text('Selecionar Logo');
            $(this).remove();
        });
    });
    </script>
    <?php
  }

  public function mapa_meta_box_callback($post) {
    wp_nonce_field('terreno_mapa_nonce', 'terreno_mapa_nonce');
    
    $api_key = get_option('terreno_google_maps_api_key', '');
    if (empty($api_key)) {
        echo '<div class="notice notice-error"><p><strong>Atenção:</strong> Configure sua chave API do Google Maps em <a href="edit.php?post_type=terreno&page=terreno-settings">Configurações</a> para usar o mapa.</p></div>';
    }
    
    $endereco = get_post_meta($post->ID, '_terreno_endereco', true);
    $latitude = get_post_meta($post->ID, '_terreno_latitude', true) ?: '-3.7319';
    $longitude = get_post_meta($post->ID, '_terreno_longitude', true) ?: '-38.5267';
    $lotes_data = get_post_meta($post->ID, '_terreno_lotes', true);
    $zoom = get_post_meta($post->ID, '_terreno_zoom', true) ?: '18';
    $empreendimento_id = get_post_meta($post->ID, '_empreendimento_id', true);

    // Dados do SVG Overlay
    $svg_content = get_post_meta($post->ID, '_terreno_svg_content', true);
    $svg_bounds = get_post_meta($post->ID, '_terreno_svg_bounds', true);
    $svg_rotation = get_post_meta($post->ID, '_terreno_svg_rotation', true);
    $shape_mapping = get_post_meta($post->ID, '_terreno_shape_mapping', true);

    // Dados da Planta Humanizada (Image Overlay)
    $image_url = get_post_meta($post->ID, '_terreno_image_url', true);
    $image_bounds = get_post_meta($post->ID, '_terreno_image_bounds', true);
    $image_rotation = get_post_meta($post->ID, '_terreno_image_rotation', true);
    $image_opacity = get_post_meta($post->ID, '_terreno_image_opacity', true);

    ?>

    <!-- Modal de Edição de Lote -->
    <div id="editModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index: 9999;">
        <div style="background:white; padding:30px; max-width:400px; margin:100px auto; border-radius:8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <h3 style="margin: 0 0 20px 0; color: #23282d;">Dados do Lote</h3>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #23282d;">ID da Unidade: <span style="color: red;">*</span></label>
                <input type="text" id="editLoteUnidadeId" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Ex: 123" />
                <small style="color: #666; font-size: 11px;">ID da unidade correspondente na API</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #23282d;">Quadra: <span style="color: red;">*</span></label>
                <input type="text" id="editLoteBloco" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Ex: A, B, C..." />
                <small style="color: #666; font-size: 11px;">Bloco onde a unidade está localizada</small>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #23282d;">Nome do Lote (opcional):</label>
                <input type="text" id="editLoteNome" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Ex: Lote 1" />
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="button button-secondary" onclick="closeEditModal()">Cancelar</button>
                <button type="button" class="button button-primary" onclick="saveEditLote()">Salvar</button>
            </div>
        </div>
    </div>
    <!-- Fim Modal -->

    <!-- Painel Lateral de Importação de SVG -->
    <div id="svgImportModal" style="display:none; position:fixed; top:32px; right:0; width:320px; height:calc(100vh - 32px); background:white; z-index: 9999; overflow-y: auto; box-shadow: -4px 0 20px rgba(0,0,0,0.2); border-left: 1px solid #ddd;">
        <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #23282d; font-size: 16px;">Importar SVG</h3>
                <button type="button" class="button" id="svgImportClose" style="padding: 0 8px;">&times;</button>
            </div>

            <!-- Step 1: Upload -->
            <div id="svgStep1">
                <div style="border: 2px dashed #ccc; border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 15px;" id="svgDropZone">
                    <span class="dashicons dashicons-upload" style="font-size: 36px; color: #ccc; display: block; margin-bottom: 8px;"></span>
                    <p style="margin: 0 0 8px 0; font-size: 13px;">Arraste um arquivo SVG aqui ou</p>
                    <input type="file" id="svgFileInput" accept=".svg" style="display: none;">
                    <button type="button" class="button button-primary" id="svgSelectFile">Selecionar Arquivo</button>
                </div>
                <div id="svgUploadStatus" style="display: none; padding: 8px; background: #f0f0f0; border-radius: 4px; margin-bottom: 15px; font-size: 12px;">
                    <span id="svgFileName"></span>
                    <span id="svgShapeCount" style="float: right;"></span>
                </div>
            </div>

            <!-- Step 2: Controles de Posicionamento -->
            <div id="svgStep2" style="display: none;">
                <!-- Instruções -->
                <div style="background: #e7f5ff; border: 1px solid #0073aa; border-radius: 4px; padding: 10px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 8px 0; color: #0073aa; font-size: 13px;">
                        <span class="dashicons dashicons-info" style="margin-right: 5px;"></span>
                        Como posicionar
                    </h4>
                    <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #333;">
                        <li><strong>Arrastar:</strong> Clique e arraste para mover</li>
                        <li><strong>Redimensionar:</strong> Arraste os cantos</li>
                        <li><strong>Rotacionar:</strong> Use o slider abaixo</li>
                    </ul>
                </div>

                <!-- Controles de Transformação -->
                <div style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 13px;">Controles</h4>

                    <!-- Rotação -->
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 600; font-size: 12px;">
                            Rotação: <span id="svgRotationValue">0°</span>
                        </label>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <button type="button" class="button button-small" id="svgRotateLeft" title="-1°">
                                &#8634;
                            </button>
                            <input type="range" id="svgRotationSlider" min="-180" max="180" value="0"
                                   style="flex: 1; margin: 0;">
                            <button type="button" class="button button-small" id="svgRotateRight" title="+1°">
                                &#8635;
                            </button>
                        </div>
                    </div>

                    <!-- Opacidade -->
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 600; font-size: 12px;">
                            Opacidade
                        </label>
                        <input type="range" id="svgOpacitySlider" min="10" max="100" value="70"
                               style="width: 100%;">
                    </div>

                    <!-- Zoom + Reset -->
                    <div style="display: flex; gap: 6px;">
                        <button type="button" class="button button-small" id="svgZoomOut" title="Diminuir">
                            <span class="dashicons dashicons-minus" style="font-size: 16px;"></span>
                        </button>
                        <button type="button" class="button button-small" id="svgZoomIn" title="Aumentar">
                            <span class="dashicons dashicons-plus" style="font-size: 16px;"></span>
                        </button>
                        <button type="button" class="button button-small" id="svgResetTransform" style="flex: 1;" title="Resetar">
                            <span class="dashicons dashicons-image-rotate" style="font-size: 16px;"></span> Resetar
                        </button>
                    </div>
                </div>

                <!-- Dica -->
                <div style="background: #fff8e5; border: 1px solid #f0c36d; border-radius: 4px; padding: 8px; margin-bottom: 15px; font-size: 11px;">
                    <strong>Dica:</strong> Alinhe com as ruas no satélite.
                </div>
            </div>

            <!-- Botões de ação -->
            <div style="display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 10px;">
                <button type="button" class="button" id="svgImportCancel">Cancelar</button>
                <button type="button" class="button button-primary" id="svgImportConfirm" disabled>
                    <span class="dashicons dashicons-yes" style="font-size: 16px;"></span>
                    Importar
                </button>
            </div>
        </div>
    </div>
    <!-- Fim Modal SVG -->

    <div id="terreno-mapa-container">
        <!-- Controles superiores -->
        <div class="terreno-controls">
            <div class="control-row">
                <div class="control-group">
                    <label for="empreendimento_id">ID do Empreendimento:</label>
                    <input type="text" id="empreendimento_id" name="empreendimento_id"
                        value="<?php echo esc_attr($empreendimento_id); ?>"
                        placeholder="Digite ID do Empreendimento" />
                
                    <label for="terreno_endereco">Endereço:</label>
                    <input type="text" id="terreno_endereco" name="terreno_endereco" 
                           value="<?php echo esc_attr($endereco); ?>" 
                           placeholder="Digite o endereço ou clique no mapa" />
                    <button type="button" id="buscar_endereco" class="button">Buscar</button>
                    <!-- <button type="button" id="minha_localizacao" class="button">Minha Localização</button> -->
                </div>
            </div>
            
            <div class="control-row">
                <div class="coordinate-group">
                    <div class="coordinate-item">
                        <label for="terreno_latitude">Latitude:</label>
                        <input type="text" id="terreno_latitude" name="terreno_latitude"
                               value="<?php echo esc_attr($latitude); ?>" />
                    </div>
                    <div class="coordinate-item">
                        <label for="terreno_longitude">Longitude:</label>
                        <input type="text" id="terreno_longitude" name="terreno_longitude"
                               value="<?php echo esc_attr($longitude); ?>" />
                    </div>
                    <div class="coordinate-item">
                        <label for="terreno_zoom">Zoom:</label>
                        <input type="number" id="terreno_zoom" name="terreno_zoom"
                               value="<?php echo esc_attr($zoom); ?>" min="1" max="20" />
                    </div>
                    <div class="coordinate-item" style="align-self: flex-end;">
                        <button type="button" id="ir_para_coordenadas" class="button button-primary">
                            <span class="dashicons dashicons-location" style="margin-top: 3px;"></span> Ir para coordenadas
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="control-row">
                <div class="action-group">
                    <button type="button" id="toggle_satellite" class="button">
                        <span class="dashicons dashicons-admin-site-alt3"></span> Visualização Satélite
                    </button>
                </div>
                <div class="status-group">
                    <span id="modo_desenho"></span>
                </div>
            </div>
        </div>
        
        <!-- Container principal com mapa e lista lateral -->
        <div class="mapa-lotes-container">
            <!-- Mapa -->
            <div class="mapa-wrapper">
                <div id="gmap"></div>
            </div>
            
            <!-- Lista de shapes lateral -->
            <div class="lotes-sidebar">
                <div class="lotes-header">
                    <h4>
                        <span class="dashicons dashicons-admin-multisite"></span>
                        Shapes do SVG
                    </h4>
                    <div class="lotes-counter">
                        <span id="total-shapes">0</span> shape(s)
                    </div>
                </div>

                <div class="lotes-content">
                    <div id="shapes-sidebar-container">
                        <div class="no-lotes" id="no-shapes-message">
                            <div class="no-lotes-icon">
                                <span class="dashicons dashicons-admin-multisite"></span>
                            </div>
                            <p>Nenhum shape carregado.</p>
                            <p class="help-text">Importe um SVG para visualizar os shapes.</p>
                        </div>
                    </div>
                </div>

                <div class="lotes-footer">
                    <div class="shapes-info">
                        <strong>Shapes mapeados: <span id="shapes-mapped-count">0</span></strong>
                    </div>
                </div>
            </div>
        </div>
        
        <input type="hidden" id="terreno_lotes_data" name="terreno_lotes_data"
               value='<?php echo esc_attr( $lotes_data ? wp_json_encode( json_decode($lotes_data, true) ) : "[]" ); ?>' />

        <!-- Dados do SVG Overlay -->
        <input type="hidden" id="terreno_svg_content" name="terreno_svg_content"
               value="<?php echo esc_attr($svg_content); ?>" />
        <input type="hidden" id="terreno_svg_bounds" name="terreno_svg_bounds"
               value="<?php echo esc_attr($svg_bounds); ?>" />
        <input type="hidden" id="terreno_svg_rotation" name="terreno_svg_rotation"
               value="<?php echo esc_attr($svg_rotation); ?>" />
        <input type="hidden" id="terreno_shape_mapping" name="terreno_shape_mapping"
               value='<?php echo esc_attr($shape_mapping); ?>' />

        <!-- Dados da Planta Humanizada (Image Overlay) -->
        <input type="hidden" id="terreno_image_url" name="terreno_image_url"
               value="<?php echo esc_attr($image_url); ?>" />
        <input type="hidden" id="terreno_image_bounds" name="terreno_image_bounds"
               value="<?php echo esc_attr($image_bounds); ?>" />
        <input type="hidden" id="terreno_image_rotation" name="terreno_image_rotation"
               value="<?php echo esc_attr($image_rotation); ?>" />
        <input type="hidden" id="terreno_image_opacity" name="terreno_image_opacity"
               value="<?php echo esc_attr($image_opacity); ?>" />
    </div>
    
    <style>
        .hidden {
            display: none;
        }
        /* Layout principal */
        #terreno-mapa-container {
            width: 100%;
            max-width: 100%;
        }
        
        /* Controles superiores */
        .terreno-controls {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .control-row {
            margin-bottom: 12px;
        }
        
        .control-row:last-child {
            margin-bottom: 0;
        }
        
        .control-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .control-group label {
            font-weight: bold;
            min-width: 70px;
        }
        
        .control-group input[type="text"] {
            flex: 1;
            max-width: 400px;
        }
        
        .coordinate-group {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .coordinate-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .coordinate-item label {
            font-weight: bold;
            min-width: 60px;
        }
        
        .coordinate-item input {
            width: 120px;
        }
        
        .action-group {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .action-group .button {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .status-group {
            margin-left: auto;
        }
        
        #modo_desenho {
            font-weight: bold;
            color: #d63638;
            font-size: 14px;
        }
        
        /* Container principal mapa + lista */
        .mapa-lotes-container {
            display: flex;
            gap: 15px;
            height: 550px;
        }
        
        /* Mapa */
        .mapa-wrapper {
            flex: 1;
            min-width: 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
        }
        
        #gmap {
            width: 100%;
            height: 100%;
        }
        
        /* Sidebar dos lotes */
        .lotes-sidebar {
            width: 350px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .lotes-header {
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .lotes-header h4 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #23282d;
            font-size: 14px;
        }
        
        .lotes-counter {
            background: #0073aa;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .lotes-content {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        
        .lotes-footer {
            border-top: 1px solid #ddd;
            padding: 12px 15px;
            background: #f8f9fa;
            text-align: center;
        }
        
        .area-total {
            color: #0073aa;
            font-size: 13px;
        }
        
        /* Lista de lotes */
        .lote-item {
            background: #fff;
            border: 1px solid #e1e1e1;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .lote-item:hover {
            border-color: #0073aa;
            box-shadow: 0 2px 5px rgba(0, 115, 170, 0.1);
        }
        
        .lote-item h5 {
            margin: 0 0 8px 0;
            font-size: 13px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .lote-item p {
            margin: 4px 0;
            font-size: 12px;
            color: #666;
        }
        
        .lote-item strong {
            color: #23282d;
        }
        
        .lote-actions {
            margin-top: 10px;
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
        
        .lote-actions .button {
            font-size: 11px;
            padding: 4px 8px;
            height: auto;
            line-height: 1.2;
        }
        
        /* Estado vazio */
        .no-lotes {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }
        
        .no-lotes-icon {
            font-size: 48px;
            color: #ccc;
            margin-bottom: 15px;
        }
        
        .no-lotes p {
            margin: 8px 0;
            font-size: 14px;
        }
        
        .help-text {
            font-size: 12px !important;
            color: #999 !important;
        }
        
        /* Status badge */
        .status-badge {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-disponivel {
            background: #d4edda;
            color: #155724;
        }
        
        .status-vendido {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-reservado {
            background: #fff3cd;
            color: #856404;
        }

        /* Shapes na sidebar */
        .shape-item {
            background: #fff;
            border: 1px solid #e1e1e1;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .shape-item:hover {
            border-color: #0073aa;
            box-shadow: 0 2px 5px rgba(0, 115, 170, 0.15);
        }

        .shape-item.shape-mapped {
            border-left: 3px solid #46b450;
        }

        .shape-item.shape-unmapped {
            border-left: 3px solid #dc3232;
        }

        .shape-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }

        .shape-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            flex-shrink: 0;
        }

        .shape-name {
            font-weight: 600;
            font-size: 12px;
            color: #23282d;
            flex: 1;
        }

        .shape-points {
            font-size: 10px;
            color: #999;
        }

        .shape-status {
            font-size: 11px;
            color: #666;
        }

        .shape-mapped .shape-status {
            color: #46b450;
        }

        .shape-unmapped .shape-status {
            color: #dc3232;
        }

        .shapes-info {
            color: #0073aa;
            font-size: 13px;
        }

        /* Responsividade */
        @media (max-width: 1200px) {
            .lotes-sidebar {
                width: 300px;
            }
        }
        
        @media (max-width: 768px) {
            .mapa-lotes-container {
                flex-direction: column;
                height: auto;
            }
            
            .mapa-wrapper {
                height: 400px;
            }
            
            .lotes-sidebar {
                width: 100%;
                height: 300px;
            }
            
            .coordinate-group {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .action-group {
                justify-content: flex-start;
            }
        }
        
        /* Scrollbar customizada */
        .lotes-content::-webkit-scrollbar {
            width: 8px;
        }
        
        .lotes-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        
        .lotes-content::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
        }
        
        .lotes-content::-webkit-scrollbar-thumb:hover {
            background: #999;
        }
    </style>
    <?php
  }
}
?>