/**
 * ImageOverlayManager - Gerencia overlay de planta humanizada no mapa
 *
 * Permite:
 * - Upload de imagem via Media Library do WordPress
 * - Posicionamento (drag) no mapa
 * - Redimensionamento (resize)
 * - Rotação
 * - Ajuste de opacidade
 *
 * A imagem fica ABAIXO dos polígonos de lotes usando panes.overlayLayer
 */
export class ImageOverlayManager {
  constructor(map, stateManager, eventBus) {
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;

    // Estado do overlay
    this.imageUrl = null;
    this.overlay = {
      bounds: null,
      rotation: 0,
      opacity: 0.7,
      center: null,
    };

    // Google Maps Custom Overlay
    this.customOverlay = null;

    // Estado de interação
    this.isControlsVisible = false;

    // Elementos DOM
    this.controlPanel = null;
    console.log('ImageOverlayManager: construtor');
    this.init();
  }

  /**
   * Inicializa os event listeners
   */
  init() {
    console.log('ImageOverlayManager: init()');

    // Botão de importar imagem
    const btnImportar = document.getElementById('btn_importar_planta');
    console.log(
      'ImageOverlayManager: btn_importar_planta encontrado?',
      !!btnImportar,
    );

    if (btnImportar) {
      btnImportar.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('ImageOverlayManager: botao clicado');
        this.openMediaLibrary();
      });
    } else {
      // Tenta novamente após um delay (DOM pode não estar pronto)
      setTimeout(() => {
        const btn = document.getElementById('btn_importar_planta');
        if (btn) {
          console.log('ImageOverlayManager: btn encontrado no retry');
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('ImageOverlayManager: botao clicado (retry)');
            this.openMediaLibrary();
          });
        }
      }, 500);
    }

    // Botão de remover imagem
    const btnRemover = document.getElementById('btn_remover_planta');
    if (btnRemover) {
      btnRemover.addEventListener('click', () => this.removeOverlay());
    }

    // Botão de ajustar posição
    const btnAjustar = document.getElementById('btn_ajustar_planta');
    if (btnAjustar) {
      btnAjustar.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('ImageOverlayManager: ajustar posicao clicado');
        this.toggleEditMode();
      });
    } else {
      setTimeout(() => {
        const btn = document.getElementById('btn_ajustar_planta');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleEditMode();
          });
        }
      }, 500);
    }

    // Cria painel de controles
    this.createControlPanel();
  }

  /**
   * Alterna modo de edição (mostra/esconde controles)
   */
  toggleEditMode() {
    if (!this.imageUrl) {
      alert('Nenhuma imagem carregada. Selecione uma imagem primeiro.');
      return;
    }

    if (this.isControlsVisible) {
      this.hideControls();
    } else {
      this.showControls();
    }
  }

  /**
   * Cria o painel de controles para a imagem
   */
  createControlPanel() {
    this.controlPanel = document.createElement('div');
    this.controlPanel.id = 'imageOverlayControls';
    this.controlPanel.innerHTML = `
      <div class="image-overlay-header">
        <span>Ajustar Planta Humanizada</span>
        <button type="button" id="imageControlsClose" title="Fechar">&times;</button>
      </div>
      <div class="image-overlay-content">
        <!-- Instruções -->
        <div style="background: #e7f5ff; border: 1px solid #28a745; border-radius: 4px; padding: 10px; margin-bottom: 15px;">
          <h4 style="margin: 0 0 8px 0; color: #28a745; font-size: 13px;">
            <span class="dashicons dashicons-info" style="margin-right: 5px;"></span>
            Como posicionar
          </h4>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #333;">
            <li><strong>Arrastar:</strong> Clique e arraste para mover</li>
            <li><strong>Redimensionar:</strong> Arraste os cantos</li>
            <li><strong>Rotacionar:</strong> Use o slider abaixo</li>
          </ul>
        </div>

        <div class="image-overlay-preview">
          <img id="imageOverlayPreview" src="" alt="Preview" />
        </div>
        <div class="image-overlay-controls">
          <h4 style="margin: 0 0 12px 0; font-size: 13px;">Controles</h4>
          <div class="control-group">
            <label>Rotação: <span id="imageRotationValue">0°</span></label>
            <div class="rotation-controls">
              <button type="button" class="button button-small" id="imageRotateLeft" title="-1°">&#8634;</button>
              <input type="range" id="imageRotationSlider" min="-180" max="180" value="0" />
              <button type="button" class="button button-small" id="imageRotateRight" title="+1°">&#8635;</button>
            </div>
          </div>
          <div class="control-group">
            <label>Opacidade</label>
            <input type="range" id="imageOpacitySlider" min="10" max="100" value="70" />
          </div>
          <div class="control-group">
            <div class="scale-controls">
              <button type="button" class="button button-small" id="imageZoomOut" title="Diminuir">
                <span class="dashicons dashicons-minus" style="font-size: 16px;"></span>
              </button>
              <button type="button" class="button button-small" id="imageZoomIn" title="Aumentar">
                <span class="dashicons dashicons-plus" style="font-size: 16px;"></span>
              </button>
              <button type="button" class="button button-small" id="imageResetScale" title="Resetar">
                <span class="dashicons dashicons-image-rotate" style="font-size: 16px;"></span> Resetar
              </button>
            </div>
          </div>
        </div>

        <!-- Dica -->
        <div style="background: #fff8e5; border: 1px solid #f0c36d; border-radius: 4px; padding: 8px; margin-bottom: 15px; font-size: 11px;">
          <strong>Dica:</strong> Alinhe com as ruas no satélite.
        </div>

        <div class="image-overlay-actions">
          <button type="button" id="imageRemoveBtn" class="button">Remover Imagem</button>
          <button type="button" id="imageSaveBtn" class="button button-primary">Salvar Ajustes</button>
        </div>
      </div>
    `;

    this.addControlPanelStyles();

    // Insere o painel no mesmo local que o modal do SVG (antes do #terreno-mapa-container)
    const terrenoContainer = document.getElementById('terreno-mapa-container');
    if (terrenoContainer && terrenoContainer.parentNode) {
      terrenoContainer.parentNode.insertBefore(this.controlPanel, terrenoContainer);
    } else {
      document.body.appendChild(this.controlPanel);
    }

    // Event listeners do painel
    this.setupControlListeners();
  }

  /**
   * Adiciona estilos CSS do painel de controle
   */
  addControlPanelStyles() {
    if (document.getElementById('imageOverlayStyles')) return;

    const style = document.createElement('style');
    style.id = 'imageOverlayStyles';
    style.textContent = `
      #imageOverlayControls {
        position: fixed;
        top: 32px;
        right: 0;
        width: 320px;
        height: calc(100vh - 32px);
        background: #fff;
        border-left: 1px solid #ddd;
        box-shadow: -4px 0 20px rgba(0,0,0,0.2);
        z-index: 9999;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: none;
      }
      #imageOverlayControls.active {
        display: block;
      }
      .image-overlay-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #ddd;
        background: #fff;
      }
      .image-overlay-header span {
        margin: 0;
        color: #23282d;
        font-size: 16px;
        font-weight: 600;
      }
      .image-overlay-header button {
        background: none;
        border: 1px solid #ccc;
        color: #666;
        font-size: 18px;
        cursor: pointer;
        padding: 0 8px;
        line-height: 1.5;
        border-radius: 3px;
      }
      .image-overlay-header button:hover {
        background: #f0f0f0;
      }
      .image-overlay-content {
        padding: 20px;
      }
      .image-overlay-preview {
        margin-bottom: 15px;
        text-align: center;
      }
      .image-overlay-preview img {
        max-width: 100%;
        max-height: 120px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .image-overlay-controls {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 15px;
      }
      .image-overlay-controls .control-group {
        margin-bottom: 12px;
      }
      .image-overlay-controls .control-group:last-child {
        margin-bottom: 0;
      }
      .image-overlay-controls label {
        display: block;
        margin-bottom: 4px;
        font-weight: 600;
        font-size: 12px;
        color: #333;
      }
      .image-overlay-controls input[type="range"] {
        width: 100%;
        margin: 0;
      }
      .image-overlay-controls span {
        display: inline;
        font-size: 12px;
        color: #666;
      }
      .rotation-controls, .scale-controls {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .rotation-controls input[type="range"] {
        flex: 1;
      }
      .rotation-controls button, .scale-controls button {
        padding: 5px 10px;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #ccc;
        background: #f7f7f7;
        border-radius: 3px;
      }
      .rotation-controls button:hover, .scale-controls button:hover {
        background: #e5e5e5;
      }
      .scale-controls button:last-child {
        flex: 1;
      }
      .image-overlay-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        border-top: 1px solid #ddd;
        padding-top: 15px;
        margin-top: 10px;
      }
      .image-overlay-actions button {
        padding: 8px 12px;
        cursor: pointer;
      }
      #imageRemoveBtn {
        background: #dc3545;
        color: #fff;
        border-color: #dc3545;
      }
      #imageRemoveBtn:hover {
        background: #c82333;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Configura event listeners do painel de controle
   */
  setupControlListeners() {
    // Fechar painel
    document
      .getElementById('imageControlsClose')
      ?.addEventListener('click', () => {
        this.hideControls();
      });

    // Opacidade
    document
      .getElementById('imageOpacitySlider')
      ?.addEventListener('input', (e) => {
        const opacity = e.target.value / 100;
        this.setOverlayOpacity(opacity);
        document.getElementById('imageOpacityValue').textContent =
          `${e.target.value}%`;
      });

    // Rotacao
    document
      .getElementById('imageRotationSlider')
      ?.addEventListener('input', (e) => {
        this.setRotation(parseFloat(e.target.value));
        document.getElementById('imageRotationValue').textContent =
          `${e.target.value}°`;
      });

    document
      .getElementById('imageRotateLeft')
      ?.addEventListener('click', () => {
        this.rotateOverlay(-1);
      });

    document
      .getElementById('imageRotateRight')
      ?.addEventListener('click', () => {
        this.rotateOverlay(1);
      });

    // Escala
    document.getElementById('imageZoomIn')?.addEventListener('click', () => {
      this.scaleOverlay(1.1);
    });

    document.getElementById('imageZoomOut')?.addEventListener('click', () => {
      this.scaleOverlay(0.9);
    });

    document
      .getElementById('imageResetScale')
      ?.addEventListener('click', () => {
        this.resetTransform();
      });

    // Remover
    document.getElementById('imageRemoveBtn')?.addEventListener('click', () => {
      this.removeOverlay();
    });

    // Salvar e fechar
    document.getElementById('imageSaveBtn')?.addEventListener('click', () => {
      this.updateHiddenInputs();
      this.hideControls();
      console.log('Ajustes da planta humanizada salvos');
    });
  }

  /**
   * Abre a Media Library do WordPress
   */
  openMediaLibrary() {
    console.log('ImageOverlayManager: openMediaLibrary()');
    console.log(
      'ImageOverlayManager: wp disponivel?',
      typeof wp !== 'undefined',
    );
    console.log(
      'ImageOverlayManager: wp.media disponivel?',
      typeof wp !== 'undefined' && typeof wp.media !== 'undefined',
    );

    if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
      alert('Media Library nao disponivel. Recarregue a pagina.');
      console.error('ImageOverlayManager: wp.media nao disponivel');
      return;
    }

    const frame = wp.media({
      title: 'Selecionar Planta Humanizada',
      button: { text: 'Usar esta imagem' },
      multiple: false,
      library: { type: 'image' },
    });

    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();
      this.handleImageSelect(attachment.url);
    });

    frame.open();
  }

  /**
   * Processa a imagem selecionada
   */
  handleImageSelect(imageUrl) {
    this.imageUrl = imageUrl;

    // Atualiza preview
    const preview = document.getElementById('imageOverlayPreview');
    if (preview) {
      preview.src = imageUrl;
    }

    // Cria overlay no mapa
    this.createMapOverlay();

    // Mostra controles
    this.showControls();

    // Habilita botão de ajustar posição
    this.updateAjustarButton(true);

    // Atualiza hidden inputs
    this.updateHiddenInputs();

    console.log('Planta humanizada carregada:', imageUrl);
  }

  /**
   * Atualiza estado do botão de ajustar posição
   */
  updateAjustarButton(hasImage) {
    const btnAjustar = document.getElementById('btn_ajustar_planta');
    if (btnAjustar) {
      btnAjustar.disabled = !hasImage;
    }
  }

  /**
   * Cria o overlay da imagem sobre o mapa
   */
  createMapOverlay() {
    // Remove overlay anterior se existir
    if (this.customOverlay) {
      this.customOverlay.setMap(null);
    }

    // Carrega a imagem para obter dimensões e calcular aspect ratio
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      // Define posicao inicial baseada no centro do mapa
      const mapCenter = this.map.getCenter();
      this.overlay.center = {
        lat: mapCenter.lat(),
        lng: mapCenter.lng(),
      };

      // Tamanho inicial do overlay (em graus, aproximadamente)
      // Ajusta para manter o aspect ratio da imagem
      const baseSize = 0.003; // ~300 metros
      let halfWidth, halfHeight;

      if (aspectRatio > 1) {
        // Imagem mais larga que alta
        halfWidth = baseSize / 2;
        halfHeight = baseSize / aspectRatio / 2;
      } else {
        // Imagem mais alta que larga
        halfHeight = baseSize / 2;
        halfWidth = (baseSize * aspectRatio) / 2;
      }

      this.overlay.bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          this.overlay.center.lat - halfHeight,
          this.overlay.center.lng - halfWidth,
        ),
        new google.maps.LatLng(
          this.overlay.center.lat + halfHeight,
          this.overlay.center.lng + halfWidth,
        ),
      );

      // Cria Custom Overlay
      const OverlayClass = getCustomImageOverlayClass();
      this.customOverlay = new OverlayClass(
        this.overlay.bounds,
        this.imageUrl,
        this.map,
        this,
      );
      this.customOverlay.setMap(this.map);

      // Centraliza o mapa no overlay
      this.map.setCenter(mapCenter);
      this.map.setZoom(18);

      // Atualiza hidden inputs
      this.updateHiddenInputs();
    };

    img.onerror = () => {
      console.error('Erro ao carregar imagem para calcular dimensões');
      // Fallback: usa dimensões quadradas
      this.createMapOverlayFallback();
    };

    img.src = this.imageUrl;
  }

  /**
   * Fallback para criar overlay quando não consegue carregar dimensões da imagem
   */
  createMapOverlayFallback() {
    const mapCenter = this.map.getCenter();
    this.overlay.center = {
      lat: mapCenter.lat(),
      lng: mapCenter.lng(),
    };

    const initialSize = 0.003;
    const halfSize = initialSize / 2;

    this.overlay.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(
        this.overlay.center.lat - halfSize,
        this.overlay.center.lng - halfSize,
      ),
      new google.maps.LatLng(
        this.overlay.center.lat + halfSize,
        this.overlay.center.lng + halfSize,
      ),
    );

    const OverlayClass = getCustomImageOverlayClass();
    this.customOverlay = new OverlayClass(
      this.overlay.bounds,
      this.imageUrl,
      this.map,
      this,
    );
    this.customOverlay.setMap(this.map);
    this.map.setCenter(mapCenter);
    this.map.setZoom(18);
  }

  /**
   * Mostra o painel de controles
   */
  showControls() {
    this.isControlsVisible = true;
    this.controlPanel?.classList.add('active');
  }

  /**
   * Esconde o painel de controles
   */
  hideControls() {
    this.isControlsVisible = false;
    this.controlPanel?.classList.remove('active');
  }

  /**
   * Remove o overlay do mapa
   */
  removeOverlay() {
    if (this.customOverlay) {
      this.customOverlay.setMap(null);
      this.customOverlay = null;
    }

    this.imageUrl = null;
    this.overlay = {
      bounds: null,
      rotation: 0,
      opacity: 0.7,
      center: null,
    };

    // Limpa preview
    const preview = document.getElementById('imageOverlayPreview');
    if (preview) {
      preview.src = '';
    }

    // Esconde controles
    this.hideControls();

    // Desabilita botão de ajustar posição
    this.updateAjustarButton(false);

    // Limpa hidden inputs
    this.clearHiddenInputs();

    console.log('Planta humanizada removida');
  }

  /**
   * Define a opacidade do overlay
   */
  setOverlayOpacity(opacity) {
    this.overlay.opacity = opacity;
    if (this.customOverlay) {
      this.customOverlay.setOpacity(opacity);
    }
    this.updateHiddenInputs();
  }

  /**
   * Rotaciona o overlay
   */
  rotateOverlay(degrees) {
    this.overlay.rotation += degrees;
    this.overlay.rotation = ((this.overlay.rotation % 360) + 360) % 360;
    if (this.overlay.rotation > 180) {
      this.overlay.rotation -= 360;
    }
    this.updateOverlayTransform();

    // Atualiza slider
    const slider = document.getElementById('imageRotationSlider');
    const value = document.getElementById('imageRotationValue');
    if (slider) slider.value = this.overlay.rotation;
    if (value) value.textContent = `${Math.round(this.overlay.rotation)}°`;

    this.updateHiddenInputs();
  }

  /**
   * Define rotacao especifica
   */
  setRotation(degrees) {
    this.overlay.rotation = degrees;
    this.updateOverlayTransform();
    this.updateHiddenInputs();
  }

  /**
   * Escala o overlay
   */
  scaleOverlay(factor) {
    if (!this.overlay.bounds || !this.overlay.center) return;

    const bounds = this.overlay.bounds;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const centerLat = this.overlay.center.lat;
    const centerLng = this.overlay.center.lng;

    const halfHeight = ((ne.lat() - sw.lat()) / 2) * factor;
    const halfWidth = ((ne.lng() - sw.lng()) / 2) * factor;

    this.overlay.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(centerLat - halfHeight, centerLng - halfWidth),
      new google.maps.LatLng(centerLat + halfHeight, centerLng + halfWidth),
    );

    this.customOverlay?.updateBounds(this.overlay.bounds);
    this.updateHiddenInputs();
  }

  /**
   * Reseta as transformacoes
   */
  resetTransform() {
    if (!this.imageUrl || !this.map) return;

    this.overlay.rotation = 0;
    this.createMapOverlay();

    // Reseta sliders
    const rotationSlider = document.getElementById('imageRotationSlider');
    const rotationValue = document.getElementById('imageRotationValue');
    if (rotationSlider) rotationSlider.value = 0;
    if (rotationValue) rotationValue.textContent = '0°';

    this.updateHiddenInputs();
  }

  /**
   * Atualiza a transformacao visual do overlay
   */
  updateOverlayTransform() {
    if (this.customOverlay) {
      this.customOverlay.updateRotation(this.overlay.rotation);
    }
  }

  /**
   * Carrega dados salvos (chamado na inicializacao)
   */
  loadSavedOverlay() {
    const imageUrlInput = document.getElementById('terreno_image_url');
    const boundsInput = document.getElementById('terreno_image_bounds');
    const rotationInput = document.getElementById('terreno_image_rotation');
    const opacityInput = document.getElementById('terreno_image_opacity');

    if (imageUrlInput?.value) {
      this.imageUrl = imageUrlInput.value;

      // Atualiza preview
      const preview = document.getElementById('imageOverlayPreview');
      if (preview) {
        preview.src = this.imageUrl;
      }
    }

    if (boundsInput?.value) {
      try {
        const bounds = JSON.parse(boundsInput.value);
        this.overlay.bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(bounds.south, bounds.west),
          new google.maps.LatLng(bounds.north, bounds.east),
        );
        this.overlay.center = {
          lat: (bounds.north + bounds.south) / 2,
          lng: (bounds.east + bounds.west) / 2,
        };
      } catch (e) {
        console.warn('Erro ao carregar bounds da imagem:', e);
      }
    }

    if (rotationInput?.value) {
      this.overlay.rotation = parseFloat(rotationInput.value) || 0;
    }

    if (opacityInput?.value) {
      this.overlay.opacity = parseFloat(opacityInput.value) || 0.7;
    }

    // Se tem imagem salva, renderiza o overlay e habilita botão
    if (this.imageUrl && this.overlay.bounds) {
      this.renderSavedOverlay();
      this.updateAjustarButton(true);
    } else if (this.imageUrl) {
      // Tem imagem mas não tem bounds ainda
      this.updateAjustarButton(true);
    }
  }

  /**
   * Renderiza overlay salvo anteriormente
   */
  renderSavedOverlay() {
    if (!this.imageUrl || !this.overlay.bounds) return;

    // Cria o overlay no mapa
    const OverlayClass = getCustomImageOverlayClass();
    this.customOverlay = new OverlayClass(
      this.overlay.bounds,
      this.imageUrl,
      this.map,
      this,
    );
    this.customOverlay.setMap(this.map);

    // Aplica rotacao e opacidade salvas
    if (this.overlay.rotation) {
      this.customOverlay.updateRotation(this.overlay.rotation);
    }
    if (this.overlay.opacity) {
      this.customOverlay.setOpacity(this.overlay.opacity);
    }

    // Atualiza sliders
    const rotationSlider = document.getElementById('imageRotationSlider');
    const rotationValue = document.getElementById('imageRotationValue');
    const opacitySlider = document.getElementById('imageOpacitySlider');
    const opacityValue = document.getElementById('imageOpacityValue');

    if (rotationSlider) rotationSlider.value = this.overlay.rotation;
    if (rotationValue)
      rotationValue.textContent = `${Math.round(this.overlay.rotation)}°`;
    if (opacitySlider) opacitySlider.value = this.overlay.opacity * 100;
    if (opacityValue)
      opacityValue.textContent = `${Math.round(this.overlay.opacity * 100)}%`;

    console.log('Overlay de imagem carregado dos dados salvos');
  }

  /**
   * Atualiza inputs hidden com dados do overlay
   */
  updateHiddenInputs() {
    const container = document.querySelector('#terreno-mapa-container');
    if (!container) return;

    // Image URL
    let urlInput = document.getElementById('terreno_image_url');
    if (!urlInput) {
      urlInput = document.createElement('input');
      urlInput.type = 'hidden';
      urlInput.id = 'terreno_image_url';
      urlInput.name = 'terreno_image_url';
      container.appendChild(urlInput);
    }
    urlInput.value = this.imageUrl || '';

    // Bounds
    let boundsInput = document.getElementById('terreno_image_bounds');
    if (!boundsInput) {
      boundsInput = document.createElement('input');
      boundsInput.type = 'hidden';
      boundsInput.id = 'terreno_image_bounds';
      boundsInput.name = 'terreno_image_bounds';
      container.appendChild(boundsInput);
    }
    if (this.overlay.bounds) {
      boundsInput.value = JSON.stringify({
        north: this.overlay.bounds.getNorthEast().lat(),
        south: this.overlay.bounds.getSouthWest().lat(),
        east: this.overlay.bounds.getNorthEast().lng(),
        west: this.overlay.bounds.getSouthWest().lng(),
      });
    }

    // Rotation
    let rotationInput = document.getElementById('terreno_image_rotation');
    if (!rotationInput) {
      rotationInput = document.createElement('input');
      rotationInput.type = 'hidden';
      rotationInput.id = 'terreno_image_rotation';
      rotationInput.name = 'terreno_image_rotation';
      container.appendChild(rotationInput);
    }
    rotationInput.value = this.overlay.rotation || 0;

    // Opacity
    let opacityInput = document.getElementById('terreno_image_opacity');
    if (!opacityInput) {
      opacityInput = document.createElement('input');
      opacityInput.type = 'hidden';
      opacityInput.id = 'terreno_image_opacity';
      opacityInput.name = 'terreno_image_opacity';
      container.appendChild(opacityInput);
    }
    opacityInput.value = this.overlay.opacity || 0.7;
  }

  /**
   * Limpa hidden inputs
   */
  clearHiddenInputs() {
    const inputs = [
      'terreno_image_url',
      'terreno_image_bounds',
      'terreno_image_rotation',
      'terreno_image_opacity',
    ];

    inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = '';
      }
    });
  }
}

/**
 * Factory function para criar a classe CustomImageOverlay
 * Isso evita erro de referencia ao google.maps.OverlayView antes do Maps API estar pronto
 */
let CustomImageOverlayClass = null;

function getCustomImageOverlayClass() {
  if (CustomImageOverlayClass) {
    return CustomImageOverlayClass;
  }

  CustomImageOverlayClass = class CustomImageOverlay extends (
    google.maps.OverlayView
  ) {
    constructor(bounds, imageUrl, map, manager) {
      super();
      this.bounds = bounds;
      this.imageUrl = imageUrl;
      this.manager = manager;
      this.div = null;
      this.img = null;
      this.rotation = 0;
      this.opacity = 0.7;
      this.isDragging = false;
      this.isResizing = false;
    }

    onAdd() {
      // Cria container do overlay
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      this.div.style.cursor = 'move';

      // Cria elemento de imagem
      this.img = document.createElement('img');
      this.img.src = this.imageUrl;
      this.img.style.width = '100%';
      this.img.style.height = '100%';
      this.img.style.opacity = this.opacity;
      this.img.style.pointerEvents = 'none';
      this.img.style.objectFit = 'contain';

      this.div.appendChild(this.img);

      // Adiciona borda para visualizacao
      this.div.style.border = '2px dashed #28a745';
      this.div.style.boxSizing = 'border-box';

      // Adiciona handles de resize nos cantos
      this.addResizeHandles();

      // Adiciona eventos de drag
      this.addDragListeners();

      // Adiciona ao mapa - USA overlayMouseTarget para receber eventos de mouse
      // z-index menor para ficar ABAIXO do SVG overlay
      this.div.style.zIndex = '1';
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(this.div);
    }

    addResizeHandles() {
      const corners = ['nw', 'ne', 'sw', 'se'];
      corners.forEach((corner) => {
        const handle = document.createElement('div');
        handle.className = `image-resize-handle image-resize-${corner}`;
        handle.style.cssText = `
          position: absolute;
          width: 14px;
          height: 14px;
          background: #28a745;
          border: 2px solid white;
          border-radius: 50%;
          cursor: ${corner}-resize;
          z-index: 1000;
        `;

        if (corner.includes('n')) handle.style.top = '-7px';
        if (corner.includes('s')) handle.style.bottom = '-7px';
        if (corner.includes('w')) handle.style.left = '-7px';
        if (corner.includes('e')) handle.style.right = '-7px';

        handle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          this.startResize(e, corner);
        });

        this.div.appendChild(handle);
      });
    }

    addDragListeners() {
      this.div.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('image-resize-handle')) return;
        this.startDrag(e);
      });

      document.addEventListener('mousemove', (e) => {
        if (this.isDragging) this.onDrag(e);
        if (this.isResizing) this.onResize(e);
      });

      document.addEventListener('mouseup', () => {
        if (this.isDragging || this.isResizing) {
          this.manager.updateHiddenInputs();
          // Reabilita o drag do mapa
          const map = this.getMap();
          if (map) {
            map.setOptions({ draggable: true });
          }
        }
        this.isDragging = false;
        this.isResizing = false;
      });
    }

    startDrag(e) {
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX,
        y: e.clientY,
        bounds: new google.maps.LatLngBounds(
          this.bounds.getSouthWest(),
          this.bounds.getNorthEast(),
        ),
      };
      // Desabilita o drag do mapa enquanto arrasta o overlay
      this.getMap().setOptions({ draggable: false });
      e.preventDefault();
      e.stopPropagation();
    }

    onDrag(e) {
      const projection = this.getProjection();
      if (!projection) return;

      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;

      const startSW = this.dragStart.bounds.getSouthWest();
      const startNE = this.dragStart.bounds.getNorthEast();

      const swPoint = projection.fromLatLngToDivPixel(startSW);
      const nePoint = projection.fromLatLngToDivPixel(startNE);

      const newSW = projection.fromDivPixelToLatLng(
        new google.maps.Point(swPoint.x + dx, swPoint.y + dy),
      );
      const newNE = projection.fromDivPixelToLatLng(
        new google.maps.Point(nePoint.x + dx, nePoint.y + dy),
      );

      this.bounds = new google.maps.LatLngBounds(newSW, newNE);
      this.manager.overlay.bounds = this.bounds;
      this.manager.overlay.center = {
        lat: (newSW.lat() + newNE.lat()) / 2,
        lng: (newSW.lng() + newNE.lng()) / 2,
      };

      this.draw();
    }

    startResize(e, corner) {
      this.isResizing = true;
      this.resizeCorner = corner;
      this.resizeStart = {
        x: e.clientX,
        y: e.clientY,
        bounds: new google.maps.LatLngBounds(
          this.bounds.getSouthWest(),
          this.bounds.getNorthEast(),
        ),
      };
      // Desabilita o drag do mapa enquanto redimensiona
      this.getMap().setOptions({ draggable: false });
      e.preventDefault();
      e.stopPropagation();
    }

    onResize(e) {
      const projection = this.getProjection();
      if (!projection) return;

      const startSW = this.resizeStart.bounds.getSouthWest();
      const startNE = this.resizeStart.bounds.getNorthEast();

      let newSW = startSW;
      let newNE = startNE;

      const swPoint = projection.fromLatLngToDivPixel(startSW);
      const nePoint = projection.fromLatLngToDivPixel(startNE);

      const dx = e.clientX - this.resizeStart.x;
      const dy = e.clientY - this.resizeStart.y;

      if (this.resizeCorner.includes('e')) {
        newNE = projection.fromDivPixelToLatLng(
          new google.maps.Point(nePoint.x + dx, nePoint.y),
        );
      }
      if (this.resizeCorner.includes('w')) {
        newSW = projection.fromDivPixelToLatLng(
          new google.maps.Point(swPoint.x + dx, swPoint.y),
        );
      }
      if (this.resizeCorner.includes('n')) {
        newNE = projection.fromDivPixelToLatLng(
          new google.maps.Point(
            this.resizeCorner.includes('e') ? nePoint.x + dx : nePoint.x,
            nePoint.y + dy,
          ),
        );
      }
      if (this.resizeCorner.includes('s')) {
        newSW = projection.fromDivPixelToLatLng(
          new google.maps.Point(
            this.resizeCorner.includes('w') ? swPoint.x + dx : swPoint.x,
            swPoint.y + dy,
          ),
        );
      }

      this.bounds = new google.maps.LatLngBounds(newSW, newNE);
      this.manager.overlay.bounds = this.bounds;
      this.manager.overlay.center = {
        lat: (newSW.lat() + newNE.lat()) / 2,
        lng: (newSW.lng() + newNE.lng()) / 2,
      };

      this.draw();
    }

    draw() {
      if (!this.div) return;

      const projection = this.getProjection();
      if (!projection) return;

      const sw = projection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      const ne = projection.fromLatLngToDivPixel(this.bounds.getNorthEast());

      if (!sw || !ne) return;

      const width = ne.x - sw.x;
      const height = sw.y - ne.y;

      this.div.style.left = sw.x + 'px';
      this.div.style.top = ne.y + 'px';
      this.div.style.width = width + 'px';
      this.div.style.height = height + 'px';

      // Aplica rotacao
      this.div.style.transform = `rotate(${this.rotation}deg)`;
      this.div.style.transformOrigin = 'center center';
    }

    updateBounds(bounds) {
      this.bounds = bounds;
      this.draw();
    }

    updateRotation(rotation) {
      this.rotation = rotation;
      this.draw();
    }

    setOpacity(opacity) {
      this.opacity = opacity;
      if (this.img) {
        this.img.style.opacity = opacity;
      }
    }

    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
        this.img = null;
      }
    }
  };

  return CustomImageOverlayClass;
}
