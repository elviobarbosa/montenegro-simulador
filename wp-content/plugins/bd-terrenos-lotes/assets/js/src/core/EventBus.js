/**
 * EventBus - Sistema de eventos para comunicação desacoplada entre módulos
 *
 * Permite que diferentes partes da aplicação se comuniquem sem dependências diretas.
 *
 * Eventos disponíveis:
 * - lote:created - Quando um novo lote é criado
 * - lote:updated - Quando um lote é atualizado
 * - lote:deleted - Quando um lote é excluído
 * - map:updated - Quando o mapa é atualizado (centro, zoom)
 * - drawing:started - Quando o modo de desenho é iniciado
 * - drawing:completed - Quando um desenho é completado
 * - drawing:canceled - Quando o desenho é cancelado
 *
 * @example
 * const eventBus = new EventBus();
 * eventBus.on('lote:created', (lote) => console.log('Novo lote:', lote));
 * eventBus.emit('lote:created', { id: 1, nome: 'Lote 1' });
 */
export class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * Registra um listener para um evento
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função a ser executada
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  /**
   * Remove um listener de um evento
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função a ser removida
   */
  off(event, callback) {
    if (!this.events.has(event)) {
      return;
    }

    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }

    // Remove o evento se não houver mais callbacks
    if (callbacks.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * Dispara um evento
   * @param {string} event - Nome do evento
   * @param {*} data - Dados a serem passados para os listeners
   */
  emit(event, data) {
    if (!this.events.has(event)) {
      return;
    }

    const callbacks = this.events.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erro ao executar callback do evento "${event}":`, error);
      }
    });
  }

  /**
   * Registra um listener que será executado apenas uma vez
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função a ser executada
   */
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  /**
   * Remove todos os listeners de um evento ou de todos os eventos
   * @param {string} [event] - Nome do evento (opcional)
   */
  clear(event = null) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  /**
   * Retorna o número de listeners para um evento
   * @param {string} event - Nome do evento
   * @returns {number}
   */
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }
}
