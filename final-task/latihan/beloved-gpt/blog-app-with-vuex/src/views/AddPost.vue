<!-- eslint-disable vue/no-reserved-keys -->
<script>
const DRAFT_KEY = "draft:add-post";

export default {
    data() {
        return {
            title: "",
            content: "",
            _t: null
        };
    },
    created() {
        const raw = localStorage.getItem("draft:add-post");
        if (raw) {
            const d = JSON.parse(raw);
            const want = this.$route.query.restore ? true : confirm("Lanjutkan dari draft sebelumnya?");
            if (want) { this.title = d.title || ""; this.content = d.content || ""; }
            else localStorage.removeItem("draft:add-post");
        }
    },
    watch: {
        title() { this.saveDraftDebounced(); },
        content() { this.saveDraftDebounced(); }
    },
    methods: {
        saveDraft() {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({
                title: this.title,
                content: this.content,
                savedAt: Date.now()
            }));
        },
        saveDraftDebounced() {
            clearTimeout(this._t);
            this._t = setTimeout(this.saveDraft, 300);
        },
        clearDraft() { localStorage.removeItem(DRAFT_KEY); },
        save() {
            if (!this.title.trim() || !this.content.trim()) return;
            this.$store.dispatch("addNewPost", {
                id: Date.now(),
                title: this.title.trim(),
                content: this.content.trim(),
                createdAt: new Date().toISOString()
            });
            this.clearDraft();
            this.$router.push("/");
        },
        cancel() {
            const ok = window.confirm("Buang draft ini?");
            if (ok) this.clearDraft();
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
                <button type="button" class="btn btn--ghost" @click="cancel">Cancel</button>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
