<script>
export default {
    data() { return { title: "", content: "" }; },
    methods: {
        save() {
            if (!this.title.trim() || !this.content.trim()) return;
            this.$store.dispatch("addNewPost", {
                id: Date.now(),
                title: this.title.trim(),
                content: this.content.trim(),
                createdAt: new Date().toISOString()
            });
            this.$router.push("/");
        }
    }
};
</script>

<template>
    <div>
        <h1 class="h1">Add Post</h1>

        <form class="form card" @submit.prevent="save">
            <div class="row">
                <input class="input" v-model="title" placeholder="Title" />
                <textarea class="textarea" v-model="content" placeholder="Content"></textarea>
            </div>

            <div class="actions">
                <button type="submit" class="btn btn--primary">Save</button>
                <router-link class="btn btn--ghost" to="/">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
