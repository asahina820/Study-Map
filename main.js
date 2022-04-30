const firebaseConfig = {
  apiKey: "AIzaSyArpzDzVztEkVAw0WMAb7HuchiJ6D-r2Qc",
  authDomain: "slog-map.firebaseapp.com",
  projectId: "slog-map",
  storageBucket: "slog-map.appspot.com",
  messagingSenderId: "196564306097",
  appId: "1:196564306097:web:8929c883ac4cf775997a90",
};

// https://github.com/google/google-api-javascript-client/blob/master/docs/start.md
const gapiConfig = {
  apiKey: 'AIzaSyBYBitUyYjOT1XipnK4npRMrJAqyRtaBNc',
  'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest'],
  'clientId': '196564306097-h9rorlcsbdefol2f6ccr3bihkmcma1pu.apps.googleusercontent.com',
  'scope': 'profile',
}

const router = new VueRouter({
  routes: [
    { path: '/', component: httpVueLoader('./map.vue') },
    { path: '/list', component: httpVueLoader('./list.vue') },
    { path: '/detail/:id', component: httpVueLoader('./detail.vue') },
    { path: '/login', component: httpVueLoader('./login.vue') },
    { path: '/crud', component: httpVueLoader('./crud.vue') },  // hidden page
  ]
})

const app = new Vue({
  el: "#app",
  router,
  data: function() { 
    return {
      user: null,
      firebase,
    }
  },
  mounted: function() {
    // Initialize Firebase
    this.firebase = firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user;
        // document.querySelector("#username").innerText = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    gapi.load('client', async () => {
      await gapi.client.init(gapiConfig);
      console.debug("Now you can use gapi.client.sheets API!");
    });
  }
});