import React, { useEffect, useState } from "react";
import getFormattedWeatherData from "./Components/services/weatherService";
import TopBar from "./Components/WeatherApp/TopBar";
import CurrentWeather from "./Components/WeatherApp/CurrentWeather";
import Forecast from "./Components/WeatherApp/Forecast";
import "./Components/WeatherApp/currentweather.css";
import ChatWidget from "./Components/WeatherApp/ChatWidget";

// i added this helper to compute weather themes based on conditions and temperature
const getWeatherTheme = (weather, units) => {
  if (!weather || !weather.details || weather.temp === undefined) {
    return 'mild'; // fallback theme
  }

  const { details, temp } = weather;
  const condition = details.toLowerCase();

  // i prioritize precipitation and severe conditions over temperature
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return 'rainy';
  }
  if (condition.includes('thunderstorm') || condition.includes('storm')) {
    return 'stormy';
  }
  if (condition.includes('snow')) {
    return 'snowy';
  }
  if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze') || condition.includes('smoke')) {
    return 'foggy';
  }
  if (condition.includes('cloud')) {
    return 'cloudy';
  }

  // i use temperature thresholds for clear conditions
  const warmThreshold = units === 'metric' ? 28 : 82;
  const coldThreshold = units === 'metric' ? 10 : 50;

  if (temp >= warmThreshold) {
    return 'warm';
  }
  if (temp <= coldThreshold) {
    return 'cold';
  }

  return 'mild'; // default green-bluish theme
};

const App = () => {
  const [query, setQuery] = useState({ q: "Bungoma" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [unitSign, setUnitSign] = useState("C");
  const [wind_speed_sign, setWindSpeedSign] = useState("km/hr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFormattedWeatherData({ ...query, units });
        setWeather(data);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        setError(err.message || "Failed to load weather data. Please try again.");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [query, units]);

  const makeDecisionBasedOnWeather = () => {
    if (weather !== null) {
      console.log("Weather:", weather);
    }
  };
  useEffect(() => {
    makeDecisionBasedOnWeather();
  }, [weather]);

  useEffect(() => {
    if (units === "metric") {
      setUnitSign("C");
      setWindSpeedSign("km/hr");
    } else if (units === "imperial") {
      setUnitSign("F");
      setWindSpeedSign("m/s");
    }
  }, [units]);

  // i compute the theme based on current weather conditions
  const currentTheme = weather ? getWeatherTheme(weather, units) : 'mild';

  return (
    <div className={`wholepage theme--${currentTheme}`}>
      <TopBar setQuery={setQuery} setUnits={setUnits} units={units} />
      
      {loading && (
        <div className="loading-container" aria-busy="true" aria-live="polite">
          <div className="dynamics">
            <div className="current-weather-box">
              <div className="cuurent-weather">
                <div className="weather-image">
                  <div className="placeholder-icon"></div>
                </div>
                <div className="weather-temp">
                  <span className="placeholder-temp"></span>
                </div>
                <div className="city-name">
                  <p className="placeholder-city"></p>
                </div>
                <div className="data-container">
                  <div className="element">
                    <div className="icon placeholder-small-icon"></div>
                    <div className="data">
                      <div className="text">Humidity :</div>
                      <div className="humidity_percentage placeholder-value"></div>
                    </div>
                  </div>
                  <p className="divider">|</p>
                  <div className="element">
                    <div className="icon placeholder-small-icon"></div>
                    <div className="data">
                      <div className="text">Windspeed :</div>
                      <div className="wind_speed placeholder-value"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="forecast-weather-box">
              <div className="forecastcontainer">
                <div className="dailyforecast">
                  <div className="forecasthead">
                    <h2>hourly forecast</h2>
                  </div>
                  <hr />
                  <div className="dailyelements">
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-time"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-time"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-time"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-time"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="forecastcontainer">
                <div className="dailyforecast">
                  <div className="forecasthead">
                    <h2>daily forecast</h2>
                  </div>
                  <hr />
                  <div className="dailyelements">
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-day"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-day"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-day"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                    <div className="f_element placeholder-forecast-item">
                      <div className="day placeholder-forecast-day"></div>
                      <div className="w-day-img placeholder-forecast-icon"></div>
                      <div className="day-temp placeholder-forecast-temp"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          color: '#ff6b6b',
          fontSize: '16px',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <h3>Weather data unavailable</h3>
            <p>{error}</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              Please check your internet connection and API key configuration.
            </p>
          </div>
        </div>
      )}
      
      {weather && !loading && !error && (
        <div className="dynamics">
          <div className="current-weather-box">
            <CurrentWeather
              weather={weather}
              unitSign={unitSign}
              windspeed={wind_speed_sign}
            />
          </div>
          <div className="forecast-weather-box">
            <Forecast
              items={weather.hourly}
              icon={weather.hourly.icon}
              title="hourly forecast"
            />
            <Forecast
              items={weather.daily}
              icon={weather.daily.icon}
              title="daily forecast"
            />
          </div>
          <ChatWidget weather={weather} units={units} />
        </div>
      )}
    </div>
  );
};

export default App;
