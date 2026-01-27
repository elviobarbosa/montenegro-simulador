// // terreno-mapa.js
// jQuery(document).ready(function ($) {
//   let map;
//   let lotes = [];
//   let isDrawing = false;
//   let drawingPolygon = null;
//   let currentPoints = [];
//   let marker = null;
//   let nextLoteId = 1;

//   // Cores disponíveis para os lotes
//   const cores = [
//     { color: "#ff0000", fillColor: "#ff0000", name: "Vermelho" },
//     { color: "#00ff00", fillColor: "#00ff00", name: "Verde" },
//     { color: "#0000ff", fillColor: "#0000ff", name: "Azul" },
//     { color: "#ffff00", fillColor: "#ffff00", name: "Amarelo" },
//     { color: "#ff00ff", fillColor: "#ff00ff", name: "Magenta" },
//     { color: "#00ffff", fillColor: "#00ffff", name: "Ciano" },
//     { color: "#ffa500", fillColor: "#ffa500", name: "Laranja" },
//     { color: "#800080", fillColor: "#800080", name: "Roxo" },
//   ];

//   // Inicializar mapa
//   function initMap() {
//     const lat = $("#terreno_latitude").val() || -3.7319;
//     const lng = $("#terreno_longitude").val() || -38.5267;

//     map = L.map("mapa", {
//       center: [lat, lng],
//       zoom: 18,
//       scrollWheelZoom: true,
//     });

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "© OpenStreetMap contributors",
//     }).addTo(map);

//     // Adicionar marker se já houver coordenadas
//     if ($("#terreno_latitude").val() && $("#terreno_longitude").val()) {
//       addMarker(lat, lng);
//     }

//     // Carregar lotes existentes
//     loadExistingLotes();

//     // Evento de clique no mapa
//     map.on("click", function (e) {
//       if (isDrawing) {
//         addPointToPolygon(e.latlng);
//       } else {
//         updateCoordinates(e.latlng.lat, e.latlng.lng);
//         geocodeReverse(e.latlng.lat, e.latlng.lng);
//       }
//     });

//     // Evento de clique com botão direito para finalizar polígono
//     map.on("contextmenu", function (e) {
//       if (isDrawing) {
//         finishPolygon();
//       }
//     });
//   }

//   // Adicionar marker no mapa
//   function addMarker(lat, lng) {
//     if (marker) {
//       map.removeLayer(marker);
//     }

//     marker = L.marker([lat, lng], {
//       draggable: true,
//     }).addTo(map);

//     marker.on("dragend", function (e) {
//       const pos = e.target.getLatLng();
//       updateCoordinates(pos.lat, pos.lng);
//       geocodeReverse(pos.lat, pos.lng);
//     });
//   }

//   // Atualizar coordenadas nos inputs
//   function updateCoordinates(lat, lng) {
//     $("#terreno_latitude").val(lat.toFixed(6));
//     $("#terreno_longitude").val(lng.toFixed(6));
//     addMarker(lat, lng);
//   }

//   // Geocodificação reversa
//   function geocodeReverse(lat, lng) {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

//     $.get(url)
//       .done(function (data) {
//         if (data && data.display_name) {
//           $("#terreno_endereco").val(data.display_name);
//         }
//       })
//       .fail(function () {
//         console.log("Erro ao buscar endereço");
//       });
//   }

//   // Buscar endereço
//   function geocodeAddress(address) {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//       address
//     )}&limit=1`;

//     $.get(url)
//       .done(function (data) {
//         if (data && data.length > 0) {
//           const result = data[0];
//           const lat = parseFloat(result.lat);
//           const lng = parseFloat(result.lon);

//           updateCoordinates(lat, lng);
//           map.setView([lat, lng], 18);
//         } else {
//           alert("Endereço não encontrado");
//         }
//       })
//       .fail(function () {
//         alert("Erro ao buscar endereço");
//       });
//   }

//   // Iniciar desenho de polígono
//   function startDrawing() {
//     isDrawing = true;
//     currentPoints = [];
//     $("#desenhar_lote")
//       .prop("disabled", true)
//       .text("Desenhando... (Clique direito para finalizar)");
//     $("#modo_desenho").text(
//       "MODO DESENHO ATIVO - Clique no mapa para adicionar pontos"
//     );
//     map.getContainer().style.cursor = "crosshair";
//   }

//   // Adicionar ponto ao polígono em construção
//   function addPointToPolygon(latlng) {
//     currentPoints.push([latlng.lat, latlng.lng]);

//     // Remover polígono temporário se existir
//     if (drawingPolygon) {
//       map.removeLayer(drawingPolygon);
//     }

//     // Criar polígono temporário se houver pelo menos 3 pontos
//     if (currentPoints.length >= 3) {
//       drawingPolygon = L.polygon(currentPoints, {
//         color: "#ff0000",
//         fillColor: "#ff0000",
//         fillOpacity: 0.3,
//         dashArray: "5, 5",
//       }).addTo(map);
//     } else if (currentPoints.length > 0) {
//       // Mostrar linha temporária
//       if (drawingPolygon) {
//         map.removeLayer(drawingPolygon);
//       }
//       drawingPolygon = L.polyline(currentPoints, {
//         color: "#ff0000",
//         dashArray: "5, 5",
//       }).addTo(map);
//     }
//   }

//   // Finalizar polígono
//   function finishPolygon() {
//     if (currentPoints.length < 3) {
//       alert("É necessário pelo menos 3 pontos para criar um lote");
//       return;
//     }

//     // Remover polígono temporário
//     if (drawingPolygon) {
//       map.removeLayer(drawingPolygon);
//     }

//     // Criar lote final
//     const loteId = getNextLoteId();
//     const cor = cores[lotes.length % cores.length];

//     const lote = {
//       id: loteId,
//       coordinates: [...currentPoints],
//       color: cor.color,
//       fillColor: cor.fillColor,
//       colorName: cor.name,
//     };

//     lotes.push(lote);
//     addLoteToMap(lote);
//     updateLotesData();
//     renderLotesList();

//     // Resetar modo desenho
//     isDrawing = false;
//     currentPoints = [];
//     drawingPolygon = null;
//     $("#desenhar_lote").prop("disabled", false).text("Desenhar Novo Lote");
//     $("#modo_desenho").text("");
//     map.getContainer().style.cursor = "";

//     alert(`Lote ${loteId} criado com sucesso!`);
//   }

//   // Adicionar lote ao mapa
//   function addLoteToMap(lote) {
//     const polygon = L.polygon(lote.coordinates, {
//       color: lote.color,
//       fillColor: lote.fillColor,
//       fillOpacity: 0.3,
//       weight: 2,
//     }).addTo(map);

//     polygon.bindPopup(`
//             <strong>Lote ${lote.id}</strong><br>
//             <small>Cor: ${lote.colorName}</small><br>
//             <button onclick="editarLote('${lote.id}')" class="button button-small">Editar</button>
//             <button onclick="removerLote('${lote.id}')" class="button button-small">Remover</button>
//         `);

//     // Armazenar referência do polígono no lote
//     lote.polygon = polygon;
//   }

//   // Obter próximo ID de lote
//   function getNextLoteId() {
//     const existingIds = lotes.map((l) => parseInt(l.id.replace("LOTE_", "")));
//     const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
//     return `LOTE_${String(maxId + 1).padStart(3, "0")}`;
//   }

//   // Carregar lotes existentes
//   function loadExistingLotes() {
//     const lotesData = $("#terreno_lotes_data").val();
//     if (lotesData) {
//       try {
//         lotes = JSON.parse(lotesData);
//         lotes.forEach((lote) => {
//           addLoteToMap(lote);
//         });
//         renderLotesList();
//       } catch (e) {
//         console.error("Erro ao carregar lotes:", e);
//       }
//     }
//   }

//   // Atualizar dados dos lotes no input hidden
//   function updateLotesData() {
//     const lotesData = lotes.map((lote) => ({
//       id: lote.id,
//       coordinates: lote.coordinates,
//       color: lote.color,
//       fillColor: lote.fillColor,
//       colorName: lote.colorName,
//     }));
//     $("#terreno_lotes_data").val(JSON.stringify(lotesData));
//   }

//   // Renderizar lista de lotes
//   function renderLotesList() {
//     const container = $("#lista-lotes-container");
//     container.empty();

//     if (lotes.length === 0) {
//       container.html("<p>Nenhum lote cadastrado ainda.</p>");
//       return;
//     }

//     lotes.forEach((lote) => {
//       const loteHtml = `
//                 <div class="lote-item" data-lote-id="${lote.id}">
//                     <h5>
//                         <span style="display: inline-block; width: 20px; height: 20px; background: ${lote.fillColor}; border: 2px solid ${lote.color}; margin-right: 10px;"></span>
//                         ${lote.id} (${lote.colorName})
//                     </h5>
//                     <p><strong>Coordenadas:</strong> ${lote.coordinates.length} pontos</p>
//                     <div class="lote-actions">
//                         <button type="button" class="button button-small editar-lote" data-lote-id="${lote.id}">Editar</button>
//                         <button type="button" class="button button-small remover-lote" data-lote-id="${lote.id}">Remover</button>
//                         <button type="button" class="button button-small centralizar-lote" data-lote-id="${lote.id}">Centralizar</button>
//                     </div>
//                 </div>
//             `;
//       container.append(loteHtml);
//     });
//   }

//   // Remover lote
//   function removeLote(loteId) {
//     if (!confirm(`Deseja realmente remover o ${loteId}?`)) return;

//     const loteIndex = lotes.findIndex((l) => l.id === loteId);
//     if (loteIndex > -1) {
//       const lote = lotes[loteIndex];
//       if (lote.polygon) {
//         map.removeLayer(lote.polygon);
//       }
//       lotes.splice(loteIndex, 1);
//       updateLotesData();
//       renderLotesList();
//       alert(`${loteId} removido com sucesso!`);
//     }
//   }

//   // Centralizar mapa no lote
//   function centralizarLote(loteId) {
//     const lote = lotes.find((l) => l.id === loteId);
//     if (lote && lote.coordinates.length > 0) {
//       const bounds = L.polygon(lote.coordinates).getBounds();
//       map.fitBounds(bounds);
//     }
//   }

//   // Limpar todos os lotes
//   function limparTodosLotes() {
//     if (
//       !confirm(
//         "Deseja realmente remover todos os lotes? Esta ação não pode ser desfeita."
//       )
//     )
//       return;

//     lotes.forEach((lote) => {
//       if (lote.polygon) {
//         map.removeLayer(lote.polygon);
//       }
//     });

//     lotes = [];
//     updateLotesData();
//     renderLotesList();
//     alert("Todos os lotes foram removidos!");
//   }

//   // Event listeners
//   $("#buscar_endereco").on("click", function () {
//     const endereco = $("#terreno_endereco").val();
//     if (endereco.trim()) {
//       geocodeAddress(endereco);
//     } else {
//       alert("Digite um endereço para buscar");
//     }
//   });

//   $("#desenhar_lote").on("click", startDrawing);
//   $("#limpar_lotes").on("click", limparTodosLotes);

//   // Event delegation para botões dos lotes
//   $(document).on("click", ".remover-lote", function () {
//     const loteId = $(this).data("lote-id");
//     removeLote(loteId);
//   });

//   $(document).on("click", ".centralizar-lote", function () {
//     const loteId = $(this).data("lote-id");
//     centralizarLote(loteId);
//   });

//   // Permitir Enter no campo de endereço
//   $("#terreno_endereco").on("keypress", function (e) {
//     if (e.which === 13) {
//       e.preventDefault();
//       $("#buscar_endereco").click();
//     }
//   });

//   // Atualizar coordenadas quando os inputs são alterados manualmente
//   $("#terreno_latitude, #terreno_longitude").on("change", function () {
//     const lat = parseFloat($("#terreno_latitude").val());
//     const lng = parseFloat($("#terreno_longitude").val());

//     if (!isNaN(lat) && !isNaN(lng)) {
//       addMarker(lat, lng);
//       map.setView([lat, lng], 18);
//     }
//   });

//   // Funções globais para uso nos popups
//   window.editarLote = function (loteId) {
//     alert(`Funcionalidade de edição do ${loteId} será implementada em breve.`);
//     // Aqui você pode implementar a edição de lotes
//   };

//   window.removerLote = function (loteId) {
//     removeLote(loteId);
//   };

//   // Inicializar quando o mapa estiver pronto
//   if (typeof L !== "undefined") {
//     initMap();
//   } else {
//     // Aguardar carregamento do Leaflet
//     const checkLeaflet = setInterval(function () {
//       if (typeof L !== "undefined") {
//         clearInterval(checkLeaflet);
//         initMap();
//       }
//     }, 100);
//   }

//   // Prevenir envio do formulário quando pressionando Enter nos campos
//   $("#terreno_endereco, #terreno_latitude, #terreno_longitude").on(
//     "keydown",
//     function (e) {
//       if (e.keyCode === 13) {
//         e.preventDefault();
//       }
//     }
//   );

//   // Salvar automaticamente ao sair do campo
//   $("#terreno_endereco, #terreno_latitude, #terreno_longitude").on(
//     "blur",
//     function () {
//       // Trigger do evento change para atualizar os dados
//       $(this).trigger("change");
//     }
//   );

//   // Mensagem de ajuda para o usuário
//   if ($("#mapa").length > 0) {
//     $(
//       '<div class="notice notice-info"><p><strong>Como usar:</strong><br>' +
//         "• Clique no mapa ou digite um endereço para definir a localização<br>" +
//         '• Use "Desenhar Novo Lote" para criar polígonos representando os lotes<br>' +
//         "• Clique no mapa para adicionar pontos ao polígono<br>" +
//         "• Clique com o botão direito para finalizar o polígono<br>" +
//         "• Cada lote recebe um ID único que pode ser usado no frontend</p></div>"
//     ).insertBefore("#terreno-mapa-container");
//   }
// });

// // Função auxiliar para calcular área do polígono (aproximada)
// function calcularArea(coordinates) {
//   if (coordinates.length < 3) return 0;

//   let area = 0;
//   const j = coordinates.length - 1;

//   for (let i = 0; i < coordinates.length; i++) {
//     area +=
//       (coordinates[j][0] + coordinates[i][0]) *
//       (coordinates[j][1] - coordinates[i][1]);
//     j = i;
//   }

//   return Math.abs(area / 2) * 111320; // Conversão aproximada para m²
// }
