// // terreno-google-maps-admin.js
// let map;
// let drawingManager;
// //let polygons = [];
// let polygons = new Map();
// let lotesData = [];
// let geocoder;
// let currentInfoWindow = null;
// let isDrawingMode = false;
// let currentMapType = "roadmap";
// let currentPolygon = null;

// const desenharLoteBtn = document.getElementById("desenhar_lote");
// const aplicarDesenhoBtn = document.getElementById("aplicar_desenho");
// const cancelarDesenhoBtn = document.getElementById("cancelar_desenho");
// const modoDesenhoStatus = document.getElementById("modo_desenho");

// jQuery(document).ready(function ($) {
//   if ($("#gmap").length > 0) {
//     initializeMap();
//   }
// });

// function initializeMap() {
//   const savedDataElement = document.getElementById("terreno_lotes_data");

//   // Carregar dados salvos dos lotes
//   loadSavedLotes();

//   // Verificar se todos os elementos existem
//   const elements = {
//     gmap: document.getElementById("gmap"),
//     latitude: document.getElementById("terreno_latitude"),
//     longitude: document.getElementById("terreno_longitude"),
//     zoom: document.getElementById("terreno_zoom"),
//     lotesData: document.getElementById("terreno_lotes_data"),
//   };

//   // Coordenadas iniciais
//   const lat = parseFloat(elements.latitude.value);
//   const lng = parseFloat(elements.longitude.value);
//   const zoom = parseInt(elements.zoom.value) || 18;

//   // Configurar o mapa
//   const mapOptions = {
//     zoom: zoom,
//     center: { lat: lat, lng: lng },
//     mapTypeId: google.maps.MapTypeId.ROADMAP,
//     mapTypeControl: true,
//     streetViewControl: false,
//     fullscreenControl: true,
//   };

//   map = new google.maps.Map(elements.gmap, mapOptions);
//   geocoder = new google.maps.Geocoder();

//   // Configurar Drawing Manager
//   setupDrawingManager();

//   // Event listeners
//   setupEventListeners();

//   // Carregar polígonos salvos
//   loadSavedPolygons();

//   // Atualizar lista de lotes
//   updateLotesList();
// }

// /**
//  * Decodifica HTML entities de forma segura
//  */
// function decodeHtmlEntities(str) {
//   if (!str) return str;

//   // Método 1: usando DOM
//   try {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = str;
//     return tempDiv.textContent || tempDiv.innerText || "";
//   } catch (e) {
//     console.warn("Falha na decodificação DOM, usando método manual");
//   }

//   // Método 2: decodificação manual das entities mais comuns
//   const htmlEntities = {
//     "&quot;": '"',
//     "&#039;": "'",
//     "&lt;": "<",
//     "&gt;": ">",
//     "&amp;": "&",
//   };

//   return str.replace(/&[^;]+;/g, function (entity) {
//     return htmlEntities[entity] || entity;
//   });
// }

// function loadSavedLotes() {
//   const savedDataElement = document.getElementById("terreno_lotes_data");
//   if (!savedDataElement) {
//     console.error("Elemento terreno_lotes_data não encontrado");
//     lotesData = [];
//     return;
//   }

//   let savedData = savedDataElement.value;
//   // console.log("Dados salvos brutos:", savedData);

//   if (savedData && savedData.trim() !== "" && savedData !== "[]") {
//     try {
//       savedData = decodeHtmlEntities(savedData);
//       // console.log("Dados após decodificação:", savedData);

//       lotesData = JSON.parse(savedData);
//       // console.log("Lotes carregados com sucesso:", lotesData);

//       if (!Array.isArray(lotesData)) {
//         console.warn("Dados não são um array, resetando");
//         lotesData = [];
//       }
//     } catch (e) {
//       console.error("Erro ao fazer parse dos lotes salvos:", e);
//       console.error("Dados problemáticos:", savedData);
//       lotesData = [];
//     }
//   } else {
//     lotesData = [];
//   }
// }

// function setupDrawingManager() {
//   drawingManager = new google.maps.drawing.DrawingManager({
//     drawingMode: null,
//     drawingControl: false,
//     markerOptions: {
//       draggable: false,
//     },
//     polygonOptions: {
//       fillColor: "#FF6B6B",
//       fillOpacity: 0.4,
//       strokeWeight: 2,
//       strokeColor: "#FF6B6B",
//       editable: true,
//       draggable: false,
//     },
//   });

//   drawingManager.setMap(map);

//   // Evento quando polígono é completado
//   drawingManager.addListener("polygoncomplete", function (polygon) {
//     drawingManager.setDrawingMode(null);
//     isDrawingMode = false;
//     currentPolygon = polygon;
//   });
// }

// function setupEventListeners() {
//   document
//     .getElementById("buscar_endereco")
//     .addEventListener("click", searchAddress);
//   document
//     .getElementById("terreno_endereco")
//     .addEventListener("keypress", function (e) {
//       if (e.key === "Enter") {
//         e.preventDefault();
//         searchAddress();
//       }
//     });

//   // Desenhar lote
//   desenharLoteBtn.addEventListener("click", startDrawingMode);
//   aplicarDesenhoBtn.addEventListener("click", handlePolygonComplete);
//   cancelarDesenhoBtn.addEventListener("click", cancelDrawing);

//   // Limpar lotes
//   document
//     .getElementById("limpar_lotes")
//     .addEventListener("click", clearAllLotes);

//   // Toggle satellite/roadmap
//   document
//     .getElementById("toggle_satellite")
//     .addEventListener("click", toggleMapType);

//   // Atualizar coordenadas quando campos mudarem
//   document
//     .getElementById("terreno_latitude")
//     .addEventListener("change", updateMapCenter);
//   document
//     .getElementById("terreno_longitude")
//     .addEventListener("change", updateMapCenter);
//   document
//     .getElementById("terreno_zoom")
//     .addEventListener("change", updateMapZoom);

//   // Clique no mapa para obter coordenadas
//   map.addListener("click", function (event) {
//     if (!isDrawingMode) {
//       updateLocationFromClick(event.latLng);
//     }
//   });

//   // Atualizar zoom quando mudar no mapa
//   map.addListener("zoom_changed", function () {
//     document.getElementById("terreno_zoom").value = map.getZoom();
//   });
// }

// function searchAddress() {
//   const address = document.getElementById("terreno_endereco").value;

//   if (!address.trim()) {
//     alert("Por favor, digite um endereço");
//     return;
//   }

//   // Verificar se é coordenada (lat,lng)
//   const coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
//   if (coordPattern.test(address)) {
//     const coords = address.split(",");
//     const lat = parseFloat(coords[0].trim());
//     const lng = parseFloat(coords[1].trim());
//     updateMapLocation(lat, lng, address);
//     return;
//   }

//   // Geocoding
//   geocoder.geocode({ address: address }, function (results, status) {
//     if (status === "OK" && results[0]) {
//       const location = results[0].geometry.location;
//       const lat = location.lat();
//       const lng = location.lng();
//       const formattedAddress = results[0].formatted_address;

//       updateMapLocation(lat, lng, formattedAddress);
//     } else {
//       alert("Endereço não encontrado: " + status);
//     }
//   });
// }

// function getMyLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       function (position) {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         // Reverse geocoding para obter endereço
//         geocoder.geocode(
//           { location: { lat: lat, lng: lng } },
//           function (results, status) {
//             if (status === "OK" && results[0]) {
//               updateMapLocation(lat, lng, results[0].formatted_address);
//             } else {
//               updateMapLocation(lat, lng, `${lat}, ${lng}`);
//             }
//           }
//         );
//       },
//       function (error) {
//         alert("Erro ao obter localização: " + error.message);
//       }
//     );
//   } else {
//     alert("Geolocalização não é suportada pelo seu navegador");
//   }
// }

// function updateMapLocation(lat, lng, address) {
//   const location = { lat: lat, lng: lng };

//   map.setCenter(location);
//   map.setZoom(18);

//   // Atualizar campos
//   document.getElementById("terreno_latitude").value = lat.toFixed(6);
//   document.getElementById("terreno_longitude").value = lng.toFixed(6);
//   document.getElementById("terreno_endereco").value = address;
//   document.getElementById("terreno_zoom").value = "18";
// }

// function updateLocationFromClick(latLng) {
//   const lat = latLng.lat();
//   const lng = latLng.lng();

//   // Reverse geocoding
//   geocoder.geocode({ location: latLng }, function (results, status) {
//     if (status === "OK" && results[0]) {
//       updateMapLocation(lat, lng, results[0].formatted_address);
//     } else {
//       updateMapLocation(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
//     }
//   });
// }

// function updateMapCenter() {
//   const lat = parseFloat(document.getElementById("terreno_latitude").value);
//   const lng = parseFloat(document.getElementById("terreno_longitude").value);

//   if (!isNaN(lat) && !isNaN(lng)) {
//     map.setCenter({ lat: lat, lng: lng });
//   }
// }

// function updateMapZoom() {
//   const zoom = parseInt(document.getElementById("terreno_zoom").value);
//   if (!isNaN(zoom) && zoom >= 1 && zoom <= 20) {
//     map.setZoom(zoom);
//   }
// }

// // Função para ativar o modo de desenho
// function startDrawingMode() {
//   isDrawingMode = true;
//   drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

//   // Esconde o botão "Desenhar Novo Lote"
//   desenharLoteBtn.classList.add("hidden");

//   // Mostra os botões de ação (Aplicar e Cancelar)
//   aplicarDesenhoBtn.classList.remove("hidden");
//   cancelarDesenhoBtn.classList.remove("hidden");

//   // Atualiza a classe para visualização
//   desenharLoteBtn.classList.remove("button-primary");
//   desenharLoteBtn.classList.add("button-secondary");

//   // Adiciona o texto de status
//   if (modoDesenhoStatus) {
//     modoDesenhoStatus.textContent =
//       "MODO DESENHO ATIVO - Clique para desenhar o polígono";
//   }
// }

// function cancelDrawing() {
//   stopDrawingMode();
//   const polygon = currentPolygon;
//   google.maps.event.clearInstanceListeners(polygon);
//   polygon.setMap(null);
// }

// function stopDrawingMode() {
//   isDrawingMode = false;
//   drawingManager.setDrawingMode(null);

//   // Esconde os botões de ação (Aplicar e Cancelar)
//   aplicarDesenhoBtn.classList.add("hidden");
//   cancelarDesenhoBtn.classList.add("hidden");

//   // Mostra o botão "Desenhar Novo Lote"
//   desenharLoteBtn.classList.remove("hidden");

//   // Atualiza as classes de visualização
//   desenharLoteBtn.classList.remove("button-secondary");
//   desenharLoteBtn.classList.add("button-primary");

//   // Limpa o texto de status
//   if (modoDesenhoStatus) {
//     modoDesenhoStatus.textContent = "";
//   }
// }

// function toggleMapType() {
//   if (currentMapType === "roadmap") {
//     map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
//     currentMapType = "satellite";
//     document.getElementById("toggle_satellite").textContent =
//       "Visualização Mapa";
//   } else {
//     map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
//     currentMapType = "roadmap";
//     document.getElementById("toggle_satellite").textContent =
//       "Visualização Satélite";
//   }
// }

// function handlePolygonComplete() {
//   const polygon = currentPolygon;
//   if (polygons.has(lotesData.id)) {
//     try {
//       const existing = polygons.get(lotesData.id);
//       google.maps.event.clearInstanceListeners(existing.polygon);
//       existing.polygon.setMap(null);
//     } catch (e) {
//       console.warn(e);
//     }
//     polygons.delete(lotesData.id);
//   }
//   drawingManager.setDrawingMode(null);
//   isDrawingMode = false;
//   document.getElementById("desenhar_lote").textContent = "Desenhar Novo Lote";
//   document.getElementById("desenhar_lote").classList.remove("button-secondary");
//   document.getElementById("desenhar_lote").classList.add("button-primary");
//   document.getElementById("modo_desenho").textContent = "";

//   // Gerar ID do lote
//   const loteId = generateLoteId();

//   // Obter coordenadas do polígono
//   const path = polygon.getPath();
//   const coordinates = [];

//   for (let i = 0; i < path.getLength(); i++) {
//     coordinates.push({
//       lat: path.getAt(i).lat(),
//       lng: path.getAt(i).lng(),
//     });
//   }

//   // Calcular área
//   const area = google.maps.geometry.spherical.computeArea(path);

//   // Gerar cor aleatória
//   const color = generateRandomColor();

//   // Criar dados do lote
//   const loteData = {
//     id: loteId,
//     coordinates: coordinates,
//     area: area,
//     areaFormatted: formatArea(area),
//     color: color,
//     fillColor: color,
//     nome: `Lote ${loteId}`,
//     bloco: "",
//     status: "disponivel",
//     created_at: new Date().toISOString(),
//   };

//   // Configurar aparência do polígono
//   polygon.setOptions({
//     strokeColor: color,
//     fillColor: color,
//     fillOpacity: 0.4,
//     strokeWeight: 2,
//   });

//   // IMPORTANTE: Adicionar aos arrays ANTES de configurar eventos
//   lotesData.push(loteData);

//   // Criar objeto polígono com referência consistente
//   const polygonObj = {
//     polygon: polygon,
//     data: loteData,
//   };
//   // polygons.push(polygonObj);
//   polygons.set(loteData.id, polygonObj);

//   // Configurar eventos após adicionar aos arrays
//   setupPolygonEvents(polygon, loteData);

//   // Salvar dados
//   saveLotesData();

//   // Atualizar interface
//   updateLotesList();
//   stopDrawingMode();
//   alert(`Lote ${loteId} criado com sucesso!\nÁrea: ${loteData.areaFormatted}`);
// }

// function setupPolygonEvents(polygon, loteData) {
//   // Info Window
//   const infoWindow = new google.maps.InfoWindow();

//   // Clique
//   polygon.addListener("click", function (event) {
//     const content = `
//             <div style="max-width: 200px;">
//                 <h4 style="margin: 0 0 10px 0; color: ${loteData.color};">${
//       loteData.id
//     }</h4>
//                 <p><strong>Área:</strong> ${loteData.areaFormatted.replace(
//                   "u00b2",
//                   "²"
//                 )}</p>
//                 <p><strong>Bloco:</strong> ${loteData.bloco}</p>
//                 <div style="margin-top: 10px;">
//                     <button onclick="editLote('${
//                       loteData.id
//                     }')" class="button button-small">Editar</button>
//                     <button onclick="deleteLote('${
//                       loteData.id
//                     }')" class="button button-small" style="margin-left: 5px;">Excluir</button>
//                 </div>
//             </div>
//         `;

//     infoWindow.setContent(content);
//     infoWindow.setPosition(event.latLng);
//     infoWindow.open(map);

//     if (currentInfoWindow) {
//       currentInfoWindow.close();
//     }
//     currentInfoWindow = infoWindow;
//   });

//   polygon.addListener("mouseover", function () {
//     polygon.setOptions({
//       fillOpacity: 0.6,
//       strokeWeight: 3,
//     });
//   });

//   polygon.addListener("mouseout", function () {
//     polygon.setOptions({
//       fillOpacity: 0.4,
//       strokeWeight: 2,
//     });
//   });

//   polygon.addListener("set_at", function () {
//     updateLoteCoordinates(loteData.id, polygon);
//   });

//   polygon.addListener("insert_at", function () {
//     updateLoteCoordinates(loteData.id, polygon);
//   });
// }

// function updateLoteCoordinates(loteId, polygon) {
//   const loteIndex = lotesData.findIndex((lote) => lote.id === loteId);
//   if (loteIndex !== -1) {
//     const path = polygon.getPath();
//     const coordinates = [];

//     for (let i = 0; i < path.getLength(); i++) {
//       coordinates.push({
//         lat: path.getAt(i).lat(),
//         lng: path.getAt(i).lng(),
//       });
//     }

//     const area = google.maps.geometry.spherical.computeArea(path);

//     lotesData[loteIndex].coordinates = coordinates;
//     lotesData[loteIndex].area = area;
//     lotesData[loteIndex].areaFormatted = formatArea(area);

//     saveLotesData();
//     updateLotesList();
//   }
// }

// function generateLoteId() {
//   const existingIds = lotesData.map((lote) => lote.id);
//   let counter = 1;
//   let newId;

//   do {
//     newId = `LOTE_${counter.toString().padStart(3, "0")}`;
//     counter++;
//   } while (existingIds.includes(newId));

//   return newId;
// }

// function generateRandomColor() {
//   const colors = [
//     "#FF6B6B",
//     "#4ECDC4",
//     "#45B7D1",
//     "#96CEB4",
//     "#FECA57",
//     "#FF9FF3",
//     "#54A0FF",
//     "#5F27CD",
//     "#00D2D3",
//     "#FF9F43",
//     "#10AC84",
//     "#EE5A24",
//     "#0984E3",
//     "#6C5CE7",
//     "#A29BFE",
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// }

// function formatArea(area) {
//   if (area < 10000) {
//     return Math.round(area) + " m\u00B2";
//   } else {
//     return (area / 10000).toFixed(2) + " hectares";
//   }
// }

// function loadSavedPolygons() {
//   if (polygons.size > 0) {
//     for (const [, pObj] of polygons) {
//       try {
//         google.maps.event.clearInstanceListeners(pObj.polygon);
//         pObj.polygon.setMap(null);
//       } catch (e) {
//         console.warn("Erro ao limpar polígono antigo:", e);
//       }
//     }
//     polygons.clear();
//   }
//   if (lotesData.length === 0) return;

//   console.log("Carregando polígonos salvos:", lotesData.length);

//   lotesData.forEach(function (loteData, index) {
//     if (loteData.coordinates && loteData.coordinates.length > 0) {
//       const polygonCoords = loteData.coordinates.map(function (coord) {
//         return { lat: coord.lat, lng: coord.lng };
//       });

//       const polygon = new google.maps.Polygon({
//         paths: polygonCoords,
//         strokeColor: loteData.color || "#FF6B6B",
//         strokeOpacity: 0.8,
//         strokeWeight: 2,
//         fillColor: loteData.fillColor || loteData.color || "#FF6B6B",
//         fillOpacity: 0.4,
//         editable: true,
//         draggable: false,
//         map: map,
//       });

//       // Criar objeto com referência consistente
//       const polygonObj = {
//         polygon: polygon,
//         data: loteData,
//       };

//       // polygons.push(polygonObj);
//       polygons.set(loteData.id, polygonObj);
//       console.log(`Polígono ${index + 1} carregado:`, loteData.id);

//       setupPolygonEvents(polygon, loteData);
//     }
//   });

//   console.log("Total de polígonos carregados:", polygons.length);
// }

// function updateLotesList() {
//   const container = document.getElementById("lista-lotes-container");
//   const totalLotesElement = document.getElementById("total-lotes");
//   const areaTotalElement = document.getElementById("area-total-value");

//   if (!container) {
//     console.error("Container lista-lotes-container não encontrado");
//     return;
//   }

//   if (totalLotesElement) {
//     totalLotesElement.textContent = lotesData.length;
//   }

//   let areaTotal = 0;
//   lotesData.forEach((lote) => {
//     if (lote.area) {
//       areaTotal += lote.area;
//     }
//   });

//   if (areaTotalElement) {
//     areaTotalElement.textContent = formatArea(areaTotal);
//   }

//   if (lotesData.length === 0) {
//     container.innerHTML = `
//       <div class="no-lotes">
//         <div class="no-lotes-icon">
//           <span class="dashicons dashicons-admin-multisite"></span>
//         </div>
//         <p>Nenhum lote cadastrado ainda.</p>
//         <p class="help-text">Clique em "Desenhar Novo Lote" para começar.</p>
//       </div>
//     `;
//     return;
//   }

//   // Construir HTML dos lotes
//   let html = "";
//   lotesData.forEach(function (lote, index) {
//     // const statusClass = `status-${lote.status || "disponivel"}`;
//     // const statusText = getStatusText(lote.status);

//     html += `
//       <div class="lote-item" id="lote-item-${lote.id}">
//         <h5 style="color: ${lote.color};">
//           <span class="dashicons dashicons-admin-multisite" style="color: ${
//             lote.color
//           };"></span>
//           ${`Lote ${lote.id}`}
//         </h5>

//         <p><strong>Área:</strong> ${lote.areaFormatted.replace(
//           "u00b2",
//           "²"
//         )}</p>
//         <p><strong>Bloco:</strong> ${lote.bloco}</p>
//         ${
//           lote.created_at
//             ? `<p><strong>Criado:</strong> ${formatDate(lote.created_at)}</p>`
//             : ""
//         }

//         <div class="lote-actions">
//           <button type="button" onclick="focusOnLote('${lote.id}')"
//                   class="button button-small" title="Localizar no mapa">
//             <span class="dashicons dashicons-location"></span>
//           </button>
//           <button type="button" onclick="editLote('${lote.id}')"
//                   class="button button-small" title="Editar lote">
//             <span class="dashicons dashicons-edit"></span>
//           </button>
//           <button type="button" onclick="deleteLote('${lote.id}')"
//                   class="button button-small" title="Excluir lote">
//             <span class="dashicons dashicons-trash"></span>
//           </button>
//         </div>
//       </div>
//     `;
//   });

//   container.innerHTML = html;
// }

// function getStatusText(status) {
//   const statusMap = {
//     disponivel: "Disponível",
//     vendido: "Vendido",
//     reservado: "Reservado",
//     bloqueado: "Bloqueado",
//   };
//   return statusMap[status] || "Disponível";
// }

// function formatDate(dateString) {
//   try {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("pt-BR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   } catch (e) {
//     return "Data inválida";
//   }
// }

// function focusOnLote(loteId) {
//   const lote = lotesData.find((l) => l.id === loteId);
//   if (!lote || !lote.coordinates.length) {
//     alert("Coordenadas do lote não encontradas!");
//     return;
//   }

//   // Calcular centro do polígono
//   let latSum = 0,
//     lngSum = 0;
//   lote.coordinates.forEach((coord) => {
//     latSum += coord.lat;
//     lngSum += coord.lng;
//   });
//   const center = {
//     lat: latSum / lote.coordinates.length,
//     lng: lngSum / lote.coordinates.length,
//   };

//   // Animar para o centro
//   map.panTo(center);
//   setTimeout(() => {
//     if (map.getZoom() < 18) map.setZoom(19);
//   }, 500);

//   // Ajuste o ID do lote aqui:
//   const LOTE_ID = "LOTE_001";

//   // Buscar referência
//   const polygonObj = polygons.get(loteId);

//   if (!polygonObj) {
//     console.log(
//       "IDs de polígonos disponíveis:",
//       polygons.map((p) => p.data.id)
//     );
//   } else {
//     const poly = polygonObj.polygon;

//     const original = {
//       fillOpacity: poly.get("fillOpacity"),
//       fillColor:
//         poly.get("fillColor") ||
//         polygonObj.data.fillColor ||
//         polygonObj.data.color,
//       strokeWeight: poly.get("strokeWeight"),
//       strokeColor: poly.get("strokeColor") || polygonObj.data.color,
//       strokeOpacity: poly.get("strokeOpacity"),
//       zIndex: poly.get("zIndex") || 0,
//     };

//     const listItem = document.getElementById(`lote-item-${loteId}`);

//     // Forçar highlight bem visível
//     poly.setOptions({
//       fillOpacity: 1,
//       fillColor: "#fff700ff",
//       strokeWeight: 4,
//       strokeColor: "#ff0000ff",
//       strokeOpacity: 1,
//     });

//     setTimeout(() => {
//       poly.setOptions({
//         fillOpacity: original.fillOpacity,
//         fillColor: original.fillColor,
//         strokeWeight: original.strokeWeight,
//         strokeColor: original.strokeColor,
//         strokeOpacity: original.strokeOpacity,
//         zIndex: original.zIndex,
//       });

//       if (listItem) {
//         listItem.style.background = "";
//         listItem.style.borderColor = "";
//       }

//       console.log("Highlight restaurado:", poly);
//     }, 3000);
//   }
// }

// let currentEditLoteId = null;

// function editLote(loteId) {
//   const lote = lotesData.find((l) => l.id === loteId);
//   if (!lote) return alert("Lote não encontrado!");

//   currentEditLoteId = loteId;
//   document.getElementById("editLoteId").value = lote.id;
//   document.getElementById("editLoteBloco").value = lote.bloco;

//   document.getElementById("editModal").style.display = "block";
// }

// function saveEditLote() {
//   const lote = lotesData.find((l) => l.id === currentEditLoteId);
//   if (!lote) return;

//   lote.id = document.getElementById("editLoteId").value.trim();
//   lote.bloco = document.getElementById("editLoteBloco").value.trim();

//   saveLotesData();
//   updateLotesList();

//   document.getElementById("editModal").style.display = "none";
// }

// function closeEditModal() {
//   document.getElementById("editModal").style.display = "none";
// }

// // function editLote(loteId) {
// //   const lote = lotesData.find((l) => l.id === loteId);
// //   if (!lote) {
// //     alert("Lote não encontrado!");
// //     return;
// //   }

// //   // Criar modal de edição simples
// //   const currentName = lote.id || `Lote ${lote.id}`;
// //   // const currentStatus = lote.status || "disponivel";

// //   const newName = prompt("Nome do lote:", currentName);
// //   if (newName === null) return; // Usuário cancelou

// //   if (newName.trim() !== "") {
// //     lote.id = newName.trim();
// //   }

// //   // Opcionalmente, permitir mudança de status
// //   const statusOptions = ["disponivel", "reservado", "vendido", "bloqueado"];

// //   // Salvar alterações
// //   saveLotesData();
// //   updateLotesList();

// //   // Atualizar info window se estiver aberta
// //   if (currentInfoWindow) {
// //     currentInfoWindow.close();
// //   }

// //   console.log("Lote atualizado:", lote);
// // }

// function deleteLote(loteId) {
//   if (!confirm(`Tem certeza que deseja excluir o lote ${loteId}?`)) {
//     return;
//   }

//   // Limpar TODOS os polígonos do mapa primeiro
//   polygons.forEach((polygonObj) => {
//     if (polygonObj.polygon) {
//       google.maps.event.clearInstanceListeners(polygonObj.polygon);
//       polygonObj.polygon.setMap(null);
//     }
//   });

//   // Remover o lote dos dados
//   lotesData = lotesData.filter((lote) => lote.id !== loteId);

//   // Limpar array de polígonos
//   polygons = [];

//   // Recriar TODOS os polígonos restantes
//   if (lotesData.length > 0) {
//     console.log("Recriando polígonos restantes...");
//     loadSavedPolygons();
//   }

//   // Forçar re-renderização
//   setTimeout(() => {
//     google.maps.event.trigger(map, "resize");
//     const center = map.getCenter();
//     map.setCenter(center);
//   }, 100);

//   // Fechar info window
//   if (currentInfoWindow) {
//     currentInfoWindow.close();
//     currentInfoWindow = null;
//   }

//   // Salvar e atualizar
//   saveLotesData();
//   updateLotesList();

//   alert(`Lote ${loteId} excluído com sucesso!`);
// }

// function clearAllLotes() {
//   if (lotesData.length === 0) {
//     alert("Não há lotes para limpar.");
//     return;
//   }

//   if (
//     !confirm(
//       `Tem certeza que deseja excluir todos os ${lotesData.length} lotes?`
//     )
//   ) {
//     return;
//   }

//   // Limpar polígonos do mapa
//   polygons.forEach(function (polygonObj) {
//     if (polygonObj.polygon) {
//       google.maps.event.clearInstanceListeners(polygonObj.polygon);
//       polygonObj.polygon.setMap(null);
//     }
//   });

//   // Limpar arrays
//   polygons = [];
//   lotesData = [];

//   // Fechar info window
//   if (currentInfoWindow) {
//     currentInfoWindow.close();
//     currentInfoWindow = null;
//   }

//   // Forçar re-renderização
//   setTimeout(() => {
//     google.maps.event.trigger(map, "resize");
//     const center = map.getCenter();
//     map.setCenter(center);
//   }, 100);

//   // Salvar e atualizar
//   saveLotesData();
//   updateLotesList();

//   alert("Todos os lotes foram excluídos!");
// }

// function saveLotesData() {
//   const dataElement = document.getElementById("terreno_lotes_data");

//   if (dataElement) {
//     const jsonData = JSON.stringify(lotesData);
//     dataElement.value = jsonData;

//     const event = new Event("change", { bubbles: true });
//     dataElement.dispatchEvent(event);
//   } else {
//     console.error("Elemento terreno_lotes_data não encontrado para salvar");
//   }
// }

// // Tornar funções globais para usar nos botões
// window.editLote = editLote;
// window.deleteLote = deleteLote;
// window.focusOnLote = focusOnLote;

// // Inicializar quando Google Maps estiver carregado
// function initGoogleMaps() {
//   if (typeof google !== "undefined" && google.maps) {
//     initializeMap();
//     // Adicionar no setupEventListeners()
//     document
//       .getElementById("debug_dados")
//       .addEventListener("click", debugDados);

//     //
//   } else {
//     console.error("Google Maps API não carregada");
//   }
// }

// // Auto-inicializar
// if (typeof google !== "undefined" && google.maps) {
//   jQuery(document).ready(initializeMap);
// } else {
//   window.initGoogleMaps = initGoogleMaps;
// }

// // Tratamento de erros AJAX
// jQuery(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
//   if (ajaxSettings.url.includes("admin-ajax.php")) {
//     console.error("Erro AJAX:", thrownError);
//     console.error("Status:", jqXHR.status);
//     console.error("Response:", jqXHR.responseText);
//   }
// });

// jQuery("#post").on("submit", function () {
//   saveLotesData();
//   console.log(
//     ">>> Antes do submit, valor do hidden:",
//     document.getElementById("terreno_lotes_data").value
//   );
// });
