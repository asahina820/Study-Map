<template>
    <div id="login">
        <div id="firebaseui-auth-container"></div>
        <div id="profile" v-if="!this.$parent?.user?.isCentinel">
            <div class="ui list">
                <div class="item">
                    <img class="content" :src="this.$parent?.user?.photoURL" style="width:200px" />
                </div>
                <div class="item">
                    <div class="content">{{ this.$parent?.user?.displayName || "void" }}
                    </div>
                </div>
            </div>
            <button @click="signout">sign out</button>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            user: this.$parent?.user
        }
    },
    async mounted() {
        if (this.$parent?.user?.isCentinel) {
            this.signin();
        }
    },
    methods: {
        signin() {
            // sign in
            // https://firebase.google.com/docs/auth/web/firebaseui?hl=ja#oauth_providers_google_facebook_twitter_and_github
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', {
                signInOptions: [
                    // List of OAuth providers supported.
                    firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                    firebase.auth.GithubAuthProvider.PROVIDER_ID
                ],
                signInSuccessUrl: window.location.origin + window.location.pathname,
                // Other config options...
            });
        },
        signout() {
            firebase.auth().signOut().then(this.signin);
        }
    }
}
</script>