<script>
import PostList from '../components/PostList.vue';

export default {
    name: "HomePage",
    components: { PostList },
    computed: {
        posts() {
            return this.$store.getters.posts;
        },
    },
    created() {
        this.$store.dispatch("loadPosts");
    },
    methods: {
        remove(index) {
            this.$store.dispatch("removePost", index);
        }
    }
};
</script>

<template>
    <div>
        <h1>Blog Home</h1>
        <PostList :posts="posts" @remove="remove" />
        <router-link to="/add">+ Add Post</router-link>
    </div>
</template>

<style scoped></style>