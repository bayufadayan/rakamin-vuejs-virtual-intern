<script>
export default {
    props: ["id"],
    data() { return { title: "", content: "", createdAt: null }; },
    created() {
        const post = this.$store.getters.postById(Number(this.id));
        if (post) {
            this.title = post.title;
            this.content = post.content;
            this.createdAt = post.createdAt;
        } else {
            this.$router.replace("/");
        }
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
};
</script>

<template>
    <div>
        <h1 class="h1">Edit Post</h1>

        <form class="form card" @submit.prevent="save">
            <div class="row">
                <input class="input" v-model="title" placeholder="Title" />
                <textarea class="textarea" v-model="content" placeholder="Content"></textarea>
            </div>

            <div class="actions">
                <button type="submit" class="btn btn--primary">Update</button>
                <router-link class="btn btn--ghost" to="/">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
