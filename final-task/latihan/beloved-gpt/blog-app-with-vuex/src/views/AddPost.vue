<script>
export default {
    data() {
        return {
            title: "",
            content: ""
        };
    },
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
        <h1>Add Post</h1>

        <form @submit.prevent="save">
            <input v-model="title" placeholder="Title" />
            <textarea v-model="content" placeholder="Content"></textarea>

            <div class="actions">
                <button type="submit">Save</button>
                <router-link to="/">Cancel</router-link>
            </div>
        </form>
    </div>
</template>


<style scoped>
.add {
    max-width: 640px;
    margin: 24px auto;
}

input,
textarea {
    width: 100%;
    margin: 8px 0;
    padding: 8px;
}

.actions {
    display: flex;
    gap: 12px;
    align-items: center;
}
</style>