<script>
export default {
    name: "HomeView",

    data() {
        return {
            cityInput: "",
            lastFetchAtMs: 0,
            debounceTimer: null
        };
    },

    created() {
        const fromQuery = this.$route.query.city;
        if (fromQuery) {
            this.cityInput = fromQuery;
            this.fetchWeatherNow();
        }
    },

    computed: {
        units() {
            return this.$store.state.units;
        },
        weatherData() {
            return this.$store.getters.cached(this.cityInput, this.units);
        },
        isLoading() {
            return this.$store.getters.loading(this.cityInput, this.units);
        },
        loadError() {
            return this.$store.getters.error(this.cityInput, this.units);
        },
        recentSearches() {
            return this.$store.state.recentSearches;
        },

        themeClass() {
            const w = this.weatherData;
            let cls = "theme-default";
            if (w) {
                const main = (w.weather && w.weather[0] && w.weather[0].main || "").toLowerCase();
                const t = Number(w.main && w.main.temp);

                if (!Number.isNaN(t)) {
                    if (t >= 32) return "theme-hot";
                    if (t <= 18) return "theme-cold";
                }
                if (main.includes("rain") || main.includes("drizzle")) return "theme-rain";
                if (main.includes("snow")) return "theme-snow";
                if (main.includes("cloud")) return "theme-clouds";
                if (main.includes("clear")) return "theme-clear";
            }
            return cls;
        },
    },
    methods: {
        async fetchWeatherNow() {
            const city = (this.cityInput || "").trim();
            if (!city) return;
            try {
                await this.$store.dispatch("fetchWeather", city);
            } catch {
                // 
            }
        },
        formatTemp(value) {
            if (value == null) return "-";
            const n = Math.round(Number(value));
            return this.units === "metric" ? `${n}°C` : `${n}°F`;
        },

        async onChangeUnits(event) {
            const nextUnits = event.target.value;
            await this.$store.dispatch("changeUnits", nextUnits);
            // refetch utk kota aktif (pakai cache per-unit kalau ada)
            if ((this.cityInput || "").trim()) this.fetchWeatherNow();
        },

        toggleFavoriteCurrent() {
            const city = this.weatherData?.name;
            if (!city) return;
            this.$store.dispatch("toggleFavorite", city);
        },

        selectRecent(city) {
            this.cityInput = city;
            this.fetchWeatherNow();
        },

        clearRecent() {
            this.$store.commit("clearRecent");
            this.$store.dispatch("persist");
        },

        onCityInput() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                // optional: auto-fetch saat ketik berhenti
                // this.fetchWeatherNow();
            }, 400);
        },

        // geolocation
        useMyLocation() {
            if (!navigator.geolocation) {
                this.$store.dispatch("showToast", { message: "Geolocation tidak tersedia", type: "error" });
                return;
            }
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords || {};
                    if (latitude == null || longitude == null) return;
                    try {
                        const data = await this.$store.dispatch("fetchWeatherByCoords", {
                            lat: latitude,
                            lon: longitude
                        });
                        if (data?.name) this.cityInput = data.name;
                    } catch { /* toast sudah di store */ }
                },
                () => {
                    this.$store.dispatch("showToast", { message: "Izin lokasi ditolak", type: "error" });
                },
                { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true }
            );
        },
    }
};
</script>


<template>
    <div class="container" :class="themeClass">
        <div class="title">
            <h1 class="title-h1">Weather Monitoring</h1>
            <small class="title-small">You can monitor weather around the world</small>
        </div>

        <div class="card controls">
            <input class="input" v-model="cityInput" placeholder="Cari kota… (mis. Jakarta, Bandung, Tokyo)"
                @keyup.enter="fetchWeatherNow" aria-label="Nama kota" />
            <button class="btn btn--primary" @click="fetchWeatherNow">Cari</button>

            <!-- Units -->
            <select class="input units" :value="units" @change="onChangeUnits" aria-label="Satuan suhu">
                <option value="metric">°C (Metric)</option>
                <option value="imperial">°F (Imperial)</option>
            </select>
        </div>

        <!-- Recent (blok terpisah) -->
        <div v-if="recentSearches && recentSearches.length" class="card controls__recent">
            <span class="recent__label">Recent:</span>
            <div class="recent__chips">
                <button v-for="city in recentSearches" :key="city" class="chip" @click="selectRecent(city)">
                    {{ city }}
                </button>
            </div>
            <button class="link recent__clear" @click="clearRecent">Clear</button>
        </div>

        <div class="card geo">
            <button class="btn btn--ghost" @click="useMyLocation">Use my location</button>
        </div>


        <!-- Loading -->
        <div v-if="isLoading" class="card info skeleton">Loading data cuaca…</div>

        <!-- Error -->
        <div v-else-if="loadError" class="card error">
            Gagal ambil data: {{ loadError }}
        </div>

        <!-- Result -->
        <div v-else-if="weatherData" class="card result fade-in">
            <div class="row space">
                <div>
                    <h2 class="city">
                        {{ weatherData.name }},
                        {{ weatherData.sys && weatherData.sys.country }}
                    </h2>
                    <div class="desc">
                        {{ weatherData.weather && weatherData.weather[0] && weatherData.weather[0].description }}
                    </div>
                </div>

                <div style="text-align:right;">
                    <div class="temp">
                        {{ formatTemp(weatherData.main && weatherData.main.temp) }}
                    </div>
                    <button class="btn" @click="toggleFavoriteCurrent"
                        :aria-pressed="$store.getters.isFavorite(weatherData.name)" style="margin-top:6px;">
                        {{ $store.getters.isFavorite(weatherData.name) ? "★ Favorit" : "☆ Jadikan Favorit" }}
                    </button>
                </div>
            </div>

            <div class="grid">
                <!-- Feels Like -->
                <div class="pill pill--with-icon">
                    <font-awesome-icon icon="thermometer-half" class="pill__icon" />
                    <span>Feels like:</span>
                    <b>{{ formatTemp(weatherData.main && weatherData.main.feels_like) }}</b>
                </div>

                <!-- Humidity -->
                <div class="pill pill--with-icon">
                    <font-awesome-icon icon="tint" class="pill__icon" />
                    <span>Humidity:</span>
                    <b>{{ weatherData.main && weatherData.main.humidity }}%</b>
                </div>

                <!-- Wind -->
                <div class="pill pill--with-icon">
                    <font-awesome-icon icon="wind" class="pill__icon" />
                    <span>Wind:</span>
                    <b>{{ Math.round(weatherData.wind && weatherData.wind.speed) }} {{ units === 'metric' ? 'm/s' :
                        'mph' }}</b>
                </div>
            </div>
        </div>

        <!-- Empty state cakep -->
        <div v-else class="card empty fade-in">
            <div class="empty__art" aria-hidden="true"></div>
            <h3 class="empty__title">Cari cuaca kota favoritmu</h3>
            <p class="empty__desc">Ketik nama kota di atas atau pakai tombol <b>Use my location</b>.</p>
        </div>
    </div>
</template>


<style scoped></style>