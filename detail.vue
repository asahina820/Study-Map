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

        <div>
            <span v-for="comment in comments" :key="comment">{{comment}}<br/></span>
        </div>
        
        <div class="extra content">
            <p>口コミ</p>
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
      comments: [
          '静かです',
          '子どもが走り回っていました',
          'リファレンスが優しかった'
      ],
    }
  },
  mounted: function() {
  },
  methods: {
      aaa: async function() {
        db = document.firebase.db;  // FIXME
        collection = document.firebase.collection;  // FIXME
        doc = document.firebase.doc;  // FIXME
        getDoc = document.firebase.getDoc;  // FIXME
        setDoc = document.firebase.setDoc;  // FIXME
        addDoc = document.firebase.addDoc;  // FIXME
        const comment = document.querySelector('form.ui input').value;
        const documentId = 'gHWHGxflto2fijt4Ftgs';  // FIXME: いま開いている地物のdocumentIDをもらってくること
        // const thelibrary = collection(db, 'feature')
        const the_feature = doc(db, 'feature', documentId);
        const reviews = collection(the_feature, 'reviews');
        debugger
        await addDoc(reviews, {
            comment: comment,
            user_id: 'TBD'
        });
        return false;  // TODO: リダイレクトさせる
    }
  }
}
</script>