import axios from 'axios';

const weatherKey = import.meta.env.VITE_OPEN_WEATHER_KEY;

export const getWeather = (lat, lon, units = 'metric', apiKey = weatherKey) => {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`,
  );
};
