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
      error_log("[CVCRM] Erro WP: " . $response->get_error_message());
      return new WP_Error('cvcrm_error', 'Erro na comunicação com CVCRM', array('status' => 500));
  }

  $status_code = wp_remote_retrieve_response_code($response);
  $body = wp_remote_retrieve_body($response);

  if (defined('WP_DEBUG') && WP_DEBUG) {
      error_log("[CVCRM] Status: $status_code");
      error_log("[CVCRM] Body: " . substr($body, 0, 500));
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
    $data = cvcrm_request($url, "cvcrm_empreendimento_$id", 15, 86400);

    if (is_wp_error($data)) {
        return $data;
    }

    return cvcrm_filter_empreendimento($data);
}

function cvcrm_filter_empreendimento($data) {
    $filtered = array(
        'nome' => $data['nome'] ?? '',
        'etapas' => array()
    );

    if (!empty($data['etapas'])) {
        foreach ($data['etapas'] as $etapa) {
            $filtered_etapa = array('blocos' => array());

            if (!empty($etapa['blocos'])) {
                foreach ($etapa['blocos'] as $bloco) {
                    $filtered_bloco = array(
                        'idbloco' => $bloco['nome'] ?? '',
                        'unidades' => array()
                    );

                    if (!empty($bloco['unidades'])) {
                        foreach ($bloco['unidades'] as $unidade) {
                            $filtered_bloco['unidades'][] = array(
                                'nome' => $unidade['nome'] ?? '',
                                'idunidade' => $unidade['idunidade'] ?? null,
                                'valor' => $unidade['valor'] ?? null,
                                'area_privativa' => $unidade['area_privativa'] ?? null,
                                'situacao' => array(
                                    'situacao_mapa_disponibilidade' => $unidade['situacao']['situacao_mapa_disponibilidade'] ?? null
                                )
                            );
                        }
                    }

                    $filtered_etapa['blocos'][] = $filtered_bloco;
                }
            }

            $filtered['etapas'][] = $filtered_etapa;
        }
    }

    return $filtered;
}

function cvcrm_get_unidade($request) {
    $id = intval($request['id']);
    $empreendimento = intval($request['empreendimento']);
    $url = "https://montenegro.cvcrm.com.br/api/v1/cadastros/empreendimentos/{$empreendimento}/unidades/{$id}";
    $data = cvcrm_request($url, "cvcrm_unidade_$id", 15, 86400);

    if (is_wp_error($data)) {
        return $data;
    }

    return cvcrm_filter_unidade($data);
}

function cvcrm_filter_unidade($data) {
    return($data);
    return array(
        'idunidade' => $data['idunidade'] ?? null,
        'idunidade_int' => $data['idunidade_int'] ?? null,
        'idbloco' => $data['idbloco'] ?? null,
        'valor' => $data['valor'] ?? null,
        'area_privativa' => $data['area_privativa'] ?? null,
        'situacao' => array(
            'situacao_mapa_disponibilidade' => $data['situacao']['situacao_mapa_disponibilidade'] ?? null
        )
    );
}

add_action('rest_api_init', function () {
    register_rest_route('cvcrm/v1', '/unidades/(?P<empreendimento_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'cvcrm_get_unidades_by_empreendimento',
        'permission_callback' => '__return_true'
    ));
});

function cvcrm_get_unidades_by_empreendimento($request) {
    $empreendimento_id = intval($request['empreendimento_id']);
    $url = "https://montenegro.cvcrm.com.br/api/v1/cvdw/unidades?a_partir_referencia={$empreendimento_id}";
    return cvcrm_request($url, "cvcrm_unidades_emp_$empreendimento_id", 15, 300);
}

add_action('rest_api_init', function () {
    register_rest_route('cvcrm/v1', '/porcentagem-vendida/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'cvcrm_get_porcentagem_vendida',
        'permission_callback' => '__return_true'
    ));
});

function cvcrm_get_porcentagem_vendida($request) {
    $id = intval($request['id']);
    $url = "https://montenegro.cvcrm.com.br/api/v1/comercial/mapadisponibilidade/{$id}/?limitePagina=800&pag=1";
    $data = cvcrm_request($url, "cvcrm_mapa_disponibilidade_$id", 15, 300);

    if (is_wp_error($data)) {
        return $data;
    }

    $lotes = $data['data'] ?? [];
    $total = count($lotes);

    if ($total === 0) {
        return array('porcentagem' => 0, 'total' => 0, 'vendidos' => 0);
    }
// var_dump($lotes);
    $vendidos = 0;
    foreach ($lotes as $lote) {
        $situacao = strtolower($lote['situacao'] ?? '');
        if ($situacao === 'reservada') {
            $vendidos++;
        }
    }

    $porcentagem = round(($vendidos / $total) * 100);

    return array(
        'porcentagem' => $porcentagem,
        'total' => $total,
        'vendidos' => $vendidos
    );
}


