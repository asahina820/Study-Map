const firebaseConfig = {
  apiKey: "AIzaSyArpzDzVztEkVAw0WMAb7HuchiJ6D-r2Qc",
  authDomain: "slog-map.firebaseapp.com",
  projectId: "slog-map",
  storageBucket: "slog-map.appspot.com",
  messagingSenderId: "196564306097",
  appId: "1:196564306097:web:8929c883ac4cf775997a90",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const router = new VueRouter({
  routes: [
    { path: '/', component: httpVueLoader('./map.vue') },
    { path: '/list', component: httpVueLoader('./list.vue') },
    { path: '/detail', component: httpVueLoader('./detail.vue') },
  ]
})
const app = new Vue({
  el: "#app",
  router,
  db,  // can refer from vue components by this.$parent.$options.db
});