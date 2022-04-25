<template>
    <div class="ui centered card" style="width:50%; margin-top:50px;">
        <div class="image">
            <img src="https://www2.wagmap.jp/sendaicity-html/pict/ext_shimin.jpg">
        </div>
        <div class="content">
            <a href = "http://www.library.pref.miyagi.jp/" class="header">宮城県図書館</a>
            <div class="meta">
                <span class="category">{{ name }}</span>
            </div>
            <div class="description">{{ description }}</div>
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
            <div v-for="review in reviews" :key="review" class="ui tag labels">
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
      name: '宮城県図書館',
      description: ' 伊達家ゆかりの資料である伊達文庫などの古書を含む、約115万点の資料を収蔵している。',
      reviews: [],
    }
  },
  mounted: async function() {
      const db = firebase.firestore();
      const documentId = 'gHWHGxflto2fijt4Ftgs';  // FIXME: いま開いている地物のdocumentIDをもらってくること

      const snap = await db.collection('feature').doc(documentId).collection('reviews').get();
      snap.forEach(doc => {
          this.reviews.push(doc.data())
      });
  },
  methods: {
      aaa: async function() {
        const db = firebase.firestore();
        const comment = document.querySelector('form.ui input').value;
        const documentId = 'gHWHGxflto2fijt4Ftgs';  // FIXME: いま開いている地物のdocumentIDをもらってくること
        const reviews = db.collection('feature').doc(documentId).collection('reviews');
        const docRef = await reviews.add({
            comment: comment,
            user_id: this.$parent.user?.uid || "anonymous"
        });
        return false;  // TODO: リダイレクトさせる
    }
  }
}
</script>