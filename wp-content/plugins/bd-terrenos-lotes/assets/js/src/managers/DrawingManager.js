/**
 * DrawingManager - Gerencia o modo de desenho de polígonos
 *
 * Responsável por:
 * - Ativar/desativar drawing mode
 * - Validar polígonos desenhados
 * - Disparo de eventos de conclusão
 *
 * @example
 * const drawingManager = new DrawingManager(map, stateManager, eventBus);
 * drawingManager.startDrawing();
 * drawingManager.stopDrawing();
 */
export class DrawingManager {
  constructor(map, stateManager, eventBus) {
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.drawingManager = null;
    this.currentPolygon = null;
  }

  /**
   * Inicializa o Drawing Manager do Google Maps
   */
  initialize() {
    if (this.drawingManager) {
      return;
    }

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        strokeColor: '#FF6B6B',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF6B6B',
        fillOpacity: 0.35,
        editable: true,
        draggable: false
      }
    });

    this.drawingManager.setMap(this.map);
    this.stateManager.setState('drawingManager', this.drawingManager);

    // Listener para quando um polígono é completado
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        this.handlePolygonComplete(event.overlay);
      }
    });

  }

  /**
   * Ativa o modo de desenho
   */
  startDrawing() {
    if (!this.drawingManager) {
      this.initialize();
    }

    // Cancela qualquer desenho anterior
    if (this.currentPolygon) {
      this.cancelDrawing();
    }

    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    this.stateManager.setState('isDrawingMode', true);

    this.eventBus.emit('drawing:started');
  }

  /**
   * Desativa o modo de desenho e retorna o polígono
   * @returns {google.maps.Polygon|null}
   */
  stopDrawing() {
    if (!this.drawingManager) {
      return null;
    }

    this.drawingManager.setDrawingMode(null);
    this.stateManager.setState('isDrawingMode', false);

    const polygon = this.currentPolygon;
    this.currentPolygon = null;

    this.eventBus.emit('drawing:stopped', { polygon });

    return polygon;
  }

  /**
   * Cancela o desenho atual
   */
  cancelDrawing() {
    if (this.currentPolygon) {
      // Remove o polígono do mapa
      this.currentPolygon.setMap(null);
      this.currentPolygon = null;
    }

    if (this.drawingManager) {
      this.drawingManager.setDrawingMode(null);
    }

    this.stateManager.setState('isDrawingMode', false);
    this.stateManager.setState('currentPolygon', null);

    this.eventBus.emit('drawing:canceled');
  }

  /**
   * Handler para quando um polígono é completado
   * @private
   * @param {google.maps.Polygon} polygon - Polígono desenhado
   */
  handlePolygonComplete(polygon) {
    // Remove o modo de desenho
    this.drawingManager.setDrawingMode(null);

    // Valida o polígono
    if (!this.validatePolygon(polygon)) {
      polygon.setMap(null);
      this.eventBus.emit('drawing:invalid');
      return;
    }

    // Armazena o polígono atual
    this.currentPolygon = polygon;
    this.stateManager.setState('currentPolygon', polygon);

    // Extrai coordenadas
    const coordinates = this.extractCoordinates(polygon);

    this.eventBus.emit('drawing:completed', {
      polygon: polygon,
      coordinates: coordinates
    });
  }

  /**
   * Valida um polígono desenhado
   * @param {google.maps.Polygon} polygon - Polígono a validar
   * @returns {boolean}
   */
  validatePolygon(polygon) {
    const path = polygon.getPath();

    if (path.getLength() < 3) {
      alert('O polígono deve ter pelo menos 3 vértices');
      return false;
    }

    // Pode adicionar mais validações aqui:
    // - Área mínima
    // - Verificar se não intercepta outros polígonos
    // - Verificar se está dentro de limites específicos

    return true;
  }

  /**
   * Extrai coordenadas de um polígono
   * @param {google.maps.Polygon} polygon - Polígono
   * @returns {Array<Object>} Array de {lat, lng}
   */
  extractCoordinates(polygon) {
    const path = polygon.getPath();
    const coordinates = [];

    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    }

    return coordinates;
  }

  /**
   * Retorna o polígono atual sendo desenhado
   * @returns {google.maps.Polygon|null}
   */
  getCurrentPolygon() {
    return this.currentPolygon;
  }

  /**
   * Verifica se está em modo de desenho
   * @returns {boolean}
   */
  isDrawing() {
    return this.stateManager.getState('isDrawingMode');
  }

  /**
   * Altera as opções do polígono sendo desenhado
   * @param {Object} options - Opções do polígono (cores, etc)
   */
  setPolygonOptions(options) {
    if (this.drawingManager) {
      this.drawingManager.setOptions({
        polygonOptions: options
      });
    }
  }

  /**
   * Destrói o drawing manager e limpa recursos
   */
  destroy() {
    if (this.currentPolygon) {
      this.currentPolygon.setMap(null);
      this.currentPolygon = null;
    }

    if (this.drawingManager) {
      google.maps.event.clearInstanceListeners(this.drawingManager);
      this.drawingManager.setMap(null);
      this.drawingManager = null;
    }

    this.stateManager.setState('drawingManager', null);
    this.stateManager.setState('isDrawingMode', false);
    this.stateManager.setState('currentPolygon', null);

  }
}
