<template>
  <div class="ui four cards" id="list-card">
    <div v-for="featureItem in featureItems" :key="featureItem.documentId" class="card">
      <div class="image">
        <img v-bind:src="featureItem.imgSrc">
      </div>
      <div class="content">
        <router-link tag="a" v-bind:to="'/detail/'+featureItem.documentId" title="詳細" class="header">{{ featureItem.name }}</router-link>
      </div>
      <div class="extra">
        <span class="category" v-if="featureItem.type == 'library'">図書館</span>
        <span class="category" v-else-if="featureItem.type == 'cafe'">カフェ</span>
        <span class="category" v-else>公民館</span>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      featureItems: [],
    }
  },
  mounted: async function() {
    const db = firebase.firestore();
    const itemListFromDoc = await db.collection('feature').get();
    // 地物情報（GeoJSON形式）とドキュメントIDを全て取り出す
    this.featureItems = itemListFromDoc.docs.map(doc => {
      const data = doc.data();
      return {
        documentId: doc.id,
        name: data.name,
        imgSrc: data.imgSrc,
        type: data.type
      }
    });
  }
}
</script>