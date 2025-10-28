<script>
export default {
    props: ["id"],
    computed: {
        post() {
            return this.$store.getters.postById(Number(this.id));
        }
    },
    methods: {
        formatCreatedAt(timestamp) {
            if (!timestamp) return "";
            try {
                const date = new Date(timestamp);
                return date.toLocaleString();
            } catch {
                return "";
            }
        }
    }
}
</script>

<template>
    <div v-if="post">
        <h1>{{ post.title }}</h1>
        <p class="date">{{ formatCreatedAt(post.createdAt) }}</p>
        <p class="content">{{ post.content }}</p>

        <div class="actions">
            <router-link to="`/edit/${post.id}`"></router-link>
            <router-link to="/">Kembali</router-link>
        </div>
    </div>

    <p v-else>Post tidak ditemukan 😅</p>
</template>

<style scoped>
.date {
    color: #777;
    margin-bottom: 12px;
    display: block;
}

.content {
    white-space: pre-line;
    margin-bottom: 20px;
}

.actions {
    display: flex;
    gap: 12px;
}
</style>