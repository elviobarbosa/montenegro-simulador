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
import { DrawingManager } from './managers/DrawingManager';
import { PolygonManager } from './managers/PolygonManager';
import { GeocodeManager } from './managers/GeocodeManager';
import { DataPersistence } from './managers/DataPersistence';
import { SVGOverlayManager } from './managers/SVGOverlayManager';
import { SVGEditorManager } from './managers/SVGEditorManager';
import { ImageOverlayManager } from './managers/ImageOverlayManager';

// Services
import { CoordinatesService } from './services/CoordinatesService';
import { AreaCalculator } from './services/AreaCalculator';

// UI
import { UIManager } from './ui/UIManager';
import { ModalManager } from './ui/ModalManager';

// Models
import { Lote } from './models/Lote';

// Utils
import { DOMHelper } from './utils/DOMHelper';
import { ColorGenerator } from './utils/ColorGenerator';

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
    this.drawingManager = null;
    this.polygonManager = null;
    this.geocodeManager = null;
    this.dataPersistence = null;
    this.uiManager = null;
    this.modalManager = null;
    this.svgImportManager = null;
    this.svgEditorManager = null;
    this.imageOverlayManager = null;

    // InfoWindow compartilhada
    this.infoWindow = null;
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
      this.drawingManager = new DrawingManager(map, this.stateManager, this.eventBus);
      this.polygonManager = new PolygonManager(map, this.stateManager, this.eventBus);
      this.geocodeManager = new GeocodeManager(geocoder, this.eventBus);
      this.dataPersistence = new DataPersistence('terreno_lotes_data', this.stateManager, this.eventBus);
      this.uiManager = new UIManager(this.stateManager, this.eventBus);
      this.modalManager = new ModalManager();
      this.svgImportManager = new SVGOverlayManager(
        map,
        this.stateManager,
        this.eventBus,
        this.polygonManager,
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

      // Carrega dados salvos
      const lotesData = this.dataPersistence.load();

      // Carrega polígonos no mapa
      if (lotesData.length > 0) {
        this.polygonManager.loadPolygons(lotesData);
      }

      // Renderiza UI
      this.uiManager.renderLotesList(lotesData);

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
    // Drawing completed
    this.eventBus.on('drawing:completed', ({ polygon, coordinates }) => {
    });

    // Polygon clicked - abre InfoWindow
    this.eventBus.on('polygon:clicked', ({ lote, polygon, event }) => {
      this.openInfoWindow(lote, polygon, event);
    });

    // UI events
    this.eventBus.on('ui:zoom_lote', ({ loteId }) => {
      this.polygonManager.centerOnPolygon(loteId);
      this.polygonManager.highlightPolygon(loteId);
    });

    this.eventBus.on('ui:edit_lote', ({ loteId }) => {
      this.openEditModal(loteId);
    });

    this.eventBus.on('ui:delete_lote', ({ loteId }) => {
      this.deleteLote(loteId);
    });

    // Data events
    this.eventBus.on('data:saved', () => {
    });

    // SVG Import events
    this.eventBus.on('lotes:imported', ({ count }) => {
      // Atualiza a lista de lotes na UI
      this.uiManager.renderLotesList(this.stateManager.getState('lotesData'));
    });

    // SVG Editor events - clique em shape no overlay
    this.eventBus.on('svg:shape_clicked', ({ index }) => {
      // Abre o editor e seleciona o shape
      if (this.svgEditorManager) {
        this.svgEditorManager.openEditor();
        this.svgEditorManager.selectShape(index);
      }
    });

    // SVG configuração salva
    this.eventBus.on('svg:configuration_saved', (data) => {
    });
  }

  /**
   * Configura event handlers dos elementos DOM
   */
  setupDOMEventHandlers() {
    // Botão Desenhar Lote
    DOMHelper.addEventListener('desenhar_lote', 'click', () => {
      this.startDrawing();
    });

    // Botão Aplicar Desenho
    DOMHelper.addEventListener('aplicar_desenho', 'click', () => {
      this.applyDrawing();
    });

    // Botão Cancelar Desenho
    DOMHelper.addEventListener('cancelar_desenho', 'click', () => {
      this.cancelDrawing();
    });

    // Botão Limpar Lotes
    DOMHelper.addEventListener('limpar_lotes', 'click', () => {
      if (confirm('Tem certeza que deseja limpar TODOS os lotes? Esta ação não pode ser desfeita.')) {
        this.clearAllLotes();
      }
    });

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
   * Inicia modo de desenho
   */
  startDrawing() {
    this.drawingManager.startDrawing();
    this.uiManager.updateDrawingButtons(true);
  }

  /**
   * Aplica o desenho e cria novo lote
   */
  async applyDrawing() {
    const polygon = this.drawingManager.getCurrentPolygon();

    if (!polygon) {
      alert('Nenhum polígono desenhado');
      return;
    }

    // Extrai coordenadas
    const coordinates = CoordinatesService.pathToArray(polygon.getPath());

    // Calcula área
    const area = AreaCalculator.calculateAreaFromCoordinates(coordinates);

    // Gera cor
    const color = ColorGenerator.random();

    // Cria lote temporário com dados default
    const defaultNome = `Lote ${this.stateManager.getState('lotesData').length + 1}`;
    const tempLote = new Lote({
      coordinates: coordinates,
      area: area,
      color: color,
      nome: defaultNome,
      bloco: ''
    });

    try {
      // Abre modal para pedir ID da unidade, bloco e nome
      const loteData = await this.modalManager.openEditModal(tempLote);

      // Cria lote com dados do modal (usa o ID da unidade como ID do lote)
      const lote = new Lote({
        id: loteData.id, // ID da unidade da API
        coordinates: coordinates,
        area: area,
        color: color,
        nome: loteData.nome || defaultNome,
        bloco: loteData.bloco
      });

      // Valida
      const validation = lote.validate();
      if (!validation.valid) {
        alert('Lote inválido: ' + validation.errors.join(', '));
        return;
      }

      // Remove o polígono temporário do desenho
      polygon.setMap(null);

      // Adiciona lote
      this.dataPersistence.addLote(lote.toJSON());

      // Cria polígono visual
      this.polygonManager.createPolygon(lote.toJSON());

      // Atualiza UI
      this.uiManager.renderLotesList(this.stateManager.getState('lotesData'));

      // Desativa modo desenho
      this.drawingManager.stopDrawing();
      this.uiManager.updateDrawingButtons(false);


    } catch (error) {
      // Usuário cancelou - remove o polígono temporário
      polygon.setMap(null);
      this.drawingManager.stopDrawing();
      this.uiManager.updateDrawingButtons(false);
    }
  }

  /**
   * Cancela o desenho
   */
  cancelDrawing() {
    this.drawingManager.cancelDrawing();
    this.uiManager.updateDrawingButtons(false);
  }

  /**
   * Limpa todos os lotes
   */
  clearAllLotes() {
    this.polygonManager.clearAllPolygons();
    this.dataPersistence.clearAll();
    this.uiManager.renderLotesList([]);
  }

  /**
   * Deleta um lote
   */
  deleteLote(loteId) {
    this.polygonManager.deletePolygon(loteId);
    this.dataPersistence.removeLote(loteId);
    this.uiManager.renderLotesList(this.stateManager.getState('lotesData'));
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

  /**
   * Abre modal de edição
   */
  async openEditModal(loteId) {
    const lote = this.stateManager.getLote(loteId);

    if (!lote) {
      alert('Lote não encontrado');
      return;
    }

    try {
      // Abre o modal e aguarda os dados editados
      const editedData = await this.modalManager.openEditModal(lote);

      // Verifica se o ID mudou
      const idChanged = editedData.id !== loteId;

      if (idChanged) {
        // Se o ID mudou, precisamos deletar o lote antigo e criar um novo

        // Remove o polígono antigo do mapa
        this.polygonManager.deletePolygon(loteId);

        // Remove do state
        this.dataPersistence.removeLote(loteId);

        // Cria novo lote com o novo ID
        const newLote = new Lote({
          id: editedData.id, // Novo ID
          coordinates: lote.coordinates,
          area: lote.area,
          color: lote.color,
          nome: editedData.nome || lote.nome,
          bloco: editedData.bloco,
          status: lote.status,
          observacoes: lote.observacoes,
          created_at: lote.created_at
        });

        // Adiciona o novo lote
        this.dataPersistence.addLote(newLote.toJSON());

        // Cria novo polígono no mapa
        this.polygonManager.createPolygon(newLote.toJSON());

      } else {
        // Se o ID não mudou, apenas atualiza os dados
        this.dataPersistence.updateLote(loteId, {
          nome: editedData.nome || lote.nome,
          bloco: editedData.bloco || lote.bloco
        });

      }

      // Re-renderiza a lista
      this.uiManager.renderLotesList(this.stateManager.getState('lotesData'));

    } catch (error) {
      // Usuário cancelou o modal
    }
  }

  /**
   * Abre InfoWindow ao clicar no polígono
   * @param {Object} lote - Dados do lote
   * @param {google.maps.Polygon} polygon - Polígono clicado
   * @param {Object} event - Evento do clique
   */
  openInfoWindow(lote, polygon, event) {
    // Fecha InfoWindow existente
    if (this.infoWindow) {
      this.infoWindow.close();
    }

    // Cria conteúdo da InfoWindow
    const content = `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin: 0 0 10px 0; color: #23282d; font-size: 14px;">
          ${lote.nome || 'Lote sem nome'}
        </h4>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>ID da Unidade:</strong> ${lote.id || '-'}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>Quadra:</strong> ${lote.bloco || '-'}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>Área:</strong> ${lote.area ? lote.area.toFixed(2) + ' m²' : '-'}
        </p>
        <div style="margin-top: 12px; text-align: center;">
          <button type="button" class="button button-primary" id="infowindow-edit-btn" style="width: 100%;">
            Editar Lote
          </button>
        </div>
      </div>
    `;

    // Cria InfoWindow
    this.infoWindow = new google.maps.InfoWindow({
      content: content,
      position: event.latLng
    });

    // Abre InfoWindow
    this.infoWindow.open(this.mapManager.getMap());

    // Adiciona listener para o botão de editar após o DOM ser renderizado
    google.maps.event.addListenerOnce(this.infoWindow, 'domready', () => {
      const editBtn = document.getElementById('infowindow-edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          this.infoWindow.close();
          this.openEditModal(lote.id);
        });
      }
    });
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
