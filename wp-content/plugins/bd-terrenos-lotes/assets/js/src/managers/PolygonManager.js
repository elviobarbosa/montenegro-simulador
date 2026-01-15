/**
 * PolygonManager - Gerencia CRUD de polígonos no mapa
 *
 * Responsável por:
 * - Criação de polígonos visuais no mapa
 * - Edição de polígonos (drag de vértices)
 * - Exclusão de polígonos
 * - Event listeners (click, hover, drag)
 * - Sincronização com estado
 *
 * @example
 * const polygonManager = new PolygonManager(map, stateManager, eventBus);
 * polygonManager.createPolygon(loteData);
 * polygonManager.deletePolygon(loteId);
 */
export class PolygonManager {
  constructor(map, stateManager, eventBus) {
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }

  /**
   * Cria um polígono visual no mapa
   * @param {Object} loteData - Dados do lote
   * @returns {google.maps.Polygon}
   */
  createPolygon(loteData) {
    if (!loteData.coordinates || loteData.coordinates.length < 3) {
      console.error('Lote deve ter no mínimo 3 coordenadas');
      return null;
    }

    // Converte coordenadas para formato do Google Maps
    const paths = loteData.coordinates.map(coord => ({
      lat: coord.lat,
      lng: coord.lng
    }));

    // Define cor padrão se não existir
    const color = loteData.color || this.generateRandomColor();

    const polygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      editable: false,
      draggable: false,
      map: this.map
    });

    // Armazena referência do lote no polígono
    polygon.loteId = loteData.id;
    polygon.loteData = loteData;

    // Adiciona ao estado
    this.stateManager.addPolygon(loteData.id, polygon);

    // Configura event listeners
    this.setupPolygonEvents(polygon, loteData);

    return polygon;
  }

  /**
   * Configura event listeners para um polígono
   * @param {google.maps.Polygon} polygon - Polígono
   * @param {Object} loteData - Dados do lote
   */
  setupPolygonEvents(polygon, loteData) {
    // Click no polígono
    google.maps.event.addListener(polygon, 'click', (event) => {
      this.eventBus.emit('polygon:clicked', {
        lote: loteData,
        polygon: polygon,
        event: event
      });
    });

    // Mouse over (hover)
    google.maps.event.addListener(polygon, 'mouseover', () => {
      polygon.setOptions({
        strokeWeight: 3,
        fillOpacity: 0.5
      });

      this.eventBus.emit('polygon:hover', {
        lote: loteData,
        polygon: polygon
      });
    });

    // Mouse out
    google.maps.event.addListener(polygon, 'mouseout', () => {
      polygon.setOptions({
        strokeWeight: 2,
        fillOpacity: 0.35
      });
    });

    // Right click (pode ser usado para menu contextual)
    google.maps.event.addListener(polygon, 'rightclick', (event) => {
      this.eventBus.emit('polygon:rightclick', {
        lote: loteData,
        polygon: polygon,
        event: event
      });
    });
  }

  /**
   * Atualiza as coordenadas de um polígono
   * @param {string} loteId - ID do lote
   * @param {Array<Object>} newCoordinates - Novas coordenadas
   * @returns {boolean}
   */
  updatePolygon(loteId, newCoordinates) {
    const polygon = this.stateManager.getPolygon(loteId);

    if (!polygon) {
      console.warn(`Polígono com ID "${loteId}" não encontrado`);
      return false;
    }

    const paths = newCoordinates.map(coord => ({
      lat: coord.lat,
      lng: coord.lng
    }));

    polygon.setPath(paths);

    this.eventBus.emit('polygon:updated', {
      loteId: loteId,
      coordinates: newCoordinates
    });

    return true;
  }

  /**
   * Ativa a edição de um polígono
   * @param {string} loteId - ID do lote
   */
  enableEditing(loteId) {
    const polygon = this.stateManager.getPolygon(loteId);

    if (!polygon) {
      console.warn(`Polígono com ID "${loteId}" não encontrado`);
      return;
    }

    polygon.setOptions({
      editable: true,
      draggable: true
    });

    // Listener para detectar mudanças no path
    const pathListener = google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
      this.handlePolygonEdit(polygon);
    });

    const insertListener = google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
      this.handlePolygonEdit(polygon);
    });

    // Armazena listeners para remover depois
    polygon.editListeners = [pathListener, insertListener];
  }

  /**
   * Desativa a edição de um polígono
   * @param {string} loteId - ID do lote
   */
  disableEditing(loteId) {
    const polygon = this.stateManager.getPolygon(loteId);

    if (!polygon) {
      return;
    }

    polygon.setOptions({
      editable: false,
      draggable: false
    });

    // Remove listeners de edição
    if (polygon.editListeners) {
      polygon.editListeners.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      polygon.editListeners = null;
    }
  }

  /**
   * Handler para quando um polígono é editado
   * @private
   * @param {google.maps.Polygon} polygon - Polígono editado
   */
  handlePolygonEdit(polygon) {
    const path = polygon.getPath();
    const coordinates = [];

    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    }

    this.eventBus.emit('polygon:path_changed', {
      loteId: polygon.loteId,
      coordinates: coordinates
    });
  }

  /**
   * Remove um polígono do mapa
   * @param {string} loteId - ID do lote
   * @returns {boolean}
   */
  deletePolygon(loteId) {
    const polygon = this.stateManager.getPolygon(loteId);

    if (!polygon) {
      console.warn(`Polígono com ID "${loteId}" não encontrado`);
      return false;
    }

    // Remove listeners de edição se existirem
    if (polygon.editListeners) {
      polygon.editListeners.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
    }

    // Remove todos os listeners do polígono
    google.maps.event.clearInstanceListeners(polygon);

    // Remove do mapa
    polygon.setMap(null);

    // Remove do estado
    this.stateManager.removePolygon(loteId);

    this.eventBus.emit('polygon:deleted', { loteId });

    return true;
  }

  /**
   * Carrega múltiplos polígonos de uma vez
   * @param {Array<Object>} lotesData - Array de dados de lotes
   * @returns {Array<google.maps.Polygon>}
   */
  loadPolygons(lotesData) {
    const polygons = [];

    lotesData.forEach(loteData => {
      const polygon = this.createPolygon(loteData);
      if (polygon) {
        polygons.push(polygon);
      }
    });

    console.log(`${polygons.length} polígono(s) carregado(s) no mapa`);
    this.eventBus.emit('polygons:loaded', polygons);

    return polygons;
  }

  /**
   * Remove todos os polígonos do mapa
   */
  clearAllPolygons() {
    const polygons = this.stateManager.getState('polygons');

    polygons.forEach((polygon, loteId) => {
      google.maps.event.clearInstanceListeners(polygon);
      polygon.setMap(null);
    });

    polygons.clear();
    this.eventBus.emit('polygons:cleared');

    console.log('Todos os polígonos foram removidos');
  }

  /**
   * Destaca um polígono específico
   * @param {string} loteId - ID do lote
   */
  highlightPolygon(loteId) {
    const polygon = this.stateManager.getPolygon(loteId);

    if (!polygon) {
      return;
    }

    // Salva estilo original
    const originalStyle = {
      strokeWeight: polygon.strokeWeight,
      strokeOpacity: polygon.strokeOpacity,
      fillOpacity: polygon.fillOpacity
    };

    // Aplica destaque
    polygon.setOptions({
      strokeWeight: 4,
      strokeOpacity: 1,
      fillOpacity: 0.6
    });

    // Restaura estilo após delay
    setTimeout(() => {
      polygon.setOptions(originalStyle);
    }, 2000);
  }

  /**
   * Gera uma cor aleatória para polígono
   * @private
   * @returns {string}
   */
  generateRandomColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F06292', '#AED581', '#FFD54F', '#4DB6AC', '#7986CB'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Retorna todos os polígonos ativos
   * @returns {Map<string, google.maps.Polygon>}
   */
  getAllPolygons() {
    return this.stateManager.getState('polygons');
  }

  /**
   * Centraliza o mapa em um polígono específico
   * @param {string} loteId - ID do lote
   */
  centerOnPolygon(loteId) {
    const polygon = this.stateManager.getPolygon(loteId);

    if (!polygon) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    const path = polygon.getPath();

    path.forEach(latLng => {
      bounds.extend(latLng);
    });

    this.map.fitBounds(bounds);
    this.map.setZoom(Math.min(this.map.getZoom(), 18));
  }
}
