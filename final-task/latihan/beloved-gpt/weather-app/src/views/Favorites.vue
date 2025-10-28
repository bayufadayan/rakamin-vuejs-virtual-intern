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

        <ul v-else class="list">
            <li v-for="city in favorites" :key="city" class="card row space">
                <div class="city">{{ city }}</div>
                <div class="actions">
                    <button class="btn btn--primary" @click="openCity(city)">Lihat</button>
                    <button class="btn" @click="removeCity(city)">Hapus</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.container {
    max-width: 720px;
    margin: 24px auto;
    display: grid;
    gap: 14px;
}

.card {
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    padding: 14px;
    background: #fff;
}

.list {
    display: grid;
    gap: 10px;
}

.row.space {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn {
    border: 1px solid #d6d6d6;
    background: #f7f7f7;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
}

.btn--primary {
    background: #155e75;
    color: #eaffff;
    border-color: #0b3a47;
}

.city {
    font-weight: 600;
}

.info {
    background: #fafafa;
}
</style>
