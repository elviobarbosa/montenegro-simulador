/**
 * DataPersistence - Gerencia a persistência de dados no WordPress
 *
 * Responsável por:
 * - Salvar dados dos lotes em hidden field
 * - Carregar dados salvos
 * - Validação de JSON
 * - Sincronização com o estado
 *
 * @example
 * const persistence = new DataPersistence('terreno_lotes_data', stateManager, eventBus);
 * persistence.load();
 * persistence.save();
 */
export class DataPersistence {
  constructor(fieldId, stateManager, eventBus) {
    this.fieldId = fieldId;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.field = null;
  }

  /**
   * Inicializa e valida o campo hidden
   * @returns {boolean}
   */
  initialize() {
    this.field = document.getElementById(this.fieldId);

    if (!this.field) {
      console.error(`Campo hidden com ID "${this.fieldId}" não encontrado`);
      return false;
    }

    return true;
  }

  /**
   * Carrega os dados salvos do hidden field
   * @returns {Array<Object>} Array de lotes carregados
   */
  load() {
    if (!this.initialize()) {
      return [];
    }

    const rawData = this.field.value;

    if (!rawData || rawData.trim() === '') {
      console.log('Nenhum dado de lotes encontrado');
      return [];
    }

    try {
      const lotesData = JSON.parse(rawData);

      if (!Array.isArray(lotesData)) {
        console.error('Dados de lotes inválidos: esperado array');
        return [];
      }

      // Valida cada lote
      const validLotes = lotesData.filter(lote => this.validateLote(lote));

      // Atualiza o estado
      this.stateManager.setState('lotesData', validLotes);

      console.log(`${validLotes.length} lote(s) carregado(s)`);
      this.eventBus.emit('data:loaded', validLotes);

      return validLotes;

    } catch (error) {
      console.error('Erro ao fazer parse dos dados de lotes:', error);
      console.error('Dados problemáticos:', rawData.substring(0, 200));
      return [];
    }
  }

  /**
   * Salva os dados dos lotes no hidden field
   * @returns {boolean} Sucesso da operação
   */
  save() {
    if (!this.initialize()) {
      return false;
    }

    const lotesData = this.stateManager.getState('lotesData');

    try {
      const jsonData = JSON.stringify(lotesData);

      this.field.value = jsonData;

      console.log(`${lotesData.length} lote(s) salvo(s)`);
      this.eventBus.emit('data:saved', lotesData);

      return true;

    } catch (error) {
      console.error('Erro ao serializar dados de lotes:', error);
      return false;
    }
  }

  /**
   * Valida a estrutura de um lote
   * @param {Object} lote - Dados do lote
   * @returns {boolean}
   */
  validateLote(lote) {
    if (!lote || typeof lote !== 'object') {
      console.warn('Lote inválido: não é um objeto', lote);
      return false;
    }

    // Campos obrigatórios
    const requiredFields = ['id', 'coordinates'];

    for (const field of requiredFields) {
      if (!(field in lote)) {
        console.warn(`Lote inválido: campo "${field}" ausente`, lote);
        return false;
      }
    }

    // Valida coordinates
    if (!Array.isArray(lote.coordinates) || lote.coordinates.length < 3) {
      console.warn('Lote inválido: coordinates deve ser array com no mínimo 3 pontos', lote);
      return false;
    }

    // Valida cada coordenada
    for (const coord of lote.coordinates) {
      if (typeof coord.lat !== 'number' || typeof coord.lng !== 'number') {
        console.warn('Lote inválido: coordenada com lat/lng inválido', coord);
        return false;
      }
    }

    return true;
  }

  /**
   * Adiciona um lote e salva automaticamente
   * @param {Object} lote - Dados do lote
   * @returns {boolean}
   */
  addLote(lote) {
    if (!this.validateLote(lote)) {
      console.error('Lote inválido, não será adicionado');
      return false;
    }

    this.stateManager.addLote(lote);
    return this.save();
  }

  /**
   * Atualiza um lote e salva automaticamente
   * @param {string} loteId - ID do lote
   * @param {Object} updates - Dados a atualizar
   * @returns {boolean}
   */
  updateLote(loteId, updates) {
    this.stateManager.updateLote(loteId, updates);
    return this.save();
  }

  /**
   * Remove um lote e salva automaticamente
   * @param {string} loteId - ID do lote
   * @returns {boolean}
   */
  removeLote(loteId) {
    this.stateManager.removeLote(loteId);
    return this.save();
  }

  /**
   * Limpa todos os lotes
   * @returns {boolean}
   */
  clearAll() {
    this.stateManager.setState('lotesData', []);
    return this.save();
  }

  /**
   * Exporta os dados como JSON string formatado
   * @returns {string}
   */
  exportJSON() {
    const lotesData = this.stateManager.getState('lotesData');
    return JSON.stringify(lotesData, null, 2);
  }

  /**
   * Importa dados de um JSON string
   * @param {string} jsonString - JSON a importar
   * @returns {boolean}
   */
  importJSON(jsonString) {
    try {
      const lotesData = JSON.parse(jsonString);

      if (!Array.isArray(lotesData)) {
        throw new Error('Dados devem ser um array');
      }

      const validLotes = lotesData.filter(lote => this.validateLote(lote));

      this.stateManager.setState('lotesData', validLotes);
      return this.save();

    } catch (error) {
      console.error('Erro ao importar JSON:', error);
      return false;
    }
  }
}
