<script>
export default {
    name: "HomeView",

    data() {
        return {
            cityInput: "Jakarta"
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
        }
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
    }
};
</script>


<template>
    <div class="container">
        <h1 class="title">Weather</h1>

        <div class="card controls">
            <input class="input" v-model="cityInput" placeholder="Cari kota… (mis. Jakarta, Bandung, Tokyo)"
                @keyup.enter="fetchWeatherNow" />
                <button class="btn btn--primary" @click="fetchWeatherNow">Cari</button>
                <div v-if="recentSearches && recentSearches.length" class="card"
                    style="display:flex; gap:8px; flex-wrap:wrap;">
                    <span style="color:#64748b;">Recent:</span>
                    <button v-for="city in recentSearches" :key="city" class="chip" @click="selectRecent(city)">
                        {{ city }}
                    </button>
                    <button class="link" @click="clearRecent">Clear</button>
                </div>

            <!-- Units -->
            <select class="input" style="max-width:140px" :value="units" @change="onChangeUnits" aria-label="Units">
                <option value="metric">°C (Metric)</option>
                <option value="imperial">°F (Imperial)</option>
            </select>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="card info">Loading data cuaca…</div>

        <!-- Error -->
        <div v-else-if="loadError" class="card error">
            Gagal ambil data: {{ loadError }}
        </div>

        <!-- Result -->
        <div v-else-if="weatherData" class="card result">
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
                <div class="pill">
                    Feels like:
                    <b>{{ formatTemp(weatherData.main && weatherData.main.feels_like) }}</b>
                </div>
                <div class="pill">
                    Humidity:
                    <b>{{ weatherData.main && weatherData.main.humidity }}%</b>
                </div>
                <div class="pill">
                    Wind:
                    <b>
                        {{ weatherData.wind && Math.round(weatherData.wind.speed) }}
                        {{ units === 'metric' ? 'm/s' : 'mph' }}
                    </b>
                </div>
            </div>
        </div>

        <div v-else class="card info">
            Ketik nama kota lalu tekan Enter / klik Cari.
        </div>
    </div>
</template>


<style scoped>
.container {
    max-width: 720px;
    margin: 24px auto;
    display: grid;
    gap: 14px;
}

.title {
    margin: 0 0 4px 0;
}

.card {
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    padding: 14px;
    background: #fff;
}

.controls {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr auto;
}

.input {
    padding: 10px 12px;
    border: 1px solid #d6d6d6;
    border-radius: 8px;
    outline: none;
}

.btn {
    border: 1px solid #d6d6d6;
    background: #f7f7f7;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
}

.btn--primary {
    background: #155e75;
    color: #eaffff;
    border-color: #0b3a47;
}

.info {
    color: #444;
    background: #fafafa;
}

.error {
    color: #7a1a34;
    background: #fff3f5;
    border-color: #f3c9d3;
}

.result .row.space {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.city {
    margin: 0;
}

.desc {
    color: #555;
    text-transform: capitalize;
}

.temp {
    font-size: 42px;
    font-weight: 700;
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 10px;
}

.pill {
    background: #f7fafc;
    border: 1px solid #e1e9ef;
    padding: 8px 10px;
    border-radius: 10px;
}

.chip {
    border: 1px solid #d6d6d6;
    background: #f8fafc;
    padding: 6px 10px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 13px;
}

.link {
    background: transparent;
    border: 0;
    color: #0b3a47;
    cursor: pointer;
    text-decoration: underline;
    padding: 0 4px;
}

@media (max-width: 560px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>