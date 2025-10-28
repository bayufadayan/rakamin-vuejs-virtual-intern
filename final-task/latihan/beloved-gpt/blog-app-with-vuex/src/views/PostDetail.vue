<script>
export default {
    props: ["id"],
    computed: {
        post() { return this.$store.getters.postById(Number(this.id)); }
    },
    methods: {
        formatCreatedAt(timestamp) {
            if (!timestamp) return "";
            try {
                const date = new Date(timestamp);
                return date.toLocaleString();
            } catch { return ""; }
        }
    }
};
</script>

<template>
    <div v-if="post">
        <div class="card" style="padding:20px;">
            <h1 class="h1" style="margin-top:0;">{{ post.title }}</h1>
            <p class="time">{{ formatCreatedAt(post.createdAt) }}</p>
            <p class="content">{{ post.content }}</p>

            <div class="actions">
                <router-link class="btn" :to="`/edit/${post.id}`">Edit</router-link>
                <router-link class="btn btn--ghost" to="/">Kembali</router-link>
            </div>
        </div>
    </div>

    <p v-else class="empty">Post tidak ditemukan 😅</p>
</template>

<style scoped>
/* pakai util global, tambahan kecil lokal kalau perlu */
</style>
