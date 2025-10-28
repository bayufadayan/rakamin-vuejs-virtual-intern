<!-- eslint-disable vue/no-reserved-keys -->
<script>
export default {
    props: ["slug"],
    data() {
        return {
            id: null,
            title: "",
            content: "",
            createdAt: null,
            _t: null
        };
    },
    computed: {
        draftKey() {
            return `draft:edit-post:${this.id}`;
        }
    },
    created() {
        const post = this.$store.getters.postBySlug(this.slug);
        if (!post) return this.$router.replace("/");
        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.createdAt = post.createdAt;
    },
    watch: {
        title() { this.saveDraftDebounced(); },
        content() { this.saveDraftDebounced(); }
    },
    methods: {
        saveDraft() {
            localStorage.setItem(this.draftKey, JSON.stringify({
                title: this.title, content: this.content, savedAt: Date.now()
            }));
        },
        saveDraftDebounced() {
            clearTimeout(this._t);
            this._t = setTimeout(this.saveDraft, 300);
        },
        clearDraft() { localStorage.removeItem(this.draftKey); },
        save() {
            if (!this.title.trim() || !this.content.trim()) return;
            this.$store.dispatch("updateExistingPost", {
                id: this.id,
                title: this.title.trim(),
                content: this.content.trim(),
                createdAt: this.createdAt
            });
            this.$router.push("/");
        },
        cancel() {
            const ok = window.confirm("Buang draft edit ini?");
            if (ok) this.clearDraft();
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
                <button type="button" class="btn btn--ghost" @click="cancel">Cancel</button>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
