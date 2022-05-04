<template>
    <!-- 地図 -->
    <div id="map"></div>
</template>

<script>
module.exports = {
  async mounted() {
    // 背景地図表示
    let map = L.map("map");

    map.setView([
            Number(sessionStorage.currentLat ||  38.26889),  // 緯度
            Number(sessionStorage.currentLng || 140.87194), // 経度
        ],
        Number(sessionStorage.currentZoom || 16),  // ズームレベル
    );

    map.on('move', _.debounce(function(e){
        currentPosi = map.getCenter();
        currentZoom = map.getZoom();
        sessionStorage.setItem('currentLat',currentPosi.lat);
        sessionStorage.setItem('currentLng',currentPosi.lng);
        sessionStorage.setItem('currentZoom',currentZoom);
    }, 500));

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
    ).addTo(map);
    // アイコン設定
    var libraryIcon = L.icon({
        iconUrl: './img/book.png',
        iconSize: [40, 40],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
    });
    var cafeIcon = L.icon({
        iconUrl: './img/cafe.png',
        iconSize: [40, 40],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
    });
    const geojson = {
        "type": "FeatureCollection",
        "features": [],
    }
    const geoJsonLayer = L.geoJson(geojson,
        {
            pointToLayer: function (feature, latlng) {
                // typeが図書館の場合は図書館のアイコンを表示する
                if(feature.properties.type == 'library'){
                    return L.marker(latlng, {icon: libraryIcon})
                }
                // 図書館以外の場合はカフェのアイコンを表示する
                // TODO: 公民館が増えた場合は判定を追加する
                else{
                    return L.marker(latlng, {icon: cafeIcon})
                }
            },
            onEachFeature: function(feature,layer){
                // Leafletのpopupからrouter-linkを表示することができない
                // そのため、Vueオブジェクトを作ってpopupに渡す
                let name = feature.properties.name;
                let PopupCont = Vue.extend({
                    router,
                    template: `<router-link to="/detail/${feature.id}" title="詳細">${name}</router-link>`
                })
                let popup = new PopupCont()
                layer.bindPopup(popup.$mount().$el)
            }
        }
    );
    geoJsonLayer.addTo(map);

    // retrieve features from firestore
    const db = firebase.firestore();
    const features = await db.collection('feature').get();
    features.docs.map(doc => {
        const data = doc.data();
        return data.geometry
        ? {  // from geopoint
            id: doc.id,
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    data.geometry.longitude,
                    data.geometry.latitude,
                ],
            },
            "properties": {
                name: data.name,
                imgSrc: data.imgSrc,
                type: data.type,
            },
        }
        : Object.assign({id: doc.id}, JSON.parse(data.geojson || "{}"));  // from geojson
    })
    .map(data => geoJsonLayer.addData(data));

    // retrieve features from spreadsheet
    if (false) try {
        await new Promise(resolve => setTimeout(resolve, 500));
        while(!gapi.client.sheets) {
            console.debug("waiting for that gapi.client.sheets api be available...")
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1JWUkyuRUprYrODsa1Fr70VOIxleLNy5g3Xs-g7NymmI',
            range: 'amenity:library'
        });
        var features_json = response.result?.values?.slice(2)?.map(feature => {
            const [id, lat, lng, type, name, description, imgSrc] = feature;
            return {
                type: "Feature",
                id,
                properties: { "名称": name, type, name, description, imgSrc },
                geometry: {
                    type: "Point", 
                    coordinates: [ lat, lng ]
                }
            };
        }) || [];
        geojson.features.push(...features_json);
    } catch (error) {
        // do nothing...
    }

  }
}
</script>
<style>
#map {
    width: 100%;
    height: 100%;
}
</style>