document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("mapa-terreno");
  if (!mapContainer) return;

  const lat = parseFloat(mapContainer.dataset.lat) || -23.5505;
  const lng = parseFloat(mapContainer.dataset.lng) || -46.6333;

  const map = new google.maps.Map(mapContainer, {
    center: { lat, lng },
    zoom: 14,
  });

  new google.maps.Marker({
    position: { lat, lng },
    map,
    title: "Localização do Terreno",
  });
});
