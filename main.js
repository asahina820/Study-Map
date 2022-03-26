// 背景地図表示
let lat = 38.26889; // 緯度
let lon = 140.87194; // 経度
let zoom = 16; // ズームレベル

let map = L.map("map");
map.setView([lat, lon], zoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

// 地物表示
var geojsonFeature = {
  "type": "Feature",
  "properties": {
      "name": "親子プラス仙台",
      "popupContent": "親子プラス仙台"
  },
  "geometry": {
      "type": "Point",
      "coordinates": [140.866252, 38.260599]
  }
};

var icon = L.geoJSON(geojsonFeature).addTo(map);
icon.bindPopup("親子プラス仙台");
