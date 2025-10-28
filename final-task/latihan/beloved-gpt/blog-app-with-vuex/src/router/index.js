import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import AddPost from '../views/AddPost.vue';
import EditPost from '../views/EditPost.vue';
import PostDetail from '../views/PostDetail.vue';
import Drafts from "../views/Drafts.vue";

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/add",
      name: "add",
      component: AddPost
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: EditPost,
      props: true
    },
    {
      path: "/post/:id",
      name: "detail",
      component: PostDetail,
      props: true,
    },
    {
      path: "/drafts",
      name: "drafts",
      component: Drafts
    }
  ]
})
