/**
 * UIManager - Gerenciamento geral de UI
 *
 * Responsável por:
 * - Controlar estado dos botões
 * - Renderizar lista de lotes
 * - Mostrar notificações
 * - Atualizar contadores
 *
 * @example
 * const uiManager = new UIManager(stateManager, eventBus);
 * uiManager.updateDrawingButtons(true);
 * uiManager.renderLotesList(lotesData);
 */
import { DOMHelper } from '../utils/DOMHelper';
import { AreaCalculator } from '../services/AreaCalculator';
import { ColorGenerator } from '../utils/ColorGenerator';

export class UIManager {
  constructor(stateManager, eventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }

  /**
   * Atualiza estado dos botões de desenho
   * @param {boolean} isDrawing - Se está em modo de desenho
   */
  updateDrawingButtons(isDrawing) {
    if (isDrawing) {
      DOMHelper.hide('desenhar_lote');
      DOMHelper.show('aplicar_desenho');
      DOMHelper.show('cancelar_desenho');
      DOMHelper.setText('modo_desenho', 'MODO DESENHO ATIVO');
    } else {
      DOMHelper.show('desenhar_lote');
      DOMHelper.hide('aplicar_desenho');
      DOMHelper.hide('cancelar_desenho');
      DOMHelper.setText('modo_desenho', '');
    }
  }

  /**
   * Renderiza a lista de lotes na sidebar
   * @param {Array<Object>} lotesData - Array de lotes
   */
  renderLotesList(lotesData) {
    const container = DOMHelper.getElement('lista-lotes-container');

    if (!container) {
      return;
    }

    // Se não houver lotes, mostra estado vazio
    if (!lotesData || lotesData.length === 0) {
      this.renderEmptyState(container);
      this.updateLotesCounter(0);
      this.updateTotalArea(0);
      return;
    }

    // Limpa container
    DOMHelper.clearChildren('lista-lotes-container');

    // Renderiza cada lote
    lotesData.forEach(lote => {
      const loteElement = this.createLoteElement(lote);
      container.appendChild(loteElement);
    });

    // Atualiza contadores
    this.updateLotesCounter(lotesData.length);
    this.updateTotalArea(this.calculateTotalArea(lotesData));
  }

  /**
   * Renderiza estado vazio
   * @private
   */
  renderEmptyState(container) {
    DOMHelper.setHTML('lista-lotes-container', `
      <div class="no-lotes">
        <div class="no-lotes-icon">
          <span class="dashicons dashicons-admin-multisite"></span>
        </div>
        <p>Nenhum lote cadastrado ainda.</p>
        <p class="help-text">Clique em "Desenhar Novo Lote" para começar.</p>
      </div>
    `);
  }

  /**
   * Cria elemento HTML para um lote
   * @private
   */
  createLoteElement(lote) {
    const div = DOMHelper.createElement('div', {
      class: 'lote-item',
      'data-lote-id': lote.id
    });

    const statusClass = `status-${lote.status || 'disponivel'}`;
    const statusLabel = this.getStatusLabel(lote.status);
    const areaFormatted = AreaCalculator.formatArea(lote.area || 0);

    div.innerHTML = `
      <h5>
        <span class="dashicons dashicons-location"></span>
        ${lote.nome || lote.id}
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </h5>
      ${lote.bloco ? `<p><strong>Bloco:</strong> ${lote.bloco}</p>` : ''}
      <p><strong>Área:</strong> ${areaFormatted}</p>
      <p><strong>Vértices:</strong> ${lote.coordinates.length}</p>
      <div class="lote-actions">
        <button type="button" class="button button-small lote-action-zoom" data-lote-id="${lote.id}">
          <span class="dashicons dashicons-visibility"></span> Ver
        </button>
        <button type="button" class="button button-small lote-action-edit" data-lote-id="${lote.id}">
          <span class="dashicons dashicons-edit"></span> Editar
        </button>
        <button type="button" class="button button-small lote-action-delete" data-lote-id="${lote.id}">
          <span class="dashicons dashicons-trash"></span> Excluir
        </button>
      </div>
    `;

    // Adiciona event listeners
    this.attachLoteActions(div, lote.id);

    return div;
  }

  /**
   * Adiciona event listeners aos botões de ação do lote
   * @private
   */
  attachLoteActions(element, loteId) {
    // Botão Ver/Zoom
    const zoomBtn = element.querySelector('.lote-action-zoom');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        this.eventBus.emit('ui:zoom_lote', { loteId });
      });
    }

    // Botão Editar
    const editBtn = element.querySelector('.lote-action-edit');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.eventBus.emit('ui:edit_lote', { loteId });
      });
    }

    // Botão Excluir
    const deleteBtn = element.querySelector('.lote-action-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir este lote?')) {
          this.eventBus.emit('ui:delete_lote', { loteId });
        }
      });
    }
  }

  /**
   * Atualiza contador de lotes
   * @private
   */
  updateLotesCounter(count) {
    DOMHelper.setText('total-lotes', count.toString());
  }

  /**
   * Atualiza área total
   * @private
   */
  updateTotalArea(totalArea) {
    const formatted = AreaCalculator.formatArea(totalArea);
    DOMHelper.setText('area-total-value', formatted);
  }

  /**
   * Calcula área total de todos os lotes
   * @private
   */
  calculateTotalArea(lotesData) {
    return lotesData.reduce((total, lote) => total + (lote.area || 0), 0);
  }

  /**
   * Retorna label de status
   * @private
   */
  getStatusLabel(status) {
    const labels = {
      'disponivel': 'Disponível',
      'vendido': 'Vendido',
      'reservado': 'Reservado'
    };
    return labels[status] || 'Disponível';
  }

  /**
   * Mostra notificação
   * @param {string} message - Mensagem
   * @param {string} type - Tipo (success, error, warning, info)
   */
  showNotification(message, type = 'info') {
    // Implementação simplificada com alert
    // Pode ser melhorada com um sistema de toasts
    if (type === 'error') {
      alert('Erro: ' + message);
    } else if (type === 'success') {
    } else {
    }
  }

  /**
   * Mostra/oculta loading
   * @param {boolean} show - Se deve mostrar loading
   */
  toggleLoading(show) {
    // Implementação simplificada
    // Pode ser melhorada com spinner visual
    if (show) {
    }
  }
}
