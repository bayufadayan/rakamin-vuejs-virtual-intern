import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        posts: [] // daftar semua postingan
    },

    mutations: {
        setPosts(state, allPosts) {
            state.posts = allPosts;
        },
        addPost(state, newPost) {
            state.posts.push(newPost);
        },
        deletePost(state, postIndex) {
            state.posts.splice(postIndex, 1);
        },
        updatePost(state, updatedPost) {
            const targetIndex = state.posts.findIndex(
                post => post.id === updatedPost.id
            );
            if (targetIndex !== -1) {
                state.posts.splice(targetIndex, 1, updatedPost);
            }
        }
    },

    actions: {
        loadPosts({ commit }) {
            const savedPosts =
                JSON.parse(localStorage.getItem("posts")) || [];
            commit("setPosts", savedPosts);
        },
        savePosts({ state }) {
            localStorage.setItem("posts", JSON.stringify(state.posts));
        },
        addNewPost({ commit, dispatch }, newPost) {
            commit("addPost", newPost);
            dispatch("savePosts");
        },
        removePost({ commit, dispatch }, postIndex) {
            commit("deletePost", postIndex);
            dispatch("savePosts");
        },
        updateExistingPost({ commit, dispatch }, updatedPost) {
            commit("updatePost", updatedPost);
            dispatch("savePosts");
        }
    },

    getters: {
        posts: state => state.posts,
        postById: state => postId =>
            state.posts.find(post => post.id === postId)
    }
});
