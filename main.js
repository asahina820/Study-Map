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
var libraryIcon = L.icon({
  iconUrl: './img/book.png',
  iconSize: [40, 40],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});

let point;
$.getJSON("geojson/sendai_library.geojson",function(data) {
  point = L.geoJson(data,
    {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: libraryIcon})
      },
      onEachFeature: function(feature,layer){
        let name = feature.properties.名称;
        // TODO: 各施設の詳細ページに飛ばす。今は仮のページになっている
        let link = './detail.html'
        layer.bindPopup(name + '<br>' + '<a href = ' + link + '>詳細</a>');
      }
    }
  ).addTo(map);
});