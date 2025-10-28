<template>
    <div>
        <h2>Daftar Post</h2>

        <ul>
            <li v-for="(post, index) in posts" :key="index">
                <strong>{{ post.title }}</strong> - {{ post.content }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    computed: {
        posts() {
            return this.$store.getters.posts;
        },
    },
}
</script>

<style scoped></style>