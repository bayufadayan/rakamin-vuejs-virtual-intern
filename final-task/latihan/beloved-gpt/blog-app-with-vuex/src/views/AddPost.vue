<!-- eslint-disable vue/no-reserved-keys -->
<script>
import { makeAddDraftId, getAddDraft, saveAddDraft } from "@/utils/drafts";

export default {
    data() {
        return {
            title: "",
            content: "",
            draftId: null,
            _t: null,
            savedFlash: false
        };
    },

    created() {
        const q = this.$route.query.draft;
        if (q && q.startsWith("add:")) {
            const id = q.replace("add:", "");
            const found = getAddDraft(id);
            if (found) {
                this.draftId = id;
                this.title = found.title || "";
                this.content = found.content || "";
            }
        }
    },

    watch: {
        title() { this.saveDraftDebounced(); },
        content() { this.saveDraftDebounced(); }
    },

    methods: {
        ensureDraftId() {
            if (!this.draftId) this.draftId = makeAddDraftId();
        },
        saveDraft() {
            this.ensureDraftId();
            saveAddDraft(this.draftId, { title: this.title, content: this.content });
            // flash badge "draft saved"
            this.savedFlash = true;
            clearTimeout(this._flashT);
            this._flashT = setTimeout(() => (this.savedFlash = false), 1200);
        },
        saveDraftDebounced() {
            clearTimeout(this._t);
            this._t = setTimeout(this.saveDraft, 300);
        },

        async save() {
            if (!this.title.trim() || !this.content.trim()) return;
            this.$store.dispatch("addNewPost", {
                id: Date.now(),
                title: this.title.trim(),
                content: this.content.trim(),
                createdAt: new Date().toISOString()
            });
            this.$router.push("/");
        },

        async cancel() {
            const hasContent = this.title.trim() || this.content.trim();
            if (!hasContent) return this.$router.push("/");

            const res = await this.$swal.fire({
                title: "Anda belum post ini",
                text: "Mau simpan di Draft?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Simpan di Draft",
                cancelButtonText: "Buang",
                reverseButtons: true,
                confirmButtonColor: "#16a34a",
                cancelButtonColor: "#7a1a34"
            });

            if (res.isConfirmed) {
                this.saveDraft();
                this.$router.push("/");
            } else {
                this.$router.push("/");
            }
        }
    }
};
</script>

<template>
    <div>
        <h1 class="h1">Add Post</h1>

        <div class="form card" style="position:relative;">
            <div v-show="savedFlash" class="draft-badge" aria-live="polite">
                Draft tersimpan
            </div>

            <form @submit.prevent="save">
                <div class="row">
                    <input class="input" v-model="title" placeholder="Title" />
                    <textarea class="textarea" v-model="content" placeholder="Content"></textarea>
                </div>
                <div class="actions">
                    <button type="submit" class="btn btn--primary">Publish</button>
                    <button type="button" class="btn btn--ghost" @click="cancel">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.draft-badge {
    position: absolute;
    top: -12px;
    right: 12px;
    background: rgba(22, 163, 74, .18);
    border: 1px solid #215f4a;
    color: #b9f6cf;
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 12px;
    box-shadow: var(--shadow);
    transition: opacity .2s ease;
}
</style>
