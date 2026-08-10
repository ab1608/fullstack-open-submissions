import List from './List';
import Weather from './Weather';
import { useState, useEffect } from 'react';
import { getWeather } from '../services/weather';

const Country = ({ commonName, capitalCity, areaCode, languages, lat, lon, fullDetail }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (!fullDetail || lat == null || lon == null) return;

    getWeather(lat, lon)
      .then((r) => {
        setWeatherData(r.data);
      })
      .catch((e) => {
        console.error('Could not fetch weather:', e);
      });
  }, [lat, lon, fullDetail]);

  if (!fullDetail) return null;

  if (weatherData) {
    return (
      <div>
        <h1>{commonName}</h1>
        <div>Capital: {capitalCity}</div>
        <div>Area code: {areaCode}</div>
        <div>Latitude: {lat}</div>
        <div>Longitude: {lon}</div>
        <h2>Languages</h2>
        <List items={languages ? Object.values(languages) : []} />
        <Weather commonName={commonName} weatherData={weatherData} />
      </div>
    );
  }
};

export default Country;
