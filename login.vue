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
                <div class="item">Social Login:<br />
                    <div class="content" v-for="provider in providers.slice(1)" :key="provider.providerId">
                        <i class="ui icon" :class="provider.providerId.slice(0, provider.providerId.length - 4)"></i>{{
                                provider.providerId
                        }}
                        <span v-if="user.providerData.find(pd => pd.providerId === provider.providerId)">連携済み
                            <button @click="user.unlink(provider.providerId).then(() => this.user = user)">解除</button>
                        </span>
                        <button v-else @click="firebase.auth().currentUser.linkWithRedirect(provider)">連携する</button>
                    </div>
                </div>
            </div>
            <div>{{ error_message }}</div>
            <button @click="signout">sign out</button>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            user: undefined,
            error_message: undefined,
        }
    },
    created: function () {
        this.firebase = firebase;
    },
    mounted() {
        this.providers = [
            new firebase.auth.EmailAuthProvider(),
            new firebase.auth.GoogleAuthProvider(),
            new firebase.auth.TwitterAuthProvider(),
            new firebase.auth.GithubAuthProvider(),
        ];
        firebase.auth().onAuthStateChanged((user) => {
            this.user = user ? user : null;
        });
        firebase.auth().getRedirectResult().then((result) => {
            if (result.credential) {
                // debugger;
                // Accounts successfully linked.
                var credential = result.credential;
                var user = result.user;
                // ...
            }
        }).catch((error) => {
            this.error_message = `ERROR: ${error.message}`;
        });
    },
    updated() {
        if (!this.user) {
            // sign in
            // https://firebase.google.com/docs/auth/web/firebaseui?hl=ja#oauth_providers_google_facebook_twitter_and_github
            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
            ui.start('#firebaseui-auth-container', {
                signInOptions: this.providers.map(p => p.providerId),
                signInSuccessUrl: window.location.origin + window.location.pathname,
            });
        };
    },
    methods: {
        async signout() {
            await firebase.auth().signOut();
            this.user = null;
        },
    }
}
</script>