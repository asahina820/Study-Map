<template>
    <table>
        <thead>
            <tr>
                <th>id</th>
                <th v-for="column in Object.keys(columns)"> {{ column }} </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="feature in features" :key="feature.id" @id="feature.id" :class="{ edited: feature.darty }">
                <td><input class="id" :value="feature.id" disabled></td>
                <td v-for="column in Object.keys(columns)">
                    <input @change="darty(feature.id)" v-model="feature[column]" :size="columns[column]">
                </td>
                <td @id="feature.id"><button @click="save(feature.id)">save</button></td>
            </tr>
        </tbody>
    </table>
</template>

<script>
module.exports = {
    data: function () {
        return {
            columns: { 'lng': 12, 'lat': 12, 'type': 12, 'name': 15, 'description': 20, 'imgSrc': 20 },
            features: [],
        }
    },
    mounted: async function () {
        const db = firebase.firestore();
        const features_ref = await db.collection('feature').get();
        this.features = features_ref.docs
            .map(feature_ref => {
                data = feature_ref.data();
                debugger
                if (data.geojson) {
                    const geojson = JSON.parse(feature_ref.data().geojson);
                    return {
                        id: feature_ref.id,
                        darty: false,
                        lng: geojson.geometry.coordinates[0],
                        lat: geojson.geometry.coordinates[1],
                        type: geojson.properties.type,
                        name: geojson.properties.名称,
                        description: geojson.properties.コメント,
                        imgSrc: geojson.properties.写真
                    }
                } else {
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
                }
            });
    },
    methods: {
        darty: function (id) {
            console.log(id);
            this.features.find(feature => feature.id == id).darty = true;
        },
        save: async function (documentId) {
            feature = this.features.find(feature => feature.id == documentId);
            const db = firebase.firestore();
            if (feature.darty) {
                await db.collection('feature').doc(documentId).set({
                    geometry: new firebase.firestore.GeoPoint(Number(feature.lat), Number(feature.lng)),
                    type: feature.type || "",
                    name: feature.name || "",
                    description: feature.description || "",
                    imgSrc: feature.imgSrc || "",
                }, { merge: true });
            }
            feature.darty = false;

            // const docRef = await reviews.add({
            //     comment: comment,
            //     user_id: this.$parent.user?.uid || "anonymous"
            // });
            // return false;  // TODO: リダイレクトさせる
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
</style>