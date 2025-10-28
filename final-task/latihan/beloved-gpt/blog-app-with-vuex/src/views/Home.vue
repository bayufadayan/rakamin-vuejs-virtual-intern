<script>
import PostList from "../components/PostList.vue";
import { generateDummyPosts } from "../utils/dummy";
import ConfirmModal from "../components/ConfirmModal.vue";

export default {
    name: "HomePage",
    data() {
        return {
            showConfirm: false,
            pendingIndex: null,
            searchQuery: "",
            sortBy: "newest",
            currentPage: 1,
            pageSize: 5
        };
    },
    components: { PostList, ConfirmModal },
    computed: {
        posts() {
            return this.$store.getters.posts;
        },

        filteredSortedPosts() {
            const q = this.searchQuery.trim().toLowerCase();
            let base = this.posts || [];

            if (q) {
                base = base.filter(
                    p => (p.title || "").toLowerCase().includes(q) || (p.content || "").toLowerCase().includes(q)
                );
            }

            // Sort
            const byDate = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
            const byTitle = (a, b) => (a.title || "").localeCompare(b.title || "");

            switch (this.sortBy) {
                case "newest":
                    base = [...base].sort((a, b) => byDate(a, b)).reverse();
                    break;

                case "oldest":
                    base = [...base].sort((a, b) => byDate(a, b));
                    break;

                case "title-asc":
                    base = [...base].sort((a, b) => byTitle(a, b));
                    break;

                case "title-desc":
                    base = [...base].sort((a, b) => byTitle(b, a));
                    break;

                default:
                    break;
            }
            return base;
        },

        totalPages() { return Math.max(1, Math.ceil(this.filteredSortedPosts.length / this.pageSize)); },
        pagedPosts() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredSortedPosts.slice(start, start + this.pageSize);
        }
    },
    watch: {
        searchQuery() { this.currentPage = 1; },
        sortBy() { this.currentPage = 1; },
        pageSize() { this.currentPage = 1; }
    },
    async created() {
        await this.$store.dispatch("loadPosts");
        if (!this.posts || this.posts.length === 0) {
            const agree = window.confirm("Isi dengan 25 dummy posts?");
            if (agree) {
                const dummy = generateDummyPosts(25);
                this.$store.dispatch("seedPosts", dummy);
            }
        }
    },
    methods: {
        askRemove(postIndex) {
            this.pendingIndex = postIndex;
            this.showConfirm = true;
        },
        confirmRemove() {
            if (this.pendingIndex !== null) this.$store.dispatch("removePost", this.pendingIndex);
            this.showConfirm = false;
            this.pendingIndex = null;
            this.$nextTick(() => {
                if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
            });
        },
        cancelRemove() {
            this.showConfirm = false;
            this.pendingIndex = null;
        },
        prev() {
            if (this.currentPage > 1) this.currentPage--;
        },
        next() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        goTo(p) {
            if (p >= 1 && p <= this.totalPages) this.currentPage = p;
        }
    }
};
</script>

<template>
    <div>
        <h1 class="h1">Blog Home</h1>

        <div class="card" style="padding:14px; margin-bottom:14px; display:grid; gap:10px;">
            <input class="input" v-model="searchQuery" placeholder="Cari Judul atau isi Post..." />
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                <label for="sort" style="color:var(--muted);">Sort:</label>
                <select id="sort" class="input" style="max-width:220px;" v-model="sortBy">
                    <option value="newest">Terbaru → Terlama</option>
                    <option value="oldest">Terlama → Terbaru</option>
                    <option value="title-asc">Title A → Z</option>
                    <option value="title-desc">Title Z → A</option>
                </select>

                <label style="color:var(--muted); margin-left:12px;">Per halaman:</label>
                <select class="input" style="max-width:120px;" v-model.number="pageSize">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="15">15</option>
                </select>
            </div>
        </div>

        <PostList :posts="pagedPosts" @remove="askRemove" />

        <div class="card"
            style="padding:12px; margin-top:12px; display:flex; gap:8px; align-items:center; justify-content:center;">
            <button class="btn" @click="prev" :disabled="currentPage === 1">Prev</button>
            <span style="color:var(--muted);">Page {{ currentPage }} / {{ totalPages }}</span>
            <button class="btn" @click="next" :disabled="currentPage === totalPages">Next</button>
        </div>

        <div class="actions" style="margin-top:16px; padding-bottom: 100px;">
            <router-link class="btn btn--primary" to="/add">+ Add Post</router-link>
        </div>

        <ConfirmModal :open="showConfirm" @confirm="confirmRemove" @close="cancelRemove" />
    </div>
</template>

<style scoped></style>
