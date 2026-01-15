/**
 * ColorGenerator - Geração de cores para polígonos
 *
 * Gera cores aleatórias ou a partir de paleta pré-definida
 *
 * @example
 * const color = ColorGenerator.random();
 * const paletteColor = ColorGenerator.fromPalette(0);
 */
export class ColorGenerator {
  // Paleta de cores pré-definidas (tons vibrantes e distintos)
  static PALETTE = [
    '#FF6B6B', // Vermelho coral
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul céu
    '#FFA07A', // Salmão
    '#98D8C8', // Verde menta
    '#F06292', // Rosa
    '#AED581', // Verde limão
    '#FFD54F', // Amarelo ouro
    '#4DB6AC', // Verde-azulado
    '#7986CB', // Azul índigo
    '#9575CD', // Roxo
    '#F06292', // Rosa escuro
    '#BA68C8', // Violeta
    '#4FC3F7', // Azul claro
    '#81C784', // Verde
    '#DCE775', // Lima
    '#FFB74D', // Laranja claro
    '#FF8A65', // Laranja coral
    '#A1887F', // Marrom claro
    '#90A4AE'  // Azul acinzentado
  ];

  /**
   * Gera uma cor aleatória da paleta
   * @returns {string} Código hexadecimal da cor
   */
  static random() {
    const randomIndex = Math.floor(Math.random() * this.PALETTE.length);
    return this.PALETTE[randomIndex];
  }

  /**
   * Retorna uma cor da paleta por índice
   * @param {number} index - Índice da cor (faz loop se maior que length)
   * @returns {string} Código hexadecimal da cor
   */
  static fromPalette(index) {
    const adjustedIndex = index % this.PALETTE.length;
    return this.PALETTE[adjustedIndex];
  }

  /**
   * Gera uma cor aleatória completamente aleatória (não da paleta)
   * @returns {string} Código hexadecimal da cor
   */
  static randomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  /**
   * Gera uma cor baseada em um ID (sempre retorna a mesma cor para o mesmo ID)
   * @param {string} id - ID único
   * @returns {string} Código hexadecimal da cor
   */
  static fromId(id) {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % this.PALETTE.length;
    return this.PALETTE[index];
  }

  /**
   * Gera uma cor baseada em status
   * @param {string} status - Status do lote (disponivel, vendido, reservado)
   * @returns {string} Código hexadecimal da cor
   */
  static fromStatus(status) {
    const statusColors = {
      'disponivel': '#4ECDC4',  // Turquesa (disponível)
      'vendido': '#FF6B6B',      // Vermelho (vendido)
      'reservado': '#FFD54F'     // Amarelo (reservado)
    };

    return statusColors[status] || this.random();
  }

  /**
   * Escurece uma cor em uma porcentagem
   * @param {string} color - Cor hexadecimal
   * @param {number} percent - Porcentagem para escurecer (0-100)
   * @returns {string} Cor escurecida
   */
  static darken(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;

    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  /**
   * Clareia uma cor em uma porcentagem
   * @param {string} color - Cor hexadecimal
   * @param {number} percent - Porcentagem para clarear (0-100)
   * @returns {string} Cor clareada
   */
  static lighten(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
      0x1000000 +
      (R < 255 ? R : 255) * 0x10000 +
      (G < 255 ? G : 255) * 0x100 +
      (B < 255 ? B : 255)
    ).toString(16).slice(1);
  }

  /**
   * Converte hex para RGB
   * @param {string} hex - Cor hexadecimal
   * @returns {Object} {r, g, b}
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Converte RGB para hex
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {string} Cor hexadecimal
   */
  static rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Retorna uma cor de contraste (preto ou branco) para texto
   * @param {string} backgroundColor - Cor de fundo hexadecimal
   * @returns {string} '#000000' ou '#FFFFFF'
   */
  static getContrastColor(backgroundColor) {
    const rgb = this.hexToRgb(backgroundColor);

    if (!rgb) {
      return '#000000';
    }

    // Calcula luminância
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
