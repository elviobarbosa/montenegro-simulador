<?php
if ( ! function_exists( 'button' ) ) {
    function button( $args = [] ) {
        $defaults = [
            'label' => 'Clique aqui',
            'url'   => '#',
            'class' => '',
            'alt'   => '',
            'data-js' => ''
        ];

        $args = wp_parse_args( $args, $defaults );

        $html = sprintf(
            '<a href="%s" class="button %s" alt="%s" data-js="%s">%s</a>',
            esc_url( $args['url'] ),
            esc_attr( $args['class'] ),
            esc_attr( $args['alt'] ),
            esc_html( $args['data-js'] ),
            esc_html( $args['label'] ),
        );

        echo $html;
    }
}
