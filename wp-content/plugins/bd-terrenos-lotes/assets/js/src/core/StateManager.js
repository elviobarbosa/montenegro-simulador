/**
 * StateManager - Gerenciamento centralizado de estado da aplicação
 *
 * Substitui variáveis globais descontroladas por um estado centralizado e reativo.
 * Implementa o padrão Observer para notificar mudanças de estado.
 *
 * @example
 * const stateManager = new StateManager();
 * stateManager.setState('map', mapInstance);
 */
export class StateManager {
  constructor() {
    this.state = {
      map: null,
      drawingManager: null,
      polygons: new Map(),
      lotesData: [],
      isDrawingMode: false,
      currentMapType: 'roadmap',
      currentPolygon: null,
      currentInfoWindow: null,
      currentEditLoteId: null,
      zoom: 18,
      center: { lat: -3.7319, lng: -38.5267 }
    };

    this.subscribers = new Map();
  }

  /**
   * Define um valor no estado
   * @param {string} key - Chave do estado
   * @param {*} value - Novo valor
   */
  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;

    // Notifica subscribers apenas se o valor mudou
    if (oldValue !== value) {
      this.notifySubscribers(key, value, oldValue);
    }
  }

  /**
   * Retorna um valor do estado
   * @param {string} key - Chave do estado
   * @returns {*}
   */
  getState(key) {
    return this.state[key];
  }

  /**
   * Retorna todo o estado (cópia)
   * @returns {Object}
   */
  getAllState() {
    return { ...this.state };
  }

  /**
   * Registra um subscriber para mudanças em uma chave específica
   * @param {string} key - Chave do estado a observar
   * @param {Function} callback - Função a ser executada quando o estado mudar
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(callback);
  }

  /**
   * Remove um subscriber
   * @param {string} key - Chave do estado
   * @param {Function} callback - Função a ser removida
   */
  unsubscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      return;
    }

    const callbacks = this.subscribers.get(key);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Notifica todos os subscribers de uma chave
   * @private
   * @param {string} key - Chave do estado
   * @param {*} newValue - Novo valor
   * @param {*} oldValue - Valor anterior
   */
  notifySubscribers(key, newValue, oldValue) {
    if (!this.subscribers.has(key)) {
      return;
    }

    const callbacks = this.subscribers.get(key);
    callbacks.forEach(callback => {
      try {
        callback(newValue, oldValue);
      } catch (error) {
        console.error(`Erro ao executar subscriber da chave "${key}":`, error);
      }
    });
  }

  /**
   * Atualiza múltiplas chaves do estado de uma vez
   * @param {Object} updates - Objeto com as chaves e valores a atualizar
   */
  setMultiple(updates) {
    Object.keys(updates).forEach(key => {
      this.setState(key, updates[key]);
    });
  }

  /**
   * Reseta o estado para os valores iniciais
   */
  reset() {
    this.state = {
      map: null,
      drawingManager: null,
      polygons: new Map(),
      lotesData: [],
      isDrawingMode: false,
      currentMapType: 'roadmap',
      currentPolygon: null,
      currentInfoWindow: null,
      currentEditLoteId: null,
      zoom: 18,
      center: { lat: -3.7319, lng: -38.5267 }
    };
  }

  /**
   * Adiciona um polígono ao Map de polígonos
   * @param {string} loteId - ID do lote
   * @param {google.maps.Polygon} polygon - Instância do polígono
   */
  addPolygon(loteId, polygon) {
    this.state.polygons.set(loteId, polygon);
  }

  /**
   * Remove um polígono do Map de polígonos
   * @param {string} loteId - ID do lote
   */
  removePolygon(loteId) {
    this.state.polygons.delete(loteId);
  }

  /**
   * Retorna um polígono pelo ID do lote
   * @param {string} loteId - ID do lote
   * @returns {google.maps.Polygon|undefined}
   */
  getPolygon(loteId) {
    return this.state.polygons.get(loteId);
  }

  /**
   * Adiciona um lote ao array de lotes
   * @param {Object} lote - Dados do lote
   */
  addLote(lote) {
    this.state.lotesData.push(lote);
  }

  /**
   * Atualiza um lote existente
   * @param {string} loteId - ID do lote
   * @param {Object} updates - Dados a atualizar
   */
  updateLote(loteId, updates) {
    const index = this.state.lotesData.findIndex(l => l.id === loteId);
    if (index > -1) {
      this.state.lotesData[index] = { ...this.state.lotesData[index], ...updates };
    }
  }

  /**
   * Remove um lote do array de lotes
   * @param {string} loteId - ID do lote
   */
  removeLote(loteId) {
    this.state.lotesData = this.state.lotesData.filter(l => l.id !== loteId);
  }

  /**
   * Retorna um lote pelo ID
   * @param {string} loteId - ID do lote
   * @returns {Object|undefined}
   */
  getLote(loteId) {
    return this.state.lotesData.find(l => l.id === loteId);
  }
}
