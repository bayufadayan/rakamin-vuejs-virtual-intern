<!-- eslint-disable vue/no-reserved-keys -->
<script>
export default {
    props: ["id"],
    data() {
        return {
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
        const post = this.$store.getters.postById(Number(this.id));
        if (!post) return this.$router.replace("/");

        const key = `draft:edit-post:${this.id}`;
        const raw = localStorage.getItem(key);
        const want = this.$route.query.restore ? true : (raw ? confirm("Lanjutkan dari draft edit?") : false);

        if (want && raw) {
            const d = JSON.parse(raw);
            this.title = d.title ?? post.title;
            this.content = d.content ?? post.content;
        } else {
            this.title = post.title;
            this.content = post.content;
            localStorage.removeItem(key);
        }
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
                id: Number(this.id),
                title: this.title.trim(),
                content: this.content.trim(),
                createdAt: this.createdAt || new Date().toISOString()
            });
            this.clearDraft();
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
