<?php
/**
 * AJAX Handlers para o plugin Terrenos Lotes
 *
 * Gerencia requisições AJAX para:
 * - Upload e processamento de SVG
 */
class TerrenosLotes_AjaxHandlers {

    /**
     * SVG Importer instance
     */
    private $svg_importer;

    /**
     * Constructor - registra os handlers AJAX
     */
    public function __construct() {
        $this->svg_importer = new SVGImporter();

        // Registra handlers AJAX (logados)
        add_action('wp_ajax_terreno_parse_svg', array($this, 'handle_parse_svg'));
    }

    /**
     * Handler para parse de SVG
     * Recebe o conteúdo SVG via POST e retorna os shapes extraídos
     */
    public function handle_parse_svg() {
        // Verifica nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'terreno_ajax_nonce')) {
            wp_send_json_error(['message' => 'Nonce inválido']);
            return;
        }

        // Verifica permissões
        if (!current_user_can('edit_posts')) {
            wp_send_json_error(['message' => 'Permissão negada']);
            return;
        }

        // Verifica se há conteúdo SVG
        if (empty($_POST['svg_content'])) {
            wp_send_json_error(['message' => 'Conteúdo SVG não fornecido']);
            return;
        }

        // Decodifica o conteúdo (pode vir como base64)
        $svg_content = $_POST['svg_content'];

        // Remove slashes adicionados pelo WordPress/PHP (magic quotes)
        $svg_content = wp_unslash($svg_content);

        // Se vier como base64 data URI
        if (strpos($svg_content, 'data:image/svg+xml;base64,') === 0) {
            $svg_content = base64_decode(substr($svg_content, 26));
        } elseif (strpos($svg_content, 'data:image/svg+xml,') === 0) {
            $svg_content = urldecode(substr($svg_content, 19));
        }

        // Corrige aspas que podem ter sido escapadas
        $svg_content = str_replace(['\"', "\'"], ['"', "'"], $svg_content);

        // Processa o SVG
        $result = $this->svg_importer->parse($svg_content);

        if ($result['success']) {
            wp_send_json_success([
                'shapes' => $result['shapes'],
                'viewBox' => $result['viewBox'],
                'dimensions' => $result['dimensions'],
                'total_shapes' => $result['total_shapes'],
                'message' => sprintf('%d shapes encontrados no SVG', $result['total_shapes'])
            ]);
        } else {
            wp_send_json_error([
                'message' => $result['error'] ?: 'Erro ao processar SVG'
            ]);
        }
    }
}
