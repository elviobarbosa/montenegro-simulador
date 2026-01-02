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
    $facebook_pixel_id = get_post_meta($post->ID, '_facebook_pixel_id', true);
    $facebook_pixel_token = get_post_meta($post->ID, '_facebook_pixel_token', true);
    
    ?>

    <!-- Modal -->
    <div id="editModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index: 999">
        <div style="background:white; padding:20px; max-width:300px; margin:100px auto; border-radius:10px;">
            <label>ID do Lote:</label>
            <input type="text" id="editLoteId" /><br /><br />
            
            <label>Bloco do Lote:</label>
            <input type="text" id="editLoteBloco" /><br /><br />
            
            <button onclick="saveEditLote()">Salvar</button>
            <button onclick="closeEditModal()">Cancelar</button>
        </div>
    </div>
    <!-- Modal -->


    <div id="terreno-mapa-container">
        <!-- Configurações Facebook Pixel -->
        <div class="terreno-controls" style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #23282d;">
                <span class="dashicons dashicons-facebook" style="vertical-align: middle;"></span>
                Facebook Pixel
            </h4>
            <div class="control-row">
                <div class="control-group">
                    <label for="facebook_pixel_id">Pixel ID:</label>
                    <input type="text" id="facebook_pixel_id" name="facebook_pixel_id"
                        value="<?php echo esc_attr($facebook_pixel_id); ?>"
                        placeholder="Ex: 1423368039304251"
                        style="max-width: 300px;" />

                    <label for="facebook_pixel_token" style="margin-left: 15px;">Access Token:</label>
                    <input type="text" id="facebook_pixel_token" name="facebook_pixel_token"
                        value="<?php echo esc_attr($facebook_pixel_token); ?>"
                        placeholder="Cole o token de acesso aqui"
                        style="flex: 1;" />
                </div>
            </div>
        </div>

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
                </div>
            </div>
            
            <div class="control-row">
                <div class="action-group">
                    <button type="button" id="desenhar_lote" class="button button-primary">
                        <span class="dashicons dashicons-edit"></span> <span data-js="label_desenhar_lote">Desenhar Novo Lote</span>
                    </button>
                    <button type="button" id="aplicar_desenho" class="button button-primary hidden">
                        <span class="dashicons dashicons-yes"></span> <span data-js="label_desenhar_lote">Aplicar Desenho</span>
                    </button>
                    <button type="button" id="cancelar_desenho" class="button button-primary hidden">
                        <span class="dashicons dashicons-no-alt"></span> <span data-js="label_desenhar_lote">Cancelar</span>
                    </button>
                    <button type="button" id="limpar_lotes" class="button">
                        <span class="dashicons dashicons-trash"></span> Limpar Todos os Lotes
                    </button>
                    <button type="button" id="toggle_satellite" class="button">
                        <span class="dashicons dashicons-admin-site-alt3"></span> Visualização Satélite
                    </button>
                    <button type="button" id="recarregar_poligonos" class="button" style="display: none;">
                        <span class="dashicons dashicons-update"></span> Debug: Recarregar
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
            
            <!-- Lista de lotes lateral -->
            <div class="lotes-sidebar">
                <div class="lotes-header">
                    <h4>
                        <span class="dashicons dashicons-admin-multisite"></span>
                        Lotes Cadastrados
                    </h4>
                    <div class="lotes-counter">
                        <span id="total-lotes">0</span> lote(s)
                    </div>
                </div>
                
                <div class="lotes-content">
                    <div id="lista-lotes-container">
                        <div class="no-lotes">
                            <div class="no-lotes-icon">
                                <span class="dashicons dashicons-admin-multisite"></span>
                            </div>
                            <p>Nenhum lote cadastrado ainda.</p>
                            <p class="help-text">Clique em "Desenhar Novo Lote" para começar.</p>
                        </div>
                    </div>
                </div>
                
                <div class="lotes-footer">
                    <div class="area-total">
                        <strong>Área Total: <span id="area-total-value">0 m²</span></strong>
                    </div>
                </div>
            </div>
        </div>
        
        <input type="hidden" id="terreno_lotes_data" name="terreno_lotes_data" 
               value='<?php echo esc_attr( $lotes_data ? wp_json_encode( json_decode($lotes_data, true) ) : "[]" ); ?>' />
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