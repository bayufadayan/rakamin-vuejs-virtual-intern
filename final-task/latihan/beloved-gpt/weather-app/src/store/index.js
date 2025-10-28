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
        units: "metric",                 // "metric" | "imperial"
        favorites: [],                   // ["Jakarta", "Bandung"]
        weatherByCity: {},               // { "jakarta|metric": { data, ts } }
        loadingByKey: {},                // { "jakarta|metric": boolean }
        errorByKey: {}                   // { "jakarta|metric": string|null }
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

        async featchWeather({ state, commit, getters }, cityName) {
            const key = cacheKey(cityName, state.units);

            const cached = getters.cached(cityName, state.units);
            if (cached) return cached;

            commit("setLoading", {
                key,
                value: true
            });
            commit("setError", {
                key,
                message: null
            });

            try {
                const res = await getCurrentWeather(cityName, state.units);
                commit("setWeather", {
                    key,
                    payload: res.data
                });
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || "Fetch Failed";
                commit("setError", {
                    key,
                    message: msg
                });
                throw err;
            } finally {
                commit("setLoading", {
                    key,
                    value: false
                });
            }
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
        }
    }
});
