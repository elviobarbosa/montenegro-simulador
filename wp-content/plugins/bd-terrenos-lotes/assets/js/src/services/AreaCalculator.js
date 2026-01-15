/**
 * AreaCalculator - Cálculo de áreas de polígonos
 *
 * Usa a Google Maps Geometry API para cálculos precisos
 *
 * @example
 * const area = AreaCalculator.calculateArea(polygon);
 * const formatted = AreaCalculator.formatArea(area);
 */
export class AreaCalculator {
  /**
   * Calcula a área de um polígono em metros quadrados
   * @param {google.maps.Polygon} polygon - Polígono do Google Maps
   * @returns {number} Área em m²
   */
  static calculateArea(polygon) {
    if (!polygon || !polygon.getPath) {
      console.error('Polígono inválido para cálculo de área');
      return 0;
    }

    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    return Math.round(area * 100) / 100; // Arredonda para 2 casas decimais
  }

  /**
   * Calcula a área a partir de um array de coordenadas
   * @param {Array<Object>} coordinates - Array de {lat, lng}
   * @returns {number} Área em m²
   */
  static calculateAreaFromCoordinates(coordinates) {
    if (!coordinates || coordinates.length < 3) {
      return 0;
    }

    const path = coordinates.map(coord =>
      new google.maps.LatLng(coord.lat, coord.lng)
    );

    const area = google.maps.geometry.spherical.computeArea(path);
    return Math.round(area * 100) / 100;
  }

  /**
   * Formata área para exibição com separadores de milhar
   * @param {number} area - Área em m²
   * @returns {string} Área formatada (ex: "1.234,56 m²")
   */
  static formatArea(area) {
    if (typeof area !== 'number' || isNaN(area)) {
      return '0 m²';
    }

    const formatted = area.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${formatted} m²`;
  }

  /**
   * Converte m² para hectares
   * @param {number} area - Área em m²
   * @returns {number} Área em hectares
   */
  static toHectares(area) {
    return area / 10000;
  }

  /**
   * Formata área em hectares
   * @param {number} area - Área em m²
   * @returns {string} Área em hectares formatada
   */
  static formatAsHectares(area) {
    const hectares = this.toHectares(area);

    const formatted = hectares.toLocaleString('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });

    return `${formatted} ha`;
  }

  /**
   * Retorna área formatada de forma inteligente (m² ou hectares)
   * @param {number} area - Área em m²
   * @returns {string} Área formatada
   */
  static formatSmart(area) {
    // Se área maior que 10.000 m² (1 hectare), mostra em hectares
    if (area >= 10000) {
      return this.formatAsHectares(area);
    }

    return this.formatArea(area);
  }

  /**
   * Calcula perímetro de um polígono em metros
   * @param {google.maps.Polygon} polygon - Polígono do Google Maps
   * @returns {number} Perímetro em metros
   */
  static calculatePerimeter(polygon) {
    if (!polygon || !polygon.getPath) {
      return 0;
    }

    const path = polygon.getPath();
    let perimeter = 0;

    for (let i = 0; i < path.getLength(); i++) {
      const point1 = path.getAt(i);
      const point2 = path.getAt((i + 1) % path.getLength());

      perimeter += google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    }

    return Math.round(perimeter * 100) / 100;
  }

  /**
   * Calcula perímetro a partir de coordenadas
   * @param {Array<Object>} coordinates - Array de {lat, lng}
   * @returns {number} Perímetro em metros
   */
  static calculatePerimeterFromCoordinates(coordinates) {
    if (!coordinates || coordinates.length < 3) {
      return 0;
    }

    let perimeter = 0;

    for (let i = 0; i < coordinates.length; i++) {
      const point1 = new google.maps.LatLng(coordinates[i].lat, coordinates[i].lng);
      const point2 = new google.maps.LatLng(
        coordinates[(i + 1) % coordinates.length].lat,
        coordinates[(i + 1) % coordinates.length].lng
      );

      perimeter += google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    }

    return Math.round(perimeter * 100) / 100;
  }

  /**
   * Formata perímetro para exibição
   * @param {number} perimeter - Perímetro em metros
   * @returns {string} Perímetro formatado
   */
  static formatPerimeter(perimeter) {
    if (typeof perimeter !== 'number' || isNaN(perimeter)) {
      return '0 m';
    }

    // Se maior que 1000m, mostra em km
    if (perimeter >= 1000) {
      const km = perimeter / 1000;
      return `${km.toFixed(2)} km`;
    }

    return `${perimeter.toFixed(2)} m`;
  }

  /**
   * Calcula área total de múltiplos polígonos
   * @param {Array<google.maps.Polygon>} polygons - Array de polígonos
   * @returns {number} Área total em m²
   */
  static calculateTotalArea(polygons) {
    if (!polygons || !Array.isArray(polygons)) {
      return 0;
    }

    return polygons.reduce((total, polygon) => {
      return total + this.calculateArea(polygon);
    }, 0);
  }

  /**
   * Calcula estatísticas de área para múltiplos polígonos
   * @param {Array<google.maps.Polygon>} polygons - Array de polígonos
   * @returns {Object} {total, average, min, max, count}
   */
  static calculateStatistics(polygons) {
    if (!polygons || !Array.isArray(polygons) || polygons.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        count: 0
      };
    }

    const areas = polygons.map(p => this.calculateArea(p));

    return {
      total: areas.reduce((sum, area) => sum + area, 0),
      average: areas.reduce((sum, area) => sum + area, 0) / areas.length,
      min: Math.min(...areas),
      max: Math.max(...areas),
      count: areas.length
    };
  }
}
