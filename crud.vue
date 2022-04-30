<template>
    <table>
        <thead>
            <tr>
                <th>id</th>
                <th v-for="column in Object.keys(columns)"> {{ column }} </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(feature,index) in features" :key="index" :class="{ edited: feature.darty }">
                <td v-for="column in Object.keys(columns)">
                    <input @change="darty(index)" v-model="feature[column]" :size="columns[column]">
                </td>
                <td @id="feature.id"><button @click="save(index)">save</button></td>
            </tr>
        </tbody>
    </table>
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
            feature = this.features[index];
            const db = firebase.firestore();
            if (feature.darty) {
                await db.collection('feature').doc(feature.id).set({
                    geometry: new firebase.firestore.GeoPoint(Number(feature.lat), Number(feature.lng)),
                    type: feature.type || "",
                    name: feature.name || "",
                    description: feature.description || "",
                    imgSrc: feature.imgSrc || "",
                }, { merge: true });
            }
            feature.darty = false;
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