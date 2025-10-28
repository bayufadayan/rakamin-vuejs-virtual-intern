import Vue from "vue";
import Vuex from "vuex";
import { slugify } from "@/utils/slug";

Vue.use(Vuex);

function uniqueSlugFrom(state, baseTitle, excludeId = null) {
    const base = slugify(baseTitle);
    let s = base, n = 2;
    const taken = new Set(
        state.posts.filter(p => p.id !== excludeId).map(p => p.slug)
    );
    while (taken.has(s)) { s = `${base}-${n++}`; }
    return s;
}

export default new Vuex.Store({
    state: {
        posts: []
    },

    mutations: {
        setPosts(state, allPosts) {
            state.posts = allPosts;
        },
        addPost(state, newPost) {
            state.posts.push(newPost);
        },
        deletePost(state, postId) {
            const targetIndex = state.posts.findIndex(p => p.id === postId);
            if (targetIndex !== -1) state.posts.splice(targetIndex, 1);
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
        loadPosts({ commit, dispatch }) {
            const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
            // 🔁 MIGRASI: pastikan semua punya slug unik
            const migrated = [];
            savedPosts.forEach(p => {
                const hasSlug = p.slug && typeof p.slug === "string";
                const title = p.title || "(untitled)";
                const slug = hasSlug ? p.slug : uniqueSlugFrom({ posts: migrated }, title, p.id);
                migrated.push({ ...p, slug });
            });
            commit("setPosts", migrated);
            dispatch("savePosts");
        },

        savePosts({ state }) {
            localStorage.setItem("posts", JSON.stringify(state.posts));
        },
        addNewPost({ commit, dispatch, state }, newPost) {
            const slug = uniqueSlugFrom(state, newPost.title, null);
            commit("addPost", { ...newPost, slug });
            dispatch("savePosts");
        },
        removePost({ commit, dispatch }, postId) {
            commit("deletePost", postId);
            dispatch("savePosts");
        },
        updateExistingPost({ commit, dispatch, state }, updatedPost) {
            const slug = uniqueSlugFrom(state, updatedPost.title, updatedPost.id);
            commit("updatePost", { ...updatedPost, slug });
            dispatch("savePosts");
        },
        seedPosts({ commit, dispatch }, posts) {
            commit("setPosts", posts);
            dispatch("savePosts");
        }
    },

    getters: {
        posts: state => state.posts,
        postById: state => postId => state.posts.find(post => post.id === postId),
        postBySlug: state => slug => state.posts.find(p => p.slug === slug)
    }
});
