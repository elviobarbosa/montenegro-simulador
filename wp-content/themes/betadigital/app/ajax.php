<?php


add_action('rest_api_init', function () {
    register_rest_route('cvcrm/v1', '/empreendimentos/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'cvcrm_get_empreendimento_by_id',
        'permission_callback' => '__return_true'
    ));
});

add_action('rest_api_init', function () {
    register_rest_route('cvcrm/v1', '/simulacoes', array(
        'methods' => 'GET',
        'callback' => 'cvcrm_get_simulacoes',
        'permission_callback' => '__return_true'
    ));
});

add_action('rest_api_init', function () {
    register_rest_route('cvcrm/v1', '/unidade/(?P<empreendimento>\d+)/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'cvcrm_get_unidade',
        'permission_callback' => '__return_true'
    ));
});


function cvcrm_request($endpoint, $cache_key, $timeout = 15, $cache_ttl = 300) {
  $email = 'elviobarbosa@gmail.com';
  $token = '247db4c96f7917d859de8fdda43ae3783893c7f1';

  $cached = get_transient($cache_key);
  if ($cached !== false) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
      error_log("💾 [CVCRM] Cache HIT para $cache_key");
    }
    return $cached;
  }

  if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log("🌎 [CVCRM] Consultando URL: $endpoint");
  }

  $response = wp_remote_get($endpoint, array(
    'headers' => array(
      'Content-Type' => 'application/json',
      'email' => $email,
      'token' => $token
    ),
    'timeout' => $timeout
  ));

  if (is_wp_error($response)) {
      error_log("❌ [CVCRM] Erro WP: " . $response->get_error_message());
      return new WP_Error('cvcrm_error', 'Erro na comunicação com CVCRM', array('status' => 500));
  }

  $status_code = wp_remote_retrieve_response_code($response);
  $body = wp_remote_retrieve_body($response);

  if (defined('WP_DEBUG') && WP_DEBUG) {
      error_log("📡 [CVCRM] Status: $status_code");
      error_log("📦 [CVCRM] Body: " . substr($body, 0, 500));
  }

  if ($status_code >= 400) {
      return new WP_Error('cvcrm_error', "Erro da API CVCRM (HTTP $status_code): $body", array('status' => $status_code));
  }

  $data = json_decode($body, true);

  
  set_transient($cache_key, $data, $cache_ttl);

  return $data;
}

function cvcrm_get_simulacoes($request) {
    $url = "https://montenegro.cvcrm.com.br/api/v1/cvdw/simulacoes";
    return cvcrm_request($url, 'cvcrm_simulacoes', 20, 86400);
}

function cvcrm_get_empreendimento_by_id($request) {
    $id = intval($request['id']);
    $url = "https://montenegro.cvcrm.com.br/api/v1/cadastros/empreendimentos/{$id}";
    return cvcrm_request($url, "cvcrm_empreendimento_$id", 15, 86400);
}

function cvcrm_get_unidade($request) {
  $id = intval($request['id']);
  $empreendimento = intval($request['empreendimento']);
  $url = "https://montenegro.cvcrm.com.br/api/v1/cadastros/empreendimentos/{$empreendimento}/unidades/{$id}"; 
  return cvcrm_request($url, "cvcrm_unidade_$id", 15, 86400);
}


