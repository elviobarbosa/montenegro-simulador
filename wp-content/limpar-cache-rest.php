<?php
/**
 * Script para limpar cache REST API e rewrite rules
 *
 * INSTRUÇÕES:
 * 1. Faça upload deste arquivo para a raiz do WordPress em produção
 * 2. Acesse: https://seusite.com.br/wp-content/limpar-cache-rest.php
 * 3. Após executar, DELETE este arquivo imediatamente por segurança
 */

// Carrega o WordPress
require_once( dirname(__DIR__) . '/wp-load.php' );
// Verifica se está logado como admin
if (!current_user_can('administrator')) {
    die('❌ Você precisa estar logado como administrador.');
}

echo '<h1>Limpeza de Cache - REST API</h1>';
echo '<style>body{font-family:monospace;padding:40px;background:#f5f5f5;} li{padding:5px 0;}</style>';

echo '<h2>1. Limpando transients do CVCRM...</h2><ul>';

// Limpa todos os transients relacionados ao CVCRM
global $wpdb;
$transients = $wpdb->get_results(
    "SELECT option_name FROM $wpdb->options WHERE option_name LIKE '_transient_cvcrm_%'"
);

foreach ($transients as $transient) {
    $key = str_replace('_transient_', '', $transient->option_name);
    delete_transient($key);
    echo "<li>✅ Removido: $key</li>";
}

if (empty($transients)) {
    echo '<li>ℹ️ Nenhum transient encontrado</li>';
}

echo '</ul>';

// Flush rewrite rules
echo '<h2>2. Recarregando rewrite rules...</h2>';
flush_rewrite_rules();
echo '<p>✅ Rewrite rules recarregadas com sucesso!</p>';

// Limpa object cache (se houver)
echo '<h2>3. Limpando object cache...</h2>';
wp_cache_flush();
echo '<p>✅ Object cache limpo!</p>';

// Verifica rotas REST API
echo '<h2>4. Verificando rotas REST API registradas...</h2>';
$rest_server = rest_get_server();
$routes = array_keys($rest_server->get_routes());
$cvcrm_routes = array_filter($routes, function($route) {
    return strpos($route, '/cvcrm/') !== false;
});

echo '<ul>';
foreach ($cvcrm_routes as $route) {
    echo "<li>✅ $route</li>";
}
echo '</ul>';

echo '<hr>';
echo '<h2>✅ Limpeza concluída!</h2>';
echo '<p><strong>IMPORTANTE:</strong> DELETE este arquivo agora por segurança!</p>';
echo '<p><a href="/">← Voltar para o site</a></p>';
?>
