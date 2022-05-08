<template>
    <div>
        <p>
            <h3>【注意】</h3>
            <ol>
                <li>左端のID列を修正してSaveすると新規地物として登録されます。<br/>
                    既存のレビューとの関連は切れます。<br/>
                    既存の地物を編集する場合は、左端のID列は編集しないでください。<br/>
                    座標が同一の地物が複数あるときの動作は未確認です。</li>
                <li>ID列以外を編集してsaveすると、行単位で既存地物データを上書きします。<br/>
                    (geohash文字列はlngとlatから算出しますので入力不要です)</li>
                <li>typeは現時点では 「<span class="tt">library</span>と <span class="tt">community_centre</span> と それ以外」で3種類のアイコンを出し分けています。<br/>
                    アイコンは3種類しか用意していません。新しいtypeを定義するときはロジックの修正とアイコンの追加が必要になります。</li>
                <li>ページ先頭の「ファイルを選択」でgeojsonファイルを読み込みます。そのあと行単位のSaveボタンで追加できます。
                    サンプルは<a href="https://github.com/hinamei/Study-Map/tree/vue/geojson">ここ</a>にあります。<br/>
                    nameやdescription など、現時点では cafe_in_tohoku.geojson に記載されている属性を解釈するように実装してありますが、別のproperties を割り当てたい場合は実装の修正が必要ですので登録したいgeojsonファイルをお知らせください。
                </li>
                <li>地物の削除はこのページからはできません。詳細な編集(削除含む)は
                    <a href="https://console.firebase.google.com/project/slog-map/firestore/data/~2Ffeature~2F0mXRxazaKAnDxBCFP9mz">Firestore管理ページ</a>から行えます(管理アカウントでのログインが必要です)。</li>
            </ol>
        </p>
        <input type=file @change="upload">
        <table>
            <thead>
                <tr>
                    <th v-for="column in Object.keys(columns)"> {{ column }} </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(feature, index) in features" :key="index" :class="{ edited: feature.darty }">
                    <td v-for="column in Object.keys(columns)">
                        <input @change="darty(index)" v-model="feature[column]" :size="columns[column]">
                    </td>
                    <td @id="feature.id"><button @click="save(index)">save</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            columns: { id: 10, 'lng': 12, 'lat': 12, 'type': 12, 'name': 15, 'description': 20, 'imgSrc': 20 },
            features: [],
        }
    },
    mounted: async function () {
        const db = firebase.firestore();
        const features_ref = await db.collection('feature').get();
        this.features = features_ref.docs
            .map(feature_ref => {
                data = feature_ref.data();
                if (data.geometry) {
                    return {
                        id: feature_ref.id,
                        darty: false,
                        lng: data.geometry.longitude,
                        lat: data.geometry.latitude,
                        type: data.type,
                        name: data.name,
                        description: data.description,
                        imgSrc: data.imgSrc
                    }
                } else {
                    return {
                        id: feature_ref.id,
                        darty: false,
                        lng: 0,
                        lat: 0,
                        type: "library",
                        name: "name",
                        description: "description",
                    }
                }
            });
    },
    methods: {
        darty: function (index) {
            this.features[index].darty = true;
        },
        save: async function (index) {
            debugger
            feature = this.features[index];
            const db = firebase.firestore();
            // if (feature.darty) {
            await db.collection('feature').doc(feature.id).set({
                geometry: new firebase.firestore.GeoPoint(Number(feature.lat), Number(feature.lng)),
                type: feature.type || "",
                name: feature.name || "",
                description: feature.description || "",
                imgSrc: feature.imgSrc || "",
                geohash: geohash.encode(Number(feature.lat), Number(feature.lng)),
            }, { merge: true });
            // }
            feature.darty = false;
        },
        upload: async function(event) {
            const file = event.srcElement.files[0];
            const content = await file.text();
            const featurecollection = JSON.parse(content);
            const features = featurecollection.features
            .map(geojson => {
                return {
                        id: geojson.properties.name + (geojson.properties.branch || ""),
                        darty: true,
                        lng: geojson.geometry.coordinates[0],
                        lat: geojson.geometry.coordinates[1],
                        type: geojson.properties.type,
                        name: geojson.properties.name,
                        description: geojson.properties.コメント,
                        imgSrc: geojson.properties.写真
                    }
            })
            .filter(features => features.lng >= 140.7 && features.lng <= 141 && features.lat >= 38.15 && features.lat <= 38.39);
            this.features.push(...features);
            debugger;
        }
    }
}
</script>
<style>
td {
    background-color: wheat;
}

tr.edited td {
    border-style: solid;
    border-width: thin;
    border-color: red;
}

.tt {
    font-family: monospace;
}
</style>