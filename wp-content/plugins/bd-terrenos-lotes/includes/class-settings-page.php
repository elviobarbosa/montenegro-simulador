<?php
class TerrenosLotes_SettingsPage {
  public function __construct() {
    add_action('admin_menu', array($this, 'add_settings_page'));
  }
  public function add_settings_page() {
    add_submenu_page(
      'edit.php?post_type=terreno',
      'Configurações Google Maps',
      'Configurações',
      'manage_options',
      'terreno-settings',
      array($this, 'settings_page_callback')
    );
  }

  public function settings_page_callback() {
    if (isset($_POST['submit'])) {
      update_option('terreno_google_maps_api_key', sanitize_text_field($_POST['google_maps_api_key']));
      echo '<div class="notice notice-success"><p>Configurações salvas!</p></div>';
    }
    
    $api_key = get_option('terreno_google_maps_api_key', '');
    ?>
    <div class="wrap">
      <h1>Configurações - Terrenos e Lotes</h1>
      <form method="post">
        <table class="form-table">
          <tr>
            <th scope="row">
              <label for="google_maps_api_key">Chave API Google Maps</label>
            </th>
            <td>
              <input type="text" id="google_maps_api_key" name="google_maps_api_key" 
                      value="<?php echo esc_attr($api_key); ?>" class="regular-text" />
              <p class="description">
                <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">
                    Obtenha sua chave API aqui
                </a>. APIs necessárias: Maps JavaScript API, Places API, Geocoding API.
              </p>
            </td>
          </tr>
        </table>
        <?php submit_button(); ?>
      </form>
      
      <h2>Como usar</h2>
      <p><strong>Shortcodes disponíveis:</strong></p>
      <ul>
        <li><code>[terreno_mapa id="123"]</code> - Exibe mapa com lotes do terreno</li>
        <li><code>[lote_info terreno_id="123" lote_id="LOTE_001"]</code> - Informações de um lote</li>
        <li><code>[terreno_lotes_lista terreno_id="123"]</code> - Lista todos os lotes</li>
      </ul>
    </div>
  <?php
  }
}