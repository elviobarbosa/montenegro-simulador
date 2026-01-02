<?php
class TerrenosLotes_LoteInfo {
  
  public function __construct() {
    add_action('wp_ajax_get_lote_info', array($this, 'get_lote_info'));
    add_action('wp_ajax_nopriv_get_lote_info', array($this, 'get_lote_info'));
  }
  public function get_lote_info() {
    echo 'ok';
    check_ajax_referer('terreno_ajax_nonce', 'nonce');
    
    $lote_id = sanitize_text_field($_POST['lote_id']);
    $post_id = intval($_POST['post_id']);

    var_dump($lote_id);
    
    $response = array(
      'success' => true,
      'data' => array(
        'id' => $lote_id,
        'status' => 'Disponível',
        'area' => '500m²',
        'preco' => 'R$ 150.000,00'
      )
    );
    
    wp_send_json($response);
  }
}