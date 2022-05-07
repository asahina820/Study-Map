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

const anonymous = {
  displayName: "Anonymous",
  email: "anonymous@example.com",
  photoURL: "https://via.placeholder.com/300/030/777.png",
  emailVerified: false,
  isAnonymous: true,
  isCentinel: true,
}

const app = new Vue({
  el: "#app",
  router,
  data: function() { 
    return {
      user: anonymous,
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
      } else {
        this.user = anonymous
      }
    });
    gapi.load('client', async () => {
      await gapi.client.init(gapiConfig);
      console.debug("Now you can use gapi.client.sheets API!");
    });
    // 初回アクセス時の場合はチュートリアルを表示する
    if (document.cookie.indexOf('visited=yes') === -1) {
      document.cookie = 'visited=yes; max-age=31536000;';
      this.startTutorial();
    } 
  },
  methods: {
    startTutorial: function(){
      introJs().setOptions({
        showBullets: false,
        showProgress: true,
        steps: [{
            title: 'ようこそ👋',
            intro: 'Sログは、学生のための自習スペース共有サイトです。'
        },
        {
            title: '自習スペース詳細',
            element: document.querySelector('#content-area'),
            intro: '地図上のアイコンをクリックすると、<br>自習スペースの名前が表示されます。<br>リンクをクリックすると、自習スペースの詳細を見ることができます。'
        },
        {
            element: document.querySelector('#content-area'),
            intro: '自習スペース詳細画面では、口コミを投稿できます。'
        },
        {
            title: '自習スペース一覧',
            element: document.querySelector('#list-btn'),
            intro: '自習スペースの一覧を見ることができます。'
        },
        {
          title: 'ログイン',
          element: document.querySelector('#login-btn'),
          intro: 'ソーシャルアカウントでログインできます。'
        },
        {
            intro: 'Good Luck!'
        }]
      }).start();
    }
  }
});