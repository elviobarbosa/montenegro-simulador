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
    if (isset($_POST['submit']) && check_admin_referer('terreno_settings_nonce', 'terreno_settings_nonce_field')) {
      update_option('terreno_google_maps_api_key', sanitize_text_field($_POST['google_maps_api_key']));
      update_option('terreno_cvcrm_email', sanitize_email($_POST['cvcrm_email']));
      update_option('terreno_cvcrm_token', sanitize_text_field($_POST['cvcrm_token']));
      update_option('terreno_cvcrm_base_url', esc_url_raw($_POST['cvcrm_base_url']));

      // Header e Footer
      update_option('terreno_logo_url', esc_url_raw($_POST['logo_url']));
      update_option('terreno_company_name', sanitize_text_field($_POST['company_name']));
      update_option('terreno_phone', sanitize_text_field($_POST['phone']));
      update_option('terreno_whatsapp', sanitize_text_field($_POST['whatsapp']));
      update_option('terreno_email', sanitize_email($_POST['email']));
      update_option('terreno_address', sanitize_textarea_field($_POST['address']));

      echo '<div class="notice notice-success"><p>Configurações salvas!</p></div>';
    }

    $api_key = get_option('terreno_google_maps_api_key', '');
    $cvcrm_email = get_option('terreno_cvcrm_email', '');
    $cvcrm_token = get_option('terreno_cvcrm_token', '');
    $cvcrm_base_url = get_option('terreno_cvcrm_base_url', 'https://montenegro.cvcrm.com.br');

    // Header e Footer
    $logo_url = get_option('terreno_logo_url', '');
    $company_name = get_option('terreno_company_name', get_bloginfo('name'));
    $phone = get_option('terreno_phone', '');
    $whatsapp = get_option('terreno_whatsapp', '');
    $email = get_option('terreno_email', get_bloginfo('admin_email'));
    $address = get_option('terreno_address', '');
    ?>
    <div class="wrap">
      <h1>Configurações - Terrenos e Lotes</h1>
      <form method="post">
        <?php wp_nonce_field('terreno_settings_nonce', 'terreno_settings_nonce_field'); ?>

        <h2>Google Maps</h2>
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

        <h2>CV CRM - API</h2>
        <table class="form-table">
          <tr>
            <th scope="row">
              <label for="cvcrm_base_url">URL Base da API</label>
            </th>
            <td>
              <input type="url" id="cvcrm_base_url" name="cvcrm_base_url"
                      value="<?php echo esc_attr($cvcrm_base_url); ?>" class="regular-text"
                      placeholder="https://seudominio.cvcrm.com.br" />
              <p class="description">URL base do CV CRM (sem barra no final)</p>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="cvcrm_email">Email</label>
            </th>
            <td>
              <input type="email" id="cvcrm_email" name="cvcrm_email"
                      value="<?php echo esc_attr($cvcrm_email); ?>" class="regular-text" />
              <p class="description">Email de autenticação da API CV CRM</p>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="cvcrm_token">Token</label>
            </th>
            <td>
              <input type="text" id="cvcrm_token" name="cvcrm_token"
                      value="<?php echo esc_attr($cvcrm_token); ?>" class="regular-text" />
              <p class="description">Token de autenticação da API CV CRM</p>
            </td>
          </tr>
        </table>

        <h2>Header e Footer (Template do Plugin)</h2>
        <p class="description">Configure as informações exibidas no header e footer quando o template do plugin estiver ativo.</p>
        <table class="form-table">
          <tr>
            <th scope="row">
              <label for="logo_url">URL do Logo</label>
            </th>
            <td>
              <input type="url" id="logo_url" name="logo_url"
                      value="<?php echo esc_attr($logo_url); ?>" class="regular-text"
                      placeholder="https://seusite.com/logo.png" />
              <p class="description">URL completa do logo (opcional)</p>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="company_name">Nome da Empresa</label>
            </th>
            <td>
              <input type="text" id="company_name" name="company_name"
                      value="<?php echo esc_attr($company_name); ?>" class="regular-text" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="phone">Telefone</label>
            </th>
            <td>
              <input type="text" id="phone" name="phone"
                      value="<?php echo esc_attr($phone); ?>" class="regular-text"
                      placeholder="(85) 3111-3100" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="whatsapp">WhatsApp</label>
            </th>
            <td>
              <input type="text" id="whatsapp" name="whatsapp"
                      value="<?php echo esc_attr($whatsapp); ?>" class="regular-text"
                      placeholder="(85) 98902-0701" />
              <p class="description">Apenas números ou com formatação</p>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="email">Email</label>
            </th>
            <td>
              <input type="email" id="email" name="email"
                      value="<?php echo esc_attr($email); ?>" class="regular-text" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="address">Endereço</label>
            </th>
            <td>
              <textarea id="address" name="address" class="large-text" rows="3"><?php echo esc_textarea($address); ?></textarea>
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