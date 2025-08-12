import React, { useEffect, useState } from "react";
import getFormattedWeatherData from "./Components/services/weatherService";
import TopBar from "./Components/WeatherApp/TopBar";
import CurrentWeather from "./Components/WeatherApp/CurrentWeather";
import Forecast from "./Components/WeatherApp/Forecast";
import "./Components/WeatherApp/currentweather.css";
import ChatWidget from "./Components/WeatherApp/ChatWidget";

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

  return (
    <div className="wholepage">
      <TopBar setQuery={setQuery} setUnits={setUnits} units={units} />
      
      {loading && (
        <div className="skeleton" aria-busy="true" aria-live="polite">
          <div className="skeleton-header">
            <div className="skeleton-row" />
          </div>

          <div className="skeleton-current">
            <div className="skeleton-temp skeleton-block" />
            <div className="skeleton-title skeleton-block" />
            <div className="skeleton-row" />
            <div className="skeleton-row short" />
          </div>

          <div className="skeleton-forecast">
            <div className="skeleton-chip" />
            <div className="skeleton-chip" />
            <div className="skeleton-chip" />
            <div className="skeleton-chip" />
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
