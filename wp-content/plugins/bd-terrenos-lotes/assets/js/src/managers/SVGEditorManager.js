/**
 * SVGEditorManager - Editor para vincular shapes do SVG aos lotes
 *
 * Responsabilidades:
 * 1. Renderizar o SVG sobre o mapa com shapes clicáveis
 * 2. Permitir selecionar cada shape e vincular a um lote (ID da unidade + bloco)
 * 3. Salvar o mapeamento shape_index → {lote_id, bloco}
 * 4. Gerenciar estado visual (cores baseadas em status: vinculado/não vinculado)
 */
export class SVGEditorManager {
  constructor(map, stateManager, eventBus) {
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;

    // Dados do SVG
    this.svgContent = null;
    this.svgElement = null;
    this.shapes = [];
    this.viewBox = null;

    // Mapeamento shape_index → dados do lote
    this.shapeMapping = {};

    // Overlay no mapa
    this.overlay = {
      bounds: null,
      rotation: 0,
      center: null,
    };

    // Custom Overlay do Google Maps
    this.customOverlay = null;

    // Estado
    this.isEditorActive = false;
    this.selectedShapeIndex = null;

    // Elementos DOM
    this.editorPanel = null;
    this.shapesList = null;

    this.init();
  }

  /**
   * Inicializa o editor
   */
  init() {
    this.createEditorPanel();
    this.loadSavedData();
    this.setupEventListeners();
  }

  /**
   * Cria o painel lateral do editor
   */
  createEditorPanel() {
    // Verifica se já existe
    if (document.getElementById('svgEditorPanel')) {
      this.editorPanel = document.getElementById('svgEditorPanel');
      return;
    }

    const panel = document.createElement('div');
    panel.id = 'svgEditorPanel';
    panel.innerHTML = `
      <div class="svg-editor-header">
        <h3>
          <span class="dashicons dashicons-admin-appearance"></span>
          Editor de Lotes SVG
        </h3>
        <button type="button" class="button svg-editor-close" title="Fechar">&times;</button>
      </div>

      <div class="svg-editor-content">
        <!-- Info do SVG carregado -->
        <div class="svg-editor-info" id="svgEditorInfo" style="display: none;">
          <div class="svg-info-item">
            <span class="dashicons dashicons-images-alt2"></span>
            <span id="svgEditorShapeCount">0 shapes</span>
          </div>
          <div class="svg-info-item">
            <span class="dashicons dashicons-saved"></span>
            <span id="svgEditorMappedCount">0 vinculados</span>
          </div>
        </div>

        <!-- Instruções -->
        <div class="svg-editor-instructions">
          <p><strong>Como usar:</strong></p>
          <ol>
            <li>Importe um SVG pelo botão "Importar SVG"</li>
            <li>Posicione o SVG sobre o mapa</li>
            <li>Clique em cada shape para vincular ao lote</li>
            <li>Salve o post para persistir as configurações</li>
          </ol>
        </div>

        <!-- Lista de shapes -->
        <div class="svg-editor-shapes-header" style="display: none;">
          <h4>Shapes do SVG</h4>
          <button type="button" class="button button-small" id="svgEditorSelectAll">Selecionar Todos</button>
        </div>
        <div class="svg-editor-shapes-list" id="svgEditorShapesList">
          <p class="no-shapes">Nenhum SVG carregado</p>
        </div>

        <!-- Ações -->
        <div class="svg-editor-actions" style="display: none;">
          <button type="button" class="button" id="svgEditorClearAll">
            <span class="dashicons dashicons-trash"></span> Limpar Vínculos
          </button>
          <button type="button" class="button button-primary" id="svgEditorSave">
            <span class="dashicons dashicons-yes"></span> Aplicar Configuração
          </button>
        </div>
      </div>

      <!-- Modal de vinculação -->
      <div class="svg-editor-modal" id="svgEditorModal" style="display: none;">
        <div class="svg-editor-modal-content">
          <h4>Vincular Shape ao Lote</h4>
          <p class="shape-info">Shape: <strong id="modalShapeIndex">-</strong></p>

          <div class="form-group">
            <label for="modalLoteId">ID da Unidade: <span class="required">*</span></label>
            <input type="text" id="modalLoteId" placeholder="Ex: 123" />
            <small>ID da unidade correspondente na API</small>
          </div>

          <div class="form-group">
            <label for="modalBloco">Quadra/Bloco: <span class="required">*</span></label>
            <input type="text" id="modalBloco" placeholder="Ex: A, B, C..." />
            <small>Bloco onde a unidade está localizada</small>
          </div>

          <div class="form-group">
            <label for="modalNome">Nome (opcional):</label>
            <input type="text" id="modalNome" placeholder="Ex: Lote 01" />
          </div>

          <div class="modal-actions">
            <button type="button" class="button" id="modalCancel">Cancelar</button>
            <button type="button" class="button" id="modalRemove" style="display: none; color: #d63638;">Remover Vínculo</button>
            <button type="button" class="button button-primary" id="modalSave">Salvar</button>
          </div>
        </div>
      </div>
    `;

    // Adiciona estilos
    this.addStyles();

    document.body.appendChild(panel);
    this.editorPanel = panel;
  }

  /**
   * Adiciona estilos CSS do editor
   */
  addStyles() {
    if (document.getElementById('svgEditorStyles')) return;

    const styles = document.createElement('style');
    styles.id = 'svgEditorStyles';
    styles.textContent = `
      #svgEditorPanel {
        display: none;
        position: fixed;
        top: 32px;
        right: 0;
        width: 320px;
        height: calc(100vh - 32px);
        background: #fff;
        border-left: 1px solid #ddd;
        box-shadow: -4px 0 20px rgba(0,0,0,0.1);
        z-index: 9998;
        overflow: hidden;
      }

      #svgEditorPanel.active {
        display: flex;
        flex-direction: column;
      }

      .svg-editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-bottom: 1px solid #ddd;
      }

      .svg-editor-header h3 {
        margin: 0;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .svg-editor-close {
        padding: 0 8px !important;
        font-size: 18px !important;
        line-height: 1 !important;
      }

      .svg-editor-content {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
      }

      .svg-editor-info {
        display: flex;
        gap: 15px;
        padding: 10px;
        background: #e7f5ff;
        border-radius: 4px;
        margin-bottom: 15px;
      }

      .svg-info-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
      }

      .svg-editor-instructions {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 15px;
        font-size: 12px;
      }

      .svg-editor-instructions p {
        margin: 0 0 8px 0;
      }

      .svg-editor-instructions ol {
        margin: 0;
        padding-left: 18px;
      }

      .svg-editor-instructions li {
        margin-bottom: 4px;
      }

      .svg-editor-shapes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .svg-editor-shapes-header h4 {
        margin: 0;
        font-size: 13px;
      }

      .svg-editor-shapes-list {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 15px;
      }

      .svg-editor-shapes-list .no-shapes {
        padding: 20px;
        text-align: center;
        color: #666;
        margin: 0;
      }

      .shape-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: background 0.2s;
        justify-content: space-between;
      }

      .shape-item:last-child {
        border-bottom: none;
      }

      .shape-item:hover {
        background: #f0f7fc;
      }

      .shape-item.selected {
        background: #e7f5ff;
        border-left: 3px solid #0073aa;
      }

      .shape-item.mapped {
        background: #d4edda;
      }

      .shape-item.mapped.selected {
        background: #c3e6cb;
        border-left: 3px solid #28a745;
      }

      .shape-color {
        width: 16px;
        height: 16px;
        border-radius: 3px;
        margin-right: 10px;
        border: 1px solid #ddd;
      }

      .shape-info-text {
        flex: 1;
        font-size: 12px;
      }

      .shape-info-text .shape-name {
        font-weight: 600;
      }

      .shape-info-text .shape-lote {
        color: #28a745;
        font-size: 11px;
      }

      .shape-status {
        font-size: 10px;
        padding: 2px 6px 2px 0;
        border-radius: 10px;
      }

      .shape-status.unmapped {
        background: #f8d7da;
        color: #721c24;
      }

      .shape-status.mapped {
        background: #d4edda;
        color: #155724;
      }

      .svg-editor-actions {
        display: flex;
        gap: 10px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
      }

      .svg-editor-actions .button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }

      /* Modal */
      .svg-editor-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .svg-editor-modal-content {
        background: #fff;
        padding: 25px;
        border-radius: 8px;
        width: 350px;
        max-width: 90%;
      }

      .svg-editor-modal-content h4 {
        margin: 0 0 15px 0;
      }

      .svg-editor-modal-content .shape-info {
        background: #f5f5f5;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 15px;
        font-size: 13px;
      }

      .svg-editor-modal-content .form-group {
        margin-bottom: 15px;
      }

      .svg-editor-modal-content label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
      }

      .svg-editor-modal-content label .required {
        color: #d63638;
      }

      .svg-editor-modal-content input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .svg-editor-modal-content small {
        display: block;
        margin-top: 4px;
        color: #666;
        font-size: 11px;
      }

      .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
      }

      /* Overlay SVG interativo */
      .svg-editor-overlay {
        cursor: crosshair;
      }

      .svg-editor-overlay svg {
        width: 100%;
        height: 100%;
      }

      .svg-editor-overlay svg polygon,
      .svg-editor-overlay svg path,
      .svg-editor-overlay svg polyline,
      .svg-editor-overlay svg rect {
        cursor: pointer;
        transition: fill 0.2s, stroke 0.2s;
      }

      .svg-editor-overlay svg polygon:hover,
      .svg-editor-overlay svg path:hover,
      .svg-editor-overlay svg polyline:hover,
      .svg-editor-overlay svg rect:hover {
        fill: rgba(0, 115, 170, 0.5) !important;
        stroke: #0073aa !important;
        stroke-width: 3px !important;
      }

      .svg-editor-overlay svg .shape-mapped {
        fill: rgba(40, 167, 69, 0.4) !important;
        stroke: #28a745 !important;
      }

      .svg-editor-overlay svg .shape-selected {
        fill: rgba(255, 193, 7, 0.5) !important;
        stroke: #ffc107 !important;
        stroke-width: 4px !important;
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Carrega dados salvos do hidden input
   */
  loadSavedData() {
    // SVG content
    const svgInput = document.getElementById('terreno_svg_content');
    if (svgInput && svgInput.value) {
      this.svgContent = svgInput.value;
    }

    // Bounds
    const boundsInput = document.getElementById('terreno_svg_bounds');
    if (boundsInput && boundsInput.value) {
      try {
        this.overlay.bounds = JSON.parse(boundsInput.value);
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Rotation
    const rotationInput = document.getElementById('terreno_svg_rotation');
    if (rotationInput && rotationInput.value) {
      this.overlay.rotation = parseFloat(rotationInput.value) || 0;
    }

    // Shape mapping
    const mappingInput = document.getElementById('terreno_shape_mapping');
    if (mappingInput && mappingInput.value) {
      try {
        this.shapeMapping = JSON.parse(mappingInput.value);
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Se tem SVG salvo, processa e mostra
    if (this.svgContent) {
      this.processSVGContent();
    }
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Fechar painel
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('svg-editor-close')) {
        this.closeEditor();
      }
    });

    // Modal events
    document.addEventListener('click', (e) => {
      if (e.target.id === 'modalCancel') {
        this.closeModal();
      }
      if (e.target.id === 'modalSave') {
        this.saveShapeMapping();
      }
      if (e.target.id === 'modalRemove') {
        this.removeShapeMapping();
      }
    });

    // Limpar todos vínculos
    document.addEventListener('click', (e) => {
      if (
        e.target.id === 'svgEditorClearAll' ||
        e.target.closest('#svgEditorClearAll')
      ) {
        if (confirm('Tem certeza que deseja remover todos os vínculos?')) {
          this.clearAllMappings();
        }
      }
    });

    // Salvar configuração
    document.addEventListener('click', (e) => {
      if (
        e.target.id === 'svgEditorSave' ||
        e.target.closest('#svgEditorSave')
      ) {
        this.saveConfiguration();
      }
    });

    // Eventos do EventBus
    this.eventBus.on('svg:loaded', (data) => {
      this.onSVGLoaded(data);
    });

    this.eventBus.on('svg:positioned', (data) => {
      this.onSVGPositioned(data);
    });
  }

  /**
   * Abre o editor
   */
  openEditor() {
    this.isEditorActive = true;
    this.editorPanel.classList.add('active');
  }

  /**
   * Fecha o editor
   */
  closeEditor() {
    this.isEditorActive = false;
    this.editorPanel.classList.remove('active');
  }

  /**
   * Toggle do editor
   */
  toggleEditor() {
    if (this.isEditorActive) {
      this.closeEditor();
    } else {
      this.openEditor();
    }
  }

  /**
   * Callback quando SVG é carregado pelo SVGOverlayManager
   */
  onSVGLoaded(data) {
    this.svgContent = data.svgContent;
    this.shapes = data.shapes;
    this.viewBox = data.viewBox;

    this.processSVGContent();
    this.renderShapesList();
    this.updateEditorUI();
    this.openEditor();
  }

  /**
   * Callback quando SVG é posicionado no mapa
   */
  onSVGPositioned(data) {
    this.overlay.bounds = data.bounds;
    this.overlay.rotation = data.rotation;
    this.overlay.center = data.center;

    // Salva nos inputs hidden
    this.updateHiddenInputs();
  }

  /**
   * Processa o conteúdo SVG para extrair shapes
   */
  processSVGContent() {
    if (!this.svgContent) return;

    // Parse SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.svgContent, 'image/svg+xml');
    this.svgElement = doc.documentElement;

    // Extrai viewBox
    const viewBoxAttr = this.svgElement.getAttribute('viewBox');
    if (viewBoxAttr) {
      const parts = viewBoxAttr.split(/[\s,]+/).map(parseFloat);
      this.viewBox = {
        x: parts[0] || 0,
        y: parts[1] || 0,
        width: parts[2] || 100,
        height: parts[3] || 100,
      };
    }

    // Conta shapes
    const shapeSelectors = 'polygon, path, polyline, rect';
    const shapeElements = this.svgElement.querySelectorAll(shapeSelectors);
    this.shapes = Array.from(shapeElements).map((el, index) => ({
      index,
      type: el.tagName.toLowerCase(),
      id: el.id || `shape_${index}`,
      fill: el.getAttribute('fill') || el.style.fill || '#ccc',
      stroke: el.getAttribute('stroke') || el.style.stroke || '#000',
    }));
  }

  /**
   * Renderiza a lista de shapes no painel
   */
  renderShapesList() {
    const list = document.getElementById('svgEditorShapesList');
    if (!list) return;

    if (this.shapes.length === 0) {
      list.innerHTML = '<p class="no-shapes">Nenhum SVG carregado</p>';
      return;
    }

    const html = this.shapes
      .map((shape) => {
        const mapping = this.shapeMapping[shape.index];
        const isMapped = !!mapping;
        const loteInfo = isMapped
          ? `Lote ${mapping.lote_id} - Bloco ${mapping.bloco}`
          : '';

        return `
        <div class="shape-item ${isMapped ? 'mapped' : ''}" data-shape-index="${shape.index}">
          <div class="shape-color" style="background: ${shape.fill}; border-color: ${shape.stroke};"></div>
          <div class="shape-info-text">
            <div class="shape-name">${shape.id}</div>
            ${isMapped ? `<div class="shape-lote">${loteInfo}</div>` : ''}
          </div>
          <span class="shape-status ${isMapped ? 'mapped' : 'unmapped'}">
            ${isMapped ? 'Vinculado' : 'Pendente'}
          </span>
        </div>
      `;
      })
      .join('');

    list.innerHTML = html;

    // Adiciona click listeners
    list.querySelectorAll('.shape-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.shapeIndex);
        this.selectShape(index);
      });
    });
  }

  /**
   * Atualiza UI do editor
   */
  updateEditorUI() {
    const infoEl = document.getElementById('svgEditorInfo');
    const shapesHeader = document.querySelector('.svg-editor-shapes-header');
    const actionsEl = document.querySelector('.svg-editor-actions');

    if (this.shapes.length > 0) {
      // Mostra elementos
      if (infoEl) infoEl.style.display = 'flex';
      if (shapesHeader) shapesHeader.style.display = 'flex';
      if (actionsEl) actionsEl.style.display = 'flex';

      // Atualiza contadores
      document.getElementById('svgEditorShapeCount').textContent =
        `${this.shapes.length} shapes`;

      const mappedCount = Object.keys(this.shapeMapping).length;
      document.getElementById('svgEditorMappedCount').textContent =
        `${mappedCount} vinculados`;
    }
  }

  /**
   * Seleciona um shape
   */
  selectShape(index) {
    this.selectedShapeIndex = index;

    // Atualiza visual na lista
    document.querySelectorAll('.shape-item').forEach((item) => {
      item.classList.remove('selected');
      if (parseInt(item.dataset.shapeIndex) === index) {
        item.classList.add('selected');
      }
    });

    // Destaca no overlay
    this.highlightShapeInOverlay(index);

    // Abre modal de vinculação
    this.openMappingModal(index);
  }

  /**
   * Destaca shape no overlay do mapa
   */
  highlightShapeInOverlay(index) {
    // Emite evento para o overlay
    this.eventBus.emit('svg:highlight_shape', { index });
  }

  /**
   * Abre modal de vinculação
   */
  openMappingModal(index) {
    const modal = document.getElementById('svgEditorModal');
    if (!modal) return;

    const shape = this.shapes.find((s) => s.index === index);
    const mapping = this.shapeMapping[index];

    // Preenche informações
    document.getElementById('modalShapeIndex').textContent =
      shape?.id || `Shape ${index}`;

    // Preenche campos se já tem mapeamento
    document.getElementById('modalLoteId').value = mapping?.lote_id || '';
    document.getElementById('modalBloco').value = mapping?.bloco || '';
    document.getElementById('modalNome').value = mapping?.nome || '';

    // Mostra/esconde botão de remover
    const removeBtn = document.getElementById('modalRemove');
    if (removeBtn) {
      removeBtn.style.display = mapping ? 'block' : 'none';
    }

    modal.style.display = 'flex';
  }

  /**
   * Fecha modal
   */
  closeModal() {
    const modal = document.getElementById('svgEditorModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.selectedShapeIndex = null;
  }

  /**
   * Salva o mapeamento do shape selecionado
   */
  saveShapeMapping() {
    const loteId = document.getElementById('modalLoteId').value.trim();
    const bloco = document.getElementById('modalBloco').value.trim();
    const nome = document.getElementById('modalNome').value.trim();

    if (!loteId) {
      alert('O ID da Unidade é obrigatório');
      return;
    }

    if (!bloco) {
      alert('O Bloco é obrigatório');
      return;
    }

    // Salva no mapeamento
    this.shapeMapping[this.selectedShapeIndex] = {
      lote_id: loteId,
      bloco: bloco,
      nome: nome,
      shape_index: this.selectedShapeIndex,
    };

    // Atualiza UI
    this.renderShapesList();
    this.updateEditorUI();
    this.updateOverlayColors();
    this.updateHiddenInputs();

    // Fecha modal
    this.closeModal();
  }

  /**
   * Remove vínculo do shape
   */
  removeShapeMapping() {
    if (this.selectedShapeIndex === null) return;

    delete this.shapeMapping[this.selectedShapeIndex];

    // Atualiza UI
    this.renderShapesList();
    this.updateEditorUI();
    this.updateOverlayColors();
    this.updateHiddenInputs();

    // Fecha modal
    this.closeModal();

  }

  /**
   * Limpa todos os mapeamentos
   */
  clearAllMappings() {
    this.shapeMapping = {};
    this.renderShapesList();
    this.updateEditorUI();
    this.updateOverlayColors();
    this.updateHiddenInputs();

  }

  /**
   * Atualiza cores no overlay baseado no mapeamento
   */
  updateOverlayColors() {
    this.eventBus.emit('svg:update_colors', {
      mapping: this.shapeMapping,
    });
  }

  /**
   * Atualiza inputs hidden com os dados
   */
  updateHiddenInputs() {
    // SVG Content
    let svgInput = document.getElementById('terreno_svg_content');
    if (!svgInput) {
      svgInput = document.createElement('input');
      svgInput.type = 'hidden';
      svgInput.id = 'terreno_svg_content';
      svgInput.name = 'terreno_svg_content';
      document.querySelector('#terreno-mapa-container')?.appendChild(svgInput);
    }
    svgInput.value = this.svgContent || '';

    // Bounds
    let boundsInput = document.getElementById('terreno_svg_bounds');
    if (!boundsInput) {
      boundsInput = document.createElement('input');
      boundsInput.type = 'hidden';
      boundsInput.id = 'terreno_svg_bounds';
      boundsInput.name = 'terreno_svg_bounds';
      document
        .querySelector('#terreno-mapa-container')
        ?.appendChild(boundsInput);
    }
    boundsInput.value = this.overlay.bounds
      ? JSON.stringify(this.overlay.bounds)
      : '';

    // Rotation
    let rotationInput = document.getElementById('terreno_svg_rotation');
    if (!rotationInput) {
      rotationInput = document.createElement('input');
      rotationInput.type = 'hidden';
      rotationInput.id = 'terreno_svg_rotation';
      rotationInput.name = 'terreno_svg_rotation';
      document
        .querySelector('#terreno-mapa-container')
        ?.appendChild(rotationInput);
    }
    rotationInput.value = this.overlay.rotation || 0;

    // Shape mapping
    let mappingInput = document.getElementById('terreno_shape_mapping');
    if (!mappingInput) {
      mappingInput = document.createElement('input');
      mappingInput.type = 'hidden';
      mappingInput.id = 'terreno_shape_mapping';
      mappingInput.name = 'terreno_shape_mapping';
      document
        .querySelector('#terreno-mapa-container')
        ?.appendChild(mappingInput);
    }
    mappingInput.value = JSON.stringify(this.shapeMapping);
  }

  /**
   * Salva configuração (aplica e fecha editor)
   */
  saveConfiguration() {
    this.updateHiddenInputs();

    // Notifica que foi salvo
    this.eventBus.emit('svg:configuration_saved', {
      svgContent: this.svgContent,
      bounds: this.overlay.bounds,
      rotation: this.overlay.rotation,
      mapping: this.shapeMapping,
    });

    alert('Configuração aplicada! Não esqueça de salvar o post.');
    this.closeEditor();
  }

  /**
   * Retorna o mapeamento atual
   */
  getMapping() {
    return this.shapeMapping;
  }

  /**
   * Retorna dados completos para salvar
   */
  getDataForSave() {
    return {
      svgContent: this.svgContent,
      bounds: this.overlay.bounds,
      rotation: this.overlay.rotation,
      mapping: this.shapeMapping,
    };
  }
}
