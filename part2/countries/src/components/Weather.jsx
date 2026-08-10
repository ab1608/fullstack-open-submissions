const Weather = ({ commonName, weatherData }) => {
  const tempC = weatherData.main.temp;
  const windM = weatherData.wind.speed;
  const iconCode = weatherData.weather[0].icon;

  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;

  return (
    <div>
      <h2>Weather in {commonName}</h2>
      <div>Temperature: {tempC} Celsius </div>
      <img src={iconUrl} />
      <div>Wind: {windM} m/s </div>
    </div>
  );
};

export default Weather;
