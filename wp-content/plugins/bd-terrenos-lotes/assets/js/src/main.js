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
    console.log('🚀 Iniciando TerrenoMapApp...');

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

      console.log('✓ TerrenoMapApp inicializado com sucesso');
      console.log(`📍 ${lotesData.length} lote(s) carregado(s)`);

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
      console.log('Desenho completado, aguardando aplicação...');
    });

    // Polygon clicked
    this.eventBus.on('polygon:clicked', ({ lote }) => {
      console.log('Polígono clicado:', lote.nome || lote.id);
      // Pode abrir info window aqui
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
      console.log('✓ Dados salvos com sucesso');
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

      console.log('✓ Lote criado - ID:', lote.id, '| Nome:', lote.nome, '| Bloco:', lote.bloco);

    } catch (error) {
      // Usuário cancelou - remove o polígono temporário
      polygon.setMap(null);
      this.drawingManager.stopDrawing();
      this.uiManager.updateDrawingButtons(false);
      console.log('Criação de lote cancelada');
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
    console.log('✓ Todos os lotes foram removidos');
  }

  /**
   * Deleta um lote
   */
  deleteLote(loteId) {
    this.polygonManager.deletePolygon(loteId);
    this.dataPersistence.removeLote(loteId);
    this.uiManager.renderLotesList(this.stateManager.getState('lotesData'));
    console.log('✓ Lote removido:', loteId);
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

      console.log('✓ Endereço encontrado:', result.address || address);

    } catch (error) {
      alert('Erro ao buscar endereço: ' + error.message);
    }
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

        console.log('✓ Lote recriado com novo ID - Antigo:', loteId, '| Novo:', editedData.id);
      } else {
        // Se o ID não mudou, apenas atualiza os dados
        this.dataPersistence.updateLote(loteId, {
          nome: editedData.nome || lote.nome,
          bloco: editedData.bloco || lote.bloco
        });

        console.log('✓ Lote atualizado:', loteId);
      }

      // Re-renderiza a lista
      this.uiManager.renderLotesList(this.stateManager.getState('lotesData'));

    } catch (error) {
      // Usuário cancelou o modal
      console.log('Edição cancelada');
    }
  }
}

// Bootstrap quando DOM estiver pronto
jQuery(document).ready(() => {
  // Verifica se o elemento do mapa existe
  if (jQuery('#gmap').length === 0) {
    console.log('Elemento #gmap não encontrado, não iniciando TerrenoMapApp');
    return;
  }

  const app = new TerrenoMapApp();
  app.initialize();

  // Expõe globalmente para compatibilidade/debugging
  window.TerrenoMapApp = app;
});
