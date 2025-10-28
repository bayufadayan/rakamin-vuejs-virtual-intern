<script>
import { listDrafts, deleteDraftByKey, clearAllDrafts } from "@/utils/drafts";

export default {
    name: "DraftsPage",
    data() { return { drafts: [] }; },
    created() { this.refresh(); },
    methods: {
        refresh() { this.drafts = listDrafts(); },
        async removeOne(key) {
            const res = await this.$swal.fire({
                title: "Hapus draft ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Hapus",
                cancelButtonText: "Batal",
                confirmButtonColor: "#e11d48"
            });
            if (res.isConfirmed) {
                deleteDraftByKey(key);
                this.refresh();
            }
        },
        async removeAll() {
            const res = await this.$swal.fire({
                title: "Hapus semua draft?",
                text: "Aksi tidak bisa di-undo.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Hapus Semua",
                cancelButtonText: "Batal",
                confirmButtonColor: "#e11d48"
            });
            if (res.isConfirmed) {
                clearAllDrafts();
                this.refresh();
            }
        },
        go(item) {
            if (item.type === "add") {
                this.$router.push({ path: "/add", query: { draft: `add:${item.id}` } });
            } else {
                const post = this.$store.getters.postById(item.id);
                if (post && post.slug) this.$router.push(`/edit/${post.slug}`);
                else this.$router.push("/"); // fallback
            }
        },
        fmt(ts) { return new Date(ts).toLocaleString(); }
    }
};
</script>

<template>
    <div>
        <h1 class="h1">Drafts</h1>

        <div v-if="!drafts.length" class="empty">Belum ada draft.</div>

        <div v-else class="card" style="padding:16px;">
            <div class="actions" style="justify-content:flex-end">
                <button class="btn btn--danger" @click="removeAll">Hapus Semua</button>
            </div>

            <ul class="list" style="margin-top:12px;">
                <li v-for="d in drafts" :key="d.key" class="item card">
                    <div class="meta">
                        <h3 class="title">
                            <span v-if="d.type === 'add'">[Add]</span>
                            <span v-else>[Edit #{{ d.id }}]</span>
                            {{ d.title }}
                        </h3>
                        <small class="time">{{ fmt(d.savedAt) }}</small>
                    </div>
                    <div class="actions">
                        <button class="btn btn--primary" @click="go(d)">Lanjutkan</button>
                        <button class="btn btn--ghost" @click="removeOne(d.key)">Hapus</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
