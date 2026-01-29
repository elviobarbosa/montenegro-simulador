/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/src/core/EventBus.js"
/*!****************************************!*\
  !*** ./assets/js/src/core/EventBus.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventBus: () => (/* binding */ EventBus)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
 * eventBus.emit('lote:created', { id: 1, nome: 'Lote 1' });
 */
var EventBus = /*#__PURE__*/function () {
  function EventBus() {
    _classCallCheck(this, EventBus);
    this.events = new Map();
  }

  /**
   * Registra um listener para um evento
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função a ser executada
   */
  return _createClass(EventBus, [{
    key: "on",
    value: function on(event, callback) {
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
  }, {
    key: "off",
    value: function off(event, callback) {
      if (!this.events.has(event)) {
        return;
      }
      var callbacks = this.events.get(event);
      var index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }

      // Remove o evento se não houver mais callbacks
      if (callbacks.length === 0) {
        this.events["delete"](event);
      }
    }

    /**
     * Dispara um evento
     * @param {string} event - Nome do evento
     * @param {*} data - Dados a serem passados para os listeners
     */
  }, {
    key: "emit",
    value: function emit(event, data) {
      if (!this.events.has(event)) {
        return;
      }
      var callbacks = this.events.get(event);
      callbacks.forEach(function (callback) {
        try {
          callback(data);
        } catch (error) {
          console.error("Erro ao executar callback do evento \"".concat(event, "\":"), error);
        }
      });
    }

    /**
     * Registra um listener que será executado apenas uma vez
     * @param {string} event - Nome do evento
     * @param {Function} callback - Função a ser executada
     */
  }, {
    key: "once",
    value: function once(event, callback) {
      var _this = this;
      var _onceCallback = function onceCallback(data) {
        callback(data);
        _this.off(event, _onceCallback);
      };
      this.on(event, _onceCallback);
    }

    /**
     * Remove todos os listeners de um evento ou de todos os eventos
     * @param {string} [event] - Nome do evento (opcional)
     */
  }, {
    key: "clear",
    value: function clear() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (event) {
        this.events["delete"](event);
      } else {
        this.events.clear();
      }
    }

    /**
     * Retorna o número de listeners para um evento
     * @param {string} event - Nome do evento
     * @returns {number}
     */
  }, {
    key: "listenerCount",
    value: function listenerCount(event) {
      return this.events.has(event) ? this.events.get(event).length : 0;
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/core/MapManager.js"
/*!******************************************!*\
  !*** ./assets/js/src/core/MapManager.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapManager: () => (/* binding */ MapManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * MapManager - Gerencia a instância e operações do Google Maps
 *
 * Responsável por:
 * - Inicialização do mapa
 * - Controle de zoom e centro
 * - Alternância entre visualizações (satélite/roadmap)
 * - Eventos de clique no mapa
 *
 * @example
 * const mapManager = new MapManager('gmap', stateManager, eventBus);
 * await mapManager.initialize(-3.7319, -38.5267, 18);
 */
var MapManager = /*#__PURE__*/function () {
  function MapManager(elementId, stateManager, eventBus) {
    _classCallCheck(this, MapManager);
    this.elementId = elementId;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.map = null;
    this.geocoder = null;
  }

  /**
   * Inicializa o mapa do Google Maps
   * @param {number} lat - Latitude inicial
   * @param {number} lng - Longitude inicial
   * @param {number} zoom - Nível de zoom inicial
   * @returns {Promise<google.maps.Map>}
   */
  return _createClass(MapManager, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(lat, lng, zoom) {
        var element, mapOptions;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              element = document.getElementById(this.elementId);
              if (element) {
                _context.n = 1;
                break;
              }
              throw new Error("Elemento com ID \"".concat(this.elementId, "\" n\xE3o encontrado"));
            case 1:
              if (!(typeof google === 'undefined' || typeof google.maps === 'undefined')) {
                _context.n = 2;
                break;
              }
              throw new Error('Google Maps API não está carregada');
            case 2:
              mapOptions = {
                center: {
                  lat: lat,
                  lng: lng
                },
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
                gestureHandling: 'greedy'
              };
              this.map = new google.maps.Map(element, mapOptions);
              this.geocoder = new google.maps.Geocoder();

              // Atualiza o estado
              this.stateManager.setState('map', this.map);
              this.stateManager.setMultiple({
                center: {
                  lat: lat,
                  lng: lng
                },
                zoom: zoom,
                currentMapType: 'roadmap'
              });

              // Registra listeners de eventos do mapa
              this.setupMapEventListeners();

              // Emite evento de inicialização
              this.eventBus.emit('map:initialized', {
                lat: lat,
                lng: lng,
                zoom: zoom
              });
              return _context.a(2, this.map);
          }
        }, _callee, this);
      }));
      function initialize(_x, _x2, _x3) {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Configura event listeners do mapa
     * @private
     */
    )
  }, {
    key: "setupMapEventListeners",
    value: function setupMapEventListeners() {
      var _this = this;
      // Atualiza estado quando o zoom muda
      google.maps.event.addListener(this.map, 'zoom_changed', function () {
        var newZoom = _this.map.getZoom();
        _this.stateManager.setState('zoom', newZoom);
        _this.eventBus.emit('map:zoom_changed', newZoom);
      });

      // Atualiza estado quando o centro muda
      google.maps.event.addListener(this.map, 'center_changed', function () {
        var center = _this.map.getCenter();
        var newCenter = {
          lat: center.lat(),
          lng: center.lng()
        };
        _this.stateManager.setState('center', newCenter);
      });

      // Evento de clique no mapa (pode ser usado para fechar info windows)
      google.maps.event.addListener(this.map, 'click', function () {
        _this.eventBus.emit('map:clicked');
      });
    }

    /**
     * Retorna a instância do mapa
     * @returns {google.maps.Map}
     */
  }, {
    key: "getMap",
    value: function getMap() {
      return this.map;
    }

    /**
     * Retorna a instância do geocoder
     * @returns {google.maps.Geocoder}
     */
  }, {
    key: "getGeocoder",
    value: function getGeocoder() {
      return this.geocoder;
    }

    /**
     * Atualiza o centro do mapa
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
  }, {
    key: "updateCenter",
    value: function updateCenter(lat, lng) {
      if (!this.map) {
        return;
      }
      var center = new google.maps.LatLng(lat, lng);
      this.map.setCenter(center);
      this.stateManager.setState('center', {
        lat: lat,
        lng: lng
      });
      this.eventBus.emit('map:center_updated', {
        lat: lat,
        lng: lng
      });
    }

    /**
     * Atualiza o nível de zoom
     * @param {number} level - Nível de zoom (1-20)
     */
  }, {
    key: "updateZoom",
    value: function updateZoom(level) {
      if (!this.map) {
        return;
      }
      var zoomLevel = Math.max(1, Math.min(20, level));
      this.map.setZoom(zoomLevel);
      this.stateManager.setState('zoom', zoomLevel);
    }

    /**
     * Alterna entre visualização satélite e roadmap
     */
  }, {
    key: "toggleMapType",
    value: function toggleMapType() {
      if (!this.map) {
        return;
      }
      var currentType = this.stateManager.getState('currentMapType');
      var newType = currentType === 'roadmap' ? 'satellite' : 'roadmap';
      this.map.setMapTypeId(newType === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP);
      this.stateManager.setState('currentMapType', newType);
      this.eventBus.emit('map:type_changed', newType);
      return newType;
    }

    /**
     * Ajusta o mapa para mostrar todos os polígonos
     * @param {Array<google.maps.Polygon>} polygons - Array de polígonos
     */
  }, {
    key: "fitBounds",
    value: function fitBounds(polygons) {
      if (!this.map || !polygons || polygons.length === 0) {
        return;
      }
      var bounds = new google.maps.LatLngBounds();
      polygons.forEach(function (polygon) {
        var path = polygon.getPath();
        path.forEach(function (latLng) {
          bounds.extend(latLng);
        });
      });
      this.map.fitBounds(bounds);
    }

    /**
     * Ajusta o zoom para mostrar um bounds específico
     * @param {google.maps.LatLngBounds} bounds - Bounds a exibir
     */
  }, {
    key: "fitToBounds",
    value: function fitToBounds(bounds) {
      if (!this.map) {
        return;
      }
      this.map.fitBounds(bounds);
    }

    /**
     * Pan suave para uma localização
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
  }, {
    key: "panTo",
    value: function panTo(lat, lng) {
      if (!this.map) {
        return;
      }
      var position = new google.maps.LatLng(lat, lng);
      this.map.panTo(position);
    }

    /**
     * Limpa todos os overlays do mapa
     */
  }, {
    key: "clearOverlays",
    value: function clearOverlays() {
      // Esta função pode ser expandida conforme necessário
      this.eventBus.emit('map:overlays_cleared');
    }

    /**
     * Destrói o mapa e limpa recursos
     */
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.map) {
        google.maps.event.clearInstanceListeners(this.map);
        this.map = null;
        this.geocoder = null;
        this.stateManager.setState('map', null);
        this.eventBus.emit('map:destroyed');
      }
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/core/StateManager.js"
/*!********************************************!*\
  !*** ./assets/js/src/core/StateManager.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateManager: () => (/* binding */ StateManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * StateManager - Gerenciamento centralizado de estado da aplicação
 *
 * Substitui variáveis globais descontroladas por um estado centralizado e reativo.
 * Implementa o padrão Observer para notificar mudanças de estado.
 *
 * @example
 * const stateManager = new StateManager();
 * stateManager.setState('map', mapInstance);
 */
var StateManager = /*#__PURE__*/function () {
  function StateManager() {
    _classCallCheck(this, StateManager);
    this.state = {
      map: null,
      drawingManager: null,
      polygons: new Map(),
      lotesData: [],
      isDrawingMode: false,
      currentMapType: 'roadmap',
      currentPolygon: null,
      currentInfoWindow: null,
      currentEditLoteId: null,
      zoom: 18,
      center: {
        lat: -3.7319,
        lng: -38.5267
      }
    };
    this.subscribers = new Map();
  }

  /**
   * Define um valor no estado
   * @param {string} key - Chave do estado
   * @param {*} value - Novo valor
   */
  return _createClass(StateManager, [{
    key: "setState",
    value: function setState(key, value) {
      var oldValue = this.state[key];
      this.state[key] = value;

      // Notifica subscribers apenas se o valor mudou
      if (oldValue !== value) {
        this.notifySubscribers(key, value, oldValue);
      }
    }

    /**
     * Retorna um valor do estado
     * @param {string} key - Chave do estado
     * @returns {*}
     */
  }, {
    key: "getState",
    value: function getState(key) {
      return this.state[key];
    }

    /**
     * Retorna todo o estado (cópia)
     * @returns {Object}
     */
  }, {
    key: "getAllState",
    value: function getAllState() {
      return _objectSpread({}, this.state);
    }

    /**
     * Registra um subscriber para mudanças em uma chave específica
     * @param {string} key - Chave do estado a observar
     * @param {Function} callback - Função a ser executada quando o estado mudar
     */
  }, {
    key: "subscribe",
    value: function subscribe(key, callback) {
      if (!this.subscribers.has(key)) {
        this.subscribers.set(key, []);
      }
      this.subscribers.get(key).push(callback);
    }

    /**
     * Remove um subscriber
     * @param {string} key - Chave do estado
     * @param {Function} callback - Função a ser removida
     */
  }, {
    key: "unsubscribe",
    value: function unsubscribe(key, callback) {
      if (!this.subscribers.has(key)) {
        return;
      }
      var callbacks = this.subscribers.get(key);
      var index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }

    /**
     * Notifica todos os subscribers de uma chave
     * @private
     * @param {string} key - Chave do estado
     * @param {*} newValue - Novo valor
     * @param {*} oldValue - Valor anterior
     */
  }, {
    key: "notifySubscribers",
    value: function notifySubscribers(key, newValue, oldValue) {
      if (!this.subscribers.has(key)) {
        return;
      }
      var callbacks = this.subscribers.get(key);
      callbacks.forEach(function (callback) {
        try {
          callback(newValue, oldValue);
        } catch (error) {
          console.error("Erro ao executar subscriber da chave \"".concat(key, "\":"), error);
        }
      });
    }

    /**
     * Atualiza múltiplas chaves do estado de uma vez
     * @param {Object} updates - Objeto com as chaves e valores a atualizar
     */
  }, {
    key: "setMultiple",
    value: function setMultiple(updates) {
      var _this = this;
      Object.keys(updates).forEach(function (key) {
        _this.setState(key, updates[key]);
      });
    }

    /**
     * Reseta o estado para os valores iniciais
     */
  }, {
    key: "reset",
    value: function reset() {
      this.state = {
        map: null,
        drawingManager: null,
        polygons: new Map(),
        lotesData: [],
        isDrawingMode: false,
        currentMapType: 'roadmap',
        currentPolygon: null,
        currentInfoWindow: null,
        currentEditLoteId: null,
        zoom: 18,
        center: {
          lat: -3.7319,
          lng: -38.5267
        }
      };
    }

    /**
     * Adiciona um polígono ao Map de polígonos
     * @param {string} loteId - ID do lote
     * @param {google.maps.Polygon} polygon - Instância do polígono
     */
  }, {
    key: "addPolygon",
    value: function addPolygon(loteId, polygon) {
      this.state.polygons.set(loteId, polygon);
    }

    /**
     * Remove um polígono do Map de polígonos
     * @param {string} loteId - ID do lote
     */
  }, {
    key: "removePolygon",
    value: function removePolygon(loteId) {
      this.state.polygons["delete"](loteId);
    }

    /**
     * Retorna um polígono pelo ID do lote
     * @param {string} loteId - ID do lote
     * @returns {google.maps.Polygon|undefined}
     */
  }, {
    key: "getPolygon",
    value: function getPolygon(loteId) {
      return this.state.polygons.get(loteId);
    }

    /**
     * Adiciona um lote ao array de lotes
     * @param {Object} lote - Dados do lote
     */
  }, {
    key: "addLote",
    value: function addLote(lote) {
      this.state.lotesData.push(lote);
    }

    /**
     * Atualiza um lote existente
     * @param {string} loteId - ID do lote
     * @param {Object} updates - Dados a atualizar
     */
  }, {
    key: "updateLote",
    value: function updateLote(loteId, updates) {
      var index = this.state.lotesData.findIndex(function (l) {
        return l.id === loteId;
      });
      if (index > -1) {
        this.state.lotesData[index] = _objectSpread(_objectSpread({}, this.state.lotesData[index]), updates);
      }
    }

    /**
     * Remove um lote do array de lotes
     * @param {string} loteId - ID do lote
     */
  }, {
    key: "removeLote",
    value: function removeLote(loteId) {
      this.state.lotesData = this.state.lotesData.filter(function (l) {
        return l.id !== loteId;
      });
    }

    /**
     * Retorna um lote pelo ID
     * @param {string} loteId - ID do lote
     * @returns {Object|undefined}
     */
  }, {
    key: "getLote",
    value: function getLote(loteId) {
      return this.state.lotesData.find(function (l) {
        return l.id === loteId;
      });
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/managers/DataPersistence.js"
/*!***************************************************!*\
  !*** ./assets/js/src/managers/DataPersistence.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataPersistence: () => (/* binding */ DataPersistence)
/* harmony export */ });
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * DataPersistence - Gerencia a persistência de dados no WordPress
 *
 * Responsável por:
 * - Salvar dados dos lotes em hidden field
 * - Carregar dados salvos
 * - Validação de JSON
 * - Sincronização com o estado
 *
 * @example
 * const persistence = new DataPersistence('terreno_lotes_data', stateManager, eventBus);
 * persistence.load();
 * persistence.save();
 */
var DataPersistence = /*#__PURE__*/function () {
  function DataPersistence(fieldId, stateManager, eventBus) {
    _classCallCheck(this, DataPersistence);
    this.fieldId = fieldId;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.field = null;
  }

  /**
   * Inicializa e valida o campo hidden
   * @returns {boolean}
   */
  return _createClass(DataPersistence, [{
    key: "initialize",
    value: function initialize() {
      this.field = document.getElementById(this.fieldId);
      if (!this.field) {
        console.error("Campo hidden com ID \"".concat(this.fieldId, "\" n\xE3o encontrado"));
        return false;
      }
      return true;
    }

    /**
     * Carrega os dados salvos do hidden field
     * @returns {Array<Object>} Array de lotes carregados
     */
  }, {
    key: "load",
    value: function load() {
      var _this = this;
      if (!this.initialize()) {
        return [];
      }
      var rawData = this.field.value;
      if (!rawData || rawData.trim() === '') {
        return [];
      }
      try {
        var lotesData = JSON.parse(rawData);
        if (!Array.isArray(lotesData)) {
          console.error('Dados de lotes inválidos: esperado array');
          return [];
        }

        // Valida cada lote
        var validLotes = lotesData.filter(function (lote) {
          return _this.validateLote(lote);
        });

        // Atualiza o estado
        this.stateManager.setState('lotesData', validLotes);
        this.eventBus.emit('data:loaded', validLotes);
        return validLotes;
      } catch (error) {
        console.error('Erro ao fazer parse dos dados de lotes:', error);
        console.error('Dados problemáticos:', rawData.substring(0, 200));
        return [];
      }
    }

    /**
     * Salva os dados dos lotes no hidden field
     * @returns {boolean} Sucesso da operação
     */
  }, {
    key: "save",
    value: function save() {
      if (!this.initialize()) {
        return false;
      }
      var lotesData = this.stateManager.getState('lotesData');
      try {
        var jsonData = JSON.stringify(lotesData);
        this.field.value = jsonData;
        this.eventBus.emit('data:saved', lotesData);
        return true;
      } catch (error) {
        console.error('Erro ao serializar dados de lotes:', error);
        return false;
      }
    }

    /**
     * Valida a estrutura de um lote
     * @param {Object} lote - Dados do lote
     * @returns {boolean}
     */
  }, {
    key: "validateLote",
    value: function validateLote(lote) {
      if (!lote || _typeof(lote) !== 'object') {
        return false;
      }

      // Campos obrigatórios
      var requiredFields = ['id', 'coordinates'];
      for (var _i = 0, _requiredFields = requiredFields; _i < _requiredFields.length; _i++) {
        var field = _requiredFields[_i];
        if (!(field in lote)) {
          return false;
        }
      }

      // Valida coordinates
      if (!Array.isArray(lote.coordinates) || lote.coordinates.length < 3) {
        return false;
      }

      // Valida cada coordenada
      var _iterator = _createForOfIteratorHelper(lote.coordinates),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var coord = _step.value;
          if (typeof coord.lat !== 'number' || typeof coord.lng !== 'number') {
            return false;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return true;
    }

    /**
     * Adiciona um lote e salva automaticamente
     * @param {Object} lote - Dados do lote
     * @returns {boolean}
     */
  }, {
    key: "addLote",
    value: function addLote(lote) {
      if (!this.validateLote(lote)) {
        console.error('Lote inválido, não será adicionado');
        return false;
      }
      this.stateManager.addLote(lote);
      return this.save();
    }

    /**
     * Atualiza um lote e salva automaticamente
     * @param {string} loteId - ID do lote
     * @param {Object} updates - Dados a atualizar
     * @returns {boolean}
     */
  }, {
    key: "updateLote",
    value: function updateLote(loteId, updates) {
      this.stateManager.updateLote(loteId, updates);
      return this.save();
    }

    /**
     * Remove um lote e salva automaticamente
     * @param {string} loteId - ID do lote
     * @returns {boolean}
     */
  }, {
    key: "removeLote",
    value: function removeLote(loteId) {
      this.stateManager.removeLote(loteId);
      return this.save();
    }

    /**
     * Limpa todos os lotes
     * @returns {boolean}
     */
  }, {
    key: "clearAll",
    value: function clearAll() {
      this.stateManager.setState('lotesData', []);
      return this.save();
    }

    /**
     * Exporta os dados como JSON string formatado
     * @returns {string}
     */
  }, {
    key: "exportJSON",
    value: function exportJSON() {
      var lotesData = this.stateManager.getState('lotesData');
      return JSON.stringify(lotesData, null, 2);
    }

    /**
     * Importa dados de um JSON string
     * @param {string} jsonString - JSON a importar
     * @returns {boolean}
     */
  }, {
    key: "importJSON",
    value: function importJSON(jsonString) {
      var _this2 = this;
      try {
        var lotesData = JSON.parse(jsonString);
        if (!Array.isArray(lotesData)) {
          throw new Error('Dados devem ser um array');
        }
        var validLotes = lotesData.filter(function (lote) {
          return _this2.validateLote(lote);
        });
        this.stateManager.setState('lotesData', validLotes);
        return this.save();
      } catch (error) {
        console.error('Erro ao importar JSON:', error);
        return false;
      }
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/managers/GeocodeManager.js"
/*!**************************************************!*\
  !*** ./assets/js/src/managers/GeocodeManager.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GeocodeManager: () => (/* binding */ GeocodeManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var GeocodeManager = /*#__PURE__*/function () {
  function GeocodeManager(geocoder, eventBus) {
    _classCallCheck(this, GeocodeManager);
    this.geocoder = geocoder;
    this.eventBus = eventBus;
  }

  /**
   * Busca coordenadas a partir de um endereço
   * @param {string} address - Endereço a buscar
   * @returns {Promise<Object>} {lat, lng, formatted_address}
   */
  return _createClass(GeocodeManager, [{
    key: "searchAddress",
    value: (function () {
      var _searchAddress = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(address) {
        var _this = this;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!(!address || address.trim() === '')) {
                _context.n = 1;
                break;
              }
              throw new Error('Endereço não pode ser vazio');
            case 1:
              return _context.a(2, new Promise(function (resolve, reject) {
                _this.geocoder.geocode({
                  address: address
                }, function (results, status) {
                  if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    var location = results[0].geometry.location;
                    var result = {
                      lat: location.lat(),
                      lng: location.lng(),
                      formatted_address: results[0].formatted_address,
                      place_id: results[0].place_id
                    };
                    _this.eventBus.emit('geocode:success', result);
                    resolve(result);
                  } else {
                    var error = new Error("Geocode falhou: ".concat(status));
                    _this.eventBus.emit('geocode:error', {
                      address: address,
                      status: status
                    });
                    console.error('Erro ao buscar endereço:', status);
                    reject(error);
                  }
                });
              }));
          }
        }, _callee);
      }));
      function searchAddress(_x) {
        return _searchAddress.apply(this, arguments);
      }
      return searchAddress;
    }()
    /**
     * Busca endereço a partir de coordenadas
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {Promise<string>} Endereço formatado
     */
    )
  }, {
    key: "reverseGeocode",
    value: (function () {
      var _reverseGeocode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(lat, lng) {
        var _this2 = this;
        var latLng;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              latLng = new google.maps.LatLng(lat, lng);
              return _context2.a(2, new Promise(function (resolve, reject) {
                _this2.geocoder.geocode({
                  location: latLng
                }, function (results, status) {
                  if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    var address = results[0].formatted_address;
                    _this2.eventBus.emit('reverse_geocode:success', {
                      lat: lat,
                      lng: lng,
                      address: address
                    });
                    resolve(address);
                  } else {
                    var error = new Error("Reverse geocode falhou: ".concat(status));
                    _this2.eventBus.emit('reverse_geocode:error', {
                      lat: lat,
                      lng: lng,
                      status: status
                    });
                    reject(error);
                  }
                });
              }));
          }
        }, _callee2);
      }));
      function reverseGeocode(_x2, _x3) {
        return _reverseGeocode.apply(this, arguments);
      }
      return reverseGeocode;
    }()
    /**
     * Busca coordenadas a partir de uma string de coordenadas
     * Aceita formatos: "-3.7319, -38.5267" ou "-3.7319,-38.5267"
     * @param {string} coordString - String de coordenadas
     * @returns {Promise<Object>} {lat, lng}
     */
    )
  }, {
    key: "searchCoordinates",
    value: (function () {
      var _searchCoordinates = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(coordString) {
        var parts, lat, lng, result;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              parts = coordString.split(',').map(function (p) {
                return p.trim();
              });
              if (!(parts.length !== 2)) {
                _context3.n = 1;
                break;
              }
              throw new Error('Formato inválido. Use: latitude, longitude');
            case 1:
              lat = parseFloat(parts[0]);
              lng = parseFloat(parts[1]);
              if (!(isNaN(lat) || isNaN(lng))) {
                _context3.n = 2;
                break;
              }
              throw new Error('Coordenadas inválidas');
            case 2:
              if (!(lat < -90 || lat > 90 || lng < -180 || lng > 180)) {
                _context3.n = 3;
                break;
              }
              throw new Error('Coordenadas fora dos limites válidos');
            case 3:
              result = {
                lat: lat,
                lng: lng
              };
              this.eventBus.emit('coordinates:searched', result);
              return _context3.a(2, result);
          }
        }, _callee3, this);
      }));
      function searchCoordinates(_x4) {
        return _searchCoordinates.apply(this, arguments);
      }
      return searchCoordinates;
    }()
    /**
     * Obtém a localização atual do usuário via Geolocation API
     * @returns {Promise<Object>} {lat, lng}
     */
    )
  }, {
    key: "getCurrentLocation",
    value: (function () {
      var _getCurrentLocation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _this3 = this;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              if (navigator.geolocation) {
                _context4.n = 1;
                break;
              }
              throw new Error('Geolocalização não é suportada por este navegador');
            case 1:
              return _context4.a(2, new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(function (position) {
                  var result = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                  };
                  _this3.eventBus.emit('geolocation:success', result);
                  resolve(result);
                }, function (error) {
                  var errorMessage = 'Erro ao obter localização';
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
                  _this3.eventBus.emit('geolocation:error', {
                    code: error.code,
                    message: errorMessage
                  });
                  console.error(errorMessage, error);
                  reject(new Error(errorMessage));
                }, {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0
                });
              }));
          }
        }, _callee4);
      }));
      function getCurrentLocation() {
        return _getCurrentLocation.apply(this, arguments);
      }
      return getCurrentLocation;
    }()
    /**
     * Busca detalhes de um lugar por Place ID
     * @param {string} placeId - ID do lugar no Google Places
     * @returns {Promise<Object>}
     */
    )
  }, {
    key: "getPlaceDetails",
    value: (function () {
      var _getPlaceDetails = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(placeId) {
        var _this4 = this;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              return _context5.a(2, new Promise(function (resolve, reject) {
                _this4.geocoder.geocode({
                  placeId: placeId
                }, function (results, status) {
                  if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    var location = results[0].geometry.location;
                    var result = {
                      lat: location.lat(),
                      lng: location.lng(),
                      formatted_address: results[0].formatted_address,
                      place_id: results[0].place_id,
                      types: results[0].types
                    };
                    _this4.eventBus.emit('place_details:success', result);
                    resolve(result);
                  } else {
                    var error = new Error("Place details falhou: ".concat(status));
                    _this4.eventBus.emit('place_details:error', {
                      placeId: placeId,
                      status: status
                    });
                    reject(error);
                  }
                });
              }));
          }
        }, _callee5);
      }));
      function getPlaceDetails(_x5) {
        return _getPlaceDetails.apply(this, arguments);
      }
      return getPlaceDetails;
    }()
    /**
     * Valida se uma string parece ser um endereço ou coordenadas
     * @param {string} input - String a validar
     * @returns {Object} {type: 'address'|'coordinates', valid: boolean}
     */
    )
  }, {
    key: "validateInput",
    value: function validateInput(input) {
      if (!input || input.trim() === '') {
        return {
          type: null,
          valid: false
        };
      }
      input = input.trim();

      // Verifica se parece coordenadas (contém vírgula e números)
      var coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
      if (coordPattern.test(input)) {
        return {
          type: 'coordinates',
          valid: true
        };
      }

      // Caso contrário, assume que é endereço
      return {
        type: 'address',
        valid: true
      };
    }

    /**
     * Busca inteligente - detecta automaticamente se é endereço ou coordenadas
     * @param {string} input - Endereço ou coordenadas
     * @returns {Promise<Object>} {lat, lng, address}
     */
  }, {
    key: "smartSearch",
    value: (function () {
      var _smartSearch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(input) {
        var validation, coords, address, result;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              validation = this.validateInput(input);
              if (validation.valid) {
                _context6.n = 1;
                break;
              }
              throw new Error('Entrada inválida');
            case 1:
              if (!(validation.type === 'coordinates')) {
                _context6.n = 4;
                break;
              }
              _context6.n = 2;
              return this.searchCoordinates(input);
            case 2:
              coords = _context6.v;
              _context6.n = 3;
              return this.reverseGeocode(coords.lat, coords.lng);
            case 3:
              address = _context6.v;
              return _context6.a(2, _objectSpread(_objectSpread({}, coords), {}, {
                address: address
              }));
            case 4:
              _context6.n = 5;
              return this.searchAddress(input);
            case 5:
              result = _context6.v;
              return _context6.a(2, {
                lat: result.lat,
                lng: result.lng,
                address: result.formatted_address
              });
            case 6:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function smartSearch(_x6) {
        return _smartSearch.apply(this, arguments);
      }
      return smartSearch;
    }())
  }]);
}();

/***/ },

/***/ "./assets/js/src/managers/ImageOverlayManager.js"
/*!*******************************************************!*\
  !*** ./assets/js/src/managers/ImageOverlayManager.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageOverlayManager: () => (/* binding */ ImageOverlayManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ImageOverlayManager - Gerencia overlay de planta humanizada no mapa
 *
 * Permite:
 * - Upload de imagem via Media Library do WordPress
 * - Posicionamento (drag) no mapa
 * - Redimensionamento (resize)
 * - Rotação
 * - Ajuste de opacidade
 *
 * A imagem fica ABAIXO dos polígonos de lotes usando panes.overlayLayer
 */
var ImageOverlayManager = /*#__PURE__*/function () {
  function ImageOverlayManager(map, stateManager, eventBus) {
    _classCallCheck(this, ImageOverlayManager);
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;

    // Estado do overlay
    this.imageUrl = null;
    this.overlay = {
      bounds: null,
      rotation: 0,
      opacity: 0.7,
      center: null
    };

    // Google Maps Custom Overlay
    this.customOverlay = null;

    // Estado de interação
    this.isControlsVisible = false;

    // Elementos DOM
    this.controlPanel = null;
    this.init();
  }

  /**
   * Inicializa os event listeners
   */
  return _createClass(ImageOverlayManager, [{
    key: "init",
    value: function init() {
      var _this = this;
      // Botão de importar imagem
      var btnImportar = document.getElementById('btn_importar_planta');
      if (btnImportar) {
        btnImportar.addEventListener('click', function (e) {
          e.preventDefault();
          _this.openMediaLibrary();
        });
      } else {
        // Tenta novamente após um delay (DOM pode não estar pronto)
        setTimeout(function () {
          var btn = document.getElementById('btn_importar_planta');
          if (btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault();
              _this.openMediaLibrary();
            });
          }
        }, 500);
      }

      // Botão de remover imagem
      var btnRemover = document.getElementById('btn_remover_planta');
      if (btnRemover) {
        btnRemover.addEventListener('click', function () {
          return _this.removeOverlay();
        });
      }

      // Botão de ajustar posição
      var btnAjustar = document.getElementById('btn_ajustar_planta');
      if (btnAjustar) {
        btnAjustar.addEventListener('click', function (e) {
          e.preventDefault();
          _this.toggleEditMode();
        });
      } else {
        setTimeout(function () {
          var btn = document.getElementById('btn_ajustar_planta');
          if (btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault();
              _this.toggleEditMode();
            });
          }
        }, 500);
      }

      // Cria painel de controles
      this.createControlPanel();
    }

    /**
     * Alterna modo de edição (mostra/esconde controles)
     */
  }, {
    key: "toggleEditMode",
    value: function toggleEditMode() {
      if (!this.imageUrl) {
        alert('Nenhuma imagem carregada. Selecione uma imagem primeiro.');
        return;
      }
      if (this.isControlsVisible) {
        this.hideControls();
      } else {
        this.showControls();
      }
    }

    /**
     * Cria o painel de controles para a imagem
     */
  }, {
    key: "createControlPanel",
    value: function createControlPanel() {
      this.controlPanel = document.createElement('div');
      this.controlPanel.id = 'imageOverlayControls';
      this.controlPanel.innerHTML = "\n      <div class=\"image-overlay-header\">\n        <span>Ajustar Planta Humanizada</span>\n        <button type=\"button\" id=\"imageControlsClose\" title=\"Fechar\">&times;</button>\n      </div>\n      <div class=\"image-overlay-content\">\n        <!-- Instru\xE7\xF5es -->\n        <div style=\"background: #e7f5ff; border: 1px solid #28a745; border-radius: 4px; padding: 10px; margin-bottom: 15px;\">\n          <h4 style=\"margin: 0 0 8px 0; color: #28a745; font-size: 13px;\">\n            <span class=\"dashicons dashicons-info\" style=\"margin-right: 5px;\"></span>\n            Como posicionar\n          </h4>\n          <ul style=\"margin: 0; padding-left: 18px; font-size: 12px; color: #333;\">\n            <li><strong>Arrastar:</strong> Clique e arraste para mover</li>\n            <li><strong>Redimensionar:</strong> Arraste os cantos</li>\n            <li><strong>Rotacionar:</strong> Use o slider abaixo</li>\n          </ul>\n        </div>\n\n        <div class=\"image-overlay-preview\">\n          <img id=\"imageOverlayPreview\" src=\"\" alt=\"Preview\" />\n        </div>\n        <div class=\"image-overlay-controls\">\n          <h4 style=\"margin: 0 0 12px 0; font-size: 13px;\">Controles</h4>\n          <div class=\"control-group\">\n            <label>Rota\xE7\xE3o: <span id=\"imageRotationValue\">0\xB0</span></label>\n            <div class=\"rotation-controls\">\n              <button type=\"button\" class=\"button button-small\" id=\"imageRotateLeft\" title=\"-1\xB0\">&#8634;</button>\n              <input type=\"range\" id=\"imageRotationSlider\" min=\"-180\" max=\"180\" value=\"0\" />\n              <button type=\"button\" class=\"button button-small\" id=\"imageRotateRight\" title=\"+1\xB0\">&#8635;</button>\n            </div>\n          </div>\n          <div class=\"control-group\">\n            <label>Opacidade</label>\n            <input type=\"range\" id=\"imageOpacitySlider\" min=\"10\" max=\"100\" value=\"70\" />\n          </div>\n          <div class=\"control-group\">\n            <div class=\"scale-controls\">\n              <button type=\"button\" class=\"button button-small\" id=\"imageZoomOut\" title=\"Diminuir\">\n                <span class=\"dashicons dashicons-minus\" style=\"font-size: 16px;\"></span>\n              </button>\n              <button type=\"button\" class=\"button button-small\" id=\"imageZoomIn\" title=\"Aumentar\">\n                <span class=\"dashicons dashicons-plus\" style=\"font-size: 16px;\"></span>\n              </button>\n              <button type=\"button\" class=\"button button-small\" id=\"imageResetScale\" title=\"Resetar\">\n                <span class=\"dashicons dashicons-image-rotate\" style=\"font-size: 16px;\"></span> Resetar\n              </button>\n            </div>\n          </div>\n        </div>\n\n        <!-- Dica -->\n        <div style=\"background: #fff8e5; border: 1px solid #f0c36d; border-radius: 4px; padding: 8px; margin-bottom: 15px; font-size: 11px;\">\n          <strong>Dica:</strong> Alinhe com as ruas no sat\xE9lite.\n        </div>\n\n        <div class=\"image-overlay-actions\">\n          <button type=\"button\" id=\"imageRemoveBtn\" class=\"button\">Remover Imagem</button>\n          <button type=\"button\" id=\"imageSaveBtn\" class=\"button button-primary\">Salvar Ajustes</button>\n        </div>\n      </div>\n    ";
      this.addControlPanelStyles();

      // Insere o painel no mesmo local que o modal do SVG (antes do #terreno-mapa-container)
      var terrenoContainer = document.getElementById('terreno-mapa-container');
      if (terrenoContainer && terrenoContainer.parentNode) {
        terrenoContainer.parentNode.insertBefore(this.controlPanel, terrenoContainer);
      } else {
        document.body.appendChild(this.controlPanel);
      }

      // Event listeners do painel
      this.setupControlListeners();
    }

    /**
     * Adiciona estilos CSS do painel de controle
     */
  }, {
    key: "addControlPanelStyles",
    value: function addControlPanelStyles() {
      if (document.getElementById('imageOverlayStyles')) return;
      var style = document.createElement('style');
      style.id = 'imageOverlayStyles';
      style.textContent = "\n      #imageOverlayControls {\n        position: fixed;\n        top: 32px;\n        right: 0;\n        width: 320px;\n        height: calc(100vh - 32px);\n        background: #fff;\n        border-left: 1px solid #ddd;\n        box-shadow: -4px 0 20px rgba(0,0,0,0.2);\n        z-index: 9999;\n        overflow-y: auto;\n        font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n        display: none;\n      }\n      #imageOverlayControls.active {\n        display: block;\n      }\n      .image-overlay-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        padding: 15px 20px;\n        border-bottom: 1px solid #ddd;\n        background: #fff;\n      }\n      .image-overlay-header span {\n        margin: 0;\n        color: #23282d;\n        font-size: 16px;\n        font-weight: 600;\n      }\n      .image-overlay-header button {\n        background: none;\n        border: 1px solid #ccc;\n        color: #666;\n        font-size: 18px;\n        cursor: pointer;\n        padding: 0 8px;\n        line-height: 1.5;\n        border-radius: 3px;\n      }\n      .image-overlay-header button:hover {\n        background: #f0f0f0;\n      }\n      .image-overlay-content {\n        padding: 20px;\n      }\n      .image-overlay-preview {\n        margin-bottom: 15px;\n        text-align: center;\n      }\n      .image-overlay-preview img {\n        max-width: 100%;\n        max-height: 120px;\n        border: 1px solid #ddd;\n        border-radius: 4px;\n      }\n      .image-overlay-controls {\n        background: #f5f5f5;\n        padding: 12px;\n        border-radius: 4px;\n        margin-bottom: 15px;\n      }\n      .image-overlay-controls .control-group {\n        margin-bottom: 12px;\n      }\n      .image-overlay-controls .control-group:last-child {\n        margin-bottom: 0;\n      }\n      .image-overlay-controls label {\n        display: block;\n        margin-bottom: 4px;\n        font-weight: 600;\n        font-size: 12px;\n        color: #333;\n      }\n      .image-overlay-controls input[type=\"range\"] {\n        width: 100%;\n        margin: 0;\n      }\n      .image-overlay-controls span {\n        display: inline;\n        font-size: 12px;\n        color: #666;\n      }\n      .rotation-controls, .scale-controls {\n        display: flex;\n        gap: 6px;\n        align-items: center;\n      }\n      .rotation-controls input[type=\"range\"] {\n        flex: 1;\n      }\n      .rotation-controls button, .scale-controls button {\n        padding: 5px 10px;\n        font-size: 14px;\n        cursor: pointer;\n        border: 1px solid #ccc;\n        background: #f7f7f7;\n        border-radius: 3px;\n      }\n      .rotation-controls button:hover, .scale-controls button:hover {\n        background: #e5e5e5;\n      }\n      .scale-controls button:last-child {\n        flex: 1;\n      }\n      .image-overlay-actions {\n        display: flex;\n        gap: 8px;\n        justify-content: flex-end;\n        border-top: 1px solid #ddd;\n        padding-top: 15px;\n        margin-top: 10px;\n      }\n      .image-overlay-actions button {\n        padding: 8px 12px;\n        cursor: pointer;\n      }\n      #imageRemoveBtn {\n        background: #dc3545;\n        color: #fff;\n        border-color: #dc3545;\n      }\n      #imageRemoveBtn:hover {\n        background: #c82333;\n      }\n    ";
      document.head.appendChild(style);
    }

    /**
     * Configura event listeners do painel de controle
     */
  }, {
    key: "setupControlListeners",
    value: function setupControlListeners() {
      var _document$getElementB,
        _this2 = this,
        _document$getElementB2,
        _document$getElementB3,
        _document$getElementB4,
        _document$getElementB5,
        _document$getElementB6,
        _document$getElementB7,
        _document$getElementB8,
        _document$getElementB9,
        _document$getElementB0;
      // Fechar painel
      (_document$getElementB = document.getElementById('imageControlsClose')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', function () {
        _this2.hideControls();
      });

      // Opacidade
      (_document$getElementB2 = document.getElementById('imageOpacitySlider')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('input', function (e) {
        var opacity = e.target.value / 100;
        _this2.setOverlayOpacity(opacity);
        document.getElementById('imageOpacityValue').textContent = "".concat(e.target.value, "%");
      });

      // Rotacao
      (_document$getElementB3 = document.getElementById('imageRotationSlider')) === null || _document$getElementB3 === void 0 || _document$getElementB3.addEventListener('input', function (e) {
        _this2.setRotation(parseFloat(e.target.value));
        document.getElementById('imageRotationValue').textContent = "".concat(e.target.value, "\xB0");
      });
      (_document$getElementB4 = document.getElementById('imageRotateLeft')) === null || _document$getElementB4 === void 0 || _document$getElementB4.addEventListener('click', function () {
        _this2.rotateOverlay(-1);
      });
      (_document$getElementB5 = document.getElementById('imageRotateRight')) === null || _document$getElementB5 === void 0 || _document$getElementB5.addEventListener('click', function () {
        _this2.rotateOverlay(1);
      });

      // Escala
      (_document$getElementB6 = document.getElementById('imageZoomIn')) === null || _document$getElementB6 === void 0 || _document$getElementB6.addEventListener('click', function () {
        _this2.scaleOverlay(1.01);
      });
      (_document$getElementB7 = document.getElementById('imageZoomOut')) === null || _document$getElementB7 === void 0 || _document$getElementB7.addEventListener('click', function () {
        _this2.scaleOverlay(0.99);
      });
      (_document$getElementB8 = document.getElementById('imageResetScale')) === null || _document$getElementB8 === void 0 || _document$getElementB8.addEventListener('click', function () {
        _this2.resetTransform();
      });

      // Remover
      (_document$getElementB9 = document.getElementById('imageRemoveBtn')) === null || _document$getElementB9 === void 0 || _document$getElementB9.addEventListener('click', function () {
        _this2.removeOverlay();
      });

      // Salvar e fechar
      (_document$getElementB0 = document.getElementById('imageSaveBtn')) === null || _document$getElementB0 === void 0 || _document$getElementB0.addEventListener('click', function () {
        _this2.updateHiddenInputs();
        _this2.hideControls();
      });
    }

    /**
     * Abre a Media Library do WordPress
     */
  }, {
    key: "openMediaLibrary",
    value: function openMediaLibrary() {
      var _this3 = this;
      if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
        alert('Media Library nao disponivel. Recarregue a pagina.');
        return;
      }
      var frame = wp.media({
        title: 'Selecionar Planta Humanizada',
        button: {
          text: 'Usar esta imagem'
        },
        multiple: false,
        library: {
          type: 'image'
        }
      });
      frame.on('select', function () {
        var attachment = frame.state().get('selection').first().toJSON();
        _this3.handleImageSelect(attachment.url);
      });
      frame.open();
    }

    /**
     * Processa a imagem selecionada
     */
  }, {
    key: "handleImageSelect",
    value: function handleImageSelect(imageUrl) {
      this.imageUrl = imageUrl;

      // Atualiza preview
      var preview = document.getElementById('imageOverlayPreview');
      if (preview) {
        preview.src = imageUrl;
      }

      // Cria overlay no mapa
      this.createMapOverlay();

      // Mostra controles
      this.showControls();

      // Habilita botão de ajustar posição
      this.updateAjustarButton(true);

      // Atualiza hidden inputs
      this.updateHiddenInputs();
    }

    /**
     * Atualiza estado do botão de ajustar posição
     */
  }, {
    key: "updateAjustarButton",
    value: function updateAjustarButton(hasImage) {
      var btnAjustar = document.getElementById('btn_ajustar_planta');
      if (btnAjustar) {
        btnAjustar.disabled = !hasImage;
      }
    }

    /**
     * Cria o overlay da imagem sobre o mapa
     */
  }, {
    key: "createMapOverlay",
    value: function createMapOverlay() {
      var _this4 = this;
      // Remove overlay anterior se existir
      if (this.customOverlay) {
        this.customOverlay.setMap(null);
      }

      // Carrega a imagem para obter dimensões e calcular aspect ratio
      var img = new Image();
      img.onload = function () {
        var aspectRatio = img.naturalWidth / img.naturalHeight;

        // Define posicao inicial baseada no centro do mapa
        var mapCenter = _this4.map.getCenter();
        _this4.overlay.center = {
          lat: mapCenter.lat(),
          lng: mapCenter.lng()
        };

        // Tamanho inicial do overlay (em graus, aproximadamente)
        // Ajusta para manter o aspect ratio da imagem
        var baseSize = 0.003; // ~300 metros
        var halfWidth, halfHeight;
        if (aspectRatio > 1) {
          // Imagem mais larga que alta
          halfWidth = baseSize / 2;
          halfHeight = baseSize / aspectRatio / 2;
        } else {
          // Imagem mais alta que larga
          halfHeight = baseSize / 2;
          halfWidth = baseSize * aspectRatio / 2;
        }
        _this4.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(_this4.overlay.center.lat - halfHeight, _this4.overlay.center.lng - halfWidth), new google.maps.LatLng(_this4.overlay.center.lat + halfHeight, _this4.overlay.center.lng + halfWidth));

        // Cria Custom Overlay
        var OverlayClass = getCustomImageOverlayClass();
        _this4.customOverlay = new OverlayClass(_this4.overlay.bounds, _this4.imageUrl, _this4.map, _this4);
        _this4.customOverlay.setMap(_this4.map);

        // Centraliza o mapa no overlay
        _this4.map.setCenter(mapCenter);
        _this4.map.setZoom(18);

        // Atualiza hidden inputs
        _this4.updateHiddenInputs();
      };
      img.onerror = function () {
        console.error('Erro ao carregar imagem para calcular dimensões');
        // Fallback: usa dimensões quadradas
        _this4.createMapOverlayFallback();
      };
      img.src = this.imageUrl;
    }

    /**
     * Fallback para criar overlay quando não consegue carregar dimensões da imagem
     */
  }, {
    key: "createMapOverlayFallback",
    value: function createMapOverlayFallback() {
      var mapCenter = this.map.getCenter();
      this.overlay.center = {
        lat: mapCenter.lat(),
        lng: mapCenter.lng()
      };
      var initialSize = 0.003;
      var halfSize = initialSize / 2;
      this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(this.overlay.center.lat - halfSize, this.overlay.center.lng - halfSize), new google.maps.LatLng(this.overlay.center.lat + halfSize, this.overlay.center.lng + halfSize));
      var OverlayClass = getCustomImageOverlayClass();
      this.customOverlay = new OverlayClass(this.overlay.bounds, this.imageUrl, this.map, this);
      this.customOverlay.setMap(this.map);
      this.map.setCenter(mapCenter);
      this.map.setZoom(18);
    }

    /**
     * Mostra o painel de controles
     */
  }, {
    key: "showControls",
    value: function showControls() {
      var _this$controlPanel;
      this.isControlsVisible = true;
      (_this$controlPanel = this.controlPanel) === null || _this$controlPanel === void 0 || _this$controlPanel.classList.add('active');
    }

    /**
     * Esconde o painel de controles
     */
  }, {
    key: "hideControls",
    value: function hideControls() {
      var _this$controlPanel2;
      this.isControlsVisible = false;
      (_this$controlPanel2 = this.controlPanel) === null || _this$controlPanel2 === void 0 || _this$controlPanel2.classList.remove('active');
    }

    /**
     * Remove o overlay do mapa
     */
  }, {
    key: "removeOverlay",
    value: function removeOverlay() {
      if (this.customOverlay) {
        this.customOverlay.setMap(null);
        this.customOverlay = null;
      }
      this.imageUrl = null;
      this.overlay = {
        bounds: null,
        rotation: 0,
        opacity: 0.7,
        center: null
      };

      // Limpa preview
      var preview = document.getElementById('imageOverlayPreview');
      if (preview) {
        preview.src = '';
      }

      // Esconde controles
      this.hideControls();

      // Desabilita botão de ajustar posição
      this.updateAjustarButton(false);

      // Limpa hidden inputs
      this.clearHiddenInputs();
    }

    /**
     * Define a opacidade do overlay
     */
  }, {
    key: "setOverlayOpacity",
    value: function setOverlayOpacity(opacity) {
      this.overlay.opacity = opacity;
      if (this.customOverlay) {
        this.customOverlay.setOpacity(opacity);
      }
      this.updateHiddenInputs();
    }

    /**
     * Rotaciona o overlay
     */
  }, {
    key: "rotateOverlay",
    value: function rotateOverlay(degrees) {
      this.overlay.rotation += degrees;
      this.overlay.rotation = (this.overlay.rotation % 360 + 360) % 360;
      if (this.overlay.rotation > 180) {
        this.overlay.rotation -= 360;
      }
      this.updateOverlayTransform();

      // Atualiza slider
      var slider = document.getElementById('imageRotationSlider');
      var value = document.getElementById('imageRotationValue');
      if (slider) slider.value = this.overlay.rotation;
      if (value) value.textContent = "".concat(Math.round(this.overlay.rotation), "\xB0");
      this.updateHiddenInputs();
    }

    /**
     * Define rotacao especifica
     */
  }, {
    key: "setRotation",
    value: function setRotation(degrees) {
      this.overlay.rotation = degrees;
      this.updateOverlayTransform();
      this.updateHiddenInputs();
    }

    /**
     * Escala o overlay
     */
  }, {
    key: "scaleOverlay",
    value: function scaleOverlay(factor) {
      var _this$customOverlay;
      if (!this.overlay.bounds || !this.overlay.center) return;
      var bounds = this.overlay.bounds;
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var centerLat = this.overlay.center.lat;
      var centerLng = this.overlay.center.lng;
      var halfHeight = (ne.lat() - sw.lat()) / 2 * factor;
      var halfWidth = (ne.lng() - sw.lng()) / 2 * factor;
      this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(centerLat - halfHeight, centerLng - halfWidth), new google.maps.LatLng(centerLat + halfHeight, centerLng + halfWidth));
      (_this$customOverlay = this.customOverlay) === null || _this$customOverlay === void 0 || _this$customOverlay.updateBounds(this.overlay.bounds);
      this.updateHiddenInputs();
    }

    /**
     * Reseta as transformacoes
     */
  }, {
    key: "resetTransform",
    value: function resetTransform() {
      if (!this.imageUrl || !this.map) return;
      this.overlay.rotation = 0;
      this.createMapOverlay();

      // Reseta sliders
      var rotationSlider = document.getElementById('imageRotationSlider');
      var rotationValue = document.getElementById('imageRotationValue');
      if (rotationSlider) rotationSlider.value = 0;
      if (rotationValue) rotationValue.textContent = '0°';
      this.updateHiddenInputs();
    }

    /**
     * Atualiza a transformacao visual do overlay
     */
  }, {
    key: "updateOverlayTransform",
    value: function updateOverlayTransform() {
      if (this.customOverlay) {
        this.customOverlay.updateRotation(this.overlay.rotation);
      }
    }

    /**
     * Carrega dados salvos (chamado na inicializacao)
     */
  }, {
    key: "loadSavedOverlay",
    value: function loadSavedOverlay() {
      var imageUrlInput = document.getElementById('terreno_image_url');
      var boundsInput = document.getElementById('terreno_image_bounds');
      var rotationInput = document.getElementById('terreno_image_rotation');
      var opacityInput = document.getElementById('terreno_image_opacity');
      if (imageUrlInput !== null && imageUrlInput !== void 0 && imageUrlInput.value) {
        this.imageUrl = imageUrlInput.value;

        // Atualiza preview
        var preview = document.getElementById('imageOverlayPreview');
        if (preview) {
          preview.src = this.imageUrl;
        }
      }
      if (boundsInput !== null && boundsInput !== void 0 && boundsInput.value) {
        try {
          var bounds = JSON.parse(boundsInput.value);
          this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.south, bounds.west), new google.maps.LatLng(bounds.north, bounds.east));
          this.overlay.center = {
            lat: (bounds.north + bounds.south) / 2,
            lng: (bounds.east + bounds.west) / 2
          };
        } catch (e) {
          // Silently ignore parse errors
        }
      }
      if (rotationInput !== null && rotationInput !== void 0 && rotationInput.value) {
        this.overlay.rotation = parseFloat(rotationInput.value) || 0;
      }
      if (opacityInput !== null && opacityInput !== void 0 && opacityInput.value) {
        this.overlay.opacity = parseFloat(opacityInput.value) || 0.7;
      }

      // Se tem imagem salva, renderiza o overlay e habilita botão
      if (this.imageUrl && this.overlay.bounds) {
        this.renderSavedOverlay();
        this.updateAjustarButton(true);
      } else if (this.imageUrl) {
        // Tem imagem mas não tem bounds ainda
        this.updateAjustarButton(true);
      }
    }

    /**
     * Renderiza overlay salvo anteriormente
     */
  }, {
    key: "renderSavedOverlay",
    value: function renderSavedOverlay() {
      if (!this.imageUrl || !this.overlay.bounds) return;

      // Cria o overlay no mapa
      var OverlayClass = getCustomImageOverlayClass();
      this.customOverlay = new OverlayClass(this.overlay.bounds, this.imageUrl, this.map, this);
      this.customOverlay.setMap(this.map);

      // Aplica rotacao e opacidade salvas
      if (this.overlay.rotation) {
        this.customOverlay.updateRotation(this.overlay.rotation);
      }
      if (this.overlay.opacity) {
        this.customOverlay.setOpacity(this.overlay.opacity);
      }

      // Atualiza sliders
      var rotationSlider = document.getElementById('imageRotationSlider');
      var rotationValue = document.getElementById('imageRotationValue');
      var opacitySlider = document.getElementById('imageOpacitySlider');
      var opacityValue = document.getElementById('imageOpacityValue');
      if (rotationSlider) rotationSlider.value = this.overlay.rotation;
      if (rotationValue) rotationValue.textContent = "".concat(Math.round(this.overlay.rotation), "\xB0");
      if (opacitySlider) opacitySlider.value = this.overlay.opacity * 100;
      if (opacityValue) opacityValue.textContent = "".concat(Math.round(this.overlay.opacity * 100), "%");
    }

    /**
     * Atualiza inputs hidden com dados do overlay
     */
  }, {
    key: "updateHiddenInputs",
    value: function updateHiddenInputs() {
      var container = document.querySelector('#terreno-mapa-container');
      if (!container) return;

      // Image URL
      var urlInput = document.getElementById('terreno_image_url');
      if (!urlInput) {
        urlInput = document.createElement('input');
        urlInput.type = 'hidden';
        urlInput.id = 'terreno_image_url';
        urlInput.name = 'terreno_image_url';
        container.appendChild(urlInput);
      }
      urlInput.value = this.imageUrl || '';

      // Bounds
      var boundsInput = document.getElementById('terreno_image_bounds');
      if (!boundsInput) {
        boundsInput = document.createElement('input');
        boundsInput.type = 'hidden';
        boundsInput.id = 'terreno_image_bounds';
        boundsInput.name = 'terreno_image_bounds';
        container.appendChild(boundsInput);
      }
      if (this.overlay.bounds) {
        boundsInput.value = JSON.stringify({
          north: this.overlay.bounds.getNorthEast().lat(),
          south: this.overlay.bounds.getSouthWest().lat(),
          east: this.overlay.bounds.getNorthEast().lng(),
          west: this.overlay.bounds.getSouthWest().lng()
        });
      }

      // Rotation
      var rotationInput = document.getElementById('terreno_image_rotation');
      if (!rotationInput) {
        rotationInput = document.createElement('input');
        rotationInput.type = 'hidden';
        rotationInput.id = 'terreno_image_rotation';
        rotationInput.name = 'terreno_image_rotation';
        container.appendChild(rotationInput);
      }
      rotationInput.value = this.overlay.rotation || 0;

      // Opacity
      var opacityInput = document.getElementById('terreno_image_opacity');
      if (!opacityInput) {
        opacityInput = document.createElement('input');
        opacityInput.type = 'hidden';
        opacityInput.id = 'terreno_image_opacity';
        opacityInput.name = 'terreno_image_opacity';
        container.appendChild(opacityInput);
      }
      opacityInput.value = this.overlay.opacity || 0.7;
    }

    /**
     * Limpa hidden inputs
     */
  }, {
    key: "clearHiddenInputs",
    value: function clearHiddenInputs() {
      var inputs = ['terreno_image_url', 'terreno_image_bounds', 'terreno_image_rotation', 'terreno_image_opacity'];
      inputs.forEach(function (id) {
        var input = document.getElementById(id);
        if (input) {
          input.value = '';
        }
      });
    }
  }]);
}();

/**
 * Factory function para criar a classe CustomImageOverlay
 * Isso evita erro de referencia ao google.maps.OverlayView antes do Maps API estar pronto
 */
var CustomImageOverlayClass = null;
function getCustomImageOverlayClass() {
  if (CustomImageOverlayClass) {
    return CustomImageOverlayClass;
  }
  CustomImageOverlayClass = /*#__PURE__*/function (_google$maps$OverlayV) {
    function CustomImageOverlay(bounds, imageUrl, map, manager) {
      var _this5;
      _classCallCheck(this, CustomImageOverlay);
      _this5 = _callSuper(this, CustomImageOverlay);
      _this5.bounds = bounds;
      _this5.imageUrl = imageUrl;
      _this5.manager = manager;
      _this5.div = null;
      _this5.img = null;
      _this5.rotation = 0;
      _this5.opacity = 0.7;
      _this5.isDragging = false;
      _this5.isResizing = false;
      return _this5;
    }
    _inherits(CustomImageOverlay, _google$maps$OverlayV);
    return _createClass(CustomImageOverlay, [{
      key: "onAdd",
      value: function onAdd() {
        // Cria container do overlay
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.cursor = 'move';

        // Cria elemento de imagem
        this.img = document.createElement('img');
        this.img.src = this.imageUrl;
        this.img.style.width = '100%';
        this.img.style.height = '100%';
        this.img.style.opacity = this.opacity;
        this.img.style.pointerEvents = 'none';
        this.img.style.objectFit = 'contain';
        this.div.appendChild(this.img);

        // Adiciona borda para visualizacao
        this.div.style.border = '2px dashed #28a745';
        this.div.style.boxSizing = 'border-box';

        // Adiciona handles de resize nos cantos
        this.addResizeHandles();

        // Adiciona eventos de drag
        this.addDragListeners();

        // Adiciona ao mapa - USA overlayMouseTarget para receber eventos de mouse
        // z-index menor para ficar ABAIXO do SVG overlay
        this.div.style.zIndex = '1';
        var panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);
      }
    }, {
      key: "addResizeHandles",
      value: function addResizeHandles() {
        var _this6 = this;
        var corners = ['nw', 'ne', 'sw', 'se'];
        corners.forEach(function (corner) {
          var handle = document.createElement('div');
          handle.className = "image-resize-handle image-resize-".concat(corner);
          handle.style.cssText = "\n          position: absolute;\n          width: 14px;\n          height: 14px;\n          background: #28a745;\n          border: 2px solid white;\n          border-radius: 50%;\n          cursor: ".concat(corner, "-resize;\n          z-index: 1000;\n        ");
          if (corner.includes('n')) handle.style.top = '-7px';
          if (corner.includes('s')) handle.style.bottom = '-7px';
          if (corner.includes('w')) handle.style.left = '-7px';
          if (corner.includes('e')) handle.style.right = '-7px';
          handle.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            _this6.startResize(e, corner);
          });
          _this6.div.appendChild(handle);
        });
      }
    }, {
      key: "addDragListeners",
      value: function addDragListeners() {
        var _this7 = this;
        this.div.addEventListener('mousedown', function (e) {
          if (e.target.classList.contains('image-resize-handle')) return;
          _this7.startDrag(e);
        });
        document.addEventListener('mousemove', function (e) {
          if (_this7.isDragging) _this7.onDrag(e);
          if (_this7.isResizing) _this7.onResize(e);
        });
        document.addEventListener('mouseup', function () {
          if (_this7.isDragging || _this7.isResizing) {
            _this7.manager.updateHiddenInputs();
            // Reabilita o drag do mapa
            var map = _this7.getMap();
            if (map) {
              map.setOptions({
                draggable: true
              });
            }
          }
          _this7.isDragging = false;
          _this7.isResizing = false;
        });
      }
    }, {
      key: "startDrag",
      value: function startDrag(e) {
        this.isDragging = true;
        this.dragStart = {
          x: e.clientX,
          y: e.clientY,
          bounds: new google.maps.LatLngBounds(this.bounds.getSouthWest(), this.bounds.getNorthEast())
        };
        // Desabilita o drag do mapa enquanto arrasta o overlay
        this.getMap().setOptions({
          draggable: false
        });
        e.preventDefault();
        e.stopPropagation();
      }
    }, {
      key: "onDrag",
      value: function onDrag(e) {
        var projection = this.getProjection();
        if (!projection) return;
        var dx = e.clientX - this.dragStart.x;
        var dy = e.clientY - this.dragStart.y;
        var startSW = this.dragStart.bounds.getSouthWest();
        var startNE = this.dragStart.bounds.getNorthEast();
        var swPoint = projection.fromLatLngToDivPixel(startSW);
        var nePoint = projection.fromLatLngToDivPixel(startNE);
        var newSW = projection.fromDivPixelToLatLng(new google.maps.Point(swPoint.x + dx, swPoint.y + dy));
        var newNE = projection.fromDivPixelToLatLng(new google.maps.Point(nePoint.x + dx, nePoint.y + dy));
        this.bounds = new google.maps.LatLngBounds(newSW, newNE);
        this.manager.overlay.bounds = this.bounds;
        this.manager.overlay.center = {
          lat: (newSW.lat() + newNE.lat()) / 2,
          lng: (newSW.lng() + newNE.lng()) / 2
        };
        this.draw();
      }
    }, {
      key: "startResize",
      value: function startResize(e, corner) {
        this.isResizing = true;
        this.resizeCorner = corner;
        this.resizeStart = {
          x: e.clientX,
          y: e.clientY,
          bounds: new google.maps.LatLngBounds(this.bounds.getSouthWest(), this.bounds.getNorthEast())
        };
        // Desabilita o drag do mapa enquanto redimensiona
        this.getMap().setOptions({
          draggable: false
        });
        e.preventDefault();
        e.stopPropagation();
      }
    }, {
      key: "onResize",
      value: function onResize(e) {
        var projection = this.getProjection();
        if (!projection) return;
        var startSW = this.resizeStart.bounds.getSouthWest();
        var startNE = this.resizeStart.bounds.getNorthEast();
        var newSW = startSW;
        var newNE = startNE;
        var swPoint = projection.fromLatLngToDivPixel(startSW);
        var nePoint = projection.fromLatLngToDivPixel(startNE);
        var dx = e.clientX - this.resizeStart.x;
        var dy = e.clientY - this.resizeStart.y;
        if (this.resizeCorner.includes('e')) {
          newNE = projection.fromDivPixelToLatLng(new google.maps.Point(nePoint.x + dx, nePoint.y));
        }
        if (this.resizeCorner.includes('w')) {
          newSW = projection.fromDivPixelToLatLng(new google.maps.Point(swPoint.x + dx, swPoint.y));
        }
        if (this.resizeCorner.includes('n')) {
          newNE = projection.fromDivPixelToLatLng(new google.maps.Point(this.resizeCorner.includes('e') ? nePoint.x + dx : nePoint.x, nePoint.y + dy));
        }
        if (this.resizeCorner.includes('s')) {
          newSW = projection.fromDivPixelToLatLng(new google.maps.Point(this.resizeCorner.includes('w') ? swPoint.x + dx : swPoint.x, swPoint.y + dy));
        }
        this.bounds = new google.maps.LatLngBounds(newSW, newNE);
        this.manager.overlay.bounds = this.bounds;
        this.manager.overlay.center = {
          lat: (newSW.lat() + newNE.lat()) / 2,
          lng: (newSW.lng() + newNE.lng()) / 2
        };
        this.draw();
      }
    }, {
      key: "draw",
      value: function draw() {
        if (!this.div) return;
        var projection = this.getProjection();
        if (!projection) return;
        var sw = projection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        var ne = projection.fromLatLngToDivPixel(this.bounds.getNorthEast());
        if (!sw || !ne) return;
        var width = ne.x - sw.x;
        var height = sw.y - ne.y;
        this.div.style.left = sw.x + 'px';
        this.div.style.top = ne.y + 'px';
        this.div.style.width = width + 'px';
        this.div.style.height = height + 'px';

        // Aplica rotacao
        this.div.style.transform = "rotate(".concat(this.rotation, "deg)");
        this.div.style.transformOrigin = 'center center';
      }
    }, {
      key: "updateBounds",
      value: function updateBounds(bounds) {
        this.bounds = bounds;
        this.draw();
      }
    }, {
      key: "updateRotation",
      value: function updateRotation(rotation) {
        this.rotation = rotation;
        this.draw();
      }
    }, {
      key: "setOpacity",
      value: function setOpacity(opacity) {
        this.opacity = opacity;
        if (this.img) {
          this.img.style.opacity = opacity;
        }
      }
    }, {
      key: "onRemove",
      value: function onRemove() {
        if (this.div) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
          this.img = null;
        }
      }
    }]);
  }(google.maps.OverlayView);
  return CustomImageOverlayClass;
}

/***/ },

/***/ "./assets/js/src/managers/SVGEditorManager.js"
/*!****************************************************!*\
  !*** ./assets/js/src/managers/SVGEditorManager.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SVGEditorManager: () => (/* binding */ SVGEditorManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * SVGEditorManager - Editor para vincular shapes do SVG aos lotes
 *
 * Responsabilidades:
 * 1. Renderizar o SVG sobre o mapa com shapes clicáveis
 * 2. Permitir selecionar cada shape e vincular a um lote (ID da unidade + bloco)
 * 3. Salvar o mapeamento shape_index → {lote_id, bloco}
 * 4. Gerenciar estado visual (cores baseadas em status: vinculado/não vinculado)
 */
var SVGEditorManager = /*#__PURE__*/function () {
  function SVGEditorManager(map, stateManager, eventBus) {
    _classCallCheck(this, SVGEditorManager);
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
      center: null
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
  return _createClass(SVGEditorManager, [{
    key: "init",
    value: function init() {
      this.createEditorPanel();
      this.loadSavedData();
      this.setupEventListeners();
    }

    /**
     * Cria o painel lateral do editor
     */
  }, {
    key: "createEditorPanel",
    value: function createEditorPanel() {
      // Verifica se já existe
      if (document.getElementById('svgEditorPanel')) {
        this.editorPanel = document.getElementById('svgEditorPanel');
        return;
      }
      var panel = document.createElement('div');
      panel.id = 'svgEditorPanel';
      panel.innerHTML = "\n      <div class=\"svg-editor-header\">\n        <h3>\n          <span class=\"dashicons dashicons-admin-appearance\"></span>\n          Editor de Lotes SVG\n        </h3>\n        <button type=\"button\" class=\"button svg-editor-close\" title=\"Fechar\">&times;</button>\n      </div>\n\n      <div class=\"svg-editor-content\">\n        <!-- Info do SVG carregado -->\n        <div class=\"svg-editor-info\" id=\"svgEditorInfo\" style=\"display: none;\">\n          <div class=\"svg-info-item\">\n            <span class=\"dashicons dashicons-images-alt2\"></span>\n            <span id=\"svgEditorShapeCount\">0 shapes</span>\n          </div>\n          <div class=\"svg-info-item\">\n            <span class=\"dashicons dashicons-saved\"></span>\n            <span id=\"svgEditorMappedCount\">0 vinculados</span>\n          </div>\n        </div>\n\n        <!-- Instru\xE7\xF5es -->\n        <div class=\"svg-editor-instructions\">\n          <p><strong>Como usar:</strong></p>\n          <ol>\n            <li>Importe um SVG pelo bot\xE3o \"Importar SVG\"</li>\n            <li>Posicione o SVG sobre o mapa</li>\n            <li>Clique em cada shape para vincular ao lote</li>\n            <li>Salve o post para persistir as configura\xE7\xF5es</li>\n          </ol>\n        </div>\n\n        <!-- Lista de shapes -->\n        <div class=\"svg-editor-shapes-header\" style=\"display: none;\">\n          <h4>Shapes do SVG</h4>\n          <button type=\"button\" class=\"button button-small\" id=\"svgEditorSelectAll\">Selecionar Todos</button>\n        </div>\n        <div class=\"svg-editor-shapes-list\" id=\"svgEditorShapesList\">\n          <p class=\"no-shapes\">Nenhum SVG carregado</p>\n        </div>\n\n        <!-- A\xE7\xF5es -->\n        <div class=\"svg-editor-actions\" style=\"display: none;\">\n          <button type=\"button\" class=\"button\" id=\"svgEditorClearAll\">\n            <span class=\"dashicons dashicons-trash\"></span> Limpar V\xEDnculos\n          </button>\n          <button type=\"button\" class=\"button button-primary\" id=\"svgEditorSave\">\n            <span class=\"dashicons dashicons-yes\"></span> Aplicar Configura\xE7\xE3o\n          </button>\n        </div>\n      </div>\n\n      <!-- Modal de vincula\xE7\xE3o -->\n      <div class=\"svg-editor-modal\" id=\"svgEditorModal\" style=\"display: none;\">\n        <div class=\"svg-editor-modal-content\">\n          <h4>Vincular Shape ao Lote</h4>\n          <p class=\"shape-info\">Shape: <strong id=\"modalShapeIndex\">-</strong></p>\n\n          <div class=\"form-group\">\n            <label for=\"modalLoteId\">ID da Unidade: <span class=\"required\">*</span></label>\n            <input type=\"text\" id=\"modalLoteId\" placeholder=\"Ex: 123\" />\n            <small>ID da unidade correspondente na API</small>\n          </div>\n\n          <div class=\"form-group\">\n            <label for=\"modalBloco\">Quadra/Bloco: <span class=\"required\">*</span></label>\n            <input type=\"text\" id=\"modalBloco\" placeholder=\"Ex: A, B, C...\" />\n            <small>Bloco onde a unidade est\xE1 localizada</small>\n          </div>\n\n          <div class=\"form-group\">\n            <label for=\"modalNome\">Nome (opcional):</label>\n            <input type=\"text\" id=\"modalNome\" placeholder=\"Ex: Lote 01\" />\n          </div>\n\n          <div class=\"modal-actions\">\n            <button type=\"button\" class=\"button\" id=\"modalCancel\">Cancelar</button>\n            <button type=\"button\" class=\"button\" id=\"modalRemove\" style=\"display: none; color: #d63638;\">Remover V\xEDnculo</button>\n            <button type=\"button\" class=\"button button-primary\" id=\"modalSave\">Salvar</button>\n          </div>\n        </div>\n      </div>\n    ";

      // Adiciona estilos
      this.addStyles();
      document.body.appendChild(panel);
      this.editorPanel = panel;
    }

    /**
     * Adiciona estilos CSS do editor
     */
  }, {
    key: "addStyles",
    value: function addStyles() {
      if (document.getElementById('svgEditorStyles')) return;
      var styles = document.createElement('style');
      styles.id = 'svgEditorStyles';
      styles.textContent = "\n      #svgEditorPanel {\n        display: none;\n        position: fixed;\n        top: 32px;\n        right: 0;\n        width: 320px;\n        height: calc(100vh - 32px);\n        background: #fff;\n        border-left: 1px solid #ddd;\n        box-shadow: -4px 0 20px rgba(0,0,0,0.1);\n        z-index: 9998;\n        overflow: hidden;\n      }\n\n      #svgEditorPanel.active {\n        display: flex;\n        flex-direction: column;\n      }\n\n      .svg-editor-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        padding: 15px;\n        background: #f8f9fa;\n        border-bottom: 1px solid #ddd;\n      }\n\n      .svg-editor-header h3 {\n        margin: 0;\n        font-size: 14px;\n        display: flex;\n        align-items: center;\n        gap: 8px;\n      }\n\n      .svg-editor-close {\n        padding: 0 8px !important;\n        font-size: 18px !important;\n        line-height: 1 !important;\n      }\n\n      .svg-editor-content {\n        flex: 1;\n        overflow-y: auto;\n        padding: 15px;\n      }\n\n      .svg-editor-info {\n        display: flex;\n        gap: 15px;\n        padding: 10px;\n        background: #e7f5ff;\n        border-radius: 4px;\n        margin-bottom: 15px;\n      }\n\n      .svg-info-item {\n        display: flex;\n        align-items: center;\n        gap: 5px;\n        font-size: 12px;\n      }\n\n      .svg-editor-instructions {\n        background: #f5f5f5;\n        padding: 12px;\n        border-radius: 4px;\n        margin-bottom: 15px;\n        font-size: 12px;\n      }\n\n      .svg-editor-instructions p {\n        margin: 0 0 8px 0;\n      }\n\n      .svg-editor-instructions ol {\n        margin: 0;\n        padding-left: 18px;\n      }\n\n      .svg-editor-instructions li {\n        margin-bottom: 4px;\n      }\n\n      .svg-editor-shapes-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 10px;\n      }\n\n      .svg-editor-shapes-header h4 {\n        margin: 0;\n        font-size: 13px;\n      }\n\n      .svg-editor-shapes-list {\n        max-height: 300px;\n        overflow-y: auto;\n        border: 1px solid #ddd;\n        border-radius: 4px;\n        margin-bottom: 15px;\n      }\n\n      .svg-editor-shapes-list .no-shapes {\n        padding: 20px;\n        text-align: center;\n        color: #666;\n        margin: 0;\n      }\n\n      .shape-item {\n        display: flex;\n        align-items: center;\n        padding: 8px 12px;\n        border-bottom: 1px solid #eee;\n        cursor: pointer;\n        transition: background 0.2s;\n        justify-content: space-between;\n      }\n\n      .shape-item:last-child {\n        border-bottom: none;\n      }\n\n      .shape-item:hover {\n        background: #f0f7fc;\n      }\n\n      .shape-item.selected {\n        background: #e7f5ff;\n        border-left: 3px solid #0073aa;\n      }\n\n      .shape-item.mapped {\n        background: #d4edda;\n      }\n\n      .shape-item.mapped.selected {\n        background: #c3e6cb;\n        border-left: 3px solid #28a745;\n      }\n\n      .shape-color {\n        width: 16px;\n        height: 16px;\n        border-radius: 3px;\n        margin-right: 10px;\n        border: 1px solid #ddd;\n      }\n\n      .shape-info-text {\n        flex: 1;\n        font-size: 12px;\n      }\n\n      .shape-info-text .shape-name {\n        font-weight: 600;\n      }\n\n      .shape-info-text .shape-lote {\n        color: #28a745;\n        font-size: 11px;\n      }\n\n      .shape-status {\n        font-size: 10px;\n        padding: 2px 6px 2px 0;\n        border-radius: 10px;\n      }\n\n      .shape-status.unmapped {\n        background: #f8d7da;\n        color: #721c24;\n      }\n\n      .shape-status.mapped {\n        background: #d4edda;\n        color: #155724;\n      }\n\n      .svg-editor-actions {\n        display: flex;\n        gap: 10px;\n        padding-top: 15px;\n        border-top: 1px solid #ddd;\n      }\n\n      .svg-editor-actions .button {\n        flex: 1;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        gap: 5px;\n      }\n\n      /* Modal */\n      .svg-editor-modal {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.5);\n        z-index: 100000;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      }\n\n      .svg-editor-modal-content {\n        background: #fff;\n        padding: 25px;\n        border-radius: 8px;\n        width: 350px;\n        max-width: 90%;\n      }\n\n      .svg-editor-modal-content h4 {\n        margin: 0 0 15px 0;\n      }\n\n      .svg-editor-modal-content .shape-info {\n        background: #f5f5f5;\n        padding: 8px 12px;\n        border-radius: 4px;\n        margin-bottom: 15px;\n        font-size: 13px;\n      }\n\n      .svg-editor-modal-content .form-group {\n        margin-bottom: 15px;\n      }\n\n      .svg-editor-modal-content label {\n        display: block;\n        margin-bottom: 5px;\n        font-weight: 600;\n      }\n\n      .svg-editor-modal-content label .required {\n        color: #d63638;\n      }\n\n      .svg-editor-modal-content input {\n        width: 100%;\n        padding: 8px;\n        border: 1px solid #ddd;\n        border-radius: 4px;\n      }\n\n      .svg-editor-modal-content small {\n        display: block;\n        margin-top: 4px;\n        color: #666;\n        font-size: 11px;\n      }\n\n      .modal-actions {\n        display: flex;\n        gap: 10px;\n        justify-content: flex-end;\n        margin-top: 20px;\n      }\n\n      /* Overlay SVG interativo */\n      .svg-editor-overlay {\n        cursor: crosshair;\n      }\n\n      .svg-editor-overlay svg {\n        width: 100%;\n        height: 100%;\n      }\n\n      .svg-editor-overlay svg polygon,\n      .svg-editor-overlay svg path,\n      .svg-editor-overlay svg polyline,\n      .svg-editor-overlay svg rect {\n        cursor: pointer;\n        transition: fill 0.2s, stroke 0.2s;\n      }\n\n      .svg-editor-overlay svg polygon:hover,\n      .svg-editor-overlay svg path:hover,\n      .svg-editor-overlay svg polyline:hover,\n      .svg-editor-overlay svg rect:hover {\n        fill: rgba(0, 115, 170, 0.5) !important;\n        stroke: #0073aa !important;\n        stroke-width: 3px !important;\n      }\n\n      .svg-editor-overlay svg .shape-mapped {\n        fill: rgba(40, 167, 69, 0.4) !important;\n        stroke: #28a745 !important;\n      }\n\n      .svg-editor-overlay svg .shape-selected {\n        fill: rgba(255, 193, 7, 0.5) !important;\n        stroke: #ffc107 !important;\n        stroke-width: 4px !important;\n      }\n    ";
      document.head.appendChild(styles);
    }

    /**
     * Carrega dados salvos do hidden input
     */
  }, {
    key: "loadSavedData",
    value: function loadSavedData() {
      // SVG content
      var svgInput = document.getElementById('terreno_svg_content');
      if (svgInput && svgInput.value) {
        this.svgContent = svgInput.value;
      }

      // Bounds
      var boundsInput = document.getElementById('terreno_svg_bounds');
      if (boundsInput && boundsInput.value) {
        try {
          this.overlay.bounds = JSON.parse(boundsInput.value);
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Rotation
      var rotationInput = document.getElementById('terreno_svg_rotation');
      if (rotationInput && rotationInput.value) {
        this.overlay.rotation = parseFloat(rotationInput.value) || 0;
      }

      // Shape mapping
      var mappingInput = document.getElementById('terreno_shape_mapping');
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
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // Fechar painel
      document.addEventListener('click', function (e) {
        if (e.target.classList.contains('svg-editor-close')) {
          _this.closeEditor();
        }
      });

      // Modal events
      document.addEventListener('click', function (e) {
        if (e.target.id === 'modalCancel') {
          _this.closeModal();
        }
        if (e.target.id === 'modalSave') {
          _this.saveShapeMapping();
        }
        if (e.target.id === 'modalRemove') {
          _this.removeShapeMapping();
        }
      });

      // Limpar todos vínculos
      document.addEventListener('click', function (e) {
        if (e.target.id === 'svgEditorClearAll' || e.target.closest('#svgEditorClearAll')) {
          if (confirm('Tem certeza que deseja remover todos os vínculos?')) {
            _this.clearAllMappings();
          }
        }
      });

      // Salvar configuração
      document.addEventListener('click', function (e) {
        if (e.target.id === 'svgEditorSave' || e.target.closest('#svgEditorSave')) {
          _this.saveConfiguration();
        }
      });

      // Eventos do EventBus
      this.eventBus.on('svg:loaded', function (data) {
        _this.onSVGLoaded(data);
      });
      this.eventBus.on('svg:positioned', function (data) {
        _this.onSVGPositioned(data);
      });
    }

    /**
     * Abre o editor
     */
  }, {
    key: "openEditor",
    value: function openEditor() {
      this.isEditorActive = true;
      this.editorPanel.classList.add('active');
    }

    /**
     * Fecha o editor
     */
  }, {
    key: "closeEditor",
    value: function closeEditor() {
      this.isEditorActive = false;
      this.editorPanel.classList.remove('active');
    }

    /**
     * Toggle do editor
     */
  }, {
    key: "toggleEditor",
    value: function toggleEditor() {
      if (this.isEditorActive) {
        this.closeEditor();
      } else {
        this.openEditor();
      }
    }

    /**
     * Callback quando SVG é carregado pelo SVGOverlayManager
     */
  }, {
    key: "onSVGLoaded",
    value: function onSVGLoaded(data) {
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
  }, {
    key: "onSVGPositioned",
    value: function onSVGPositioned(data) {
      this.overlay.bounds = data.bounds;
      this.overlay.rotation = data.rotation;
      this.overlay.center = data.center;

      // Salva nos inputs hidden
      this.updateHiddenInputs();
    }

    /**
     * Processa o conteúdo SVG para extrair shapes
     */
  }, {
    key: "processSVGContent",
    value: function processSVGContent() {
      if (!this.svgContent) return;

      // Parse SVG
      var parser = new DOMParser();
      var doc = parser.parseFromString(this.svgContent, 'image/svg+xml');
      this.svgElement = doc.documentElement;

      // Extrai viewBox
      var viewBoxAttr = this.svgElement.getAttribute('viewBox');
      if (viewBoxAttr) {
        var parts = viewBoxAttr.split(/[\s,]+/).map(parseFloat);
        this.viewBox = {
          x: parts[0] || 0,
          y: parts[1] || 0,
          width: parts[2] || 100,
          height: parts[3] || 100
        };
      }

      // Conta shapes
      var shapeSelectors = 'polygon, path, polyline, rect';
      var shapeElements = this.svgElement.querySelectorAll(shapeSelectors);
      this.shapes = Array.from(shapeElements).map(function (el, index) {
        return {
          index: index,
          type: el.tagName.toLowerCase(),
          id: el.id || "shape_".concat(index),
          fill: el.getAttribute('fill') || el.style.fill || '#ccc',
          stroke: el.getAttribute('stroke') || el.style.stroke || '#000'
        };
      });
    }

    /**
     * Renderiza a lista de shapes no painel
     */
  }, {
    key: "renderShapesList",
    value: function renderShapesList() {
      var _this2 = this;
      var list = document.getElementById('svgEditorShapesList');
      if (!list) return;
      if (this.shapes.length === 0) {
        list.innerHTML = '<p class="no-shapes">Nenhum SVG carregado</p>';
        return;
      }
      var html = this.shapes.map(function (shape) {
        var mapping = _this2.shapeMapping[shape.index];
        var isMapped = !!mapping;
        var loteInfo = isMapped ? "Lote ".concat(mapping.lote_id, " - Bloco ").concat(mapping.bloco) : '';
        return "\n        <div class=\"shape-item ".concat(isMapped ? 'mapped' : '', "\" data-shape-index=\"").concat(shape.index, "\">\n          <div class=\"shape-color\" style=\"background: ").concat(shape.fill, "; border-color: ").concat(shape.stroke, ";\"></div>\n          <div class=\"shape-info-text\">\n            <div class=\"shape-name\">").concat(shape.id, "</div>\n            ").concat(isMapped ? "<div class=\"shape-lote\">".concat(loteInfo, "</div>") : '', "\n          </div>\n          <span class=\"shape-status ").concat(isMapped ? 'mapped' : 'unmapped', "\">\n            ").concat(isMapped ? 'Vinculado' : 'Pendente', "\n          </span>\n        </div>\n      ");
      }).join('');
      list.innerHTML = html;

      // Adiciona click listeners
      list.querySelectorAll('.shape-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var index = parseInt(item.dataset.shapeIndex);
          _this2.selectShape(index);
        });
      });
    }

    /**
     * Atualiza UI do editor
     */
  }, {
    key: "updateEditorUI",
    value: function updateEditorUI() {
      var infoEl = document.getElementById('svgEditorInfo');
      var shapesHeader = document.querySelector('.svg-editor-shapes-header');
      var actionsEl = document.querySelector('.svg-editor-actions');
      if (this.shapes.length > 0) {
        // Mostra elementos
        if (infoEl) infoEl.style.display = 'flex';
        if (shapesHeader) shapesHeader.style.display = 'flex';
        if (actionsEl) actionsEl.style.display = 'flex';

        // Atualiza contadores
        document.getElementById('svgEditorShapeCount').textContent = "".concat(this.shapes.length, " shapes");
        var mappedCount = Object.keys(this.shapeMapping).length;
        document.getElementById('svgEditorMappedCount').textContent = "".concat(mappedCount, " vinculados");
      }
    }

    /**
     * Seleciona um shape
     */
  }, {
    key: "selectShape",
    value: function selectShape(index) {
      this.selectedShapeIndex = index;

      // Atualiza visual na lista
      document.querySelectorAll('.shape-item').forEach(function (item) {
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
  }, {
    key: "highlightShapeInOverlay",
    value: function highlightShapeInOverlay(index) {
      // Emite evento para o overlay
      this.eventBus.emit('svg:highlight_shape', {
        index: index
      });
    }

    /**
     * Abre modal de vinculação
     */
  }, {
    key: "openMappingModal",
    value: function openMappingModal(index) {
      var modal = document.getElementById('svgEditorModal');
      if (!modal) return;
      var shape = this.shapes.find(function (s) {
        return s.index === index;
      });
      var mapping = this.shapeMapping[index];

      // Preenche informações
      document.getElementById('modalShapeIndex').textContent = (shape === null || shape === void 0 ? void 0 : shape.id) || "Shape ".concat(index);

      // Preenche campos se já tem mapeamento
      document.getElementById('modalLoteId').value = (mapping === null || mapping === void 0 ? void 0 : mapping.lote_id) || '';
      document.getElementById('modalBloco').value = (mapping === null || mapping === void 0 ? void 0 : mapping.bloco) || '';
      document.getElementById('modalNome').value = (mapping === null || mapping === void 0 ? void 0 : mapping.nome) || '';

      // Mostra/esconde botão de remover
      var removeBtn = document.getElementById('modalRemove');
      if (removeBtn) {
        removeBtn.style.display = mapping ? 'block' : 'none';
      }
      modal.style.display = 'flex';
    }

    /**
     * Fecha modal
     */
  }, {
    key: "closeModal",
    value: function closeModal() {
      var modal = document.getElementById('svgEditorModal');
      if (modal) {
        modal.style.display = 'none';
      }
      this.selectedShapeIndex = null;
    }

    /**
     * Salva o mapeamento do shape selecionado
     */
  }, {
    key: "saveShapeMapping",
    value: function saveShapeMapping() {
      var loteId = document.getElementById('modalLoteId').value.trim();
      var bloco = document.getElementById('modalBloco').value.trim();
      var nome = document.getElementById('modalNome').value.trim();
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
        shape_index: this.selectedShapeIndex
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
  }, {
    key: "removeShapeMapping",
    value: function removeShapeMapping() {
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
  }, {
    key: "clearAllMappings",
    value: function clearAllMappings() {
      this.shapeMapping = {};
      this.renderShapesList();
      this.updateEditorUI();
      this.updateOverlayColors();
      this.updateHiddenInputs();
    }

    /**
     * Atualiza cores no overlay baseado no mapeamento
     */
  }, {
    key: "updateOverlayColors",
    value: function updateOverlayColors() {
      this.eventBus.emit('svg:update_colors', {
        mapping: this.shapeMapping
      });
    }

    /**
     * Atualiza inputs hidden com os dados
     */
  }, {
    key: "updateHiddenInputs",
    value: function updateHiddenInputs() {
      // SVG Content
      var svgInput = document.getElementById('terreno_svg_content');
      if (!svgInput) {
        var _document$querySelect;
        svgInput = document.createElement('input');
        svgInput.type = 'hidden';
        svgInput.id = 'terreno_svg_content';
        svgInput.name = 'terreno_svg_content';
        (_document$querySelect = document.querySelector('#terreno-mapa-container')) === null || _document$querySelect === void 0 || _document$querySelect.appendChild(svgInput);
      }
      svgInput.value = this.svgContent || '';

      // Bounds
      var boundsInput = document.getElementById('terreno_svg_bounds');
      if (!boundsInput) {
        var _document$querySelect2;
        boundsInput = document.createElement('input');
        boundsInput.type = 'hidden';
        boundsInput.id = 'terreno_svg_bounds';
        boundsInput.name = 'terreno_svg_bounds';
        (_document$querySelect2 = document.querySelector('#terreno-mapa-container')) === null || _document$querySelect2 === void 0 || _document$querySelect2.appendChild(boundsInput);
      }
      boundsInput.value = this.overlay.bounds ? JSON.stringify(this.overlay.bounds) : '';

      // Rotation
      var rotationInput = document.getElementById('terreno_svg_rotation');
      if (!rotationInput) {
        var _document$querySelect3;
        rotationInput = document.createElement('input');
        rotationInput.type = 'hidden';
        rotationInput.id = 'terreno_svg_rotation';
        rotationInput.name = 'terreno_svg_rotation';
        (_document$querySelect3 = document.querySelector('#terreno-mapa-container')) === null || _document$querySelect3 === void 0 || _document$querySelect3.appendChild(rotationInput);
      }
      rotationInput.value = this.overlay.rotation || 0;

      // Shape mapping
      var mappingInput = document.getElementById('terreno_shape_mapping');
      if (!mappingInput) {
        var _document$querySelect4;
        mappingInput = document.createElement('input');
        mappingInput.type = 'hidden';
        mappingInput.id = 'terreno_shape_mapping';
        mappingInput.name = 'terreno_shape_mapping';
        (_document$querySelect4 = document.querySelector('#terreno-mapa-container')) === null || _document$querySelect4 === void 0 || _document$querySelect4.appendChild(mappingInput);
      }
      mappingInput.value = JSON.stringify(this.shapeMapping);
    }

    /**
     * Salva configuração (aplica e fecha editor)
     */
  }, {
    key: "saveConfiguration",
    value: function saveConfiguration() {
      this.updateHiddenInputs();

      // Notifica que foi salvo
      this.eventBus.emit('svg:configuration_saved', {
        svgContent: this.svgContent,
        bounds: this.overlay.bounds,
        rotation: this.overlay.rotation,
        mapping: this.shapeMapping
      });
      alert('Configuração aplicada! Não esqueça de salvar o post.');
      this.closeEditor();
    }

    /**
     * Retorna o mapeamento atual
     */
  }, {
    key: "getMapping",
    value: function getMapping() {
      return this.shapeMapping;
    }

    /**
     * Retorna dados completos para salvar
     */
  }, {
    key: "getDataForSave",
    value: function getDataForSave() {
      return {
        svgContent: this.svgContent,
        bounds: this.overlay.bounds,
        rotation: this.overlay.rotation,
        mapping: this.shapeMapping
      };
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/managers/SVGOverlayManager.js"
/*!*****************************************************!*\
  !*** ./assets/js/src/managers/SVGOverlayManager.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SVGOverlayManager: () => (/* binding */ SVGOverlayManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var SVGOverlayManager = /*#__PURE__*/function () {
  function SVGOverlayManager(map, stateManager, eventBus, dataPersistence) {
    _classCallCheck(this, SVGOverlayManager);
    this.map = map;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
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
      height: 400
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
  return _createClass(SVGOverlayManager, [{
    key: "init",
    value: function init() {
      var _this = this,
        _document$getElementB,
        _document$getElementB2,
        _document$getElementB3,
        _document$getElementB5,
        _document$getElementB6,
        _document$getElementB7,
        _document$getElementB8,
        _document$getElementB9,
        _document$getElementB0,
        _document$getElementB1,
        _document$getElementB10,
        _document$getElementB11;
      // Botão de abrir modal
      var btnImportar = document.getElementById('btn_importar_svg');
      if (btnImportar) {
        btnImportar.addEventListener('click', function () {
          return _this.openModal();
        });
      }

      // Botão de ajustar posição do SVG
      var btnAjustar = document.getElementById('btn_ajustar_svg');
      if (btnAjustar) {
        btnAjustar.addEventListener('click', function (e) {
          e.preventDefault();
          _this.toggleEditMode();
        });
      } else {
        setTimeout(function () {
          var btn = document.getElementById('btn_ajustar_svg');
          if (btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault();
              _this.toggleEditMode();
            });
          }
        }, 500);
      }

      // Botão de remover SVG
      var btnRemover = document.getElementById('btn_remover_svg');
      if (btnRemover) {
        btnRemover.addEventListener('click', function (e) {
          e.preventDefault();
          _this.confirmAndRemoveSvg();
        });
      }

      // Elementos do modal
      this.modal = document.getElementById('svgImportModal');
      if (!this.modal) return;

      // Botões de fechar/cancelar
      (_document$getElementB = document.getElementById('svgImportClose')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', function () {
        return _this.closeModal(true);
      });
      (_document$getElementB2 = document.getElementById('svgImportCancel')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', function () {
        return _this.closeModal(true);
      });

      // Upload de arquivo
      (_document$getElementB3 = document.getElementById('svgSelectFile')) === null || _document$getElementB3 === void 0 || _document$getElementB3.addEventListener('click', function () {
        var _document$getElementB4;
        (_document$getElementB4 = document.getElementById('svgFileInput')) === null || _document$getElementB4 === void 0 || _document$getElementB4.click();
      });
      (_document$getElementB5 = document.getElementById('svgFileInput')) === null || _document$getElementB5 === void 0 || _document$getElementB5.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
          _this.handleFileUpload(e.target.files[0]);
        }
      });

      // Drag and drop
      var dropZone = document.getElementById('svgDropZone');
      if (dropZone) {
        dropZone.addEventListener('dragover', function (e) {
          e.preventDefault();
          dropZone.style.borderColor = '#0073aa';
          dropZone.style.background = '#f0f7fc';
        });
        dropZone.addEventListener('dragleave', function () {
          dropZone.style.borderColor = '#ccc';
          dropZone.style.background = 'transparent';
        });
        dropZone.addEventListener('drop', function (e) {
          e.preventDefault();
          dropZone.style.borderColor = '#ccc';
          dropZone.style.background = 'transparent';
          if (e.dataTransfer.files.length > 0) {
            _this.handleFileUpload(e.dataTransfer.files[0]);
          }
        });
      }

      // Controles de transformação
      (_document$getElementB6 = document.getElementById('svgRotateLeft')) === null || _document$getElementB6 === void 0 || _document$getElementB6.addEventListener('click', function () {
        _this.rotateOverlay(-1);
      });
      (_document$getElementB7 = document.getElementById('svgRotateRight')) === null || _document$getElementB7 === void 0 || _document$getElementB7.addEventListener('click', function () {
        _this.rotateOverlay(1);
      });
      (_document$getElementB8 = document.getElementById('svgZoomIn')) === null || _document$getElementB8 === void 0 || _document$getElementB8.addEventListener('click', function () {
        _this.scaleOverlay(1.01);
      });
      (_document$getElementB9 = document.getElementById('svgZoomOut')) === null || _document$getElementB9 === void 0 || _document$getElementB9.addEventListener('click', function () {
        _this.scaleOverlay(0.99);
      });
      (_document$getElementB0 = document.getElementById('svgResetTransform')) === null || _document$getElementB0 === void 0 || _document$getElementB0.addEventListener('click', function () {
        _this.resetTransform();
      });

      // Slider de opacidade
      (_document$getElementB1 = document.getElementById('svgOpacitySlider')) === null || _document$getElementB1 === void 0 || _document$getElementB1.addEventListener('input', function (e) {
        _this.setOverlayOpacity(e.target.value / 100);
      });

      // Slider de rotação
      (_document$getElementB10 = document.getElementById('svgRotationSlider')) === null || _document$getElementB10 === void 0 || _document$getElementB10.addEventListener('input', function (e) {
        _this.setRotation(parseFloat(e.target.value));
      });

      // Confirmar importação (agora salva como overlay permanente em vez de converter)
      (_document$getElementB11 = document.getElementById('svgImportConfirm')) === null || _document$getElementB11 === void 0 || _document$getElementB11.addEventListener('click', function () {
        _this.saveAsOverlay();
      });

      // Event listeners do SVGEditorManager
      this.eventBus.on('svg:highlight_shape', function (data) {
        _this.highlightShape(data.index);
      });
      this.eventBus.on('svg:update_colors', function (data) {
        _this.shapeMapping = data.mapping;
        _this.updateShapeColors();
      });
    }

    /**
     * Carrega dados salvos (chamado na inicialização)
     */
  }, {
    key: "loadSavedOverlay",
    value: function loadSavedOverlay() {
      var svgInput = document.getElementById('terreno_svg_content');
      var boundsInput = document.getElementById('terreno_svg_bounds');
      var rotationInput = document.getElementById('terreno_svg_rotation');
      var mappingInput = document.getElementById('terreno_shape_mapping');
      if (svgInput !== null && svgInput !== void 0 && svgInput.value) {
        this.svgContent = svgInput.value;
      }
      if (boundsInput !== null && boundsInput !== void 0 && boundsInput.value) {
        try {
          var bounds = JSON.parse(boundsInput.value);
          this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.south, bounds.west), new google.maps.LatLng(bounds.north, bounds.east));
        } catch (e) {}
      }
      if (rotationInput !== null && rotationInput !== void 0 && rotationInput.value) {
        this.overlay.rotation = parseFloat(rotationInput.value) || 0;
      }
      if (mappingInput !== null && mappingInput !== void 0 && mappingInput.value) {
        try {
          this.shapeMapping = JSON.parse(mappingInput.value);
        } catch (e) {}
      }

      // Se tem SVG salvo, renderiza o overlay
      if (this.svgContent && this.overlay.bounds) {
        this.renderSavedOverlay();
      }
    }

    /**
     * Renderiza overlay salvo anteriormente
     */
  }, {
    key: "renderSavedOverlay",
    value: function renderSavedOverlay() {
      var _this2 = this;
      if (!this.svgContent || !this.overlay.bounds) return;

      // Parse o SVG para extrair shapes
      this.parseSVGContent();

      // Cria o overlay no mapa
      var OverlayClass = getCustomSVGOverlayClass();
      this.customOverlay = new OverlayClass(this.overlay.bounds, this.svgContent, this.map, this, true // isEditorMode = true
      );
      this.customOverlay.setMap(this.map);

      // Aplica rotação salva
      if (this.overlay.rotation) {
        this.customOverlay.updateRotation(this.overlay.rotation);
      }

      // Aplica cores baseado no mapping e renderiza shapes na sidebar
      setTimeout(function () {
        _this2.updateShapeColors();
        _this2.renderShapesInSidebar();
      }, 100);
    }

    /**
     * Parse do conteúdo SVG para extrair shapes
     */
  }, {
    key: "parseSVGContent",
    value: function parseSVGContent() {
      if (!this.svgContent) return;
      var parser = new DOMParser();
      var doc = parser.parseFromString(this.svgContent, 'image/svg+xml');
      var svgEl = doc.documentElement;

      // Extrai viewBox
      var viewBoxAttr = svgEl.getAttribute('viewBox');
      if (viewBoxAttr) {
        var parts = viewBoxAttr.split(/[\s,]+/).map(parseFloat);
        this.viewBox = {
          x: parts[0] || 0,
          y: parts[1] || 0,
          width: parts[2] || 100,
          height: parts[3] || 100
        };
      }

      // Extrai shapes
      var shapeSelectors = 'polygon, path, polyline, rect';
      var shapeElements = svgEl.querySelectorAll(shapeSelectors);
      this.shapes = Array.from(shapeElements).map(function (el, index) {
        return {
          index: index,
          type: el.tagName.toLowerCase(),
          id: el.id || "shape_".concat(index),
          fill: el.getAttribute('fill') || '#ccc',
          stroke: el.getAttribute('stroke') || '#000'
        };
      });
    }

    /**
     * Abre o modal de importação
     */
  }, {
    key: "openModal",
    value: function openModal() {
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
  }, {
    key: "closeModal",
    value: function closeModal() {
      var keepOverlay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.modal) {
        this.isModalOpen = false;
        this.modal.style.display = 'none';

        // Verifica se há um SVG salvo nos inputs hidden
        var svgInput = document.getElementById('terreno_svg_content');
        var hasSavedSvg = svgInput && svgInput.value;

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
  }, {
    key: "resetState",
    value: function resetState() {
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
        height: 400
      };

      // Reset UI
      var step1 = document.getElementById('svgStep1');
      var step2 = document.getElementById('svgStep2');
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'none';
      var uploadStatus = document.getElementById('svgUploadStatus');
      if (uploadStatus) uploadStatus.style.display = 'none';
      var confirmBtn = document.getElementById('svgImportConfirm');
      if (confirmBtn) confirmBtn.disabled = true;

      // Reset sliders
      var opacitySlider = document.getElementById('svgOpacitySlider');
      if (opacitySlider) opacitySlider.value = 70;
      var rotationSlider = document.getElementById('svgRotationSlider');
      if (rotationSlider) rotationSlider.value = 0;
      var rotationValue = document.getElementById('svgRotationValue');
      if (rotationValue) rotationValue.textContent = '0°';
    }

    /**
     * Processa o upload do arquivo SVG
     */
  }, {
    key: "handleFileUpload",
    value: (function () {
      var _handleFileUpload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(file) {
        var _this3 = this;
        var reader;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (file.name.endsWith('.svg')) {
                _context2.n = 1;
                break;
              }
              alert('Por favor, selecione um arquivo SVG válido.');
              return _context2.a(2);
            case 1:
              reader = new FileReader();
              reader.onload = /*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
                  return _regenerator().w(function (_context) {
                    while (1) switch (_context.n) {
                      case 0:
                        _this3.svgContent = e.target.result;
                        _context.n = 1;
                        return _this3.processSVG(file.name);
                      case 1:
                        return _context.a(2);
                    }
                  }, _callee);
                }));
                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }();
              reader.readAsText(file);
            case 2:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function handleFileUpload(_x) {
        return _handleFileUpload.apply(this, arguments);
      }
      return handleFileUpload;
    }()
    /**
     * Processa o SVG via AJAX (extrai shapes) e cria o overlay
     */
    )
  }, {
    key: "processSVG",
    value: (function () {
      var _processSVG = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(fileName) {
        var uploadStatus, fileNameEl, shapeCountEl, formData, response, result, step1, step2, confirmBtn, _result$data, _t;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              // Mostra loading
              uploadStatus = document.getElementById('svgUploadStatus');
              fileNameEl = document.getElementById('svgFileName');
              shapeCountEl = document.getElementById('svgShapeCount');
              if (uploadStatus) uploadStatus.style.display = 'block';
              if (fileNameEl) fileNameEl.textContent = "Processando ".concat(fileName, "...");
              if (shapeCountEl) shapeCountEl.textContent = '';

              // Envia para o backend processar
              formData = new FormData();
              formData.append('action', 'terreno_parse_svg');
              formData.append('nonce', terreno_ajax.nonce);
              formData.append('svg_content', this.svgContent);
              _context3.n = 1;
              return fetch(terreno_ajax.ajax_url, {
                method: 'POST',
                body: formData
              });
            case 1:
              response = _context3.v;
              _context3.n = 2;
              return response.json();
            case 2:
              result = _context3.v;
              if (result.success) {
                this.shapes = result.data.shapes;
                this.viewBox = result.data.viewBox;

                // Atualiza UI
                if (fileNameEl) fileNameEl.textContent = fileName;
                if (shapeCountEl) shapeCountEl.textContent = "".concat(this.shapes.length, " shapes encontrados");

                // Mostra step 2
                step1 = document.getElementById('svgStep1');
                step2 = document.getElementById('svgStep2');
                if (step1) step1.style.display = 'none';
                if (step2) step2.style.display = 'block';

                // Cria o overlay no mapa
                this.createMapOverlay();

                // Habilita botão de confirmar
                confirmBtn = document.getElementById('svgImportConfirm');
                if (confirmBtn) confirmBtn.disabled = false;

                // Renderiza lista de shapes
                this.renderShapesList();
              } else {
                alert('Erro ao processar SVG: ' + (((_result$data = result.data) === null || _result$data === void 0 ? void 0 : _result$data.message) || 'Erro desconhecido'));
                if (uploadStatus) uploadStatus.style.display = 'none';
              }
              _context3.n = 4;
              break;
            case 3:
              _context3.p = 3;
              _t = _context3.v;
              console.error('Erro ao processar SVG:', _t);
              alert('Erro ao processar SVG. Verifique o console para detalhes.');
            case 4:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 3]]);
      }));
      function processSVG(_x3) {
        return _processSVG.apply(this, arguments);
      }
      return processSVG;
    }()
    /**
     * Cria o overlay do SVG sobre o mapa principal
     */
    )
  }, {
    key: "createMapOverlay",
    value: function createMapOverlay() {
      // Remove overlay anterior se existir
      this.removeOverlay();

      // Define posição inicial baseada no centro do mapa
      var mapCenter = this.map.getCenter();
      this.overlay.center = {
        lat: mapCenter.lat(),
        lng: mapCenter.lng()
      };

      // Calcula bounds iniciais baseado no viewBox do SVG
      var aspectRatio = this.viewBox ? this.viewBox.width / this.viewBox.height : 1;

      // Tamanho inicial do overlay (em graus, aproximadamente)
      var initialSize = 0.002; // ~200 metros
      var halfWidth = initialSize * aspectRatio / 2;
      var halfHeight = initialSize / 2;
      this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(this.overlay.center.lat - halfHeight, this.overlay.center.lng - halfWidth), new google.maps.LatLng(this.overlay.center.lat + halfHeight, this.overlay.center.lng + halfWidth));

      // Cria Custom Overlay (usa factory function para garantir que Google Maps já está carregado)
      var OverlayClass = getCustomSVGOverlayClass();
      this.customOverlay = new OverlayClass(this.overlay.bounds, this.svgContent, this.map, this);
      this.customOverlay.setMap(this.map);

      // Centraliza o mapa no overlay
      this.map.setCenter(mapCenter);
      this.map.setZoom(18);
    }

    /**
     * Remove o overlay do mapa
     */
  }, {
    key: "removeOverlay",
    value: function removeOverlay() {
      if (this.customOverlay) {
        this.customOverlay.setMap(null);
        this.customOverlay = null;
      }
    }

    /**
     * Confirma e remove completamente o SVG e todos os dados relacionados
     */
  }, {
    key: "confirmAndRemoveSvg",
    value: function confirmAndRemoveSvg() {
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
        height: 400
      };

      // Limpa os inputs hidden
      var svgInput = document.getElementById('terreno_svg_content');
      var boundsInput = document.getElementById('terreno_svg_bounds');
      var rotationInput = document.getElementById('terreno_svg_rotation');
      var mappingInput = document.getElementById('terreno_shape_mapping');
      if (svgInput) svgInput.value = '';
      if (boundsInput) boundsInput.value = '';
      if (rotationInput) rotationInput.value = '';
      if (mappingInput) mappingInput.value = '';

      // Atualiza a sidebar de shapes
      var container = document.getElementById('shapes-sidebar-container');
      var countEl = document.getElementById('total-shapes');
      var mappedCountEl = document.getElementById('shapes-mapped-count');
      if (countEl) countEl.textContent = '0';
      if (mappedCountEl) mappedCountEl.textContent = '0';
      if (container) {
        container.innerHTML = "\n        <div class=\"no-lotes\" id=\"no-shapes-message\">\n          <div class=\"no-lotes-icon\">\n            <span class=\"dashicons dashicons-admin-multisite\"></span>\n          </div>\n          <p>Nenhum shape carregado.</p>\n          <p class=\"help-text\">Importe um SVG para visualizar os shapes.</p>\n        </div>\n      ";
      }

      // Atualiza visibilidade dos botões
      this.updateSvgButtonsVisibility(false);

      // Emite evento para outros managers
      this.eventBus.emit('svg:removed', {});
      alert('SVG removido. Salve o post para confirmar a remoção.');
    }

    /**
     * Rotaciona o overlay
     */
  }, {
    key: "rotateOverlay",
    value: function rotateOverlay(degrees) {
      this.overlay.rotation += degrees;
      this.overlay.rotation = this.overlay.rotation % 360;
      this.updateOverlayTransform();
      var rotationSlider = document.getElementById('svgRotationSlider');
      var rotationValue = document.getElementById('svgRotationValue');
      if (rotationSlider) rotationSlider.value = this.overlay.rotation;
      if (rotationValue) {
        rotationValue.textContent = "".concat(Math.round(this.overlay.rotation), "\xB0");
      }
    }

    /**
     * Define rotação específica
     */
  }, {
    key: "setRotation",
    value: function setRotation(degrees) {
      this.overlay.rotation = degrees;
      this.updateOverlayTransform();
      if (!this.isModalOpen) return;
      var rotationValue = document.getElementById('svgRotationValue');
      if (rotationValue) rotationValue.textContent = "".concat(Math.round(degrees), "\xB0");
    }

    /**
     * Escala o overlay
     */
  }, {
    key: "scaleOverlay",
    value: function scaleOverlay(factor) {
      var _this$customOverlay;
      if (!this.overlay.bounds || !this.overlay.center) return;
      var bounds = this.overlay.bounds;
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var centerLat = this.overlay.center.lat;
      var centerLng = this.overlay.center.lng;
      var halfHeight = (ne.lat() - sw.lat()) / 2 * factor;
      var halfWidth = (ne.lng() - sw.lng()) / 2 * factor;
      this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(centerLat - halfHeight, centerLng - halfWidth), new google.maps.LatLng(centerLat + halfHeight, centerLng + halfWidth));
      (_this$customOverlay = this.customOverlay) === null || _this$customOverlay === void 0 || _this$customOverlay.updateBounds(this.overlay.bounds);
    }

    /**
     * Atualiza os bounds do overlay baseado na escala
     */
  }, {
    key: "updateOverlayBounds",
    value: function updateOverlayBounds() {
      if (!this.overlay.bounds || !this.overlay.center) return;
      var currentBounds = this.overlay.bounds;
      var ne = currentBounds.getNorthEast();
      var sw = currentBounds.getSouthWest();
      var centerLat = this.overlay.center.lat;
      var centerLng = this.overlay.center.lng;
      var halfHeight = (ne.lat() - sw.lat()) / 2 * this.overlay.scale;
      var halfWidth = (ne.lng() - sw.lng()) / 2 * this.overlay.scale;
      this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(centerLat - halfHeight, centerLng - halfWidth), new google.maps.LatLng(centerLat + halfHeight, centerLng + halfWidth));
      this.overlay.scale = 1; // Reset scale after applying

      if (this.customOverlay) {
        this.customOverlay.updateBounds(this.overlay.bounds);
      }
    }

    /**
     * Atualiza a transformação visual do overlay
     */
  }, {
    key: "updateOverlayTransform",
    value: function updateOverlayTransform() {
      if (this.customOverlay) {
        this.customOverlay.updateRotation(this.overlay.rotation);
      }
    }

    /**
     * Define a opacidade do overlay
     */
  }, {
    key: "setOverlayOpacity",
    value: function setOverlayOpacity(opacity) {
      if (this.customOverlay) {
        this.customOverlay.setOpacity(opacity);
      }
    }

    /**
     * Reseta as transformações
     */
  }, {
    key: "resetTransform",
    value: function resetTransform() {
      // Só reseta se houver SVG carregado
      if (!this.svgContent || !this.map) return;
      this.overlay.rotation = 0;
      this.overlay.scale = 1;
      this.updateOverlayTransform();
      this.createMapOverlay(); // Recria na posição inicial

      var rotationSlider = document.getElementById('svgRotationSlider');
      var rotationValue = document.getElementById('svgRotationValue');
      if (rotationSlider) rotationSlider.value = 0;
      if (rotationValue) rotationValue.textContent = '0°';
    }

    /**
     * Renderiza lista de shapes detectados (na sidebar)
     */
  }, {
    key: "renderShapesList",
    value: function renderShapesList() {
      // Renderiza na sidebar principal
      this.renderShapesInSidebar();
    }

    /**
     * Renderiza lista de shapes na sidebar principal
     */
  }, {
    key: "renderShapesInSidebar",
    value: function renderShapesInSidebar() {
      var _this4 = this;
      var container = document.getElementById('shapes-sidebar-container');
      var countEl = document.getElementById('total-shapes');
      var mappedCountEl = document.getElementById('shapes-mapped-count');
      var noShapesMessage = document.getElementById('no-shapes-message');
      if (countEl) countEl.textContent = this.shapes.length;
      if (!container) return;
      if (this.shapes.length === 0) {
        if (noShapesMessage) noShapesMessage.style.display = 'block';
        return;
      }
      if (noShapesMessage) noShapesMessage.style.display = 'none';

      // Conta shapes mapeados
      var mappedCount = Object.keys(this.shapeMapping || {}).length;
      if (mappedCountEl) mappedCountEl.textContent = mappedCount;
      var html = this.shapes.map(function (shape, index) {
        var _this4$shapeMapping;
        var mapping = (_this4$shapeMapping = _this4.shapeMapping) === null || _this4$shapeMapping === void 0 ? void 0 : _this4$shapeMapping[index];
        var isMapped = !!mapping;
        var statusClass = isMapped ? 'shape-mapped' : 'shape-unmapped';
        var statusText = isMapped ? "Quadra ".concat(mapping.bloco, " | Lote ").concat(mapping.lote_id) : 'Clique para vincular';
        return "\n          <div class=\"shape-item ".concat(statusClass, "\" data-shape-index=\"").concat(index, "\">\n            <div class=\"shape-header\">\n              \n              <span class=\"shape-name\">").concat(shape.id || "Shape ".concat(index + 1), "</span>\n              \n              <div class=\"shape-status\">").concat(statusText, "</div>\n            </div>\n            \n            <div class=\"shape-actions\">\n              <button type=\"button\" class=\"button button-small shape-edit-btn\" data-shape-index=\"").concat(index, "\">\n                <span class=\"dashicons dashicons-edit\" style=\"font-size: 14px; width: 14px; height: 14px;\"></span>\n                ").concat(isMapped ? 'Editar' : 'Vincular', "\n              </button>\n              ").concat(isMapped ? "\n              <button type=\"button\" class=\"button button-small shape-remove-btn\" data-shape-index=\"".concat(index, "\" style=\"color: #b32d2e;\">\n                <span class=\"dashicons dashicons-no\" style=\"font-size: 14px; width: 14px; height: 14px;\"></span>\n                Remover\n              </button>\n              ") : '', "\n            </div>\n          </div>\n        ");
      }).join('');
      container.innerHTML = html;

      // Adiciona event listeners para hover/click nos shapes
      this.setupShapeItemListeners();
    }

    /**
     * Configura event listeners para os itens de shape na sidebar
     */
  }, {
    key: "setupShapeItemListeners",
    value: function setupShapeItemListeners() {
      var _this5 = this;
      var items = document.querySelectorAll('.shape-item');
      items.forEach(function (item) {
        var index = parseInt(item.dataset.shapeIndex);
        item.addEventListener('mouseenter', function () {
          _this5.highlightShape(index);
        });
        item.addEventListener('mouseleave', function () {
          _this5.unhighlightShape(index);
        });
      });

      // Botões de editar
      var editBtns = document.querySelectorAll('.shape-edit-btn');
      editBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var index = parseInt(btn.dataset.shapeIndex);
          _this5.openShapeEditModal(index);
        });
      });

      // Botões de remover vínculo
      var removeBtns = document.querySelectorAll('.shape-remove-btn');
      removeBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var index = parseInt(btn.dataset.shapeIndex);
          _this5.removeShapeMapping(index);
        });
      });
    }

    /**
     * Abre modal de edição para um shape específico
     */
  }, {
    key: "openShapeEditModal",
    value: (function () {
      var _openShapeEditModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(index) {
        var _this$shapeMapping,
          _this6 = this;
        var shape, mapping, loteData, modal, unidadeIdInput, blocoInput, nomeInput;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              shape = this.shapes[index];
              mapping = (_this$shapeMapping = this.shapeMapping) === null || _this$shapeMapping === void 0 ? void 0 : _this$shapeMapping[index]; // Prepara dados para o modal
              loteData = {
                id: (mapping === null || mapping === void 0 ? void 0 : mapping.lote_id) || '',
                bloco: (mapping === null || mapping === void 0 ? void 0 : mapping.bloco) || '',
                nome: (mapping === null || mapping === void 0 ? void 0 : mapping.nome) || (shape === null || shape === void 0 ? void 0 : shape.id) || "Shape ".concat(index + 1)
              }; // Usa o ModalManager se disponível (através do eventBus)
              // Emite evento para abrir o modal
              this.eventBus.emit('modal:open_edit', {
                loteData: loteData,
                callback: function callback(result) {
                  if (result) {
                    _this6.saveShapeMappingData(index, result);
                  }
                }
              });

              // Fallback: se o modal não foi aberto pelo eventBus, usa método direto
              modal = document.getElementById('editModal');
              if (modal && modal.style.display !== 'block') {
                // Preenche os campos manualmente
                unidadeIdInput = document.getElementById('editLoteUnidadeId');
                blocoInput = document.getElementById('editLoteBloco');
                nomeInput = document.getElementById('editLoteNome');
                if (unidadeIdInput) unidadeIdInput.value = loteData.id;
                if (blocoInput) blocoInput.value = loteData.bloco;
                if (nomeInput) nomeInput.value = loteData.nome;

                // Armazena o índice do shape sendo editado
                this.editingShapeIndex = index;

                // Mostra o modal
                modal.style.display = 'block';

                // Adiciona listeners temporários para os botões
                this.setupModalListeners();
              }
            case 1:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function openShapeEditModal(_x4) {
        return _openShapeEditModal.apply(this, arguments);
      }
      return openShapeEditModal;
    }()
    /**
     * Configura listeners temporários para o modal
     */
    )
  }, {
    key: "setupModalListeners",
    value: function setupModalListeners() {
      var _this7 = this;
      var modal = document.getElementById('editModal');
      if (!modal) return;
      var saveBtn = modal.querySelector('.button-primary');
      var cancelBtn = modal.querySelector('.button-secondary');

      // Remove listeners antigos
      var newSaveBtn = saveBtn.cloneNode(true);
      var newCancelBtn = cancelBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
      cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

      // Adiciona novos listeners
      newSaveBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _this7.handleModalSave();
      });
      newCancelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _this7.closeShapeEditModal();
      });
    }

    /**
     * Handler para salvar do modal
     */
  }, {
    key: "handleModalSave",
    value: function handleModalSave() {
      var _document$getElementB12, _document$getElementB13, _document$getElementB14;
      var index = this.editingShapeIndex;
      if (index === null || index === undefined) return;
      var unidadeId = (_document$getElementB12 = document.getElementById('editLoteUnidadeId')) === null || _document$getElementB12 === void 0 || (_document$getElementB12 = _document$getElementB12.value) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.trim();
      var bloco = (_document$getElementB13 = document.getElementById('editLoteBloco')) === null || _document$getElementB13 === void 0 || (_document$getElementB13 = _document$getElementB13.value) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.trim();
      var nome = (_document$getElementB14 = document.getElementById('editLoteNome')) === null || _document$getElementB14 === void 0 || (_document$getElementB14 = _document$getElementB14.value) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.trim();
      if (!unidadeId) {
        alert('O ID da Unidade é obrigatório');
        return;
      }
      if (!bloco) {
        alert('A Quadra/Bloco é obrigatória');
        return;
      }
      this.saveShapeMappingData(index, {
        id: unidadeId,
        bloco: bloco,
        nome: nome
      });
      this.closeShapeEditModal();
    }

    /**
     * Fecha o modal de edição de shape
     */
  }, {
    key: "closeShapeEditModal",
    value: function closeShapeEditModal() {
      var modal = document.getElementById('editModal');
      if (modal) {
        modal.style.display = 'none';
      }
      this.editingShapeIndex = null;
    }

    /**
     * Salva o mapeamento do shape com os dados fornecidos
     */
  }, {
    key: "saveShapeMappingData",
    value: function saveShapeMappingData(index, data) {
      // Salva no mapeamento
      if (!this.shapeMapping) {
        this.shapeMapping = {};
      }
      this.shapeMapping[index] = {
        lote_id: data.id,
        bloco: data.bloco,
        nome: data.nome,
        shape_index: index
      };

      // Atualiza o input hidden
      var mappingInput = document.getElementById('terreno_shape_mapping');
      if (mappingInput) {
        mappingInput.value = JSON.stringify(this.shapeMapping);
      }

      // Atualiza a UI
      this.renderShapesInSidebar();
      this.updateShapeColors();
    }

    /**
     * Remove o mapeamento de um shape
     */
  }, {
    key: "removeShapeMapping",
    value: function removeShapeMapping(index) {
      if (!confirm('Tem certeza que deseja remover o vínculo deste shape?')) {
        return;
      }
      if (this.shapeMapping && this.shapeMapping[index]) {
        delete this.shapeMapping[index];
      }

      // Atualiza o input hidden
      var mappingInput = document.getElementById('terreno_shape_mapping');
      if (mappingInput) {
        mappingInput.value = JSON.stringify(this.shapeMapping || {});
      }

      // Atualiza a UI
      this.renderShapesInSidebar();
      this.updateShapeColors();
    }

    /**
     * Remove destaque de um shape
     */
  }, {
    key: "unhighlightShape",
    value: function unhighlightShape(index) {
      if (this.customOverlay) {
        this.customOverlay.unhighlightShape(index);
      }
    }

    /**
     * Atualiza o centro do overlay (chamado durante drag)
     */
  }, {
    key: "updateOverlayCenter",
    value: function updateOverlayCenter(newCenter) {
      var oldCenter = this.overlay.center;
      var bounds = this.overlay.bounds;
      if (!oldCenter || !bounds) return;
      var dLat = newCenter.lat - oldCenter.lat;
      var dLng = newCenter.lng - oldCenter.lng;
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      this.overlay.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(sw.lat() + dLat, sw.lng() + dLng), new google.maps.LatLng(ne.lat() + dLat, ne.lng() + dLng));
      this.overlay.center = newCenter;
    }

    /**
     * Salva o SVG como overlay permanente (nova abordagem)
     * Em vez de converter para polígonos, mantém o SVG como overlay
     */
  }, {
    key: "saveAsOverlay",
    value: function saveAsOverlay() {
      var _this8 = this;
      try {
        if (!this.svgContent) {
          alert('Nenhum SVG carregado.');
          return;
        }

        // Se não tem bounds, tenta criar o overlay primeiro
        if (!this.overlay.bounds) {
          this.createMapOverlay();

          // Aguarda um pouco para o overlay ser criado
          setTimeout(function () {
            if (_this8.overlay.bounds) {
              _this8.completeSaveOverlay();
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
  }, {
    key: "completeSaveOverlay",
    value: function completeSaveOverlay() {
      // Verifica novamente para segurança
      if (!this.overlay.bounds) {
        console.error('Bounds ainda é null após criação do overlay');
        alert('Erro ao posicionar SVG. Recarregue a página e tente novamente.');
        return;
      }

      // Salva os dados nos inputs hidden
      this.updateHiddenInputs();

      // Captura os valores dos bounds antes de emitir eventos
      var boundsData = {
        north: this.overlay.bounds.getNorthEast().lat(),
        south: this.overlay.bounds.getSouthWest().lat(),
        east: this.overlay.bounds.getNorthEast().lng(),
        west: this.overlay.bounds.getSouthWest().lng()
      };

      // Emite evento para o SVGEditorManager processar
      this.eventBus.emit('svg:loaded', {
        svgContent: this.svgContent,
        shapes: this.shapes,
        viewBox: this.viewBox
      });
      this.eventBus.emit('svg:positioned', {
        bounds: boundsData,
        rotation: this.overlay.rotation,
        center: this.overlay.center
      });

      // Fecha o modal de importação (mantém o overlay no mapa)
      this.closeModal(true);

      // Ativa modo de edição no overlay
      this.enableEditorMode();

      // Atualiza visibilidade dos botões
      this.updateSvgButtonsVisibility(true);
    }

    /**
     * Atualiza a visibilidade dos botões de SVG dinamicamente
     * @param {boolean} hasSvg - Se true, há SVG importado; se false, não há
     */
  }, {
    key: "updateSvgButtonsVisibility",
    value: function updateSvgButtonsVisibility(hasSvg) {
      var _this9 = this;
      var btnImportar = document.getElementById('btn_importar_svg');
      var btnAjustar = document.getElementById('btn_ajustar_svg');
      var btnRemover = document.getElementById('btn_remover_svg');
      if (hasSvg) {
        // SVG importado: esconde Importar, mostra Ajustar e Remover
        if (btnImportar) {
          btnImportar.style.display = 'none';
        }

        // Cria botão Ajustar se não existir
        if (!btnAjustar) {
          var ajustarBtn = document.createElement('button');
          ajustarBtn.type = 'button';
          ajustarBtn.className = 'button';
          ajustarBtn.id = 'btn_ajustar_svg';
          ajustarBtn.style.cssText = 'width: 100%; margin-bottom: 5px;';
          ajustarBtn.innerHTML = '<span class="dashicons dashicons-move" style="margin-top: 3px;"></span> Ajustar Posicao';
          ajustarBtn.addEventListener('click', function (e) {
            e.preventDefault();
            _this9.toggleEditMode();
          });
          var container = btnImportar === null || btnImportar === void 0 ? void 0 : btnImportar.parentElement;
          if (container && btnImportar) {
            container.insertBefore(ajustarBtn, btnImportar.nextSibling);
          }
        } else {
          btnAjustar.style.display = 'block';
          btnAjustar.disabled = false;
        }

        // Cria botão Remover se não existir
        if (!btnRemover) {
          var removerBtn = document.createElement('button');
          removerBtn.type = 'button';
          removerBtn.className = 'button';
          removerBtn.id = 'btn_remover_svg';
          removerBtn.style.cssText = 'width: 100%; color: #b32d2e; border-color: #b32d2e;';
          removerBtn.innerHTML = '<span class="dashicons dashicons-trash" style="margin-top: 3px;"></span> Remover SVG';
          removerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            _this9.confirmAndRemoveSvg();
          });
          var _ajustarBtn = document.getElementById('btn_ajustar_svg');
          var _container = _ajustarBtn === null || _ajustarBtn === void 0 ? void 0 : _ajustarBtn.parentElement;
          if (_container && _ajustarBtn) {
            _container.insertBefore(removerBtn, _ajustarBtn.nextSibling);
          }
        } else {
          btnRemover.style.display = 'block';
        }
      } else {
        // Sem SVG: mostra Importar, esconde Ajustar e Remover
        if (btnImportar) {
          btnImportar.style.display = 'block';
        }
        if (btnAjustar) {
          btnAjustar.style.display = 'none';
        }
        if (btnRemover) {
          btnRemover.style.display = 'none';
        }
      }
    }

    /**
     * Atualiza inputs hidden com dados do overlay
     */
  }, {
    key: "updateHiddenInputs",
    value: function updateHiddenInputs() {
      var container = document.querySelector('#terreno-mapa-container');
      if (!container) return;

      // SVG Content
      var svgInput = document.getElementById('terreno_svg_content');
      if (!svgInput) {
        svgInput = document.createElement('input');
        svgInput.type = 'hidden';
        svgInput.id = 'terreno_svg_content';
        svgInput.name = 'terreno_svg_content';
        container.appendChild(svgInput);
      }
      svgInput.value = this.svgContent || '';

      // Bounds
      var boundsInput = document.getElementById('terreno_svg_bounds');
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
          west: this.overlay.bounds.getSouthWest().lng()
        });
      }

      // Rotation
      var rotationInput = document.getElementById('terreno_svg_rotation');
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
  }, {
    key: "enableEditorMode",
    value: function enableEditorMode() {
      this.isEditorMode = true;
      if (this.customOverlay) {
        this.customOverlay.enableEditorMode();
      }
    }

    /**
     * Desativa modo de edição
     */
  }, {
    key: "disableEditorMode",
    value: function disableEditorMode() {
      this.isEditorMode = false;
      if (this.customOverlay) {
        this.customOverlay.disableEditorMode();
      }
    }

    /**
     * Alterna modo de edição/posicionamento do SVG
     */
  }, {
    key: "toggleEditMode",
    value: function toggleEditMode() {
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
  }, {
    key: "openModalForAdjustment",
    value: function openModalForAdjustment() {
      if (!this.modal) return;
      this.isModalOpen = true;
      this.modal.style.display = 'block';

      // Esconde step 1 (upload) e mostra step 2 (controles)
      var step1 = document.getElementById('svgStep1');
      var step2 = document.getElementById('svgStep2');
      if (step1) step1.style.display = 'none';
      if (step2) step2.style.display = 'block';

      // Habilita botão de confirmar
      var confirmBtn = document.getElementById('svgImportConfirm');
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Salvar Ajustes';
      }

      // Ativa modo de posicionamento no overlay (não editor)
      if (this.customOverlay) {
        this.customOverlay.disableEditorMode();
      }

      // Atualiza sliders com valores atuais
      var rotationSlider = document.getElementById('svgRotationSlider');
      var rotationValue = document.getElementById('svgRotationValue');
      if (rotationSlider) rotationSlider.value = this.overlay.rotation || 0;
      if (rotationValue) rotationValue.textContent = "".concat(Math.round(this.overlay.rotation || 0), "\xB0");
    }

    /**
     * Destaca um shape específico no overlay
     */
  }, {
    key: "highlightShape",
    value: function highlightShape(index) {
      this.selectedShapeIndex = index;
      if (this.customOverlay) {
        this.customOverlay.highlightShape(index);
      }
    }

    /**
     * Atualiza cores dos shapes baseado no mapeamento
     */
  }, {
    key: "updateShapeColors",
    value: function updateShapeColors() {
      if (this.customOverlay) {
        this.customOverlay.updateShapeColors(this.shapeMapping);
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
  }, {
    key: "svgPointToLatLng",
    value: function svgPointToLatLng(svgPoint) {
      var bounds = this.overlay.bounds;
      var rotation = this.overlay.rotation;
      var vb = this.viewBox;

      // Normaliza coordenadas do SVG para 0-1
      var normalizedX = (svgPoint.x - vb.x) / vb.width;
      var normalizedY = (svgPoint.y - vb.y) / vb.height;

      // Centro do overlay em coordenadas normalizadas
      var centerX = 0.5;
      var centerY = 0.5;

      // Aplica rotação em torno do centro
      var angleRad = rotation * Math.PI / 180;
      var cos = Math.cos(angleRad);
      var sin = Math.sin(angleRad);

      // Translada para origem, rotaciona, translada de volta
      var dx = normalizedX - centerX;
      var dy = normalizedY - centerY;
      var rotatedX = centerX + (dx * cos - dy * sin);
      var rotatedY = centerY + (dx * sin + dy * cos);

      // Converte para lat/lng usando os bounds
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();

      // X corresponde a longitude, Y corresponde a latitude
      // NOTA: Y do SVG cresce para baixo, latitude cresce para cima
      var lng = sw.lng() + rotatedX * (ne.lng() - sw.lng());
      var lat = ne.lat() - rotatedY * (ne.lat() - sw.lat()); // Invertido

      return {
        lat: lat,
        lng: lng
      };
    }

    /**
     * Calcula área aproximada de um polígono
     */
  }, {
    key: "calculateArea",
    value: function calculateArea(coordinates) {
      if (coordinates.length < 3) return 0;
      var area = 0;
      var n = coordinates.length;
      for (var i = 0; i < n; i++) {
        var j = (i + 1) % n;
        area += coordinates[i].lng * coordinates[j].lat;
        area -= coordinates[j].lng * coordinates[i].lat;
      }
      area = Math.abs(area / 2);
      var metersPerDegree = 111000;
      area = area * metersPerDegree * metersPerDegree;
      return area;
    }

    /**
     * Gera cor aleatória
     */
  }, {
    key: "generateRandomColor",
    value: function generateRandomColor() {
      var colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581', '#FFD54F', '#4DB6AC', '#7986CB'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }]);
}();

/**
 * Cria a classe CustomSVGOverlay quando necessário (após Google Maps carregar)
 * Isso evita o erro de referência ao google.maps.OverlayView antes do Maps API estar pronto
 */
var CustomSVGOverlayClass = null;
function getCustomSVGOverlayClass() {
  if (CustomSVGOverlayClass) {
    return CustomSVGOverlayClass;
  }

  // Define a classe apenas quando necessário (após Google Maps estar carregado)
  CustomSVGOverlayClass = /*#__PURE__*/function (_google$maps$OverlayV) {
    function CustomSVGOverlay(bounds, svgContent, map, manager) {
      var _this0;
      var isEditorMode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      _classCallCheck(this, CustomSVGOverlay);
      _this0 = _callSuper(this, CustomSVGOverlay);
      _this0.bounds = bounds;
      _this0.svgContent = svgContent;
      _this0.manager = manager;
      _this0.div = null;
      _this0.rotation = 0;
      _this0.opacity = 0.7;
      _this0.isDragging = false;
      _this0.isResizing = false;
      _this0.isEditorMode = isEditorMode;
      _this0.selectedShapeIndex = null;
      _this0.shapeMapping = {};
      return _this0;
    }
    _inherits(CustomSVGOverlay, _google$maps$OverlayV);
    return _createClass(CustomSVGOverlay, [{
      key: "onAdd",
      value: function onAdd() {
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
        var svg = this.div.querySelector('svg');
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
        var panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);
      }

      /**
       * Adiciona listeners de clique em cada shape do SVG
       */
    }, {
      key: "addShapeClickListeners",
      value: function addShapeClickListeners() {
        var _this1 = this;
        var svg = this.div.querySelector('svg');
        if (!svg) return;
        var shapes = svg.querySelectorAll('polygon, path, polyline, rect');
        shapes.forEach(function (shape, index) {
          // Torna o shape clicável
          shape.style.cursor = 'pointer';
          shape.style.pointerEvents = 'auto';
          shape.dataset.shapeIndex = index;

          // Hover effect
          shape.addEventListener('mouseenter', function () {
            if (_this1.selectedShapeIndex !== index) {
              shape.style.fill = 'rgba(0, 115, 170, 0.5)';
              shape.style.stroke = '#0073aa';
              shape.style.strokeWidth = '3px';
            }
          });
          shape.addEventListener('mouseleave', function () {
            if (_this1.selectedShapeIndex !== index) {
              _this1.restoreShapeStyle(shape, index);
            }
          });

          // Click - emite evento para o editor
          shape.addEventListener('click', function (e) {
            e.stopPropagation();
            _this1.manager.eventBus.emit('svg:shape_clicked', {
              index: index,
              shape: shape
            });
          });
        });
      }

      /**
       * Restaura estilo original do shape
       */
    }, {
      key: "restoreShapeStyle",
      value: function restoreShapeStyle(shape, index) {
        var mapping = this.shapeMapping[index];
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
    }, {
      key: "highlightShape",
      value: function highlightShape(index) {
        var _this$div;
        var svg = (_this$div = this.div) === null || _this$div === void 0 ? void 0 : _this$div.querySelector('svg');
        if (!svg) return;

        // Remove destaque anterior
        if (this.selectedShapeIndex !== null) {
          var prevShape = svg.querySelector("[data-shape-index=\"".concat(this.selectedShapeIndex, "\"]"));
          if (prevShape) {
            this.restoreShapeStyle(prevShape, this.selectedShapeIndex);
          }
        }
        this.selectedShapeIndex = index;

        // Aplica destaque no novo shape
        var shape = svg.querySelector("[data-shape-index=\"".concat(index, "\"]"));
        if (shape) {
          shape.style.fill = 'rgba(255, 193, 7, 0.5)';
          shape.style.stroke = '#ffc107';
          shape.style.strokeWidth = '4px';
        }
      }

      /**
       * Remove destaque de um shape específico
       */
    }, {
      key: "unhighlightShape",
      value: function unhighlightShape(index) {
        var _this$div2;
        var svg = (_this$div2 = this.div) === null || _this$div2 === void 0 ? void 0 : _this$div2.querySelector('svg');
        if (!svg) return;
        var shape = svg.querySelector("[data-shape-index=\"".concat(index, "\"]"));
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
    }, {
      key: "updateShapeColors",
      value: function updateShapeColors(mapping) {
        var _this$div3,
          _this10 = this;
        this.shapeMapping = mapping || {};
        var svg = (_this$div3 = this.div) === null || _this$div3 === void 0 ? void 0 : _this$div3.querySelector('svg');
        if (!svg) return;
        var shapes = svg.querySelectorAll('polygon, path, polyline, rect');
        shapes.forEach(function (shape, index) {
          if (_this10.selectedShapeIndex !== index) {
            _this10.restoreShapeStyle(shape, index);
          }
        });
      }

      /**
       * Ativa modo editor
       */
    }, {
      key: "enableEditorMode",
      value: function enableEditorMode() {
        this.isEditorMode = true;
        if (this.div) {
          this.div.style.cursor = 'crosshair';
          this.div.classList.add('svg-editor-overlay');
          var svg = this.div.querySelector('svg');
          if (svg) {
            svg.style.pointerEvents = 'auto';
          }

          // Remove handles de resize
          this.div.querySelectorAll('.svg-resize-handle').forEach(function (h) {
            return h.remove();
          });

          // Adiciona listeners de clique
          this.addShapeClickListeners();
        }
      }

      /**
       * Desativa modo editor
       */
    }, {
      key: "disableEditorMode",
      value: function disableEditorMode() {
        this.isEditorMode = false;
        if (this.div) {
          this.div.style.cursor = 'move';
          this.div.classList.remove('svg-editor-overlay');
          var svg = this.div.querySelector('svg');
          if (svg) {
            svg.style.pointerEvents = 'none';
          }

          // Adiciona handles de resize
          this.addResizeHandles();
          this.addDragListeners();
        }
      }
    }, {
      key: "addResizeHandles",
      value: function addResizeHandles() {
        var _this11 = this;
        var corners = ['nw', 'ne', 'sw', 'se'];
        corners.forEach(function (corner) {
          var handle = document.createElement('div');
          handle.className = "svg-resize-handle svg-resize-".concat(corner);
          handle.style.cssText = "\n        position: absolute;\n        width: 12px;\n        height: 12px;\n        background: #0073aa;\n        border: 2px solid white;\n        border-radius: 50%;\n        cursor: ".concat(corner, "-resize;\n        z-index: 1000;\n      ");

          // Posiciona os handles
          if (corner.includes('n')) handle.style.top = '-6px';
          if (corner.includes('s')) handle.style.bottom = '-6px';
          if (corner.includes('w')) handle.style.left = '-6px';
          if (corner.includes('e')) handle.style.right = '-6px';
          handle.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            _this11.startResize(e, corner);
          });
          _this11.div.appendChild(handle);
        });
      }
    }, {
      key: "addDragListeners",
      value: function addDragListeners() {
        var _this12 = this;
        this.div.addEventListener('mousedown', function (e) {
          if (e.target.classList.contains('svg-resize-handle')) return;
          _this12.startDrag(e);
        });
        document.addEventListener('mousemove', function (e) {
          if (_this12.isDragging) _this12.onDrag(e);
          if (_this12.isResizing) _this12.onResize(e);
        });
        document.addEventListener('mouseup', function () {
          if (_this12.isDragging || _this12.isResizing) {
            // Reabilita o drag do mapa
            var map = _this12.getMap();
            if (map) {
              map.setOptions({
                draggable: true
              });
            }
            // Atualiza hidden inputs com a nova posição
            _this12.manager.updateHiddenInputs();
          }
          _this12.isDragging = false;
          _this12.isResizing = false;
        });
      }
    }, {
      key: "startDrag",
      value: function startDrag(e) {
        this.isDragging = true;
        this.dragStart = {
          x: e.clientX,
          y: e.clientY,
          bounds: new google.maps.LatLngBounds(this.bounds.getSouthWest(), this.bounds.getNorthEast())
        };
        // Desabilita o drag do mapa enquanto arrasta o overlay
        this.getMap().setOptions({
          draggable: false
        });
        e.preventDefault();
        e.stopPropagation();
      }
    }, {
      key: "onDrag",
      value: function onDrag(e) {
        var projection = this.getProjection();
        if (!projection) return;
        var dx = e.clientX - this.dragStart.x;
        var dy = e.clientY - this.dragStart.y;
        var startSW = this.dragStart.bounds.getSouthWest();
        var startNE = this.dragStart.bounds.getNorthEast();
        var swPoint = projection.fromLatLngToDivPixel(startSW);
        var nePoint = projection.fromLatLngToDivPixel(startNE);
        var newSW = projection.fromDivPixelToLatLng(new google.maps.Point(swPoint.x + dx, swPoint.y + dy));
        var newNE = projection.fromDivPixelToLatLng(new google.maps.Point(nePoint.x + dx, nePoint.y + dy));
        this.bounds = new google.maps.LatLngBounds(newSW, newNE);
        this.manager.overlay.bounds = this.bounds;
        this.manager.overlay.center = {
          lat: (newSW.lat() + newNE.lat()) / 2,
          lng: (newSW.lng() + newNE.lng()) / 2
        };
        this.draw();
      }
    }, {
      key: "startResize",
      value: function startResize(e, corner) {
        this.isResizing = true;
        this.resizeCorner = corner;
        this.resizeStart = {
          x: e.clientX,
          y: e.clientY,
          bounds: new google.maps.LatLngBounds(this.bounds.getSouthWest(), this.bounds.getNorthEast())
        };
        // Desabilita o drag do mapa enquanto redimensiona
        this.getMap().setOptions({
          draggable: false
        });
        e.preventDefault();
        e.stopPropagation();
      }
    }, {
      key: "onResize",
      value: function onResize(e) {
        var projection = this.getProjection();
        if (!projection) return;
        var startSW = this.resizeStart.bounds.getSouthWest();
        var startNE = this.resizeStart.bounds.getNorthEast();
        var newSW = startSW;
        var newNE = startNE;
        var swPoint = projection.fromLatLngToDivPixel(startSW);
        var nePoint = projection.fromLatLngToDivPixel(startNE);
        var dx = e.clientX - this.resizeStart.x;
        var dy = e.clientY - this.resizeStart.y;

        // Ajusta baseado no corner sendo arrastado
        if (this.resizeCorner.includes('e')) {
          newNE = projection.fromDivPixelToLatLng(new google.maps.Point(nePoint.x + dx, nePoint.y));
        }
        if (this.resizeCorner.includes('w')) {
          newSW = projection.fromDivPixelToLatLng(new google.maps.Point(swPoint.x + dx, swPoint.y));
        }
        if (this.resizeCorner.includes('n')) {
          newNE = projection.fromDivPixelToLatLng(new google.maps.Point(this.resizeCorner.includes('e') ? nePoint.x + dx : nePoint.x, nePoint.y + dy));
        }
        if (this.resizeCorner.includes('s')) {
          newSW = projection.fromDivPixelToLatLng(new google.maps.Point(this.resizeCorner.includes('w') ? swPoint.x + dx : swPoint.x, swPoint.y + dy));
        }
        this.bounds = new google.maps.LatLngBounds(newSW, newNE);
        this.manager.overlay.bounds = this.bounds;
        this.manager.overlay.center = {
          lat: (newSW.lat() + newNE.lat()) / 2,
          lng: (newSW.lng() + newNE.lng()) / 2
        };
        this.draw();
      }
    }, {
      key: "draw",
      value: function draw() {
        if (!this.div) return;
        var projection = this.getProjection();
        if (!projection) return;
        var sw = projection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        var ne = projection.fromLatLngToDivPixel(this.bounds.getNorthEast());
        if (!sw || !ne) return;
        var width = ne.x - sw.x;
        var height = sw.y - ne.y;
        this.div.style.left = sw.x + 'px';
        this.div.style.top = ne.y + 'px';
        this.div.style.width = width + 'px';
        this.div.style.height = height + 'px';

        // Aplica rotação
        this.div.style.transform = "rotate(".concat(this.rotation, "deg)");
        this.div.style.transformOrigin = 'center center';
      }
    }, {
      key: "updateBounds",
      value: function updateBounds(bounds) {
        this.bounds = bounds;
        this.draw();
      }
    }, {
      key: "updateRotation",
      value: function updateRotation(rotation) {
        this.rotation = rotation;
        this.draw();
      }
    }, {
      key: "setOpacity",
      value: function setOpacity(opacity) {
        this.opacity = opacity;
        if (this.div) {
          var svg = this.div.querySelector('svg');
          if (svg) {
            svg.style.opacity = opacity;
          }
        }
      }
    }, {
      key: "onRemove",
      value: function onRemove() {
        if (this.div) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }
    }]);
  }(google.maps.OverlayView);
  return CustomSVGOverlayClass;
}

/***/ },

/***/ "./assets/js/src/services/AreaCalculator.js"
/*!**************************************************!*\
  !*** ./assets/js/src/services/AreaCalculator.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AreaCalculator: () => (/* binding */ AreaCalculator)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * AreaCalculator - Cálculo de áreas de polígonos
 *
 * Usa a Google Maps Geometry API para cálculos precisos
 *
 * @example
 * const area = AreaCalculator.calculateArea(polygon);
 * const formatted = AreaCalculator.formatArea(area);
 */
var AreaCalculator = /*#__PURE__*/function () {
  function AreaCalculator() {
    _classCallCheck(this, AreaCalculator);
  }
  return _createClass(AreaCalculator, null, [{
    key: "calculateArea",
    value:
    /**
     * Calcula a área de um polígono em metros quadrados
     * @param {google.maps.Polygon} polygon - Polígono do Google Maps
     * @returns {number} Área em m²
     */
    function calculateArea(polygon) {
      if (!polygon || !polygon.getPath) {
        console.error('Polígono inválido para cálculo de área');
        return 0;
      }
      var area = google.maps.geometry.spherical.computeArea(polygon.getPath());
      return Math.round(area * 100) / 100; // Arredonda para 2 casas decimais
    }

    /**
     * Calcula a área a partir de um array de coordenadas
     * @param {Array<Object>} coordinates - Array de {lat, lng}
     * @returns {number} Área em m²
     */
  }, {
    key: "calculateAreaFromCoordinates",
    value: function calculateAreaFromCoordinates(coordinates) {
      if (!coordinates || coordinates.length < 3) {
        return 0;
      }
      var path = coordinates.map(function (coord) {
        return new google.maps.LatLng(coord.lat, coord.lng);
      });
      var area = google.maps.geometry.spherical.computeArea(path);
      return Math.round(area * 100) / 100;
    }

    /**
     * Formata área para exibição com separadores de milhar
     * @param {number} area - Área em m²
     * @returns {string} Área formatada (ex: "1.234,56 m²")
     */
  }, {
    key: "formatArea",
    value: function formatArea(area) {
      if (typeof area !== 'number' || isNaN(area)) {
        return '0 m²';
      }
      var formatted = area.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return "".concat(formatted, " m\xB2");
    }

    /**
     * Converte m² para hectares
     * @param {number} area - Área em m²
     * @returns {number} Área em hectares
     */
  }, {
    key: "toHectares",
    value: function toHectares(area) {
      return area / 10000;
    }

    /**
     * Formata área em hectares
     * @param {number} area - Área em m²
     * @returns {string} Área em hectares formatada
     */
  }, {
    key: "formatAsHectares",
    value: function formatAsHectares(area) {
      var hectares = this.toHectares(area);
      var formatted = hectares.toLocaleString('pt-BR', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });
      return "".concat(formatted, " ha");
    }

    /**
     * Retorna área formatada de forma inteligente (m² ou hectares)
     * @param {number} area - Área em m²
     * @returns {string} Área formatada
     */
  }, {
    key: "formatSmart",
    value: function formatSmart(area) {
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
  }, {
    key: "calculatePerimeter",
    value: function calculatePerimeter(polygon) {
      if (!polygon || !polygon.getPath) {
        return 0;
      }
      var path = polygon.getPath();
      var perimeter = 0;
      for (var i = 0; i < path.getLength(); i++) {
        var point1 = path.getAt(i);
        var point2 = path.getAt((i + 1) % path.getLength());
        perimeter += google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
      }
      return Math.round(perimeter * 100) / 100;
    }

    /**
     * Calcula perímetro a partir de coordenadas
     * @param {Array<Object>} coordinates - Array de {lat, lng}
     * @returns {number} Perímetro em metros
     */
  }, {
    key: "calculatePerimeterFromCoordinates",
    value: function calculatePerimeterFromCoordinates(coordinates) {
      if (!coordinates || coordinates.length < 3) {
        return 0;
      }
      var perimeter = 0;
      for (var i = 0; i < coordinates.length; i++) {
        var point1 = new google.maps.LatLng(coordinates[i].lat, coordinates[i].lng);
        var point2 = new google.maps.LatLng(coordinates[(i + 1) % coordinates.length].lat, coordinates[(i + 1) % coordinates.length].lng);
        perimeter += google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
      }
      return Math.round(perimeter * 100) / 100;
    }

    /**
     * Formata perímetro para exibição
     * @param {number} perimeter - Perímetro em metros
     * @returns {string} Perímetro formatado
     */
  }, {
    key: "formatPerimeter",
    value: function formatPerimeter(perimeter) {
      if (typeof perimeter !== 'number' || isNaN(perimeter)) {
        return '0 m';
      }

      // Se maior que 1000m, mostra em km
      if (perimeter >= 1000) {
        var km = perimeter / 1000;
        return "".concat(km.toFixed(2), " km");
      }
      return "".concat(perimeter.toFixed(2), " m");
    }

    /**
     * Calcula área total de múltiplos polígonos
     * @param {Array<google.maps.Polygon>} polygons - Array de polígonos
     * @returns {number} Área total em m²
     */
  }, {
    key: "calculateTotalArea",
    value: function calculateTotalArea(polygons) {
      var _this = this;
      if (!polygons || !Array.isArray(polygons)) {
        return 0;
      }
      return polygons.reduce(function (total, polygon) {
        return total + _this.calculateArea(polygon);
      }, 0);
    }

    /**
     * Calcula estatísticas de área para múltiplos polígonos
     * @param {Array<google.maps.Polygon>} polygons - Array de polígonos
     * @returns {Object} {total, average, min, max, count}
     */
  }, {
    key: "calculateStatistics",
    value: function calculateStatistics(polygons) {
      var _this2 = this;
      if (!polygons || !Array.isArray(polygons) || polygons.length === 0) {
        return {
          total: 0,
          average: 0,
          min: 0,
          max: 0,
          count: 0
        };
      }
      var areas = polygons.map(function (p) {
        return _this2.calculateArea(p);
      });
      return {
        total: areas.reduce(function (sum, area) {
          return sum + area;
        }, 0),
        average: areas.reduce(function (sum, area) {
          return sum + area;
        }, 0) / areas.length,
        min: Math.min.apply(Math, _toConsumableArray(areas)),
        max: Math.max.apply(Math, _toConsumableArray(areas)),
        count: areas.length
      };
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/ui/ModalManager.js"
/*!******************************************!*\
  !*** ./assets/js/src/ui/ModalManager.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModalManager: () => (/* binding */ ModalManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var ModalManager = /*#__PURE__*/function () {
  function ModalManager() {
    _classCallCheck(this, ModalManager);
    this.modal = null;
    this.resolveCallback = null;
    this.rejectCallback = null;
    this.initialize();
  }

  /**
   * Inicializa o modal e configura event listeners
   */
  return _createClass(ModalManager, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;
      this.modal = document.getElementById('editModal');
      if (!this.modal) {
        return;
      }

      // Botão Salvar
      var saveButton = this.modal.querySelector('button[onclick="saveEditLote()"]');
      if (saveButton) {
        // Remove o onclick inline
        saveButton.removeAttribute('onclick');
        saveButton.addEventListener('click', function () {
          return _this.handleSave();
        });
      }

      // Botão Cancelar
      var cancelButton = this.modal.querySelector('button[onclick="closeEditModal()"]');
      if (cancelButton) {
        // Remove o onclick inline
        cancelButton.removeAttribute('onclick');
        cancelButton.addEventListener('click', function () {
          return _this.handleCancel();
        });
      }

      // Fechar ao clicar fora do modal
      this.modal.addEventListener('click', function (e) {
        if (e.target === _this.modal) {
          _this.handleCancel();
        }
      });

      // Fechar com tecla ESC
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && _this.isOpen()) {
          _this.handleCancel();
        }
      });
    }

    /**
     * Abre o modal para editar um lote
     * @param {Object} loteData - Dados do lote a editar
     * @returns {Promise<Object>} Promise que resolve com os dados editados ou rejeita se cancelado
     */
  }, {
    key: "openEditModal",
    value: function openEditModal(loteData) {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        _this2.resolveCallback = resolve;
        _this2.rejectCallback = reject;

        // Preenche os campos
        var unidadeIdInput = document.getElementById('editLoteUnidadeId');
        var blocoInput = document.getElementById('editLoteBloco');
        var nomeInput = document.getElementById('editLoteNome');
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
        _this2.show();

        // Foca no primeiro campo
        if (unidadeIdInput) {
          setTimeout(function () {
            return unidadeIdInput.focus();
          }, 100);
        }
      });
    }

    /**
     * Handler para salvar
     * @private
     */
  }, {
    key: "handleSave",
    value: function handleSave() {
      var unidadeIdInput = document.getElementById('editLoteUnidadeId');
      var blocoInput = document.getElementById('editLoteBloco');
      var nomeInput = document.getElementById('editLoteNome');
      var data = {
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
  }, {
    key: "handleCancel",
    value: function handleCancel() {
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
  }, {
    key: "show",
    value: function show() {
      if (this.modal) {
        this.modal.style.display = 'block';
      }
    }

    /**
     * Oculta o modal
     */
  }, {
    key: "hide",
    value: function hide() {
      if (this.modal) {
        this.modal.style.display = 'none';
      }
    }

    /**
     * Verifica se o modal está aberto
     * @returns {boolean}
     */
  }, {
    key: "isOpen",
    value: function isOpen() {
      return this.modal && this.modal.style.display === 'block';
    }

    /**
     * Limpa os campos do modal
     */
  }, {
    key: "clear",
    value: function clear() {
      var unidadeIdInput = document.getElementById('editLoteUnidadeId');
      var blocoInput = document.getElementById('editLoteBloco');
      var nomeInput = document.getElementById('editLoteNome');
      if (unidadeIdInput) unidadeIdInput.value = '';
      if (blocoInput) blocoInput.value = '';
      if (nomeInput) nomeInput.value = '';
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/ui/UIManager.js"
/*!***************************************!*\
  !*** ./assets/js/src/ui/UIManager.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UIManager: () => (/* binding */ UIManager)
/* harmony export */ });
/* harmony import */ var _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/DOMHelper */ "./assets/js/src/utils/DOMHelper.js");
/* harmony import */ var _services_AreaCalculator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/AreaCalculator */ "./assets/js/src/services/AreaCalculator.js");
/* harmony import */ var _utils_ColorGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/ColorGenerator */ "./assets/js/src/utils/ColorGenerator.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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



var UIManager = /*#__PURE__*/function () {
  function UIManager(stateManager, eventBus) {
    _classCallCheck(this, UIManager);
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }

  /**
   * Atualiza estado dos botões de desenho
   * @param {boolean} isDrawing - Se está em modo de desenho
   */
  return _createClass(UIManager, [{
    key: "updateDrawingButtons",
    value: function updateDrawingButtons(isDrawing) {
      if (isDrawing) {
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.hide('desenhar_lote');
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.show('aplicar_desenho');
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.show('cancelar_desenho');
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.setText('modo_desenho', 'MODO DESENHO ATIVO');
      } else {
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.show('desenhar_lote');
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.hide('aplicar_desenho');
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.hide('cancelar_desenho');
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.setText('modo_desenho', '');
      }
    }

    /**
     * Renderiza a lista de lotes na sidebar
     * @param {Array<Object>} lotesData - Array de lotes
     */
  }, {
    key: "renderLotesList",
    value: function renderLotesList(lotesData) {
      var _this = this;
      var container = _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.getElement('lista-lotes-container');
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
      _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.clearChildren('lista-lotes-container');

      // Renderiza cada lote
      lotesData.forEach(function (lote) {
        var loteElement = _this.createLoteElement(lote);
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
  }, {
    key: "renderEmptyState",
    value: function renderEmptyState(container) {
      _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.setHTML('lista-lotes-container', "\n      <div class=\"no-lotes\">\n        <div class=\"no-lotes-icon\">\n          <span class=\"dashicons dashicons-admin-multisite\"></span>\n        </div>\n        <p>Nenhum lote cadastrado ainda.</p>\n        <p class=\"help-text\">Clique em \"Desenhar Novo Lote\" para come\xE7ar.</p>\n      </div>\n    ");
    }

    /**
     * Cria elemento HTML para um lote
     * @private
     */
  }, {
    key: "createLoteElement",
    value: function createLoteElement(lote) {
      var div = _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.createElement('div', {
        "class": 'lote-item',
        'data-lote-id': lote.id
      });
      var statusClass = "status-".concat(lote.status || 'disponivel');
      var statusLabel = this.getStatusLabel(lote.status);
      var areaFormatted = _services_AreaCalculator__WEBPACK_IMPORTED_MODULE_1__.AreaCalculator.formatArea(lote.area || 0);
      div.innerHTML = "\n      <h5>\n        <span class=\"dashicons dashicons-location\"></span>\n        ".concat(lote.nome || lote.id, "\n        <span class=\"status-badge ").concat(statusClass, "\">").concat(statusLabel, "</span>\n      </h5>\n      ").concat(lote.bloco ? "<p><strong>Bloco:</strong> ".concat(lote.bloco, "</p>") : '', "\n      <p><strong>\xC1rea:</strong> ").concat(areaFormatted, "</p>\n      <p><strong>V\xE9rtices:</strong> ").concat(lote.coordinates.length, "</p>\n      <div class=\"lote-actions\">\n        <button type=\"button\" class=\"button button-small lote-action-zoom\" data-lote-id=\"").concat(lote.id, "\">\n          <span class=\"dashicons dashicons-visibility\"></span> Ver\n        </button>\n        <button type=\"button\" class=\"button button-small lote-action-edit\" data-lote-id=\"").concat(lote.id, "\">\n          <span class=\"dashicons dashicons-edit\"></span> Editar\n        </button>\n        <button type=\"button\" class=\"button button-small lote-action-delete\" data-lote-id=\"").concat(lote.id, "\">\n          <span class=\"dashicons dashicons-trash\"></span> Excluir\n        </button>\n      </div>\n    ");

      // Adiciona event listeners
      this.attachLoteActions(div, lote.id);
      return div;
    }

    /**
     * Adiciona event listeners aos botões de ação do lote
     * @private
     */
  }, {
    key: "attachLoteActions",
    value: function attachLoteActions(element, loteId) {
      var _this2 = this;
      // Botão Ver/Zoom
      var zoomBtn = element.querySelector('.lote-action-zoom');
      if (zoomBtn) {
        zoomBtn.addEventListener('click', function () {
          _this2.eventBus.emit('ui:zoom_lote', {
            loteId: loteId
          });
        });
      }

      // Botão Editar
      var editBtn = element.querySelector('.lote-action-edit');
      if (editBtn) {
        editBtn.addEventListener('click', function () {
          _this2.eventBus.emit('ui:edit_lote', {
            loteId: loteId
          });
        });
      }

      // Botão Excluir
      var deleteBtn = element.querySelector('.lote-action-delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function () {
          if (confirm('Tem certeza que deseja excluir este lote?')) {
            _this2.eventBus.emit('ui:delete_lote', {
              loteId: loteId
            });
          }
        });
      }
    }

    /**
     * Atualiza contador de lotes
     * @private
     */
  }, {
    key: "updateLotesCounter",
    value: function updateLotesCounter(count) {
      _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.setText('total-lotes', count.toString());
    }

    /**
     * Atualiza área total
     * @private
     */
  }, {
    key: "updateTotalArea",
    value: function updateTotalArea(totalArea) {
      var formatted = _services_AreaCalculator__WEBPACK_IMPORTED_MODULE_1__.AreaCalculator.formatArea(totalArea);
      _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_0__.DOMHelper.setText('area-total-value', formatted);
    }

    /**
     * Calcula área total de todos os lotes
     * @private
     */
  }, {
    key: "calculateTotalArea",
    value: function calculateTotalArea(lotesData) {
      return lotesData.reduce(function (total, lote) {
        return total + (lote.area || 0);
      }, 0);
    }

    /**
     * Retorna label de status
     * @private
     */
  }, {
    key: "getStatusLabel",
    value: function getStatusLabel(status) {
      var labels = {
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
  }, {
    key: "showNotification",
    value: function showNotification(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      // Implementação simplificada com alert
      // Pode ser melhorada com um sistema de toasts
      if (type === 'error') {
        alert('Erro: ' + message);
      } else if (type === 'success') {} else {}
    }

    /**
     * Mostra/oculta loading
     * @param {boolean} show - Se deve mostrar loading
     */
  }, {
    key: "toggleLoading",
    value: function toggleLoading(show) {
      // Implementação simplificada
      // Pode ser melhorada com spinner visual
      if (show) {}
    }
  }]);
}();

/***/ },

/***/ "./assets/js/src/utils/ColorGenerator.js"
/*!***********************************************!*\
  !*** ./assets/js/src/utils/ColorGenerator.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorGenerator: () => (/* binding */ ColorGenerator)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ColorGenerator - Geração de cores para polígonos
 *
 * Gera cores aleatórias ou a partir de paleta pré-definida
 *
 * @example
 * const color = ColorGenerator.random();
 * const paletteColor = ColorGenerator.fromPalette(0);
 */
var ColorGenerator = /*#__PURE__*/function () {
  function ColorGenerator() {
    _classCallCheck(this, ColorGenerator);
  }
  return _createClass(ColorGenerator, null, [{
    key: "random",
    value:
    /**
     * Gera uma cor aleatória da paleta
     * @returns {string} Código hexadecimal da cor
     */
    function random() {
      var randomIndex = Math.floor(Math.random() * this.PALETTE.length);
      return this.PALETTE[randomIndex];
    }

    /**
     * Retorna uma cor da paleta por índice
     * @param {number} index - Índice da cor (faz loop se maior que length)
     * @returns {string} Código hexadecimal da cor
     */
  }, {
    key: "fromPalette",
    value: function fromPalette(index) {
      var adjustedIndex = index % this.PALETTE.length;
      return this.PALETTE[adjustedIndex];
    }

    /**
     * Gera uma cor aleatória completamente aleatória (não da paleta)
     * @returns {string} Código hexadecimal da cor
     */
  }, {
    key: "randomHex",
    value: function randomHex() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    /**
     * Gera uma cor baseada em um ID (sempre retorna a mesma cor para o mesmo ID)
     * @param {string} id - ID único
     * @returns {string} Código hexadecimal da cor
     */
  }, {
    key: "fromId",
    value: function fromId(id) {
      var hash = 0;
      for (var i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      var index = Math.abs(hash) % this.PALETTE.length;
      return this.PALETTE[index];
    }

    /**
     * Gera uma cor baseada em status
     * @param {string} status - Status do lote (disponivel, vendido, reservado)
     * @returns {string} Código hexadecimal da cor
     */
  }, {
    key: "fromStatus",
    value: function fromStatus(status) {
      var statusColors = {
        'disponivel': '#14d279',
        // Verde (disponível)
        'vendido': '#FF6B6B',
        // Vermelho (vendido)
        'reservado': '#FFD54F' // Amarelo (reservado)
      };
      return statusColors[status] || this.random();
    }

    /**
     * Escurece uma cor em uma porcentagem
     * @param {string} color - Cor hexadecimal
     * @param {number} percent - Porcentagem para escurecer (0-100)
     * @returns {string} Cor escurecida
     */
  }, {
    key: "darken",
    value: function darken(color, percent) {
      var num = parseInt(color.replace('#', ''), 16);
      var amt = Math.round(2.55 * percent);
      var R = (num >> 16) - amt;
      var G = (num >> 8 & 0x00FF) - amt;
      var B = (num & 0x0000FF) - amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    /**
     * Clareia uma cor em uma porcentagem
     * @param {string} color - Cor hexadecimal
     * @param {number} percent - Porcentagem para clarear (0-100)
     * @returns {string} Cor clareada
     */
  }, {
    key: "lighten",
    value: function lighten(color, percent) {
      var num = parseInt(color.replace('#', ''), 16);
      var amt = Math.round(2.55 * percent);
      var R = (num >> 16) + amt;
      var G = (num >> 8 & 0x00FF) + amt;
      var B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R : 255) * 0x10000 + (G < 255 ? G : 255) * 0x100 + (B < 255 ? B : 255)).toString(16).slice(1);
    }

    /**
     * Converte hex para RGB
     * @param {string} hex - Cor hexadecimal
     * @returns {Object} {r, g, b}
     */
  }, {
    key: "hexToRgb",
    value: function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
  }, {
    key: "rgbToHex",
    value: function rgbToHex(r, g, b) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Retorna uma cor de contraste (preto ou branco) para texto
     * @param {string} backgroundColor - Cor de fundo hexadecimal
     * @returns {string} '#000000' ou '#FFFFFF'
     */
  }, {
    key: "getContrastColor",
    value: function getContrastColor(backgroundColor) {
      var rgb = this.hexToRgb(backgroundColor);
      if (!rgb) {
        return '#000000';
      }

      // Calcula luminância
      var luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
  }]);
}();
// Paleta de cores pré-definidas (tons vibrantes e distintos)
_defineProperty(ColorGenerator, "PALETTE", ['#FF6B6B',
// Vermelho coral
'#4ECDC4',
// Turquesa
'#45B7D1',
// Azul céu
'#FFA07A',
// Salmão
'#98D8C8',
// Verde menta
'#F06292',
// Rosa
'#AED581',
// Verde limão
'#FFD54F',
// Amarelo ouro
'#4DB6AC',
// Verde-azulado
'#7986CB',
// Azul índigo
'#9575CD',
// Roxo
'#F06292',
// Rosa escuro
'#BA68C8',
// Violeta
'#4FC3F7',
// Azul claro
'#81C784',
// Verde
'#DCE775',
// Lima
'#FFB74D',
// Laranja claro
'#FF8A65',
// Laranja coral
'#A1887F',
// Marrom claro
'#90A4AE' // Azul acinzentado
]);

/***/ },

/***/ "./assets/js/src/utils/DOMHelper.js"
/*!******************************************!*\
  !*** ./assets/js/src/utils/DOMHelper.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMHelper: () => (/* binding */ DOMHelper)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * DOMHelper - Helpers para manipulação de DOM
 *
 * Utilitários para trabalhar com elementos do DOM de forma segura
 *
 * @example
 * const element = DOMHelper.getElement('meu-input');
 * DOMHelper.setValue('meu-input', 'novo valor');
 */
var DOMHelper = /*#__PURE__*/function () {
  function DOMHelper() {
    _classCallCheck(this, DOMHelper);
  }
  return _createClass(DOMHelper, null, [{
    key: "getElement",
    value:
    /**
     * Obtém um elemento do DOM com cache
     * @param {string} id - ID do elemento
     * @param {boolean} useCache - Se deve usar cache (padrão: true)
     * @returns {HTMLElement|null}
     */
    function getElement(id) {
      var useCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (useCache && this.elementCache.has(id)) {
        return this.elementCache.get(id);
      }
      var element = document.getElementById(id);
      if (element && useCache) {
        this.elementCache.set(id, element);
      }
      return element;
    }

    /**
     * Obtém o valor de um input
     * @param {string} id - ID do input
     * @returns {string}
     */
  }, {
    key: "getValue",
    value: function getValue(id) {
      var element = this.getElement(id);
      return element ? element.value : '';
    }

    /**
     * Define o valor de um input
     * @param {string} id - ID do input
     * @param {string} value - Valor a definir
     * @returns {boolean} Sucesso da operação
     */
  }, {
    key: "setValue",
    value: function setValue(id, value) {
      var element = this.getElement(id);
      if (!element) {
        return false;
      }
      element.value = value;
      return true;
    }

    /**
     * Mostra um elemento
     * @param {string} id - ID do elemento
     */
  }, {
    key: "show",
    value: function show(id) {
      var element = this.getElement(id);
      if (element) {
        element.style.display = '';
        element.classList.remove('hidden');
      }
    }

    /**
     * Oculta um elemento
     * @param {string} id - ID do elemento
     */
  }, {
    key: "hide",
    value: function hide(id) {
      var element = this.getElement(id);
      if (element) {
        element.classList.add('hidden');
      }
    }

    /**
     * Alterna visibilidade de um elemento
     * @param {string} id - ID do elemento
     */
  }, {
    key: "toggle",
    value: function toggle(id) {
      var element = this.getElement(id);
      if (element) {
        element.classList.toggle('hidden');
      }
    }

    /**
     * Adiciona uma classe a um elemento
     * @param {string} id - ID do elemento
     * @param {string} className - Nome da classe
     */
  }, {
    key: "addClass",
    value: function addClass(id, className) {
      var element = this.getElement(id);
      if (element) {
        element.classList.add(className);
      }
    }

    /**
     * Remove uma classe de um elemento
     * @param {string} id - ID do elemento
     * @param {string} className - Nome da classe
     */
  }, {
    key: "removeClass",
    value: function removeClass(id, className) {
      var element = this.getElement(id);
      if (element) {
        element.classList.remove(className);
      }
    }

    /**
     * Define o texto de um elemento
     * @param {string} id - ID do elemento
     * @param {string} text - Texto a definir
     */
  }, {
    key: "setText",
    value: function setText(id, text) {
      var element = this.getElement(id);
      if (element) {
        element.textContent = text;
      }
    }

    /**
     * Define o HTML de um elemento
     * @param {string} id - ID do elemento
     * @param {string} html - HTML a definir
     */
  }, {
    key: "setHTML",
    value: function setHTML(id, html) {
      var element = this.getElement(id);
      if (element) {
        element.innerHTML = html;
      }
    }

    /**
     * Limpa o cache de elementos
     */
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.elementCache.clear();
    }

    /**
     * Remove um elemento específico do cache
     * @param {string} id - ID do elemento
     */
  }, {
    key: "removeFromCache",
    value: function removeFromCache(id) {
      this.elementCache["delete"](id);
    }

    /**
     * Adiciona event listener de forma segura
     * @param {string} id - ID do elemento
     * @param {string} event - Nome do evento
     * @param {Function} callback - Função callback
     * @returns {boolean} Sucesso da operação
     */
  }, {
    key: "addEventListener",
    value: function addEventListener(id, event, callback) {
      var element = this.getElement(id);
      if (!element) {
        return false;
      }
      element.addEventListener(event, callback);
      return true;
    }

    /**
     * Habilita um input
     * @param {string} id - ID do input
     */
  }, {
    key: "enable",
    value: function enable(id) {
      var element = this.getElement(id);
      if (element) {
        element.disabled = false;
      }
    }

    /**
     * Desabilita um input
     * @param {string} id - ID do input
     */
  }, {
    key: "disable",
    value: function disable(id) {
      var element = this.getElement(id);
      if (element) {
        element.disabled = true;
      }
    }

    /**
     * Verifica se um elemento existe
     * @param {string} id - ID do elemento
     * @returns {boolean}
     */
  }, {
    key: "exists",
    value: function exists(id) {
      return this.getElement(id) !== null;
    }

    /**
     * Foca em um elemento
     * @param {string} id - ID do elemento
     */
  }, {
    key: "focus",
    value: function focus(id) {
      var element = this.getElement(id);
      if (element && typeof element.focus === 'function') {
        element.focus();
      }
    }

    /**
     * Cria um elemento HTML
     * @param {string} tag - Tag do elemento (div, span, etc)
     * @param {Object} attributes - Atributos do elemento
     * @param {string} content - Conteúdo do elemento
     * @returns {HTMLElement}
     */
  }, {
    key: "createElement",
    value: function createElement(tag) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var element = document.createElement(tag);
      Object.keys(attributes).forEach(function (key) {
        if (key === 'class') {
          element.className = attributes[key];
        } else if (key === 'style') {
          Object.assign(element.style, attributes[key]);
        } else {
          element.setAttribute(key, attributes[key]);
        }
      });
      if (content) {
        element.innerHTML = content;
      }
      return element;
    }

    /**
     * Remove todos os filhos de um elemento
     * @param {string} id - ID do elemento
     */
  }, {
    key: "clearChildren",
    value: function clearChildren(id) {
      var element = this.getElement(id);
      if (element) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      }
    }
  }]);
}();
// Cache de elementos para melhor performance
_defineProperty(DOMHelper, "elementCache", new Map());

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./assets/js/src/main.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_StateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/StateManager */ "./assets/js/src/core/StateManager.js");
/* harmony import */ var _core_EventBus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/EventBus */ "./assets/js/src/core/EventBus.js");
/* harmony import */ var _core_MapManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/MapManager */ "./assets/js/src/core/MapManager.js");
/* harmony import */ var _managers_GeocodeManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/GeocodeManager */ "./assets/js/src/managers/GeocodeManager.js");
/* harmony import */ var _managers_DataPersistence__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/DataPersistence */ "./assets/js/src/managers/DataPersistence.js");
/* harmony import */ var _managers_SVGOverlayManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/SVGOverlayManager */ "./assets/js/src/managers/SVGOverlayManager.js");
/* harmony import */ var _managers_SVGEditorManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./managers/SVGEditorManager */ "./assets/js/src/managers/SVGEditorManager.js");
/* harmony import */ var _managers_ImageOverlayManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./managers/ImageOverlayManager */ "./assets/js/src/managers/ImageOverlayManager.js");
/* harmony import */ var _ui_UIManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ui/UIManager */ "./assets/js/src/ui/UIManager.js");
/* harmony import */ var _ui_ModalManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ui/ModalManager */ "./assets/js/src/ui/ModalManager.js");
/* harmony import */ var _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/DOMHelper */ "./assets/js/src/utils/DOMHelper.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Main Entry Point - Aplicação de Gerenciamento de Terrenos e Lotes
 *
 * Inicializa todos os módulos e configura event handlers
 */

// Core modules




// Managers






// UI



// Utils


/**
 * Classe principal da aplicação
 */
var TerrenoMapApp = /*#__PURE__*/function () {
  function TerrenoMapApp() {
    _classCallCheck(this, TerrenoMapApp);
    // Inicializa core modules
    this.eventBus = new _core_EventBus__WEBPACK_IMPORTED_MODULE_1__.EventBus();
    this.stateManager = new _core_StateManager__WEBPACK_IMPORTED_MODULE_0__.StateManager();

    // Referências dos managers (serão inicializados em initialize())
    this.mapManager = null;
    this.geocodeManager = null;
    this.dataPersistence = null;
    this.uiManager = null;
    this.modalManager = null;
    this.svgImportManager = null;
    this.svgEditorManager = null;
    this.imageOverlayManager = null;
  }

  /**
   * Inicializa a aplicação
   */
  return _createClass(TerrenoMapApp, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var lat, lng, zoom, map, geocoder, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              // Lê configurações dos inputs
              lat = parseFloat(_utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.getValue('terreno_latitude')) || -3.7319;
              lng = parseFloat(_utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.getValue('terreno_longitude')) || -38.5267;
              zoom = parseInt(_utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.getValue('terreno_zoom')) || 18; // Inicializa o mapa
              this.mapManager = new _core_MapManager__WEBPACK_IMPORTED_MODULE_2__.MapManager('gmap', this.stateManager, this.eventBus);
              _context.n = 1;
              return this.mapManager.initialize(lat, lng, zoom);
            case 1:
              map = this.mapManager.getMap();
              geocoder = this.mapManager.getGeocoder(); // Inicializa managers
              this.geocodeManager = new _managers_GeocodeManager__WEBPACK_IMPORTED_MODULE_3__.GeocodeManager(geocoder, this.eventBus);
              this.dataPersistence = new _managers_DataPersistence__WEBPACK_IMPORTED_MODULE_4__.DataPersistence('terreno_lotes_data', this.stateManager, this.eventBus);
              this.uiManager = new _ui_UIManager__WEBPACK_IMPORTED_MODULE_8__.UIManager(this.stateManager, this.eventBus);
              this.modalManager = new _ui_ModalManager__WEBPACK_IMPORTED_MODULE_9__.ModalManager();
              this.svgImportManager = new _managers_SVGOverlayManager__WEBPACK_IMPORTED_MODULE_5__.SVGOverlayManager(map, this.stateManager, this.eventBus, this.dataPersistence);

              // Inicializa editor de SVG para vincular shapes aos lotes
              this.svgEditorManager = new _managers_SVGEditorManager__WEBPACK_IMPORTED_MODULE_6__.SVGEditorManager(map, this.stateManager, this.eventBus);

              // Inicializa manager de planta humanizada (image overlay)
              this.imageOverlayManager = new _managers_ImageOverlayManager__WEBPACK_IMPORTED_MODULE_7__.ImageOverlayManager(map, this.stateManager, this.eventBus);

              // Carrega overlay SVG salvo (se existir)
              this.svgImportManager.loadSavedOverlay();

              // Carrega overlay de imagem salvo (se existir)
              this.imageOverlayManager.loadSavedOverlay();

              // Setup event handlers
              this.setupEventHandlers();
              this.setupDOMEventHandlers();
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              console.error('❌ Erro ao inicializar TerrenoMapApp:', _t);
              alert('Erro ao inicializar o mapa. Verifique se a chave da API do Google Maps está configurada corretamente.');
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Configura event handlers entre módulos
     */
    )
  }, {
    key: "setupEventHandlers",
    value: function setupEventHandlers() {
      var _this = this;
      // SVG Editor events - clique em shape no overlay
      this.eventBus.on('svg:shape_clicked', function (_ref) {
        var index = _ref.index;
        // Abre o editor e seleciona o shape
        if (_this.svgEditorManager) {
          _this.svgEditorManager.openEditor();
          _this.svgEditorManager.selectShape(index);
        }
      });
    }

    /**
     * Configura event handlers dos elementos DOM
     */
  }, {
    key: "setupDOMEventHandlers",
    value: function setupDOMEventHandlers() {
      var _this2 = this;
      // Botão Alternar Satélite
      _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.addEventListener('toggle_satellite', 'click', function () {
        var newType = _this2.mapManager.toggleMapType();
        var buttonText = newType === 'satellite' ? 'Visualização Roadmap' : 'Visualização Satélite';
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.setText('toggle_satellite', buttonText);
      });

      // Botão Buscar Endereço
      _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.addEventListener('buscar_endereco', 'click', function () {
        _this2.searchAddress();
      });

      // Botão Ir para Coordenadas
      _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.addEventListener('ir_para_coordenadas', 'click', function () {
        _this2.goToCoordinates();
      });

      // Sync inputs com mapa
      this.eventBus.on('map:zoom_changed', function (zoom) {
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.setValue('terreno_zoom', zoom);
      });
      this.eventBus.on('map:center_updated', function (_ref2) {
        var lat = _ref2.lat,
          lng = _ref2.lng;
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.setValue('terreno_latitude', lat.toFixed(7));
        _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.setValue('terreno_longitude', lng.toFixed(7));
      });
    }

    /**
     * Busca endereço
     */
  }, {
    key: "searchAddress",
    value: (function () {
      var _searchAddress = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var address, result, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              address = _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.getValue('terreno_endereco');
              if (address) {
                _context2.n = 1;
                break;
              }
              alert('Digite um endereço para buscar');
              return _context2.a(2);
            case 1:
              _context2.p = 1;
              _context2.n = 2;
              return this.geocodeManager.smartSearch(address);
            case 2:
              result = _context2.v;
              // Atualiza mapa
              this.mapManager.updateCenter(result.lat, result.lng);
              this.mapManager.updateZoom(18);

              // Atualiza inputs
              _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.setValue('terreno_latitude', result.lat.toFixed(7));
              _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.setValue('terreno_longitude', result.lng.toFixed(7));
              if (result.address) {
                _utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.setValue('terreno_endereco', result.address);
              }
              _context2.n = 4;
              break;
            case 3:
              _context2.p = 3;
              _t2 = _context2.v;
              alert('Erro ao buscar endereço: ' + _t2.message);
            case 4:
              return _context2.a(2);
          }
        }, _callee2, this, [[1, 3]]);
      }));
      function searchAddress() {
        return _searchAddress.apply(this, arguments);
      }
      return searchAddress;
    }()
    /**
     * Move o mapa para as coordenadas digitadas
     */
    )
  }, {
    key: "goToCoordinates",
    value: function goToCoordinates() {
      var lat = parseFloat(_utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.getValue('terreno_latitude'));
      var lng = parseFloat(_utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.getValue('terreno_longitude'));
      var zoom = parseInt(_utils_DOMHelper__WEBPACK_IMPORTED_MODULE_10__.DOMHelper.getValue('terreno_zoom')) || 18;
      if (isNaN(lat) || isNaN(lng)) {
        alert('Por favor, digite coordenadas válidas de latitude e longitude.');
        return;
      }
      if (lat < -90 || lat > 90) {
        alert('Latitude deve estar entre -90 e 90.');
        return;
      }
      if (lng < -180 || lng > 180) {
        alert('Longitude deve estar entre -180 e 180.');
        return;
      }

      // Atualiza mapa
      this.mapManager.updateCenter(lat, lng);
      this.mapManager.updateZoom(zoom);
    }
  }]);
}(); // Bootstrap quando DOM estiver pronto
jQuery(document).ready(function () {
  // Verifica se o elemento do mapa existe
  if (jQuery('#gmap').length === 0) {
    return;
  }
  var app = new TerrenoMapApp();
  app.initialize();

  // Expõe globalmente para compatibilidade/debugging
  window.TerrenoMapApp = app;
});
})();

window.TerrenoMapApp = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=terreno-admin.bundle.js.map