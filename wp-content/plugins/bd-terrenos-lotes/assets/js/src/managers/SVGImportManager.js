/**
 * SVGImportManager - Gerencia importação de SVG para lotes
 *
 * Responsável por:
 * - Upload e processamento de arquivos SVG
 * - Preview do SVG e shapes detectados
 * - Sistema de calibração com 2 pontos
 * - Transformação de coordenadas SVG → lat/lng
 * - Criação de lotes a partir dos shapes
 */
export class SVGImportManager {
  constructor(map, stateManager, eventBus, polygonManager, dataPersistence) {
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.polygonManager = polygonManager;
    this.dataPersistence = dataPersistence;

    // Estado da importação
    this.shapes = [];
    this.svgContent = null;
    this.viewBox = null;

    // Calibração
    this.calibration = {
      point1: { svg: null, geo: null },
      point2: { svg: null, geo: null },
      currentPoint: 1, // Qual ponto está sendo definido
    };

    // Mini mapa para calibração
    this.calibrationMap = null;
    this.calibrationMarkers = [];

    // Elementos DOM
    this.modal = null;
    this.previewContainer = null;

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

    // Elementos do modal
    this.modal = document.getElementById('svgImportModal');
    if (!this.modal) return;

    // Botões de fechar/cancelar
    document
      .getElementById('svgImportClose')
      ?.addEventListener('click', () => this.closeModal());
    document
      .getElementById('svgImportCancel')
      ?.addEventListener('click', () => this.closeModal());

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

    // Reset calibração
    document
      .getElementById('resetCalibration')
      ?.addEventListener('click', () => {
        this.resetCalibration();
      });

    // Confirmar importação
    document
      .getElementById('svgImportConfirm')
      ?.addEventListener('click', () => {
        this.importShapes();
      });

    // Container do preview
    this.previewContainer = document.getElementById('svgPreviewContainer');
  }

  /**
   * Abre o modal de importação
   */
  openModal() {
    if (this.modal) {
      this.modal.style.display = 'block';
      this.resetState();
    }
  }

  /**
   * Fecha o modal
   */
  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
      this.resetState();
    }
  }

  /**
   * Reseta o estado da importação
   */
  resetState() {
    this.shapes = [];
    this.svgContent = null;
    this.viewBox = null;
    this.resetCalibration();

    // Reset UI
    document.getElementById('svgStep1').style.display = 'block';
    document.getElementById('svgStep2').style.display = 'none';
    document.getElementById('svgUploadStatus').style.display = 'none';
    document.getElementById('svgImportConfirm').disabled = true;

    if (this.previewContainer) {
      this.previewContainer.innerHTML = '';
    }

    // Limpa mini mapa
    if (this.calibrationMap) {
      this.calibrationMarkers.forEach((m) => m.setMap(null));
      this.calibrationMarkers = [];
    }
  }

  /**
   * Reseta a calibração
   */
  resetCalibration() {
    this.calibration = {
      point1: { svg: null, geo: null },
      point2: { svg: null, geo: null },
      currentPoint: 1,
    };

    // Atualiza UI
    const point1Svg = document.getElementById('point1Svg');
    const point1Geo = document.getElementById('point1Geo');
    const point2Svg = document.getElementById('point2Svg');
    const point2Geo = document.getElementById('point2Geo');
    const svgPreviewHint = document.getElementById('svgPreviewHint');
    const svgMapHint = document.getElementById('svgMapHint');
    const svgImportConfirm = document.getElementById('svgImportConfirm');

    if (point1Svg) point1Svg.textContent = '-';
    if (point1Geo) point1Geo.textContent = '-';
    if (point2Svg) point2Svg.textContent = '-';
    if (point2Geo) point2Geo.textContent = '-';

    if (svgPreviewHint)
      svgPreviewHint.textContent = 'Clique em um ponto de referência no SVG';
    if (svgMapHint)
      svgMapHint.textContent = 'Clique no mapa para indicar a posição real';

    if (svgImportConfirm) svgImportConfirm.disabled = true;

    // Remove marcadores do mapa
    this.calibrationMarkers.forEach((m) => m.setMap(null));
    this.calibrationMarkers = [];

    // Remove marcadores do SVG
    const svgMarkers = this.previewContainer?.querySelectorAll(
      '.svg-calibration-marker',
    );
    svgMarkers?.forEach((m) => m.remove());
  }

  /**
   * Processa o upload do arquivo SVG
   */
  async handleFileUpload(file) {
    if (!file.name.endsWith('.svg')) {
      alert('Por favor, selecione um arquivo SVG válido.');
      return;
    }

    // Lê o conteúdo do arquivo
    const reader = new FileReader();
    reader.onload = async (e) => {
      this.svgContent = e.target.result;
      await this.processSVG(file.name);
    };
    reader.readAsText(file);
  }

  /**
   * Processa o SVG via AJAX
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

        // Renderiza preview
        this.renderPreview();

        // Inicializa mini mapa
        this.initCalibrationMap();

        // Renderiza lista de shapes
        this.renderShapesList();

        console.log(`✓ SVG processado: ${this.shapes.length} shapes`);
      } else {
        alert(
          'Erro ao processar SVG: ' +
            (result.data?.message || 'Erro desconhecido'),
        );
        document.getElementById('svgUploadStatus').style.display = 'none';
      }
    } catch (error) {
      console.error('Erro ao processar SVG:', error);
      alert('Erro ao processar SVG. Verifique o console para detalhes.');
      document.getElementById('svgUploadStatus').style.display = 'none';
    }
  }

  /**
   * Renderiza o preview do SVG
   */
  renderPreview() {
    if (!this.previewContainer || !this.svgContent) return;

    // Insere o SVG no container
    this.previewContainer.innerHTML = this.svgContent;

    // Ajusta o SVG para caber no container
    const svg = this.previewContainer.querySelector('svg');
    if (svg) {
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.maxWidth = '100%';
      svg.style.maxHeight = '100%';

      // Adiciona listener de clique para calibração
      svg.addEventListener('click', (e) => this.handleSVGClick(e));

      // Highlight nos shapes ao hover
      this.shapes.forEach((shape, index) => {
        const element =
          svg.querySelector(`#${shape.id}`) ||
          svg.querySelectorAll('path, polygon, polyline, rect')[index];

        if (element) {
          element.style.cursor = 'pointer';
          element.addEventListener('mouseenter', () => {
            element.style.opacity = '0.7';
          });
          element.addEventListener('mouseleave', () => {
            element.style.opacity = '1';
          });
        }
      });
    }
  }

  /**
   * Inicializa o mini mapa para calibração
   */
  initCalibrationMap() {
    const mapContainer = document.getElementById('svgCalibrationMap');
    if (!mapContainer || !this.map) return;

    // Usa as mesmas coordenadas do mapa principal
    const center = this.map.getCenter();
    const zoom = this.map.getZoom();

    this.calibrationMap = new google.maps.Map(mapContainer, {
      center: center,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
    });

    // Adiciona listener de clique
    this.calibrationMap.addListener('click', (e) => this.handleMapClick(e));
  }

  /**
   * Handler de clique no SVG
   */
  handleSVGClick(e) {
    const svg = this.previewContainer?.querySelector('svg');
    if (!svg) return;

    // Calcula posição relativa ao SVG
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Converte para coordenadas do viewBox
    const svgPoint = this.screenToSVG(x, y, rect.width, rect.height);

    const point1Svg = document.getElementById('point1Svg');
    const point2Svg = document.getElementById('point2Svg');
    const svgPreviewHint = document.getElementById('svgPreviewHint');

    if (this.calibration.currentPoint === 1) {
      this.calibration.point1.svg = svgPoint;
      if (point1Svg)
        point1Svg.textContent = `(${svgPoint.x.toFixed(1)}, ${svgPoint.y.toFixed(1)})`;

      // Adiciona marcador visual
      this.addSVGMarker(x, y, '#0073aa', '1');

      if (svgPreviewHint)
        svgPreviewHint.textContent = 'Agora clique no mapa para o Ponto 1';
    } else {
      this.calibration.point2.svg = svgPoint;
      if (point2Svg)
        point2Svg.textContent = `(${svgPoint.x.toFixed(1)}, ${svgPoint.y.toFixed(1)})`;

      // Adiciona marcador visual
      this.addSVGMarker(x, y, '#d63638', '2');

      if (svgPreviewHint)
        svgPreviewHint.textContent = 'Agora clique no mapa para o Ponto 2';
    }
  }

  /**
   * Handler de clique no mapa
   */
  handleMapClick(e) {
    const latLng = e.latLng;
    const geo = { lat: latLng.lat(), lng: latLng.lng() };

    const point1Geo = document.getElementById('point1Geo');
    const point2Geo = document.getElementById('point2Geo');
    const svgMapHint = document.getElementById('svgMapHint');
    const svgPreviewHint = document.getElementById('svgPreviewHint');
    const svgImportConfirm = document.getElementById('svgImportConfirm');

    if (this.calibration.currentPoint === 1 && this.calibration.point1.svg) {
      this.calibration.point1.geo = geo;
      if (point1Geo)
        point1Geo.textContent = `(${geo.lat.toFixed(6)}, ${geo.lng.toFixed(6)})`;

      // Adiciona marcador no mapa
      this.addMapMarker(latLng, '#0073aa', '1');

      // Avança para ponto 2
      this.calibration.currentPoint = 2;
      if (svgMapHint) svgMapHint.textContent = 'Clique no SVG para o Ponto 2';
      if (svgPreviewHint)
        svgPreviewHint.textContent =
          'Clique em outro ponto de referência no SVG';
    } else if (
      this.calibration.currentPoint === 2 &&
      this.calibration.point2.svg
    ) {
      this.calibration.point2.geo = geo;
      if (point2Geo)
        point2Geo.textContent = `(${geo.lat.toFixed(6)}, ${geo.lng.toFixed(6)})`;

      // Adiciona marcador no mapa
      this.addMapMarker(latLng, '#d63638', '2');

      // Calibração completa
      if (svgMapHint) svgMapHint.textContent = '✓ Calibração completa!';
      if (svgPreviewHint) svgPreviewHint.textContent = '✓ Calibração completa!';
      if (svgImportConfirm) svgImportConfirm.disabled = false;

      console.log('✓ Calibração completa:', this.calibration);
    }
  }

  /**
   * Converte coordenadas de tela para coordenadas do SVG
   */
  screenToSVG(screenX, screenY, containerWidth, containerHeight) {
    if (!this.viewBox) {
      return { x: screenX, y: screenY };
    }

    const scaleX = this.viewBox.width / containerWidth;
    const scaleY = this.viewBox.height / containerHeight;

    return {
      x: this.viewBox.x + screenX * scaleX,
      y: this.viewBox.y + screenY * scaleY,
    };
  }

  /**
   * Adiciona marcador visual no SVG
   */
  addSVGMarker(x, y, color, label) {
    const marker = document.createElement('div');
    marker.className = 'svg-calibration-marker';
    marker.style.cssText = `
      position: absolute;
      left: ${x - 12}px;
      top: ${y - 12}px;
      width: 24px;
      height: 24px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      color: white;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `;
    marker.textContent = label;
    this.previewContainer.appendChild(marker);
  }

  /**
   * Adiciona marcador no mapa de calibração
   */
  addMapMarker(latLng, color, label) {
    const marker = new google.maps.Marker({
      position: latLng,
      map: this.calibrationMap,
      label: {
        text: label,
        color: 'white',
        fontWeight: 'bold',
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2,
      },
    });
    this.calibrationMarkers.push(marker);
  }

  /**
   * Renderiza lista de shapes detectados
   */
  renderShapesList() {
    const container = document.getElementById('shapesListContainer');
    const countEl = document.getElementById('totalShapesCount');

    if (!container) return;

    if (countEl) countEl.textContent = this.shapes.length;

    if (this.shapes.length === 0) {
      container.innerHTML =
        '<p style="color: #666; margin: 0;">Nenhum shape detectado</p>';
      return;
    }

    const html = this.shapes
      .map(
        (shape, index) => `
      <div style="display: inline-block; padding: 4px 8px; margin: 2px; background: #f0f0f0; border-radius: 4px; font-size: 12px;">
        <span style="display: inline-block; width: 10px; height: 10px; background: ${shape.fill || shape.stroke || '#ccc'}; border-radius: 2px; margin-right: 4px;"></span>
        ${shape.id} (${shape.points?.length || 0} pts)
      </div>
    `,
      )
      .join('');

    container.innerHTML = html;
  }

  /**
   * Calcula a matriz de transformação baseada nos 2 pontos de calibração
   *
   * Usa transformação afim 2D: dado 2 pontos de referência, calcula
   * os coeficientes para mapear qualquer ponto SVG para coordenadas geo.
   *
   * Sistema SVG: X cresce para direita, Y cresce para BAIXO
   * Sistema Geo: Lng cresce para leste (direita), Lat cresce para NORTE (cima)
   */
  calculateTransform() {
    const p1 = this.calibration.point1;
    const p2 = this.calibration.point2;

    // Vetores no SVG
    const x1 = p1.svg.x,
      y1 = p1.svg.y;
    const x2 = p2.svg.x,
      y2 = p2.svg.y;

    // Vetores no Geo (Lng = X, Lat = Y)
    const lon1 = p1.geo.lng,
      lat1 = p1.geo.lat;
    const lon2 = p2.geo.lng,
      lat2 = p2.geo.lat;

    const dx = x2 - x1;
    // IMPORTANTE: Invertemos Y do SVG porque no SVG Y cresce para baixo,
    // mas no mapa latitude cresce para cima (norte)
    const dy = -(y2 - y1);
    const dLon = lon2 - lon1;
    const dLat = lat2 - lat1;

    const denominator = dx * dx + dy * dy;
    if (denominator === 0) throw new Error('Pontos do SVG são idênticos.');

    // Coeficientes para transformação de similaridade
    const a = (dx * dLon + dy * dLat) / denominator;
    const b = (dx * dLat - dy * dLon) / denominator;

    return { x1, y1, lon1, lat1, a, b };
  }

  /**
   * Transforma um ponto SVG para coordenadas geográficas
   *
   * Usa transformação afim: [lng, lat] = M * [dx, dy] + [lng0, lat0]
   * Onde M = [[a, b], [-b, a]] é matriz de rotação+escala
   */
  transformPoint(svgPoint, t) {
    const dx = svgPoint.x - t.x1;
    // Invertemos Y do SVG para corresponder ao sistema de coordenadas geo
    const dy = -(svgPoint.y - t.y1);

    // Aplicando a transformação de similaridade
    const lng = t.a * dx - t.b * dy + t.lon1;
    const lat = t.b * dx + t.a * dy + t.lat1;

    return { lat, lng };
  }

  /**
   * Importa os shapes como lotes
   */
  async importShapes() {
    try {
      // Calcula transformação
      const transform = this.calculateTransform();
      console.log('Transformação calculada:', transform);

      const importedLotes = [];

      // Converte cada shape em um lote
      this.shapes.forEach((shape, index) => {
        if (!shape.points || shape.points.length < 3) return;

        // Transforma coordenadas
        const coordinates = shape.points.map((point) =>
          this.transformPoint(point, transform),
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

      console.log(`Importando ${importedLotes.length} lotes...`);

      // Adiciona os lotes
      importedLotes.forEach((lote) => {
        // Adiciona ao persistence
        this.dataPersistence.addLote(lote);

        // Cria polígono visual
        this.polygonManager.createPolygon(lote);
      });

      // Atualiza UI
      this.eventBus.emit('lotes:imported', { count: importedLotes.length });

      // Fecha modal
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
   * Calcula área aproximada de um polígono
   */
  calculateArea(coordinates) {
    if (coordinates.length < 3) return 0;

    // Usa a fórmula de Shoelace adaptada para lat/lng
    // Nota: isso é uma aproximação, para áreas precisas usar google.maps.geometry
    let area = 0;
    const n = coordinates.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i].lng * coordinates[j].lat;
      area -= coordinates[j].lng * coordinates[i].lat;
    }

    area = Math.abs(area / 2);

    // Converte de graus² para m² (aproximação)
    // 1 grau ≈ 111km no equador
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
