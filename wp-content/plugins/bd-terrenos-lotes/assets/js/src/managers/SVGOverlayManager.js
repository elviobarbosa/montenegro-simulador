/**
 * SVGOverlayManager - Gerencia importação de SVG via overlay visual no mapa
 *
 * Nova abordagem (SVG permanente):
 * 1. O SVG é renderizado como overlay sobre o mapa
 * 2. O usuário arrasta, redimensiona e rotaciona para alinhar com o satélite
 * 3. Cada shape do SVG pode ser vinculado a um lote (via SVGEditorManager)
 * 4. No frontend, o SVG permanece como overlay (não converte para polígonos)
 *
 * Usa Custom Overlay do Google Maps + manipulação manual de transformações
 */
export class SVGOverlayManager {
  constructor(map, stateManager, eventBus, polygonManager, dataPersistence) {
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.polygonManager = polygonManager;
    this.dataPersistence = dataPersistence;

    // Estado do overlay
    this.svgContent = null;
    this.svgElement = null;
    this.shapes = [];
    this.viewBox = null;

    // Mapeamento de shapes (recebido do SVGEditorManager)
    this.shapeMapping = {};

    // Transformação do overlay
    this.overlay = {
      // Bounds iniciais (será definido baseado no centro do mapa)
      bounds: null,
      // Ângulo de rotação em graus
      rotation: 0,
      // Escala
      scale: 1,
      // Centro do overlay (lat/lng)
      center: null,
      // Tamanho em pixels
      width: 400,
      height: 400,
    };

    // Estado de interação
    this.isDragging = false;
    this.isResizing = false;
    this.isRotating = false;
    this.dragStart = null;
    this.isModalOpen = false;

    // Modo de edição (para vincular shapes)
    this.isEditorMode = false;
    this.selectedShapeIndex = null;

    // Elementos DOM
    this.modal = null;
    this.overlayContainer = null;
    this.overlayElement = null;

    // Google Maps Custom Overlay
    this.customOverlay = null;

    this.init();
  }

  /**
   * Inicializa os event listeners
   */
  init() {
    // Botão de abrir modal
    const btnImportar = document.getElementById('btn_importar_svg');
    if (btnImportar) {
      btnImportar.addEventListener('click', () => this.openModal());
    }

    // Botão de ajustar posição do SVG
    const btnAjustar = document.getElementById('btn_ajustar_svg');
    if (btnAjustar) {
      btnAjustar.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('SVGOverlayManager: ajustar posicao clicado');
        this.toggleEditMode();
      });
    } else {
      setTimeout(() => {
        const btn = document.getElementById('btn_ajustar_svg');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleEditMode();
          });
        }
      }, 500);
    }

    // Botão de remover SVG
    const btnRemover = document.getElementById('btn_remover_svg');
    if (btnRemover) {
      btnRemover.addEventListener('click', (e) => {
        e.preventDefault();
        this.confirmAndRemoveSvg();
      });
    }

    // Elementos do modal
    this.modal = document.getElementById('svgImportModal');
    if (!this.modal) return;

    // Botões de fechar/cancelar
    document
      .getElementById('svgImportClose')
      ?.addEventListener('click', () => this.closeModal(true));
    document
      .getElementById('svgImportCancel')
      ?.addEventListener('click', () => this.closeModal(true));

    // Upload de arquivo
    document.getElementById('svgSelectFile')?.addEventListener('click', () => {
      document.getElementById('svgFileInput')?.click();
    });

    document.getElementById('svgFileInput')?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0]);
      }
    });

    // Drag and drop
    const dropZone = document.getElementById('svgDropZone');
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0073aa';
        dropZone.style.background = '#f0f7fc';
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ccc';
        dropZone.style.background = 'transparent';
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
        dropZone.style.background = 'transparent';

        if (e.dataTransfer.files.length > 0) {
          this.handleFileUpload(e.dataTransfer.files[0]);
        }
      });
    }

    // Controles de transformação
    document.getElementById('svgRotateLeft')?.addEventListener('click', () => {
      this.rotateOverlay(-1);
    });
    document.getElementById('svgRotateRight')?.addEventListener('click', () => {
      this.rotateOverlay(1);
    });
    document.getElementById('svgZoomIn')?.addEventListener('click', () => {
      this.scaleOverlay(1.1);
    });
    document.getElementById('svgZoomOut')?.addEventListener('click', () => {
      this.scaleOverlay(0.9);
    });
    document
      .getElementById('svgResetTransform')
      ?.addEventListener('click', () => {
        this.resetTransform();
      });

    // Slider de opacidade
    document
      .getElementById('svgOpacitySlider')
      ?.addEventListener('input', (e) => {
        this.setOverlayOpacity(e.target.value / 100);
      });

    // Slider de rotação
    document
      .getElementById('svgRotationSlider')
      ?.addEventListener('input', (e) => {
        this.setRotation(parseFloat(e.target.value));
      });

    // Confirmar importação (agora salva como overlay permanente em vez de converter)
    document
      .getElementById('svgImportConfirm')
      ?.addEventListener('click', () => {
        this.saveAsOverlay();
      });

    // Event listeners do SVGEditorManager
    this.eventBus.on('svg:highlight_shape', (data) => {
      this.highlightShape(data.index);
    });

    this.eventBus.on('svg:update_colors', (data) => {
      this.shapeMapping = data.mapping;
      this.updateShapeColors();
    });
  }

  /**
   * Carrega dados salvos (chamado na inicialização)
   */
  loadSavedOverlay() {
    const svgInput = document.getElementById('terreno_svg_content');
    const boundsInput = document.getElementById('terreno_svg_bounds');
    const rotationInput = document.getElementById('terreno_svg_rotation');
    const mappingInput = document.getElementById('terreno_shape_mapping');

    if (svgInput?.value) {
      this.svgContent = svgInput.value;
    }

    if (boundsInput?.value) {
      try {
        const bounds = JSON.parse(boundsInput.value);
        this.overlay.bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(bounds.south, bounds.west),
          new google.maps.LatLng(bounds.north, bounds.east)
        );
      } catch (e) {
        console.warn('Erro ao carregar bounds:', e);
      }
    }

    if (rotationInput?.value) {
      this.overlay.rotation = parseFloat(rotationInput.value) || 0;
    }

    if (mappingInput?.value) {
      try {
        this.shapeMapping = JSON.parse(mappingInput.value);
      } catch (e) {
        console.warn('Erro ao carregar mapping:', e);
      }
    }

    // Se tem SVG salvo, renderiza o overlay
    if (this.svgContent && this.overlay.bounds) {
      this.renderSavedOverlay();
    }
  }

  /**
   * Renderiza overlay salvo anteriormente
   */
  renderSavedOverlay() {
    if (!this.svgContent || !this.overlay.bounds) return;

    // Parse o SVG para extrair shapes
    this.parseSVGContent();

    // Cria o overlay no mapa
    const OverlayClass = getCustomSVGOverlayClass();
    this.customOverlay = new OverlayClass(
      this.overlay.bounds,
      this.svgContent,
      this.map,
      this,
      true // isEditorMode = true
    );
    this.customOverlay.setMap(this.map);

    // Aplica rotação salva
    if (this.overlay.rotation) {
      this.customOverlay.updateRotation(this.overlay.rotation);
    }

    // Aplica cores baseado no mapping e renderiza shapes na sidebar
    setTimeout(() => {
      this.updateShapeColors();
      this.renderShapesInSidebar();
    }, 100);

    console.log('✓ Overlay SVG carregado dos dados salvos');
  }

  /**
   * Parse do conteúdo SVG para extrair shapes
   */
  parseSVGContent() {
    if (!this.svgContent) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(this.svgContent, 'image/svg+xml');
    const svgEl = doc.documentElement;

    // Extrai viewBox
    const viewBoxAttr = svgEl.getAttribute('viewBox');
    if (viewBoxAttr) {
      const parts = viewBoxAttr.split(/[\s,]+/).map(parseFloat);
      this.viewBox = {
        x: parts[0] || 0,
        y: parts[1] || 0,
        width: parts[2] || 100,
        height: parts[3] || 100,
      };
    }

    // Extrai shapes
    const shapeSelectors = 'polygon, path, polyline, rect';
    const shapeElements = svgEl.querySelectorAll(shapeSelectors);
    this.shapes = Array.from(shapeElements).map((el, index) => ({
      index,
      type: el.tagName.toLowerCase(),
      id: el.id || `shape_${index}`,
      fill: el.getAttribute('fill') || '#ccc',
      stroke: el.getAttribute('stroke') || '#000',
    }));
  }

  /**
   * Abre o modal de importação
   */
  openModal() {
    if (this.modal) {
      this.isModalOpen = true;
      this.modal.style.display = 'block';
      this.resetState();
    }
  }

  /**
   * Fecha o modal
   * @param {boolean} keepOverlay - Se true, mantém o overlay no mapa (usado ao salvar)
   */
  closeModal(keepOverlay = false) {
    if (this.modal) {
      this.isModalOpen = false;
      this.modal.style.display = 'none';

      // Verifica se há um SVG salvo nos inputs hidden
      const svgInput = document.getElementById('terreno_svg_content');
      const hasSavedSvg = svgInput && svgInput.value;

      // Só remove o overlay se não tiver SVG salvo e keepOverlay for false
      if (!keepOverlay && !hasSavedSvg) {
        this.removeOverlay();
        this.resetState();
      }
    }
  }

  /**
   * Reseta o estado
   */
  resetState() {
    this.svgContent = null;
    this.svgElement = null;
    this.shapes = [];
    this.viewBox = null;
    this.overlay = {
      bounds: null,
      rotation: 0,
      scale: 1,
      center: null,
      width: 400,
      height: 400,
    };

    // Reset UI
    const step1 = document.getElementById('svgStep1');
    const step2 = document.getElementById('svgStep2');
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';

    const uploadStatus = document.getElementById('svgUploadStatus');
    if (uploadStatus) uploadStatus.style.display = 'none';

    const confirmBtn = document.getElementById('svgImportConfirm');
    if (confirmBtn) confirmBtn.disabled = true;

    // Reset sliders
    const opacitySlider = document.getElementById('svgOpacitySlider');
    if (opacitySlider) opacitySlider.value = 70;

    const rotationSlider = document.getElementById('svgRotationSlider');
    if (rotationSlider) rotationSlider.value = 0;

    const rotationValue = document.getElementById('svgRotationValue');
    if (rotationValue) rotationValue.textContent = '0°';
  }

  /**
   * Processa o upload do arquivo SVG
   */
  async handleFileUpload(file) {
    if (!file.name.endsWith('.svg')) {
      alert('Por favor, selecione um arquivo SVG válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      this.svgContent = e.target.result;
      await this.processSVG(file.name);
    };
    reader.readAsText(file);
  }

  /**
   * Processa o SVG via AJAX (extrai shapes) e cria o overlay
   */
  async processSVG(fileName) {
    try {
      // Mostra loading
      const uploadStatus = document.getElementById('svgUploadStatus');
      const fileNameEl = document.getElementById('svgFileName');
      const shapeCountEl = document.getElementById('svgShapeCount');

      if (uploadStatus) uploadStatus.style.display = 'block';
      if (fileNameEl) fileNameEl.textContent = `Processando ${fileName}...`;
      if (shapeCountEl) shapeCountEl.textContent = '';

      // Envia para o backend processar
      const formData = new FormData();
      formData.append('action', 'terreno_parse_svg');
      formData.append('nonce', terreno_ajax.nonce);
      formData.append('svg_content', this.svgContent);

      const response = await fetch(terreno_ajax.ajax_url, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        this.shapes = result.data.shapes;
        this.viewBox = result.data.viewBox;

        // Atualiza UI
        if (fileNameEl) fileNameEl.textContent = fileName;
        if (shapeCountEl)
          shapeCountEl.textContent = `${this.shapes.length} shapes encontrados`;

        // Mostra step 2
        const step1 = document.getElementById('svgStep1');
        const step2 = document.getElementById('svgStep2');
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';

        // Cria o overlay no mapa
        this.createMapOverlay();

        // Habilita botão de confirmar
        const confirmBtn = document.getElementById('svgImportConfirm');
        if (confirmBtn) confirmBtn.disabled = false;

        // Renderiza lista de shapes
        this.renderShapesList();

        console.log(`✓ SVG processado: ${this.shapes.length} shapes`);
      } else {
        alert(
          'Erro ao processar SVG: ' +
            (result.data?.message || 'Erro desconhecido'),
        );
        if (uploadStatus) uploadStatus.style.display = 'none';
      }
    } catch (error) {
      console.error('Erro ao processar SVG:', error);
      alert('Erro ao processar SVG. Verifique o console para detalhes.');
    }
  }

  /**
   * Cria o overlay do SVG sobre o mapa principal
   */
  createMapOverlay() {
    // Remove overlay anterior se existir
    this.removeOverlay();

    // Define posição inicial baseada no centro do mapa
    const mapCenter = this.map.getCenter();
    this.overlay.center = {
      lat: mapCenter.lat(),
      lng: mapCenter.lng(),
    };

    // Calcula bounds iniciais baseado no viewBox do SVG
    const aspectRatio = this.viewBox
      ? this.viewBox.width / this.viewBox.height
      : 1;

    // Tamanho inicial do overlay (em graus, aproximadamente)
    const initialSize = 0.002; // ~200 metros
    const halfWidth = (initialSize * aspectRatio) / 2;
    const halfHeight = initialSize / 2;

    this.overlay.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(
        this.overlay.center.lat - halfHeight,
        this.overlay.center.lng - halfWidth,
      ),
      new google.maps.LatLng(
        this.overlay.center.lat + halfHeight,
        this.overlay.center.lng + halfWidth,
      ),
    );

    // Cria Custom Overlay (usa factory function para garantir que Google Maps já está carregado)
    const OverlayClass = getCustomSVGOverlayClass();
    this.customOverlay = new OverlayClass(
      this.overlay.bounds,
      this.svgContent,
      this.map,
      this,
    );
    this.customOverlay.setMap(this.map);

    // Centraliza o mapa no overlay
    this.map.setCenter(mapCenter);
    this.map.setZoom(18);
  }

  /**
   * Remove o overlay do mapa
   */
  removeOverlay() {
    if (this.customOverlay) {
      this.customOverlay.setMap(null);
      this.customOverlay = null;
    }
  }

  /**
   * Confirma e remove completamente o SVG e todos os dados relacionados
   */
  confirmAndRemoveSvg() {
    if (!confirm('Tem certeza que deseja remover o SVG? Esta ação irá remover o overlay e todos os mapeamentos de shapes. Você precisará salvar o post para confirmar a remoção.')) {
      return;
    }

    // Remove o overlay do mapa
    this.removeOverlay();

    // Reseta o estado interno
    this.svgContent = null;
    this.svgElement = null;
    this.shapes = [];
    this.viewBox = null;
    this.shapeMapping = {};
    this.overlay = {
      bounds: null,
      rotation: 0,
      scale: 1,
      center: null,
      width: 400,
      height: 400,
    };

    // Limpa os inputs hidden
    const svgInput = document.getElementById('terreno_svg_content');
    const boundsInput = document.getElementById('terreno_svg_bounds');
    const rotationInput = document.getElementById('terreno_svg_rotation');
    const mappingInput = document.getElementById('terreno_shape_mapping');

    if (svgInput) svgInput.value = '';
    if (boundsInput) boundsInput.value = '';
    if (rotationInput) rotationInput.value = '';
    if (mappingInput) mappingInput.value = '';

    // Atualiza a sidebar de shapes
    const container = document.getElementById('shapes-sidebar-container');
    const countEl = document.getElementById('total-shapes');
    const mappedCountEl = document.getElementById('shapes-mapped-count');

    if (countEl) countEl.textContent = '0';
    if (mappedCountEl) mappedCountEl.textContent = '0';
    if (container) {
      container.innerHTML = `
        <div class="no-lotes" id="no-shapes-message">
          <div class="no-lotes-icon">
            <span class="dashicons dashicons-admin-multisite"></span>
          </div>
          <p>Nenhum shape carregado.</p>
          <p class="help-text">Importe um SVG para visualizar os shapes.</p>
        </div>
      `;
    }

    // Desabilita botões de ajustar e remove botão de remover
    const btnAjustar = document.getElementById('btn_ajustar_svg');
    const btnRemover = document.getElementById('btn_remover_svg');

    if (btnAjustar) btnAjustar.disabled = true;
    if (btnRemover) btnRemover.remove();

    // Emite evento para outros managers
    this.eventBus.emit('svg:removed', {});

    console.log('✓ SVG removido. Salve o post para confirmar a remoção.');
    alert('SVG removido. Salve o post para confirmar a remoção.');
  }

  /**
   * Rotaciona o overlay
   */
  rotateOverlay(degrees) {
    this.overlay.rotation += degrees;
    this.overlay.rotation = this.overlay.rotation % 360;
    this.updateOverlayTransform();

    const rotationSlider = document.getElementById('svgRotationSlider');
    const rotationValue = document.getElementById('svgRotationValue');
    if (rotationSlider) rotationSlider.value = this.overlay.rotation;
    if (rotationValue) {
      rotationValue.textContent = `${Math.round(this.overlay.rotation)}°`;
    }
  }

  /**
   * Define rotação específica
   */
  setRotation(degrees) {
    this.overlay.rotation = degrees;
    this.updateOverlayTransform();

    if (!this.isModalOpen) return;

    const rotationValue = document.getElementById('svgRotationValue');
    if (rotationValue) rotationValue.textContent = `${Math.round(degrees)}°`;
  }

  /**
   * Escala o overlay
   */
  scaleOverlay(factor) {
    if (!this.overlay.bounds || !this.overlay.center) return;

    const bounds = this.overlay.bounds;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const centerLat = this.overlay.center.lat;
    const centerLng = this.overlay.center.lng;

    const halfHeight = ((ne.lat() - sw.lat()) / 2) * factor;
    const halfWidth = ((ne.lng() - sw.lng()) / 2) * factor;

    this.overlay.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(centerLat - halfHeight, centerLng - halfWidth),
      new google.maps.LatLng(centerLat + halfHeight, centerLng + halfWidth),
    );

    this.customOverlay?.updateBounds(this.overlay.bounds);
  }

  /**
   * Atualiza os bounds do overlay baseado na escala
   */
  updateOverlayBounds() {
    if (!this.overlay.bounds || !this.overlay.center) return;

    const currentBounds = this.overlay.bounds;
    const ne = currentBounds.getNorthEast();
    const sw = currentBounds.getSouthWest();

    const centerLat = this.overlay.center.lat;
    const centerLng = this.overlay.center.lng;

    const halfHeight = ((ne.lat() - sw.lat()) / 2) * this.overlay.scale;
    const halfWidth = ((ne.lng() - sw.lng()) / 2) * this.overlay.scale;

    this.overlay.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(centerLat - halfHeight, centerLng - halfWidth),
      new google.maps.LatLng(centerLat + halfHeight, centerLng + halfWidth),
    );

    this.overlay.scale = 1; // Reset scale after applying

    if (this.customOverlay) {
      this.customOverlay.updateBounds(this.overlay.bounds);
    }
  }

  /**
   * Atualiza a transformação visual do overlay
   */
  updateOverlayTransform() {
    if (this.customOverlay) {
      this.customOverlay.updateRotation(this.overlay.rotation);
    }
  }

  /**
   * Define a opacidade do overlay
   */
  setOverlayOpacity(opacity) {
    if (this.customOverlay) {
      this.customOverlay.setOpacity(opacity);
    }
  }

  /**
   * Reseta as transformações
   */
  resetTransform() {
    // Só reseta se houver SVG carregado
    if (!this.svgContent || !this.map) return;

    this.overlay.rotation = 0;
    this.overlay.scale = 1;
    this.updateOverlayTransform();
    this.createMapOverlay(); // Recria na posição inicial

    const rotationSlider = document.getElementById('svgRotationSlider');
    const rotationValue = document.getElementById('svgRotationValue');
    if (rotationSlider) rotationSlider.value = 0;
    if (rotationValue) rotationValue.textContent = '0°';
  }

  /**
   * Renderiza lista de shapes detectados (na sidebar)
   */
  renderShapesList() {
    // Renderiza na sidebar principal
    this.renderShapesInSidebar();
  }

  /**
   * Renderiza lista de shapes na sidebar principal
   */
  renderShapesInSidebar() {
    const container = document.getElementById('shapes-sidebar-container');
    const countEl = document.getElementById('total-shapes');
    const mappedCountEl = document.getElementById('shapes-mapped-count');
    const noShapesMessage = document.getElementById('no-shapes-message');

    if (countEl) countEl.textContent = this.shapes.length;

    if (!container) return;

    if (this.shapes.length === 0) {
      if (noShapesMessage) noShapesMessage.style.display = 'block';
      return;
    }

    if (noShapesMessage) noShapesMessage.style.display = 'none';

    // Conta shapes mapeados
    const mappedCount = Object.keys(this.shapeMapping || {}).length;
    if (mappedCountEl) mappedCountEl.textContent = mappedCount;

    const html = this.shapes
      .map((shape, index) => {
        const mapping = this.shapeMapping?.[index];
        const isMapped = !!mapping;
        const statusClass = isMapped ? 'shape-mapped' : 'shape-unmapped';
        const statusText = isMapped
          ? `Quadra ${mapping.bloco} | Lote ${mapping.lote_id}`
          : 'Não mapeado';

        return `
          <div class="shape-item ${statusClass}" data-shape-index="${index}">
            <div class="shape-header">
              <span class="shape-color" style="background: ${shape.fill || shape.stroke || '#ccc'};"></span>
              <span class="shape-name">${shape.id || `Shape ${index + 1}`}</span>
              <span class="shape-points">${shape.points?.length || 0} pts</span>
            </div>
            <div class="shape-status">${statusText}</div>
          </div>
        `;
      })
      .join('');

    container.innerHTML = html;

    // Adiciona event listeners para hover/click nos shapes
    this.setupShapeItemListeners();
  }

  /**
   * Configura event listeners para os itens de shape na sidebar
   */
  setupShapeItemListeners() {
    const items = document.querySelectorAll('.shape-item');
    items.forEach((item) => {
      const index = parseInt(item.dataset.shapeIndex);

      item.addEventListener('mouseenter', () => {
        this.highlightShape(index);
      });

      item.addEventListener('mouseleave', () => {
        this.unhighlightShape(index);
      });

      item.addEventListener('click', () => {
        this.eventBus.emit('svg:shape_clicked', { index });
      });
    });
  }

  /**
   * Remove destaque de um shape
   */
  unhighlightShape(index) {
    if (this.customOverlay) {
      this.customOverlay.unhighlightShape(index);
    }
  }

  /**
   * Atualiza o centro do overlay (chamado durante drag)
   */
  updateOverlayCenter(newCenter) {
    const oldCenter = this.overlay.center;
    const bounds = this.overlay.bounds;

    if (!oldCenter || !bounds) return;

    const dLat = newCenter.lat - oldCenter.lat;
    const dLng = newCenter.lng - oldCenter.lng;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    this.overlay.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(sw.lat() + dLat, sw.lng() + dLng),
      new google.maps.LatLng(ne.lat() + dLat, ne.lng() + dLng),
    );

    this.overlay.center = newCenter;
  }

  /**
   * Salva o SVG como overlay permanente (nova abordagem)
   * Em vez de converter para polígonos, mantém o SVG como overlay
   */
  saveAsOverlay() {
    try {
      if (!this.svgContent) {
        alert('Nenhum SVG carregado.');
        return;
      }

      // Se não tem bounds, tenta criar o overlay primeiro
      if (!this.overlay.bounds) {
        console.log('Bounds não encontrados, criando overlay...');
        this.createMapOverlay();

        // Aguarda um pouco para o overlay ser criado
        setTimeout(() => {
          if (this.overlay.bounds) {
            this.completeSaveOverlay();
          } else {
            alert('Erro: não foi possível posicionar o SVG no mapa. Tente novamente.');
          }
        }, 100);
        return;
      }

      this.completeSaveOverlay();

    } catch (error) {
      console.error('Erro ao salvar overlay:', error);
      alert('Erro ao salvar overlay: ' + error.message);
    }
  }

  /**
   * Completa o salvamento do overlay após garantir que bounds existe
   */
  completeSaveOverlay() {
    // Verifica novamente para segurança
    if (!this.overlay.bounds) {
      console.error('Bounds ainda é null após criação do overlay');
      alert('Erro ao posicionar SVG. Recarregue a página e tente novamente.');
      return;
    }

    // Salva os dados nos inputs hidden
    this.updateHiddenInputs();

    // Captura os valores dos bounds antes de emitir eventos
    const boundsData = {
      north: this.overlay.bounds.getNorthEast().lat(),
      south: this.overlay.bounds.getSouthWest().lat(),
      east: this.overlay.bounds.getNorthEast().lng(),
      west: this.overlay.bounds.getSouthWest().lng(),
    };

    // Emite evento para o SVGEditorManager processar
    this.eventBus.emit('svg:loaded', {
      svgContent: this.svgContent,
      shapes: this.shapes,
      viewBox: this.viewBox,
    });

    this.eventBus.emit('svg:positioned', {
      bounds: boundsData,
      rotation: this.overlay.rotation,
      center: this.overlay.center,
    });

    // Fecha o modal de importação (mantém o overlay no mapa)
    this.closeModal(true);

    // Ativa modo de edição no overlay
    this.enableEditorMode();

    console.log('✓ SVG salvo como overlay permanente');
    console.log(`  Shapes: ${this.shapes.length}`);
    console.log(`  Bounds: N=${boundsData.north}, S=${boundsData.south}, E=${boundsData.east}, W=${boundsData.west}`);
    console.log(`  Rotação: ${this.overlay.rotation}°`);
  }

  /**
   * Atualiza inputs hidden com dados do overlay
   */
  updateHiddenInputs() {
    const container = document.querySelector('#terreno-mapa-container');
    if (!container) return;

    // SVG Content
    let svgInput = document.getElementById('terreno_svg_content');
    if (!svgInput) {
      svgInput = document.createElement('input');
      svgInput.type = 'hidden';
      svgInput.id = 'terreno_svg_content';
      svgInput.name = 'terreno_svg_content';
      container.appendChild(svgInput);
    }
    svgInput.value = this.svgContent || '';

    // Bounds
    let boundsInput = document.getElementById('terreno_svg_bounds');
    if (!boundsInput) {
      boundsInput = document.createElement('input');
      boundsInput.type = 'hidden';
      boundsInput.id = 'terreno_svg_bounds';
      boundsInput.name = 'terreno_svg_bounds';
      container.appendChild(boundsInput);
    }
    if (this.overlay.bounds) {
      boundsInput.value = JSON.stringify({
        north: this.overlay.bounds.getNorthEast().lat(),
        south: this.overlay.bounds.getSouthWest().lat(),
        east: this.overlay.bounds.getNorthEast().lng(),
        west: this.overlay.bounds.getSouthWest().lng(),
      });
    }

    // Rotation
    let rotationInput = document.getElementById('terreno_svg_rotation');
    if (!rotationInput) {
      rotationInput = document.createElement('input');
      rotationInput.type = 'hidden';
      rotationInput.id = 'terreno_svg_rotation';
      rotationInput.name = 'terreno_svg_rotation';
      container.appendChild(rotationInput);
    }
    rotationInput.value = this.overlay.rotation || 0;
  }

  /**
   * Ativa modo de edição (shapes clicáveis)
   */
  enableEditorMode() {
    this.isEditorMode = true;
    if (this.customOverlay) {
      this.customOverlay.enableEditorMode();
    }
  }

  /**
   * Desativa modo de edição
   */
  disableEditorMode() {
    this.isEditorMode = false;
    if (this.customOverlay) {
      this.customOverlay.disableEditorMode();
    }
  }

  /**
   * Alterna modo de edição/posicionamento do SVG
   */
  toggleEditMode() {
    if (!this.svgContent || !this.customOverlay) {
      alert('Nenhum SVG carregado. Importe um SVG primeiro.');
      return;
    }

    // Abre o modal com os controles
    this.openModalForAdjustment();
  }

  /**
   * Abre modal apenas para ajuste (sem upload)
   */
  openModalForAdjustment() {
    if (!this.modal) return;

    this.isModalOpen = true;
    this.modal.style.display = 'block';

    // Esconde step 1 (upload) e mostra step 2 (controles)
    const step1 = document.getElementById('svgStep1');
    const step2 = document.getElementById('svgStep2');
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'block';

    // Habilita botão de confirmar
    const confirmBtn = document.getElementById('svgImportConfirm');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Salvar Ajustes';
    }

    // Ativa modo de posicionamento no overlay (não editor)
    if (this.customOverlay) {
      this.customOverlay.disableEditorMode();
    }

    // Atualiza sliders com valores atuais
    const rotationSlider = document.getElementById('svgRotationSlider');
    const rotationValue = document.getElementById('svgRotationValue');
    if (rotationSlider) rotationSlider.value = this.overlay.rotation || 0;
    if (rotationValue) rotationValue.textContent = `${Math.round(this.overlay.rotation || 0)}°`;

    console.log('SVG: Modo de ajuste ativado');
  }

  /**
   * Destaca um shape específico no overlay
   */
  highlightShape(index) {
    this.selectedShapeIndex = index;
    if (this.customOverlay) {
      this.customOverlay.highlightShape(index);
    }
  }

  /**
   * Atualiza cores dos shapes baseado no mapeamento
   */
  updateShapeColors() {
    if (this.customOverlay) {
      this.customOverlay.updateShapeColors(this.shapeMapping);
    }
  }

  /**
   * Finaliza a importação - converte shapes para polígonos no mapa
   * (Mantido para compatibilidade, mas não é mais o fluxo principal)
   */
  async finalizeImport() {
    try {
      if (!this.shapes || this.shapes.length === 0) {
        alert('Nenhum shape para importar.');
        return;
      }

      if (!this.overlay.bounds) {
        alert('Posicione o SVG no mapa primeiro.');
        return;
      }

      console.log('Iniciando conversão de shapes para polígonos...');
      const ne = this.overlay.bounds.getNorthEast();
      const sw = this.overlay.bounds.getSouthWest();
      console.log(`Bounds: N=${ne.lat()}, S=${sw.lat()}, E=${ne.lng()}, W=${sw.lng()}`);
      console.log('Rotação:', this.overlay.rotation);
      console.log('ViewBox:', this.viewBox);

      const importedLotes = [];

      // Converte cada shape
      this.shapes.forEach((shape, index) => {
        if (!shape.points || shape.points.length < 3) return;

        // Converte coordenadas SVG para lat/lng
        const coordinates = shape.points.map((point) =>
          this.svgPointToLatLng(point),
        );

        // Gera dados do lote
        const lote = {
          id: `imported_${Date.now()}_${index}`,
          nome: shape.id || `Lote ${index + 1}`,
          bloco: '',
          coordinates: coordinates,
          area: this.calculateArea(coordinates),
          color: shape.fill || this.generateRandomColor(),
          status: 'disponivel',
          created_at: new Date().toISOString(),
        };

        importedLotes.push(lote);
      });

      console.log(`Convertidos ${importedLotes.length} lotes.`);

      // Adiciona os lotes
      importedLotes.forEach((lote) => {
        this.dataPersistence.addLote(lote);
        this.polygonManager.createPolygon(lote);
      });

      // Atualiza UI
      this.eventBus.emit('lotes:imported', { count: importedLotes.length });

      // Remove overlay e fecha modal
      this.removeOverlay();
      this.closeModal();

      // Centraliza no primeiro lote importado
      if (importedLotes.length > 0) {
        this.polygonManager.centerOnPolygon(importedLotes[0].id);
      }

      alert(`✓ ${importedLotes.length} lotes importados com sucesso!`);
    } catch (error) {
      console.error('Erro ao importar lotes:', error);
      alert('Erro ao importar lotes: ' + error.message);
    }
  }

  /**
   * Converte um ponto SVG para coordenadas lat/lng
   *
   * Leva em conta:
   * - ViewBox do SVG
   * - Bounds do overlay no mapa
   * - Rotação do overlay
   */
  svgPointToLatLng(svgPoint) {
    const bounds = this.overlay.bounds;
    const rotation = this.overlay.rotation;
    const vb = this.viewBox;

    // Normaliza coordenadas do SVG para 0-1
    const normalizedX = (svgPoint.x - vb.x) / vb.width;
    const normalizedY = (svgPoint.y - vb.y) / vb.height;

    // Centro do overlay em coordenadas normalizadas
    const centerX = 0.5;
    const centerY = 0.5;

    // Aplica rotação em torno do centro
    const angleRad = (rotation * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    // Translada para origem, rotaciona, translada de volta
    const dx = normalizedX - centerX;
    const dy = normalizedY - centerY;

    const rotatedX = centerX + (dx * cos - dy * sin);
    const rotatedY = centerY + (dx * sin + dy * cos);

    // Converte para lat/lng usando os bounds
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // X corresponde a longitude, Y corresponde a latitude
    // NOTA: Y do SVG cresce para baixo, latitude cresce para cima
    const lng = sw.lng() + rotatedX * (ne.lng() - sw.lng());
    const lat = ne.lat() - rotatedY * (ne.lat() - sw.lat()); // Invertido

    return { lat, lng };
  }

  /**
   * Calcula área aproximada de um polígono
   */
  calculateArea(coordinates) {
    if (coordinates.length < 3) return 0;

    let area = 0;
    const n = coordinates.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i].lng * coordinates[j].lat;
      area -= coordinates[j].lng * coordinates[i].lat;
    }

    area = Math.abs(area / 2);
    const metersPerDegree = 111000;
    area = area * metersPerDegree * metersPerDegree;

    return area;
  }

  /**
   * Gera cor aleatória
   */
  generateRandomColor() {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F06292',
      '#AED581',
      '#FFD54F',
      '#4DB6AC',
      '#7986CB',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

/**
 * Cria a classe CustomSVGOverlay quando necessário (após Google Maps carregar)
 * Isso evita o erro de referência ao google.maps.OverlayView antes do Maps API estar pronto
 */
let CustomSVGOverlayClass = null;

function getCustomSVGOverlayClass() {
  if (CustomSVGOverlayClass) {
    return CustomSVGOverlayClass;
  }

  // Define a classe apenas quando necessário (após Google Maps estar carregado)
  CustomSVGOverlayClass = class CustomSVGOverlay extends (
    google.maps.OverlayView
  ) {
    constructor(bounds, svgContent, map, manager, isEditorMode = false) {
      super();
      this.bounds = bounds;
      this.svgContent = svgContent;
      this.manager = manager;
      this.div = null;
      this.rotation = 0;
      this.opacity = 0.7;
      this.isDragging = false;
      this.isResizing = false;
      this.isEditorMode = isEditorMode;
      this.selectedShapeIndex = null;
      this.shapeMapping = {};
    }

    onAdd() {
      // Cria container do overlay
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      this.div.style.cursor = this.isEditorMode ? 'crosshair' : 'move';
      this.div.innerHTML = this.svgContent;

      // Adiciona classe para o modo editor
      if (this.isEditorMode) {
        this.div.classList.add('svg-editor-overlay');
      }

      // Estiliza o SVG
      const svg = this.div.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.opacity = this.opacity;
        // Em modo editor, SVG é clicável
        svg.style.pointerEvents = this.isEditorMode ? 'auto' : 'none';
      }

      // Adiciona borda para visualização
      this.div.style.border = '2px dashed #0073aa';
      this.div.style.boxSizing = 'border-box';

      // Adiciona handles de resize nos cantos (apenas fora do modo editor)
      if (!this.isEditorMode) {
        this.addResizeHandles();
      }

      // Adiciona eventos de drag (apenas fora do modo editor)
      if (!this.isEditorMode) {
        this.addDragListeners();
      }

      // Em modo editor, adiciona listeners de clique nos shapes
      if (this.isEditorMode) {
        this.addShapeClickListeners();
      }

      // Adiciona ao mapa
      // z-index maior para ficar ACIMA do Image overlay
      this.div.style.zIndex = '10';
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(this.div);
    }

    /**
     * Adiciona listeners de clique em cada shape do SVG
     */
    addShapeClickListeners() {
      const svg = this.div.querySelector('svg');
      if (!svg) return;

      const shapes = svg.querySelectorAll('polygon, path, polyline, rect');
      shapes.forEach((shape, index) => {
        // Torna o shape clicável
        shape.style.cursor = 'pointer';
        shape.style.pointerEvents = 'auto';
        shape.dataset.shapeIndex = index;

        // Hover effect
        shape.addEventListener('mouseenter', () => {
          if (this.selectedShapeIndex !== index) {
            shape.style.fill = 'rgba(0, 115, 170, 0.5)';
            shape.style.stroke = '#0073aa';
            shape.style.strokeWidth = '3px';
          }
        });

        shape.addEventListener('mouseleave', () => {
          if (this.selectedShapeIndex !== index) {
            this.restoreShapeStyle(shape, index);
          }
        });

        // Click - emite evento para o editor
        shape.addEventListener('click', (e) => {
          e.stopPropagation();
          this.manager.eventBus.emit('svg:shape_clicked', { index, shape });
        });
      });
    }

    /**
     * Restaura estilo original do shape
     */
    restoreShapeStyle(shape, index) {
      const mapping = this.shapeMapping[index];
      if (mapping) {
        // Shape mapeado - verde
        shape.style.fill = 'rgba(40, 167, 69, 0.4)';
        shape.style.stroke = '#28a745';
        shape.style.strokeWidth = '2px';
      } else {
        // Shape não mapeado - estilo original ou cinza
        shape.style.fill = 'rgba(200, 200, 200, 0.3)';
        shape.style.stroke = '#666';
        shape.style.strokeWidth = '2px';
      }
    }

    /**
     * Destaca um shape específico
     */
    highlightShape(index) {
      const svg = this.div?.querySelector('svg');
      if (!svg) return;

      // Remove destaque anterior
      if (this.selectedShapeIndex !== null) {
        const prevShape = svg.querySelector(`[data-shape-index="${this.selectedShapeIndex}"]`);
        if (prevShape) {
          this.restoreShapeStyle(prevShape, this.selectedShapeIndex);
        }
      }

      this.selectedShapeIndex = index;

      // Aplica destaque no novo shape
      const shape = svg.querySelector(`[data-shape-index="${index}"]`);
      if (shape) {
        shape.style.fill = 'rgba(255, 193, 7, 0.5)';
        shape.style.stroke = '#ffc107';
        shape.style.strokeWidth = '4px';
      }
    }

    /**
     * Remove destaque de um shape específico
     */
    unhighlightShape(index) {
      const svg = this.div?.querySelector('svg');
      if (!svg) return;

      const shape = svg.querySelector(`[data-shape-index="${index}"]`);
      if (shape) {
        this.restoreShapeStyle(shape, index);
      }

      if (this.selectedShapeIndex === index) {
        this.selectedShapeIndex = null;
      }
    }

    /**
     * Atualiza cores dos shapes baseado no mapeamento
     */
    updateShapeColors(mapping) {
      this.shapeMapping = mapping || {};

      const svg = this.div?.querySelector('svg');
      if (!svg) return;

      const shapes = svg.querySelectorAll('polygon, path, polyline, rect');
      shapes.forEach((shape, index) => {
        if (this.selectedShapeIndex !== index) {
          this.restoreShapeStyle(shape, index);
        }
      });
    }

    /**
     * Ativa modo editor
     */
    enableEditorMode() {
      this.isEditorMode = true;
      if (this.div) {
        this.div.style.cursor = 'crosshair';
        this.div.classList.add('svg-editor-overlay');

        const svg = this.div.querySelector('svg');
        if (svg) {
          svg.style.pointerEvents = 'auto';
        }

        // Remove handles de resize
        this.div.querySelectorAll('.svg-resize-handle').forEach(h => h.remove());

        // Adiciona listeners de clique
        this.addShapeClickListeners();
      }
    }

    /**
     * Desativa modo editor
     */
    disableEditorMode() {
      this.isEditorMode = false;
      if (this.div) {
        this.div.style.cursor = 'move';
        this.div.classList.remove('svg-editor-overlay');

        const svg = this.div.querySelector('svg');
        if (svg) {
          svg.style.pointerEvents = 'none';
        }

        // Adiciona handles de resize
        this.addResizeHandles();
        this.addDragListeners();
      }
    }

    addResizeHandles() {
      const corners = ['nw', 'ne', 'sw', 'se'];
      corners.forEach((corner) => {
        const handle = document.createElement('div');
        handle.className = `svg-resize-handle svg-resize-${corner}`;
        handle.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: #0073aa;
        border: 2px solid white;
        border-radius: 50%;
        cursor: ${corner}-resize;
        z-index: 1000;
      `;

        // Posiciona os handles
        if (corner.includes('n')) handle.style.top = '-6px';
        if (corner.includes('s')) handle.style.bottom = '-6px';
        if (corner.includes('w')) handle.style.left = '-6px';
        if (corner.includes('e')) handle.style.right = '-6px';

        handle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          this.startResize(e, corner);
        });

        this.div.appendChild(handle);
      });
    }

    addDragListeners() {
      this.div.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('svg-resize-handle')) return;
        this.startDrag(e);
      });

      document.addEventListener('mousemove', (e) => {
        if (this.isDragging) this.onDrag(e);
        if (this.isResizing) this.onResize(e);
      });

      document.addEventListener('mouseup', () => {
        if (this.isDragging || this.isResizing) {
          // Reabilita o drag do mapa
          const map = this.getMap();
          if (map) {
            map.setOptions({ draggable: true });
          }
          // Atualiza hidden inputs com a nova posição
          this.manager.updateHiddenInputs();
        }
        this.isDragging = false;
        this.isResizing = false;
      });
    }

    startDrag(e) {
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX,
        y: e.clientY,
        bounds: new google.maps.LatLngBounds(
          this.bounds.getSouthWest(),
          this.bounds.getNorthEast(),
        ),
      };
      // Desabilita o drag do mapa enquanto arrasta o overlay
      this.getMap().setOptions({ draggable: false });
      e.preventDefault();
      e.stopPropagation();
    }

    onDrag(e) {
      const projection = this.getProjection();
      if (!projection) return;

      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;

      const startSW = this.dragStart.bounds.getSouthWest();
      const startNE = this.dragStart.bounds.getNorthEast();

      const swPoint = projection.fromLatLngToDivPixel(startSW);
      const nePoint = projection.fromLatLngToDivPixel(startNE);

      const newSW = projection.fromDivPixelToLatLng(
        new google.maps.Point(swPoint.x + dx, swPoint.y + dy),
      );
      const newNE = projection.fromDivPixelToLatLng(
        new google.maps.Point(nePoint.x + dx, nePoint.y + dy),
      );

      this.bounds = new google.maps.LatLngBounds(newSW, newNE);
      this.manager.overlay.bounds = this.bounds;
      this.manager.overlay.center = {
        lat: (newSW.lat() + newNE.lat()) / 2,
        lng: (newSW.lng() + newNE.lng()) / 2,
      };

      this.draw();
    }

    startResize(e, corner) {
      this.isResizing = true;
      this.resizeCorner = corner;
      this.resizeStart = {
        x: e.clientX,
        y: e.clientY,
        bounds: new google.maps.LatLngBounds(
          this.bounds.getSouthWest(),
          this.bounds.getNorthEast(),
        ),
      };
      // Desabilita o drag do mapa enquanto redimensiona
      this.getMap().setOptions({ draggable: false });
      e.preventDefault();
      e.stopPropagation();
    }

    onResize(e) {
      const projection = this.getProjection();
      if (!projection) return;

      const startSW = this.resizeStart.bounds.getSouthWest();
      const startNE = this.resizeStart.bounds.getNorthEast();

      let newSW = startSW;
      let newNE = startNE;

      const swPoint = projection.fromLatLngToDivPixel(startSW);
      const nePoint = projection.fromLatLngToDivPixel(startNE);

      const dx = e.clientX - this.resizeStart.x;
      const dy = e.clientY - this.resizeStart.y;

      // Ajusta baseado no corner sendo arrastado
      if (this.resizeCorner.includes('e')) {
        newNE = projection.fromDivPixelToLatLng(
          new google.maps.Point(nePoint.x + dx, nePoint.y),
        );
      }
      if (this.resizeCorner.includes('w')) {
        newSW = projection.fromDivPixelToLatLng(
          new google.maps.Point(swPoint.x + dx, swPoint.y),
        );
      }
      if (this.resizeCorner.includes('n')) {
        newNE = projection.fromDivPixelToLatLng(
          new google.maps.Point(
            this.resizeCorner.includes('e') ? nePoint.x + dx : nePoint.x,
            nePoint.y + dy,
          ),
        );
      }
      if (this.resizeCorner.includes('s')) {
        newSW = projection.fromDivPixelToLatLng(
          new google.maps.Point(
            this.resizeCorner.includes('w') ? swPoint.x + dx : swPoint.x,
            swPoint.y + dy,
          ),
        );
      }

      this.bounds = new google.maps.LatLngBounds(newSW, newNE);
      this.manager.overlay.bounds = this.bounds;
      this.manager.overlay.center = {
        lat: (newSW.lat() + newNE.lat()) / 2,
        lng: (newSW.lng() + newNE.lng()) / 2,
      };

      this.draw();
    }

    draw() {
      if (!this.div) return;

      const projection = this.getProjection();
      if (!projection) return;

      const sw = projection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      const ne = projection.fromLatLngToDivPixel(this.bounds.getNorthEast());

      if (!sw || !ne) return;

      const width = ne.x - sw.x;
      const height = sw.y - ne.y;

      this.div.style.left = sw.x + 'px';
      this.div.style.top = ne.y + 'px';
      this.div.style.width = width + 'px';
      this.div.style.height = height + 'px';

      // Aplica rotação
      this.div.style.transform = `rotate(${this.rotation}deg)`;
      this.div.style.transformOrigin = 'center center';
    }

    updateBounds(bounds) {
      this.bounds = bounds;
      this.draw();
    }

    updateRotation(rotation) {
      this.rotation = rotation;
      this.draw();
    }

    setOpacity(opacity) {
      this.opacity = opacity;
      if (this.div) {
        const svg = this.div.querySelector('svg');
        if (svg) {
          svg.style.opacity = opacity;
        }
      }
    }

    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }
  };

  return CustomSVGOverlayClass;
}
