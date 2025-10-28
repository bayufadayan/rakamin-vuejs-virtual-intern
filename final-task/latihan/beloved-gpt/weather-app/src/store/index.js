import Vue from "vue";
import Vuex from "vuex";
import { getCurrentWeather } from "../utils/api";

Vue.use(Vuex);

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 MENIT

function cacheKey(cityName, units) {
    return `${cityName}`.toLowerCase() + "|" + units;
}

export default new Vuex.Store({
    state: {
        units: "metric",
        favorites: [],
        recentSearches: [],
        weatherByCity: {},
        loadingByKey: {},
        errorByKey: {}
    },

    mutations: {
        loadPersisted(state, persistedState) {
            Object.assign(state, persistedState);
        },

        setUnits(state, nextUnits) {
            state.units = nextUnits;
        },

        setWeather(state, { key, payload }) {
            state.weatherByCity = {
                ...state.weatherByCity,
                [key]: {
                    data: payload,
                    ts: Date.now()
                }
            };
        },

        setLoading(state, { key, value }) {
            state.loadingByKey = {
                ...state.loadingByKey,
                [key]: value,
            };
        },

        setError(state, { key, message }) {
            state.errorByKey = {
                ...state.errorByKey,
                [key]: message || null,
            }
        },

        addFavorite(state, cityName) {
            const name = (cityName || "").trim();
            if (!name) return;
            if (!state.favorites.includes(name)) {
                state.favorites.push(name);
            }
        },

        removeFavorite(state, cityName) {
            state.favorites = state.favorites.filter(c => c !== cityName);
        },

        setRecentSearches(state, list) {
            state.recentSearches = Array.isArray(list) ? list : [];
        },

        addRecentSearch(state, cityName) {
            const name = (cityName || "").trim();
            if (!name) return;
            const dedup = state.recentSearches.filter(
                c => c.toLowerCase() !== name.toLowerCase()
            );
            state.recentSearches = [name, ...dedup].slice(0, 10); // simpan max 10
        },

        clearRecent(state) {
            state.recentSearches = [];
        }
    },

    actions: {
        init({ commit }) {
            try {
                const savedState = localStorage.getItem("weather:state");
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    commit("loadPersisted", parsedState);
                }
            } catch (error) {
                console.error("Failed to load persisted state:", error);
            }
        },

        async fetchWeather({ state, commit, getters, dispatch }, cityName) { // <-- perbaiki nama
            const key = cacheKey(cityName, state.units);

            const cachedData = getters.cached(cityName, state.units);
            if (cachedData) return cachedData;

            commit("setLoading", { key, value: true });
            commit("setError", { key, message: null });

            try {
                const res = await getCurrentWeather(cityName, state.units);
                commit("setWeather", { key, payload: res.data });
                dispatch("recordRecentSearch", res?.data?.name || cityName);
                return res.data;
            } catch (error) {
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Fetch Failed";
                commit("setError", { key, message });
                throw error;
            } finally {
                commit("setLoading", { key, value: false });
            }
        },

        changeUnits({ commit, dispatch }, nextUnits) {
            if (nextUnits !== "metric" && nextUnits !== "imperial") return;
            commit("setUnits", nextUnits);
            dispatch("persist");
        },

        toggleFavorite({ state, commit, dispatch }, cityName) {
            if (state.favorites.includes(cityName)) {
                commit("removeFavorite", cityName);
            } else {
                commit("addFavorite", cityName);
            }
            dispatch("persist");
        },

        recordRecentSearch({ commit, dispatch }, cityName) {
            commit("addRecentSearch", cityName);
            dispatch("persist");
        },

        persist({ state }) {
            localStorage.setItem(
                "weather:state",
                JSON.stringify({
                    units: state.units,
                    favorites: state.favorites,
                    recentSearches: state.recentSearches   // 👈 NEW
                })
            );
        }
    },

    getters: {
        cached: (state) => (cityName, units) => {
            const key = cacheKey(cityName, units);
            const entry = state.weatherByCity[key];
            if (!entry) return null;
            const fresh = Date.now() - entry.ts < CACHE_TTL_MS;
            return fresh ? entry.data : null;
        },

        loading: (state) => (cityName, units) => {
            return !!state.loadingByKey[cacheKey(cityName, units)];
        },

        error: (state) => (cityName, units) => {
            return state.errorByKey[cacheKey(cityName, units)] || null;
        },

        isFavorite: (state) => (cityName) => {
            return state.favorites.includes((cityName || "").trim());
        }
    }
});
