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

        map.on('move', _.debounce(async (e) => {
            currentPosi = map.getCenter();
            currentZoom = map.getZoom();
            sessionStorage.setItem('currentLat',currentPosi.lat);
            sessionStorage.setItem('currentLng',currentPosi.lng);
            sessionStorage.setItem('currentZoom',currentZoom);
            // retrieve features for new boundaries
            if (false) {
                // データ量が増えてきたら有効化する
                geoJsonLayer?.remove();
                if (currentZoom > 8) {
                    geoJsonLayer = await this.getFeaturesLayer();
                    geoJsonLayer.addTo(map);
                }
            }
        }, 500));

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(map);
        var geoJsonLayer = await this.getFeaturesLayer();
        geoJsonLayer.addTo(map);
    },
    methods: {
        getFeaturesLayer: async function () {
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
            var communityCentreIcon = L.icon({
                iconUrl: './img/community_centre.png',
                iconSize: [40, 40],
                iconAnchor: [25, 50],
                popupAnchor: [0, -50],
            });

            const geojson = {
                "type": "FeatureCollection",
                "features": [],
            }
            var geoJsonLayer = L.geoJson(geojson,
                {
                    pointToLayer: function (feature, latlng) {
                        // typeが図書館の場合は図書館のアイコンを表示する
                        if(feature.properties.type == 'library'){
                            return L.marker(latlng, {icon: libraryIcon})
                        }
                        // typeがカフェの場合はカフェのアイコンを表示する
                        else if(feature.properties.type == 'cafe'){
                            return L.marker(latlng, {icon: cafeIcon})
                        }
                        // 図書館、カフェ以外の場合は公民館のアイコンを表示する
                        else{
                            return L.marker(latlng, {icon: communityCentreIcon})
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
            // geoJsonLayer.addTo(map);

            var bboxes = ['0', 'z'];
            if (false) {  // データ量が増えてきたら有効化する
                // BoundingBoxで限定して検索する
                const bounds = map.getBounds();
                for (let precision = 1; precision < 8; precision++) {
                    bboxes = geohash.bboxes(bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast(), precision);
                    if (bboxes.length > 8) break;
                }
            }

            // retrieve features from firestore
            const db = firebase.firestore();
            const features = await db.collection('feature')
                .where('geohash','>=', bboxes[0])
                .where('geohash','<', bboxes[bboxes.length-1])
                .get();
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

            return geoJsonLayer;
        },
    }
}
</script>
<style>
#map {
    width: 100%;
    height: 100%;
}
</style>