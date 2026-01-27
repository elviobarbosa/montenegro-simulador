/**
 * ModalManager - Gerencia o modal de edição de lotes
 *
 * Responsável por:
 * - Abrir/fechar modal
 * - Preencher campos com dados do lote
 * - Validar e retornar dados editados
 *
 * @example
 * const modalManager = new ModalManager();
 * const result = await modalManager.openEditModal(loteData);
 */
export class ModalManager {
  constructor() {
    this.modal = null;
    this.resolveCallback = null;
    this.rejectCallback = null;
    this.initialize();
  }

  /**
   * Inicializa o modal e configura event listeners
   */
  initialize() {
    this.modal = document.getElementById('editModal');

    if (!this.modal) {
      return;
    }

    // Botão Salvar
    const saveButton = this.modal.querySelector('button[onclick="saveEditLote()"]');
    if (saveButton) {
      // Remove o onclick inline
      saveButton.removeAttribute('onclick');
      saveButton.addEventListener('click', () => this.handleSave());
    }

    // Botão Cancelar
    const cancelButton = this.modal.querySelector('button[onclick="closeEditModal()"]');
    if (cancelButton) {
      // Remove o onclick inline
      cancelButton.removeAttribute('onclick');
      cancelButton.addEventListener('click', () => this.handleCancel());
    }

    // Fechar ao clicar fora do modal
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.handleCancel();
      }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.handleCancel();
      }
    });
  }

  /**
   * Abre o modal para editar um lote
   * @param {Object} loteData - Dados do lote a editar
   * @returns {Promise<Object>} Promise que resolve com os dados editados ou rejeita se cancelado
   */
  openEditModal(loteData) {
    return new Promise((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;

      // Preenche os campos
      const unidadeIdInput = document.getElementById('editLoteUnidadeId');
      const blocoInput = document.getElementById('editLoteBloco');
      const nomeInput = document.getElementById('editLoteNome');

      if (unidadeIdInput) {
        unidadeIdInput.value = loteData.id || '';
      }

      if (blocoInput) {
        blocoInput.value = loteData.bloco || '';
      }

      if (nomeInput) {
        nomeInput.value = loteData.nome || '';
      }

      // Mostra o modal
      this.show();

      // Foca no primeiro campo
      if (unidadeIdInput) {
        setTimeout(() => unidadeIdInput.focus(), 100);
      }
    });
  }

  /**
   * Handler para salvar
   * @private
   */
  handleSave() {
    const unidadeIdInput = document.getElementById('editLoteUnidadeId');
    const blocoInput = document.getElementById('editLoteBloco');
    const nomeInput = document.getElementById('editLoteNome');

    const data = {
      id: unidadeIdInput ? unidadeIdInput.value.trim() : '',
      bloco: blocoInput ? blocoInput.value.trim() : '',
      nome: nomeInput ? nomeInput.value.trim() : ''
    };

    // Valida os dados obrigatórios
    if (!data.id) {
      alert('ID da Unidade é obrigatório');
      if (unidadeIdInput) unidadeIdInput.focus();
      return;
    }

    if (!data.bloco) {
      alert('Bloco é obrigatório');
      if (blocoInput) blocoInput.focus();
      return;
    }

    this.hide();

    if (this.resolveCallback) {
      this.resolveCallback(data);
      this.resolveCallback = null;
      this.rejectCallback = null;
    }
  }

  /**
   * Handler para cancelar
   * @private
   */
  handleCancel() {
    this.hide();

    if (this.rejectCallback) {
      this.rejectCallback(new Error('Modal cancelado pelo usuário'));
      this.resolveCallback = null;
      this.rejectCallback = null;
    }
  }

  /**
   * Mostra o modal
   */
  show() {
    if (this.modal) {
      this.modal.style.display = 'block';
    }
  }

  /**
   * Oculta o modal
   */
  hide() {
    if (this.modal) {
      this.modal.style.display = 'none';
    }
  }

  /**
   * Verifica se o modal está aberto
   * @returns {boolean}
   */
  isOpen() {
    return this.modal && this.modal.style.display === 'block';
  }

  /**
   * Limpa os campos do modal
   */
  clear() {
    const unidadeIdInput = document.getElementById('editLoteUnidadeId');
    const blocoInput = document.getElementById('editLoteBloco');
    const nomeInput = document.getElementById('editLoteNome');

    if (unidadeIdInput) unidadeIdInput.value = '';
    if (blocoInput) blocoInput.value = '';
    if (nomeInput) nomeInput.value = '';
  }
}
