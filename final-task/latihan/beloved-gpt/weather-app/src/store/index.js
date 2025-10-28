import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        units: "metric",
        favorites: [],
        weatherByCity: {}
    },

    mutations: {
        loadPersisted(state, persistedState) {
            Object.assign(state, persistedState);
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
        }
    }
});
