import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        posts: []
    },

    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
        },
        addPost(state, post) {
            state.posts.push(post);
        },
        deletePost(state, index) {
            state.posts.splice(index, 1);
        }
    },

    actions: {
        loadPosts({ commit }) {
            const saved = JSON.parse(localStorage.getItem("posts")) || [];
            commit("setPosts", saved);
        },
        savePosts({ state }) {
            localStorage.setItem("posts", JSON.stringify(state.posts));
        },
        addNewPost({ commit, dispatch }, post) {
            commit("addPost", post);
            dispatch("savePosts");
        },
        removePost({ commit, dispatch }, index) {
            commit("deletePost", index);
            dispatch("savePosts");
        }
    },

    getters: {
        posts: state => state.posts
    }
});
