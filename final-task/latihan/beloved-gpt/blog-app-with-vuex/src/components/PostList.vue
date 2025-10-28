<script>
export default {
    name: "PostList",
    props: { posts: { type: Array, required: true } },
    methods: {
        shortenContent(contentText = "", maxLength = 140) {
            return contentText.length > maxLength
                ? contentText.slice(0, maxLength) + "..."
                : contentText;
        },
        formatCreatedAt(timestamp) {
            if (!timestamp) return "";
            try { return new Date(timestamp).toLocaleString(); } catch { return ""; }
        }
    }
};
</script>

<template>
    <div v-if="posts && posts.length">
        <ul class="list">
            <li v-for="(post, i) in posts" :key="post.id || i" class="item card">
                <div class="meta">
                    <h3 class="title">{{ post.title }}</h3>
                    <small class="time">{{ formatCreatedAt(post.createdAt) }}</small>
                </div>

                <p class="content">{{ shortenContent(post.content) }}</p>

                <div class="actions">
                    <button class="btn" @click.stop="$router.push('/post/' + (post.id || i))">Lihat</button>
                    <button class="btn" @click.stop="$router.push('/edit/' + (post.id || i))">Edit</button>
                    <button class="btn btn--danger" @click.stop="$emit('remove', i)">Hapus</button>
                </div>
            </li>
        </ul>
    </div>

    <p v-else class="empty">Belum ada post. Yuk tambah dulu ✍️</p>
</template>

<style scoped>
/* gunakan util global; local tweak kalau perlu */
</style>
