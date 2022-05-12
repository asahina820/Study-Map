<template>
    <div id="login">
        <div id="firebaseui-auth-container"></div>
        <div class="ui centered card" id="profile" v-if="user != null">
            <img class="ui centered image" :src="user.photoURL" style="width:200px" />
            <div class="ui list">
                <div class="item">

                    <div class="ui left labeled button" v-if="!editing">
                        <div class="ui basic label">{{ user.displayName }}</div>
                        <a class="ui left pointing button" @click="edit"><i class="edit icon"></i></a>
                    </div>

                    <div class="ui left labeled button" v-else>
                        <input id="newname" class="ui basic input" :value="user.displayName">
                        <!-- v-modelにはせず、@click で処理する -->
                        <a class="ui button" @click="updateProfile"><i class="large outline save icon"></i></a>
                    </div>
                </div>

                <div class="item">
                    <i class="ui large outline mail icon"></i>
                    <div class="content">{{ user.email || "void" }}</div>
                    <i class="ui green circle check icon" v-if="user.emailVerified"></i>
                </div>

                <div class="item" v-for="provider in providers.slice(1)" :key="provider.providerId">
                    <div class="ui toggle checkbox">
                        <input type="checkbox"
                            :checked="user.providerData.find(pd => pd.providerId === provider.providerId)"
                            @click="toggle_social($event, provider)">
                        <label>
                            <i class="ui icon" :class="provider.providerId.slice(0, -4)"></i>
                            {{ provider.providerId }} 連携
                        </label>
                    </div>
                </div>

                <div class="ui negative message" v-if="this.error_message">
                    <i class="ui ban icon"></i>
                    <div class="content">{{ error_message }}</div>
                </div>

                <button class="ui button" @click="signout">sign out</button>
            </div>
        </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            user: undefined,
            error_message: undefined,
            editing: false,
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
        edit() {
            this.editing = true;
        },
        updateProfile(event) {
            const user = firebase.auth().currentUser;
            if(!user) {
                this.error_message = "ユーザが存在しません。更新できませんでした。";
                return;
            }
            const newname = document.querySelector("#newname").value;
            if(!newname) {
                this.error_message = "ユーザ名が無効です。更新できませんでした。";
                return;
            }
            user.updateProfile({
                displayName: newname,
            }).then(() => {
                this.editing = false;
                this.user.displayName = newname;
                this.$parent.$forceUpdate();  // update username in a header
            }).catch((error) => {
                this.error_message = error;
                this.editing = false;
                this.$forceUpdate();  // rewind the display name
            });
        },
        toggle_social(event, provider) {
            const connected = this.user.providerData.find(pd => pd.providerId === provider.providerId);
            if (!connected) {
                firebase.auth().currentUser.linkWithRedirect(provider);
            } else {
                if (this.user.providerData.length < 2) {
                    event.preventDefault(); // cancel default action
                    this.error_message = "You must have at least one social login";
                } else {
                    this.user.unlink(provider.providerId).then(() => this.user = user);
                }
            }
        }
    }
}
</script>