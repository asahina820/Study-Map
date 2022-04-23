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
});