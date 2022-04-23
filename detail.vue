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
    </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      name: '宮城県図書館',
      description: ' 伊達家ゆかりの資料である伊達文庫などの古書を含む、約115万点の資料を収蔵している。'
    }
  }
}
</script>