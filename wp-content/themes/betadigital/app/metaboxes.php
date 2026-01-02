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
    $marca_empreendimento = get_post_meta($post->ID, 'marca_empreendimento', true);

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

    <div style="margin-bottom: 15px;">
        <label for="marca_empreendimento" style="display: block; margin-bottom: 5px; font-weight: 600;">
            Marca do empreendimento
        </label>
        <div id="marca_empreendimento_preview" style="margin-bottom: 10px;">
            <?php if ($marca_empreendimento): ?>
                <?php echo wp_get_attachment_image($marca_empreendimento, 'medium', false, ['style' => 'max-width: 100%; height: auto;']); ?>
            <?php endif; ?>
        </div>
        <input
            type="hidden"
            id="marca_empreendimento"
            name="marca_empreendimento"
            value="<?php echo esc_attr($marca_empreendimento); ?>"
        />
        <button type="button" class="button" id="marca_empreendimento_button">
            <?php echo $marca_empreendimento ? 'Alterar imagem' : 'Selecionar imagem'; ?>
        </button>
        <?php if ($marca_empreendimento): ?>
            <button type="button" class="button" id="marca_empreendimento_remove" style="margin-left: 5px;">
                Remover imagem
            </button>
        <?php endif; ?>
    </div>

    <script>
    jQuery(document).ready(function($) {
        var mediaUploader;

        $('#marca_empreendimento_button').on('click', function(e) {
            e.preventDefault();

            if (mediaUploader) {
                mediaUploader.open();
                return;
            }

            mediaUploader = wp.media({
                title: 'Selecionar Marca do Empreendimento',
                button: {
                    text: 'Usar esta imagem'
                },
                multiple: false
            });

            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                $('#marca_empreendimento').val(attachment.id);
                $('#marca_empreendimento_preview').html('<img src="' + attachment.url + '" style="max-width: 100%; height: auto;">');
                $('#marca_empreendimento_button').text('Alterar imagem');

                if ($('#marca_empreendimento_remove').length === 0) {
                    $('#marca_empreendimento_button').after('<button type="button" class="button" id="marca_empreendimento_remove" style="margin-left: 5px;">Remover imagem</button>');
                }
            });

            mediaUploader.open();
        });

        $(document).on('click', '#marca_empreendimento_remove', function(e) {
            e.preventDefault();
            $('#marca_empreendimento').val('');
            $('#marca_empreendimento_preview').html('');
            $('#marca_empreendimento_button').text('Selecionar imagem');
            $(this).remove();
        });
    });
    </script>
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

    // Salva a marca do empreendimento
    if (isset($_POST['marca_empreendimento'])) {
        update_post_meta(
            $post_id,
            'marca_empreendimento',
            absint($_POST['marca_empreendimento'])
        );
    } else {
        delete_post_meta($post_id, 'marca_empreendimento');
    }
}
add_action('save_post', 'empreendimento_save_meta_box');
