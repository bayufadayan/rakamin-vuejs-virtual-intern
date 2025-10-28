<script>
import PostList from "../components/PostList.vue";
import { generateDummyPosts } from "../utils/dummy";

export default {
    name: "HomePage",
    components: { PostList },
    computed: {
        posts() {
            return this.$store.getters.posts;
        },
    },
    async created() {
        await this.$store.dispatch("loadPosts");
        if (!this.posts || this.posts.length === 0) {
            const agree = window.confirm("Isi dengan 25 dummy posts?");
            if (agree) {
                const dummy = generateDummyPosts(25);
                this.$store.dispatch("seedPosts", dummy);
            }
        }
    },
    methods: {
        remove(postIndex) { this.$store.dispatch("removePost", postIndex); }
    }
};
</script>

<template>
    <div>
        <h1 class="h1">Blog Home</h1>

        <PostList :posts="posts" @remove="remove" />

        <div class="actions" style="margin-top:16px; padding-bottom: 100px;">
            <router-link class="btn btn--primary" to="/add">+ Add Post</router-link>
        </div>
    </div>
</template>

<style scoped></style>
