import axios from "axios";
const API_KEY = import.meta.env.VUE_APP_OWM_API_KEY;

export const api = axios.create({
    baseURL: "https://api.openweathermap.org/data/2.5",
    timeout: 10000,
    params: {
        appid: API_KEY
    },
})

export const getCurrentWeather = (city, units='metric') => api.get("/weather", {params: {q: city, units}});