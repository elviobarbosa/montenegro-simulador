<?php
/**
 * Meta Boxes Customizadas para Empreendimento
 */

// Adiciona a meta box na sidebar do editor de páginas
function empreendimento_add_meta_box() {
    add_meta_box(
        'empreendimento_meta_box',
        '[PAGE] Empreendimento',
        'empreendimento_meta_box_callback',
        'page',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'empreendimento_add_meta_box');

// Callback para renderizar os campos da meta box
function empreendimento_meta_box_callback($post) {
    // Adiciona nonce para segurança
    wp_nonce_field('empreendimento_meta_box_nonce', 'empreendimento_meta_box_nonce');

    // Busca os valores salvos
    $codigo_empreendimento = get_post_meta($post->ID, 'codigo_empreendimento', true);

    ?>
    <div style="margin-bottom: 15px;">
        <label for="codigo_empreendimento" style="display: block; margin-bottom: 5px; font-weight: 600;">
            Código do empreendimento
        </label>
        <input
            type="number"
            id="codigo_empreendimento"
            name="codigo_empreendimento"
            value="<?php echo esc_attr($codigo_empreendimento); ?>"
            style="width: 100%;"
        />
    </div>
    <?php
}

// Salva os dados da meta box
function empreendimento_save_meta_box($post_id) {
    // Verifica nonce
    if (!isset($_POST['empreendimento_meta_box_nonce']) ||
        !wp_verify_nonce($_POST['empreendimento_meta_box_nonce'], 'empreendimento_meta_box_nonce')) {
        return;
    }

    // Verifica se não é autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Verifica permissões do usuário
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Salva o código do empreendimento
    if (isset($_POST['codigo_empreendimento'])) {
        update_post_meta(
            $post_id,
            'codigo_empreendimento',
            sanitize_text_field($_POST['codigo_empreendimento'])
        );
    }
}
add_action('save_post', 'empreendimento_save_meta_box');
