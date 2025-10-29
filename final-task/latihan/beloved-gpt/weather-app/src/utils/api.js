import axios from "axios";
const API_KEY = import.meta.env.VITE_OWM_API_KEY

export const api = axios.create({
    baseURL: "https://api.openweathermap.org/data/2.5",
    timeout: 10000,
    params: {
        appid: API_KEY
    },
});

export function getCurrentWeather(cityName, units = "metric") {
    return api.get("/weather", {
        params: {
            q: cityName,
            units,
            appid: API_KEY
        }
    });
}

export function getCurrentWeatherByCoords(lat, lon, units = "metric") {
    return api.get("/weather", {
        params: { lat, lon, units, appid: API_KEY }
    });
}