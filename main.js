const router = new VueRouter({
  routes: [
      { path: '/list', component: httpVueLoader('./list.vue') },
      { path: '/', component: httpVueLoader('./map.vue') },
  ]
})
const app = new Vue({
  el: "#app",
  router,
});