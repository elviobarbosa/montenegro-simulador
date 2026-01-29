/**
 * Main Entry Point - Aplicação de Gerenciamento de Terrenos e Lotes
 *
 * Inicializa todos os módulos e configura event handlers
 */

// Core modules
import { StateManager } from './core/StateManager';
import { EventBus } from './core/EventBus';
import { MapManager } from './core/MapManager';

// Managers
import { GeocodeManager } from './managers/GeocodeManager';
import { DataPersistence } from './managers/DataPersistence';
import { SVGOverlayManager } from './managers/SVGOverlayManager';
import { SVGEditorManager } from './managers/SVGEditorManager';
import { ImageOverlayManager } from './managers/ImageOverlayManager';

// UI
import { UIManager } from './ui/UIManager';
import { ModalManager } from './ui/ModalManager';

// Utils
import { DOMHelper } from './utils/DOMHelper';

/**
 * Classe principal da aplicação
 */
class TerrenoMapApp {
  constructor() {

    // Inicializa core modules
    this.eventBus = new EventBus();
    this.stateManager = new StateManager();

    // Referências dos managers (serão inicializados em initialize())
    this.mapManager = null;
    this.geocodeManager = null;
    this.dataPersistence = null;
    this.uiManager = null;
    this.modalManager = null;
    this.svgImportManager = null;
    this.svgEditorManager = null;
    this.imageOverlayManager = null;
  }

  /**
   * Inicializa a aplicação
   */
  async initialize() {
    try {
      // Lê configurações dos inputs
      const lat = parseFloat(DOMHelper.getValue('terreno_latitude')) || -3.7319;
      const lng = parseFloat(DOMHelper.getValue('terreno_longitude')) || -38.5267;
      const zoom = parseInt(DOMHelper.getValue('terreno_zoom')) || 18;

      // Inicializa o mapa
      this.mapManager = new MapManager('gmap', this.stateManager, this.eventBus);
      await this.mapManager.initialize(lat, lng, zoom);

      const map = this.mapManager.getMap();
      const geocoder = this.mapManager.getGeocoder();

      // Inicializa managers
      this.geocodeManager = new GeocodeManager(geocoder, this.eventBus);
      this.dataPersistence = new DataPersistence('terreno_lotes_data', this.stateManager, this.eventBus);
      this.uiManager = new UIManager(this.stateManager, this.eventBus);
      this.modalManager = new ModalManager();
      this.svgImportManager = new SVGOverlayManager(
        map,
        this.stateManager,
        this.eventBus,
        this.dataPersistence
      );

      // Inicializa editor de SVG para vincular shapes aos lotes
      this.svgEditorManager = new SVGEditorManager(
        map,
        this.stateManager,
        this.eventBus
      );

      // Inicializa manager de planta humanizada (image overlay)
      this.imageOverlayManager = new ImageOverlayManager(
        map,
        this.stateManager,
        this.eventBus
      );

      // Carrega overlay SVG salvo (se existir)
      this.svgImportManager.loadSavedOverlay();

      // Carrega overlay de imagem salvo (se existir)
      this.imageOverlayManager.loadSavedOverlay();

      // Setup event handlers
      this.setupEventHandlers();
      this.setupDOMEventHandlers();


    } catch (error) {
      console.error('❌ Erro ao inicializar TerrenoMapApp:', error);
      alert('Erro ao inicializar o mapa. Verifique se a chave da API do Google Maps está configurada corretamente.');
    }
  }

  /**
   * Configura event handlers entre módulos
   */
  setupEventHandlers() {
    // SVG Editor events - clique em shape no overlay
    this.eventBus.on('svg:shape_clicked', ({ index }) => {
      // Abre o editor e seleciona o shape
      if (this.svgEditorManager) {
        this.svgEditorManager.openEditor();
        this.svgEditorManager.selectShape(index);
      }
    });
  }

  /**
   * Configura event handlers dos elementos DOM
   */
  setupDOMEventHandlers() {
    // Botão Alternar Satélite
    DOMHelper.addEventListener('toggle_satellite', 'click', () => {
      const newType = this.mapManager.toggleMapType();
      const buttonText = newType === 'satellite' ? 'Visualização Roadmap' : 'Visualização Satélite';
      DOMHelper.setText('toggle_satellite', buttonText);
    });

    // Botão Buscar Endereço
    DOMHelper.addEventListener('buscar_endereco', 'click', () => {
      this.searchAddress();
    });

    // Botão Ir para Coordenadas
    DOMHelper.addEventListener('ir_para_coordenadas', 'click', () => {
      this.goToCoordinates();
    });

    // Sync inputs com mapa
    this.eventBus.on('map:zoom_changed', (zoom) => {
      DOMHelper.setValue('terreno_zoom', zoom);
    });

    this.eventBus.on('map:center_updated', ({ lat, lng }) => {
      DOMHelper.setValue('terreno_latitude', lat.toFixed(7));
      DOMHelper.setValue('terreno_longitude', lng.toFixed(7));
    });
  }

  /**
   * Busca endereço
   */
  async searchAddress() {
    const address = DOMHelper.getValue('terreno_endereco');

    if (!address) {
      alert('Digite um endereço para buscar');
      return;
    }

    try {
      const result = await this.geocodeManager.smartSearch(address);

      // Atualiza mapa
      this.mapManager.updateCenter(result.lat, result.lng);
      this.mapManager.updateZoom(18);

      // Atualiza inputs
      DOMHelper.setValue('terreno_latitude', result.lat.toFixed(7));
      DOMHelper.setValue('terreno_longitude', result.lng.toFixed(7));

      if (result.address) {
        DOMHelper.setValue('terreno_endereco', result.address);
      }


    } catch (error) {
      alert('Erro ao buscar endereço: ' + error.message);
    }
  }

  /**
   * Move o mapa para as coordenadas digitadas
   */
  goToCoordinates() {
    const lat = parseFloat(DOMHelper.getValue('terreno_latitude'));
    const lng = parseFloat(DOMHelper.getValue('terreno_longitude'));
    const zoom = parseInt(DOMHelper.getValue('terreno_zoom')) || 18;

    if (isNaN(lat) || isNaN(lng)) {
      alert('Por favor, digite coordenadas válidas de latitude e longitude.');
      return;
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude deve estar entre -90 e 90.');
      return;
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude deve estar entre -180 e 180.');
      return;
    }

    // Atualiza mapa
    this.mapManager.updateCenter(lat, lng);
    this.mapManager.updateZoom(zoom);

  }

}

// Bootstrap quando DOM estiver pronto
jQuery(document).ready(() => {
  // Verifica se o elemento do mapa existe
  if (jQuery('#gmap').length === 0) {
    return;
  }

  const app = new TerrenoMapApp();
  app.initialize();

  // Expõe globalmente para compatibilidade/debugging
  window.TerrenoMapApp = app;
});
