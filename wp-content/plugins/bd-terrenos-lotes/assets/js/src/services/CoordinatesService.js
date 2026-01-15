/**
 * CoordinatesService - Conversão e manipulação de coordenadas
 *
 * Métodos estáticos para trabalhar com coordenadas do Google Maps
 *
 * @example
 * const coords = CoordinatesService.pathToArray(polygon.getPath());
 * const path = CoordinatesService.arrayToPath(coords);
 */
export class CoordinatesService {
  /**
   * Converte um Google Maps Path para array de {lat, lng}
   * @param {google.maps.MVCArray} path - Path do polígono
   * @returns {Array<Object>} Array de {lat, lng}
   */
  static pathToArray(path) {
    const coordinates = [];

    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    }

    return coordinates;
  }

  /**
   * Converte array de coordenadas para Google Maps LatLng array
   * @param {Array<Object>} coordinates - Array de {lat, lng}
   * @returns {Array<google.maps.LatLng>}
   */
  static arrayToLatLngArray(coordinates) {
    return coordinates.map(coord =>
      new google.maps.LatLng(coord.lat, coord.lng)
    );
  }

  /**
   * Valida se coordenadas estão dentro dos limites válidos
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean}
   */
  static validateCoordinates(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return false;
    }

    if (isNaN(lat) || isNaN(lng)) {
      return false;
    }

    if (lat < -90 || lat > 90) {
      return false;
    }

    if (lng < -180 || lng > 180) {
      return false;
    }

    return true;
  }

  /**
   * Calcula o centro de um polígono
   * @param {Array<Object>} coordinates - Array de {lat, lng}
   * @returns {Object} {lat, lng}
   */
  static getPolygonCenter(coordinates) {
    if (!coordinates || coordinates.length === 0) {
      return null;
    }

    let latSum = 0;
    let lngSum = 0;

    coordinates.forEach(coord => {
      latSum += coord.lat;
      lngSum += coord.lng;
    });

    return {
      lat: latSum / coordinates.length,
      lng: lngSum / coordinates.length
    };
  }

  /**
   * Calcula bounds (limites) de um conjunto de coordenadas
   * @param {Array<Object>} coordinates - Array de {lat, lng}
   * @returns {google.maps.LatLngBounds}
   */
  static getBounds(coordinates) {
    if (!coordinates || coordinates.length === 0) {
      return null;
    }

    const bounds = new google.maps.LatLngBounds();

    coordinates.forEach(coord => {
      bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
    });

    return bounds;
  }

  /**
   * Formata coordenadas para exibição
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} precision - Casas decimais (padrão: 6)
   * @returns {string} "lat, lng"
   */
  static formatCoordinates(lat, lng, precision = 6) {
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
  }

  /**
   * Calcula a distância entre dois pontos (fórmula de Haversine)
   * @param {Object} point1 - {lat, lng}
   * @param {Object} point2 - {lat, lng}
   * @returns {number} Distância em metros
   */
  static calculateDistance(point1, point2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Simplifica um polígono removendo pontos redundantes
   * @param {Array<Object>} coordinates - Array de {lat, lng}
   * @param {number} tolerance - Tolerância em metros (padrão: 1)
   * @returns {Array<Object>} Coordenadas simplificadas
   */
  static simplifyPolygon(coordinates, tolerance = 1) {
    if (coordinates.length <= 3) {
      return coordinates;
    }

    const simplified = [coordinates[0]];

    for (let i = 1; i < coordinates.length - 1; i++) {
      const distance = this.calculateDistance(
        simplified[simplified.length - 1],
        coordinates[i]
      );

      if (distance >= tolerance) {
        simplified.push(coordinates[i]);
      }
    }

    simplified.push(coordinates[coordinates.length - 1]);

    return simplified;
  }

  /**
   * Verifica se um ponto está dentro de um polígono
   * @param {Object} point - {lat, lng}
   * @param {Array<Object>} polygon - Array de {lat, lng}
   * @returns {boolean}
   */
  static isPointInPolygon(point, polygon) {
    const latLng = new google.maps.LatLng(point.lat, point.lng);
    const polygonPath = new google.maps.Polygon({ paths: polygon });

    return google.maps.geometry.poly.containsLocation(latLng, polygonPath);
  }
}
