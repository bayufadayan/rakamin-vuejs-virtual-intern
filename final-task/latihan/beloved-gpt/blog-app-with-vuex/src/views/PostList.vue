<script>
export default {
    name: "PostList",
    props: {
        posts: {
            type: Array,
            required: true
        }
    },
    methods: {
        shortenContent(contentText = "", maxLength = 140) {
            return contentText.length > maxLength
                ? contentText.slice(0, maxLength) + "..."
                : contentText;
        },
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
    <div v-if="posts && posts.length">
        <ul class="list">
            <li v-for="(post, i) in posts" :key="post.id || i" class="item">
                <div class="meta">
                    <h3 class="title">{{ post.title }}</h3>
                    <small class="time">{{ formatCreatedAt(post.createdAt) }}</small>
                </div>
                <p class="content">{{ shortenContent(post.content) }}</p>

                <div class="actions">
                    <button class="danger" @click.stop="$emit('remove', i)">Hapus</button>
                </div>
            </li>
        </ul>
    </div>

    <p v-else class="empty">Belum ada post. Yuk tambah dulu ✍️</p>
</template>


<style scoped>
.list {
    display: grid;
    gap: 14px;
}

.item {
    padding: 14px;
    border: 1px solid #eee;
    border-radius: 8px;
}

.meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
}

.title {
    margin: 0;
}

.content {
    margin: 8px 0 0;
}

.actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
}

.danger {
    background: #ffefef;
    border: 1px solid #ffbcbc;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
}

.empty {
    color: #777;
}
</style>