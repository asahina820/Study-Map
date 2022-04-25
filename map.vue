<template>
    <!-- 地図 -->
    <div id="map"></div>
</template>

<script>
module.exports = {
  async mounted() {
    let lat = 38.26889; // 緯度
    let lng = 140.87194; // 経度
    let zoom = 16; // ズームレベル
    // 背景地図表示
    let map = L.map("map");
    map.setView([lat, lng], zoom);

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

    const db = firebase.firestore();
    const features = await db.collection('feature').get();
    const geojson = {
        "type": "FeatureCollection",
        "name": "sendai_library",
        "features": features.docs.map(doc => {
            const geojson = JSON.parse(doc.data().geojson);
            geojson.id = doc.id;
            return geojson;
        }),
    }

    L.geoJson(geojson,
        {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: libraryIcon})
            },
            onEachFeature: function(feature,layer){
                // Leafletのpopupからrouter-linkを表示することができない
                // そのため、Vueオブジェクトを作ってpopupに渡す
                let name = feature.properties.名称;
                let PopupCont = Vue.extend({
                    router,
                    template: `<router-link to="/detail/${feature.id}" title="詳細">${name}</router-link>`
                })
                let popup = new PopupCont()
                layer.bindPopup(popup.$mount().$el)
            }
        }
    ).addTo(map);
  }
}
</script>
<style>
#map {
    width: 100%;
    height: 100%;
}
</style>