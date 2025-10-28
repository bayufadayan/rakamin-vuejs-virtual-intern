<script>
import PostList from "../components/PostList.vue";
import { generateDummyPosts } from "../utils/dummy";

export default {
    name: "HomePage",
    data() {
        return {
            searchQuery: "",
            sortBy: "newest"
        };
    },
    components: { PostList },
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
        }
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
        remove(postIndex) { this.$store.dispatch("removePost", postIndex); }
    }
};
</script>

<template>
    <div>
        <h1 class="h1">Blog Home</h1>

        <div class="card" style="padding:14px; margin-bottom:14px; display:grid; gap:10px;">
            <input class="input" v-model="searchQuery" placeholder="Cari Judul atau isi Post..." />
            <div style="display:flex; gap:10px; align-items:center;">
                <label for="sort" style="color:var(--muted);">Sort:</label>
                <select id="sort" class="input" style="max-width:220px;" v-model="sortBy">
                    <option value="newest">Terbaru → Terlama</option>
                    <option value="oldest">Terlama → Terbaru</option>
                    <option value="title-asc">Title A → Z</option>
                    <option value="title-desc">Title Z → A</option>
                </select>
            </div>
        </div>

        <PostList :posts="filteredSortedPosts" @remove="remove" />

        <div class="actions" style="margin-top:16px; padding-bottom: 100px;">
            <router-link class="btn btn--primary" to="/add">+ Add Post</router-link>
        </div>
    </div>
</template>

<style scoped></style>
