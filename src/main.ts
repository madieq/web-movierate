import Vue from "vue";
import VueRouter from "vue-router";

import MovieList from "./components/MovieList.vue";
import NotFound from "./components/NotFound.vue"
import MovieFullInfo from "./components/MovieFullInfo.vue"
import HeadComponent from "./components/Head.vue"
import IndexComponent from "./components/Index.vue"
import FooterComponent from "./components/Footer.vue"

Vue.config.productionTip = false;
Vue.use(VueRouter);
let router = new VueRouter({
  routes: [
    { path: "/", components: { content: IndexComponent }, name: 'index' },
    { path: "/find-by/:field/:value", components: { content: MovieList } ,name:'find'},
    { path: "/movie-full-info/:id", components: { content: MovieFullInfo }, name: 'movie' },
    { path: '*', components: { content: NotFound } }
  ]
});
new Vue({
  el: '#app',
  router: router,
  components: {
    MovieList,
    NotFound,
    MovieFullInfo,
    HeadComponent,
    IndexComponent,
    FooterComponent,
  }
});
