<?php
class TerrenosLotes_CPT {
  public function __construct() {
    add_action('init', array($this, 'create_post_type'));
    add_filter('single_template', array($this, 'load_single_template'));
  }

  public function load_single_template($template) {
    global $post;

    if ($post->post_type === 'terreno') {
      $plugin_template = plugin_dir_path(__DIR__) . 'templates/single-terreno.php';
      if (file_exists($plugin_template)) {
        return $plugin_template;
      }
    }

    return $template;
  }
  public function create_post_type() {
    $labels = array(
      'name' => 'Simulador',
      'singular_name' => 'Simulador',
      'menu_name' => 'Simulador',
      'name_admin_bar' => 'Simulador',
      'archives' => 'Arquivos do Simulador',
      'attributes' => 'Atributos do Simulador',
      'parent_item_colon' => 'Terreno Pai:',
      'all_items' => 'Todos os Simuladores',
      'add_new_item' => 'Novo Simulador',
      'add_new' => 'Novo',
      'new_item' => 'Novo Simulador',
      'edit_item' => 'Editar Simulador',
      'update_item' => 'Atualizar Simulador',
      'view_item' => 'Ver Simulador',
      'view_items' => 'Ver Simuladores',
      'search_items' => 'Buscar Simuladores',
      'not_found' => 'Não encontrado',
      'not_found_in_trash' => 'Não encontrado na lixeira',
      'featured_image' => 'Imagem em Destaque',
      'set_featured_image' => 'Definir imagem em destaque',
      'remove_featured_image' => 'Remover imagem em destaque',
      'use_featured_image' => 'Usar como imagem em destaque',
      'insert_into_item' => 'Inserir no terreno',
      'uploaded_to_this_item' => 'Enviado para este terreno',
      'items_list' => 'Lista de simuladores',
      'items_list_navigation' => 'Navegação da lista de terrenos',
      'filter_items_list' => 'Filtrar lista de terrenos',
    );
    
    $args = array(
      'label' => 'Simulador',
      'description' => 'Simulador de parcelas com lotes mapeados',
      'labels' => $labels,
      'supports' => array('title', 'thumbnail'),
      'taxonomies' => array(),
      'hierarchical' => false,
      'public' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'menu_position' => 5,
      'menu_icon' => 'dashicons-location-alt',
      'show_in_admin_bar' => true,
      'show_in_nav_menus' => true,
      'can_export' => true,
      'has_archive' => true,
      'exclude_from_search' => false,
      'publicly_queryable' => true,
      'capability_type' => 'post',
      'show_in_rest' => true,
      'rewrite' => array('slug' => 'financiamento-imobiliario'),
    );

    register_post_type('terreno', $args);
  }
}