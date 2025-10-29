<script>
export default {
    name: "FavoritesView",

    computed: {
        favorites() {
            return this.$store.state.favorites;
        }
    },

    methods: {
        openCity(cityName) {
            this.$router.push({ path: "/", query: { city: cityName } });
        },
        removeCity(cityName) {
            this.$store.dispatch("toggleFavorite", cityName);
        }
    }
};
</script>

<template>
    <div class="container">
        <h1 class="title">Favorites</h1>

        <div v-if="!favorites.length" class="card info">
            Belum ada kota favorit. Cari kota di Home lalu klik “Jadikan Favorit”.
        </div>

        <ul v-else class="favorites">
            <li v-for="city in favorites" :key="city" class="fav-item">
                <div class="fav-meta">
                    <div class="fav-avatar" aria-hidden="true">
                        {{ city.slice(0, 1).toUpperCase() }}
                    </div>
                    <div class="fav-text">
                        <div class="fav-title">{{ city }}</div>
                        <div class="fav-sub">Kota favorit kamu</div>
                    </div>
                </div>

                <div class="fav-actions">
                    <button class="btn btn--ghost" @click="openCity(city)">Lihat</button>
                    <button class="btn btn--danger" @click="removeCity(city)">Hapus</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
