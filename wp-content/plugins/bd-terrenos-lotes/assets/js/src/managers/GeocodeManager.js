/**
 * GeocodeManager - Gerencia busca de endereços e coordenadas
 *
 * Responsável por:
 * - Geocoding (endereço → coordenadas)
 * - Reverse geocoding (coordenadas → endereço)
 * - Geolocalização do dispositivo
 * - Busca por coordenadas diretas
 *
 * @example
 * const geocodeManager = new GeocodeManager(geocoder, eventBus);
 * await geocodeManager.searchAddress('Fortaleza, CE');
 * await geocodeManager.reverseGeocode(-3.7319, -38.5267);
 */
export class GeocodeManager {
  constructor(geocoder, eventBus) {
    this.geocoder = geocoder;
    this.eventBus = eventBus;
  }

  /**
   * Busca coordenadas a partir de um endereço
   * @param {string} address - Endereço a buscar
   * @returns {Promise<Object>} {lat, lng, formatted_address}
   */
  async searchAddress(address) {
    if (!address || address.trim() === '') {
      throw new Error('Endereço não pode ser vazio');
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const location = results[0].geometry.location;
          const result = {
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address,
            place_id: results[0].place_id
          };

          this.eventBus.emit('geocode:success', result);

          resolve(result);
        } else {
          const error = new Error(`Geocode falhou: ${status}`);
          this.eventBus.emit('geocode:error', { address, status });
          console.error('Erro ao buscar endereço:', status);

          reject(error);
        }
      });
    });
  }

  /**
   * Busca endereço a partir de coordenadas
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<string>} Endereço formatado
   */
  async reverseGeocode(lat, lng) {
    const latLng = new google.maps.LatLng(lat, lng);

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const address = results[0].formatted_address;

          this.eventBus.emit('reverse_geocode:success', {
            lat,
            lng,
            address
          });

          resolve(address);
        } else {
          const error = new Error(`Reverse geocode falhou: ${status}`);
          this.eventBus.emit('reverse_geocode:error', { lat, lng, status });

          reject(error);
        }
      });
    });
  }

  /**
   * Busca coordenadas a partir de uma string de coordenadas
   * Aceita formatos: "-3.7319, -38.5267" ou "-3.7319,-38.5267"
   * @param {string} coordString - String de coordenadas
   * @returns {Promise<Object>} {lat, lng}
   */
  async searchCoordinates(coordString) {
    const parts = coordString.split(',').map(p => p.trim());

    if (parts.length !== 2) {
      throw new Error('Formato inválido. Use: latitude, longitude');
    }

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Coordenadas inválidas');
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Coordenadas fora dos limites válidos');
    }

    const result = { lat, lng };

    this.eventBus.emit('coordinates:searched', result);

    return result;
  }

  /**
   * Obtém a localização atual do usuário via Geolocation API
   * @returns {Promise<Object>} {lat, lng}
   */
  async getCurrentLocation() {
    if (!navigator.geolocation) {
      throw new Error('Geolocalização não é suportada por este navegador');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          this.eventBus.emit('geolocation:success', result);

          resolve(result);
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização';

          switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout ao obter localização';
            break;
          }

          this.eventBus.emit('geolocation:error', { code: error.code, message: errorMessage });
          console.error(errorMessage, error);

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Busca detalhes de um lugar por Place ID
   * @param {string} placeId - ID do lugar no Google Places
   * @returns {Promise<Object>}
   */
  async getPlaceDetails(placeId) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ placeId: placeId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const location = results[0].geometry.location;
          const result = {
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address,
            place_id: results[0].place_id,
            types: results[0].types
          };

          this.eventBus.emit('place_details:success', result);
          resolve(result);
        } else {
          const error = new Error(`Place details falhou: ${status}`);
          this.eventBus.emit('place_details:error', { placeId, status });
          reject(error);
        }
      });
    });
  }

  /**
   * Valida se uma string parece ser um endereço ou coordenadas
   * @param {string} input - String a validar
   * @returns {Object} {type: 'address'|'coordinates', valid: boolean}
   */
  validateInput(input) {
    if (!input || input.trim() === '') {
      return { type: null, valid: false };
    }

    input = input.trim();

    // Verifica se parece coordenadas (contém vírgula e números)
    const coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
    if (coordPattern.test(input)) {
      return { type: 'coordinates', valid: true };
    }

    // Caso contrário, assume que é endereço
    return { type: 'address', valid: true };
  }

  /**
   * Busca inteligente - detecta automaticamente se é endereço ou coordenadas
   * @param {string} input - Endereço ou coordenadas
   * @returns {Promise<Object>} {lat, lng, address}
   */
  async smartSearch(input) {
    const validation = this.validateInput(input);

    if (!validation.valid) {
      throw new Error('Entrada inválida');
    }

    if (validation.type === 'coordinates') {
      const coords = await this.searchCoordinates(input);
      const address = await this.reverseGeocode(coords.lat, coords.lng);
      return { ...coords, address };
    } else {
      const result = await this.searchAddress(input);
      return {
        lat: result.lat,
        lng: result.lng,
        address: result.formatted_address
      };
    }
  }
}
