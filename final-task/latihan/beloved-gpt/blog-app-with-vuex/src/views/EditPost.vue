<script>
export default {
    props: ["id"],
    data() {
        return {
            title: "",
            content: "",
            createdAt: null
        };
    },
    created() {
        const post = this.$store.getters.postById(Number(this.id));
        if (post) {
            this.title = post.title;
            this.content = post.content;
            this.createdAt = post.createdAt;
        }
        else this.$router.replace("/");
    },
    methods: {
        save() {
            if (!this.title.trim() || !this.content.trim()) return;
            this.$store.dispatch("updateExistingPost", {
                id: Number(this.id),
                title: this.title.trim(),
                content: this.content.trim(),
                createdAt: this.createdAt || new Date().toISOString()
            });
            this.$router.push("/");
        }
    }
}
</script>

<template>
    <div class="edit">
        <h1>Edit Post</h1>
        <form @submit.prevent="save">
            <input v-model="title" placeholder="Title" />
            <textarea v-model="content" placeholder="Content"></textarea>
            <div class="actions">
                <button type="submit">Update</button>
                <router-link to="/">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<style scoped></style>