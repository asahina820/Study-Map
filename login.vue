<template>
    <div id="login">
        <div id="firebaseui-auth-container"></div>
    </div>
</template>

<script>
module.exports = {
    async mounted() {
        // https://firebase.google.com/docs/auth/web/firebaseui?hl=ja#oauth_providers_google_facebook_twitter_and_github
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                // List of OAuth providers supported.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID
            ],
            signInSuccessUrl: 'http://localhost:5555/#/',   // FIXME
            // Other config options...
        });
        // // https://firebase.google.com/docs/auth/web/google-signin?hl=ja
        // // enables google provider via https://console.firebase.google.com/u/3/project/slog-map/authentication/providers?hl=ja
        // var provider = new firebase.auth.GoogleAuthProvider();
        // // We choose signInWithRedirect instead of signInWithPopup because popup permission needed on each users web browser
        // firebase.auth().signInWithRedirect(provider);
    }
}
</script>