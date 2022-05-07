<template>
    <div id="detail-cards">
        <div class="ui centered card" id="info-card">
            <img v-bind:src="imgSrc">
            <div class="content">
                <div class="header">
                    {{ name }}
                    <button class="ui icon button" @click="setLocation" title="地図に移動"><i
                            class="map marker alternate icon"></i></button>
                </div>
                <div class="meta">
                    <span class="category" v-if="type == 'library'">図書館</span>
                    <span class="category" v-else-if="type == 'cafe'">カフェ</span>
                    <span class="category" v-else>公民館</span>
                    <div class="description" id="detail-description"><span v-html="description"></span></div>
                </div>
            </div>
        </div>
        <div class="ui centered card" id="posted-card">
            <div class="extra content" id="tag-area">
                <p>タグ</p>
                <div class="ui tag labels">
                    <a class="ui label">静かめ</a>
                    <a class="ui label">無料</a>
                    <a class="ui label">休日は混んでる</a>
                    <a class="ui label">大学生が多い</a>
                    <a class="ui label">人気</a>
                </div>
            </div>
            <div class="extra content" id="review-list-area">
                <p>口コミ一覧</p>
                <p class="description" v-if="reviews.length == 0">口コミはまだありません。</p>
                <div v-for="(review, index) in reviews" :key="index" class="ui tag labels">
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
            <div class="extra content" id="review-post-area">
                <p>口コミ投稿</p>
                <form class="ui form">
                    <div class="field">
                        <input type="text" required>
                    </div>
                </form>
                <button class="ui button" type="submit" @click="sendReview">送信</button>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            name: '',
            description: '',
            imgSrc: '',
            type: '',
            reviews: [],
            location: [],
        }
    },
    mounted: async function () {
        const db = firebase.firestore();
        const documentId = this.$route.params.id;
        const docRef = db.collection('feature').doc(documentId);
        const data = (await docRef.get()).data();
        this.name = data.name;
        this.description = data.description;
        this.imgSrc = data.imgSrc;
        this.type = data.type;
        this.location = data.geometry;
        // コメントを取り出す
        const reviewsFromDoc = await docRef.collection('reviews').get();
        this.reviews = reviewsFromDoc.docs.map(doc => doc.data())
            .sort((a, b) => (a.timestamp - b.timestamp))
    },
    methods: {
        sendReview: async function () {
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
        },
        setLocation: function () {
            this.$router.push(`/@${this.location.latitude},${this.location.longitude}`);
        }
    }
}
</script>