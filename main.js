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