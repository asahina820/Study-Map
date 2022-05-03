<template>
    <div class="ui centered card" style="width:50%; margin-top:50px;">
        <div class="image">
            <img v-bind:src="imgSrc">
        </div>
        <div class="content">
            <a href = "http://www.library.pref.miyagi.jp/" class="header">{{ name }}</a>
            <div class="meta">
                <span class="category" v-if="type == 'library'">図書館</span>
                <span class="category" v-else>カフェ</span>
            </div>
            <div class="description"><span v-html="description"></span></div>
        </div>
        <div class="extra content">
            <p>タグ</p>
            <div class="ui tag labels">
                <a class="ui label">静かめ</a>
                <a class="ui label">無料</a>
                <a class="ui label">休日は混んでる</a>
                <a class="ui label">大学生が多い</a>
                <a class="ui label">人気</a>
            </div>
        </div>
        
        <div class="extra content">
            <p>口コミ一覧</p>
            <div v-for="review in reviews" :key="review.comment" class="ui tag labels">
                <div class="ui relaxed divided list">
                    <div class="item">
                        <i class="large user middle aligned icon"></i>
                        <div class="content">
                            <p class="header">{{ review.user_id }}</p>
                            <div class="description">{{ review.comment }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       <div class="extra content">
            <p>口コミ投稿</p>
            <form class="ui form">
                <div class="field">
                    <input type="text" required>
                </div>
            </form>
            <button class="ui button" type="submit"  @click="aaa">Submit</button>
       </div>
    </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      name: '',
      description: '',
      imgSrc: '',
      type: '',
      reviews: [],
    }
  },
  mounted: async function() {
      const db = firebase.firestore();
      const documentId = this.$route.params.id;
      const docRef = db.collection('feature').doc(documentId);
      const data = (await docRef.get()).data();
      this.name = data.name;
      this.description = data.description;
      this.imgSrc = data.imgSrc;
      this.type = data.type;
      // コメントを取り出す
      const reviewsFromDoc = await docRef.collection('reviews').get();
      this.reviews = reviewsFromDoc.docs.map(doc => doc.data());
  },
  methods: {
      aaa: async function() {
        const db = firebase.firestore();
        const comment = document.querySelector('form.ui input').value;
        const documentId = this.$route.params.id;
        const reviews = db.collection('feature').doc(documentId).collection('reviews');
        review = {
            comment: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user_id: this.$parent.user?.displayName || "anonymous"
        };
        await reviews.add(review);
        this.reviews.push(review);
        document.querySelector('form.ui input').value = '';
    }
  }
}
</script>