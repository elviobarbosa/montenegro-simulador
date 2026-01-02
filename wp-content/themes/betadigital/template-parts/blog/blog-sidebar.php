<div class="blog__search">
    <?php get_search_form(); ?>

    <h3>Categorias</h3>
    <ul class="blog__categorias">
        <?php
        $categories = get_categories( array(
            'orderby' => 'name',
            'order'   => 'ASC'
        ) );
        
        foreach( $categories as $category ) {
            $category_link = sprintf( 
                '<li><a href="%1$s" alt="%2$s">%3$s</a></li>',
                esc_url( get_category_link( $category->term_id ) ),
                esc_attr( sprintf( __( 'Veja todos os posts em %s', 'textdomain' ), $category->name ) ),
                esc_html( $category->name )
            );
            
            echo sprintf( esc_html__( '%s', 'textdomain' ), $category_link );
        } 
        ?>
    </ul>
</div>