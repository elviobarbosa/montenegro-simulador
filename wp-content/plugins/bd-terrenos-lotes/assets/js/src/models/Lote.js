/**
 * Lote - Modelo de dados do lote
 *
 * Representa um lote com validação e métodos helper
 *
 * @example
 * const lote = new Lote({ nome: 'Lote 1', bloco: 'A', coordinates: [...] });
 * const json = lote.toJSON();
 * const restored = Lote.fromJSON(json);
 */
export class Lote {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.nome = data.nome || '';
    this.bloco = data.bloco || '';
    this.coordinates = data.coordinates || [];
    this.area = data.area || 0;
    this.color = data.color || '';
    this.status = data.status || 'disponivel';
    this.observacoes = data.observacoes || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  /**
   * Gera um ID único para o lote
   * @returns {string}
   */
  generateId() {
    return 'lote_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Valida os dados do lote
   * @returns {Object} {valid: boolean, errors: Array}
   */
  validate() {
    const errors = [];

    if (!this.id) {
      errors.push('ID é obrigatório');
    }

    if (!Array.isArray(this.coordinates) || this.coordinates.length < 3) {
      errors.push('Lote deve ter no mínimo 3 coordenadas');
    }

    // Valida cada coordenada
    if (this.coordinates.length > 0) {
      this.coordinates.forEach((coord, index) => {
        if (typeof coord.lat !== 'number' || typeof coord.lng !== 'number') {
          errors.push(`Coordenada ${index} inválida`);
        }
      });
    }

    // Valida status
    const validStatuses = ['disponivel', 'vendido', 'reservado'];
    if (!validStatuses.includes(this.status)) {
      errors.push(`Status inválido: ${this.status}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Serializa o lote para JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      bloco: this.bloco,
      coordinates: this.coordinates,
      area: this.area,
      color: this.color,
      status: this.status,
      observacoes: this.observacoes,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Cria uma instância de Lote a partir de JSON
   * @param {Object|string} json - Objeto ou string JSON
   * @returns {Lote}
   */
  static fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    return new Lote(json);
  }

  /**
   * Atualiza os dados do lote
   * @param {Object} updates - Dados a atualizar
   */
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'created_at') {
        this[key] = updates[key];
      }
    });
    this.updated_at = new Date().toISOString();
  }

  /**
   * Retorna o nome completo do lote (Bloco + Nome)
   * @returns {string}
   */
  getFullName() {
    if (this.bloco && this.nome) {
      return `${this.bloco} - ${this.nome}`;
    }
    return this.nome || this.bloco || this.id;
  }

  /**
   * Retorna a label de status traduzida
   * @returns {string}
   */
  getStatusLabel() {
    const labels = {
      'disponivel': 'Disponível',
      'vendido': 'Vendido',
      'reservado': 'Reservado'
    };
    return labels[this.status] || this.status;
  }

  /**
   * Verifica se o lote está disponível
   * @returns {boolean}
   */
  isAvailable() {
    return this.status === 'disponivel';
  }

  /**
   * Marca o lote como vendido
   */
  markAsSold() {
    this.status = 'vendido';
    this.updated_at = new Date().toISOString();
  }

  /**
   * Marca o lote como reservado
   */
  markAsReserved() {
    this.status = 'reservado';
    this.updated_at = new Date().toISOString();
  }

  /**
   * Marca o lote como disponível
   */
  markAsAvailable() {
    this.status = 'disponivel';
    this.updated_at = new Date().toISOString();
  }

  /**
   * Retorna uma cópia do lote
   * @returns {Lote}
   */
  clone() {
    return new Lote(this.toJSON());
  }
}
