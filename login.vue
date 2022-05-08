<template>
    <div id="login">
        <div id="firebaseui-auth-container"></div>
        <div id="profile" v-if="user != null">
            <div class="ui list">
                <div class="item">
                    <img class="content" :src="user.photoURL" style="width:200px" />
                </div>
                <div class="item">Display Name: 
                    <div class="content">{{ user.displayName || "void" }} </div>
                </div>
                <div class="item">email: 
                    <div class="content">{{ user.email || "void" }} </div>
                </div>
                <div class="item">emailVerified: 
                    <div class="content">{{ user.emailVerified || "void" }} </div>
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
            user: undefined,
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            this.user = user ? user : null;
        });
    },
    updated() {
        if (!this.user) {
            // sign in
            // https://firebase.google.com/docs/auth/web/firebaseui?hl=ja#oauth_providers_google_facebook_twitter_and_github
            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
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
        };
    },
    methods: {
        async signout() {
            await firebase.auth().signOut();
            this.user = null;
        }
    }
}
</script>