/**
 * MapManager - Gerencia a instância e operações do Google Maps
 *
 * Responsável por:
 * - Inicialização do mapa
 * - Controle de zoom e centro
 * - Alternância entre visualizações (satélite/roadmap)
 * - Eventos de clique no mapa
 *
 * @example
 * const mapManager = new MapManager('gmap', stateManager, eventBus);
 * await mapManager.initialize(-3.7319, -38.5267, 18);
 */
export class MapManager {
  constructor(elementId, stateManager, eventBus) {
    this.elementId = elementId;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.map = null;
    this.geocoder = null;
  }

  /**
   * Inicializa o mapa do Google Maps
   * @param {number} lat - Latitude inicial
   * @param {number} lng - Longitude inicial
   * @param {number} zoom - Nível de zoom inicial
   * @returns {Promise<google.maps.Map>}
   */
  async initialize(lat, lng, zoom) {
    const element = document.getElementById(this.elementId);

    if (!element) {
      throw new Error(`Elemento com ID "${this.elementId}" não encontrado`);
    }

    // Verifica se a API do Google Maps está carregada
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      throw new Error('Google Maps API não está carregada');
    }

    const mapOptions = {
      center: { lat, lng },
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'greedy'
    };

    this.map = new google.maps.Map(element, mapOptions);
    this.geocoder = new google.maps.Geocoder();

    // Atualiza o estado
    this.stateManager.setState('map', this.map);
    this.stateManager.setMultiple({
      center: { lat, lng },
      zoom: zoom,
      currentMapType: 'roadmap'
    });

    // Registra listeners de eventos do mapa
    this.setupMapEventListeners();

    // Emite evento de inicialização
    this.eventBus.emit('map:initialized', { lat, lng, zoom });

    return this.map;
  }

  /**
   * Configura event listeners do mapa
   * @private
   */
  setupMapEventListeners() {
    // Atualiza estado quando o zoom muda
    google.maps.event.addListener(this.map, 'zoom_changed', () => {
      const newZoom = this.map.getZoom();
      this.stateManager.setState('zoom', newZoom);
      this.eventBus.emit('map:zoom_changed', newZoom);
    });

    // Atualiza estado quando o centro muda
    google.maps.event.addListener(this.map, 'center_changed', () => {
      const center = this.map.getCenter();
      const newCenter = { lat: center.lat(), lng: center.lng() };
      this.stateManager.setState('center', newCenter);
    });

    // Evento de clique no mapa (pode ser usado para fechar info windows)
    google.maps.event.addListener(this.map, 'click', () => {
      this.eventBus.emit('map:clicked');
    });
  }

  /**
   * Retorna a instância do mapa
   * @returns {google.maps.Map}
   */
  getMap() {
    return this.map;
  }

  /**
   * Retorna a instância do geocoder
   * @returns {google.maps.Geocoder}
   */
  getGeocoder() {
    return this.geocoder;
  }

  /**
   * Atualiza o centro do mapa
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   */
  updateCenter(lat, lng) {
    if (!this.map) {
      console.warn('Mapa não inicializado');
      return;
    }

    const center = new google.maps.LatLng(lat, lng);
    this.map.setCenter(center);
    this.stateManager.setState('center', { lat, lng });
    this.eventBus.emit('map:center_updated', { lat, lng });
  }

  /**
   * Atualiza o nível de zoom
   * @param {number} level - Nível de zoom (1-20)
   */
  updateZoom(level) {
    if (!this.map) {
      console.warn('Mapa não inicializado');
      return;
    }

    const zoomLevel = Math.max(1, Math.min(20, level));
    this.map.setZoom(zoomLevel);
    this.stateManager.setState('zoom', zoomLevel);
  }

  /**
   * Alterna entre visualização satélite e roadmap
   */
  toggleMapType() {
    if (!this.map) {
      console.warn('Mapa não inicializado');
      return;
    }

    const currentType = this.stateManager.getState('currentMapType');
    const newType = currentType === 'roadmap' ? 'satellite' : 'roadmap';

    this.map.setMapTypeId(
      newType === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP
    );

    this.stateManager.setState('currentMapType', newType);
    this.eventBus.emit('map:type_changed', newType);

    return newType;
  }

  /**
   * Ajusta o mapa para mostrar todos os polígonos
   * @param {Array<google.maps.Polygon>} polygons - Array de polígonos
   */
  fitBounds(polygons) {
    if (!this.map || !polygons || polygons.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    polygons.forEach(polygon => {
      const path = polygon.getPath();
      path.forEach(latLng => {
        bounds.extend(latLng);
      });
    });

    this.map.fitBounds(bounds);
  }

  /**
   * Ajusta o zoom para mostrar um bounds específico
   * @param {google.maps.LatLngBounds} bounds - Bounds a exibir
   */
  fitToBounds(bounds) {
    if (!this.map) {
      return;
    }

    this.map.fitBounds(bounds);
  }

  /**
   * Pan suave para uma localização
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   */
  panTo(lat, lng) {
    if (!this.map) {
      return;
    }

    const position = new google.maps.LatLng(lat, lng);
    this.map.panTo(position);
  }

  /**
   * Limpa todos os overlays do mapa
   */
  clearOverlays() {
    // Esta função pode ser expandida conforme necessário
    this.eventBus.emit('map:overlays_cleared');
  }

  /**
   * Destrói o mapa e limpa recursos
   */
  destroy() {
    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map);
      this.map = null;
      this.geocoder = null;
      this.stateManager.setState('map', null);
      this.eventBus.emit('map:destroyed');
    }
  }
}
