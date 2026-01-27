<?php
/**
 * Gerencia o carregamento do Facebook Pixel para terrenos
 */
class TerrenosLotes_FacebookPixel {

    public function __construct() {
        add_action('wp_head', array($this, 'load_facebook_pixel'));
    }

    /**
     * Carrega o Facebook Pixel no head da página de terreno
     */
    public function load_facebook_pixel() {
        $pixel_id = '';
        $pixel_token = '';
        $terreno_id = null;

        // Debug: Log da execução

        // Caso 1: Estamos em um custom post type "terreno"
        if (is_singular('terreno')) {
            $terreno_id = get_the_ID();
        }
        // Caso 2: Estamos em uma página que pode ter um terreno com mesmo slug
        elseif (is_page()) {
            global $post;

            $slug_pagina = $post->post_name;

            // Busca um terreno com o mesmo slug da página
            if (!empty($slug_pagina)) {
                $args = array(
                    'post_type'      => 'terreno',
                    'posts_per_page' => 1,
                    'name'           => $slug_pagina,
                    'post_status'    => 'publish',
                    'fields'         => 'ids',
                );

                $query = new WP_Query($args);

                if ($query->have_posts()) {
                    $terreno_id = $query->posts[0];
                } else {
                }
                wp_reset_postdata();
            } else {
            }
        }
        else {
            return;
        }

        // Se não encontramos um ID de terreno, não carrega o pixel
        if (!$terreno_id) {
            return;
        }

        // Busca os dados do pixel do terreno
        $pixel_id = get_post_meta($terreno_id, '_facebook_pixel_id', true);
        $pixel_token = get_post_meta($terreno_id, '_facebook_pixel_token', true);


        // Se não houver Pixel ID, não carrega nada
        if (empty($pixel_id)) {
            return;
        }


        ?>
        <!-- Meta Pixel Code -->
        <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '<?php echo esc_js($pixel_id); ?>');
        fbq('track', 'PageView');
        </script>
        <noscript>
            <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=<?php echo esc_attr($pixel_id); ?>&ev=PageView&noscript=1"/>
        </noscript>
        <!-- End Meta Pixel Code -->
        <?php
    }
}
