import React, { useEffect, useState } from "react";
import getFormattedWeatherData from "./Components/services/weatherService";
import TopBar from "./Components/WeatherApp/TopBar";
import CurrentWeather from "./Components/WeatherApp/CurrentWeather";
import Forecast from "./Components/WeatherApp/Forecast";
import "./Components/WeatherApp/currentweather.css";
import getdataThroughai from "./Components/services/weatheraitest";
import weatherAI from "./Components/WeatherApp/WeatherAI";
import ChatWidget from "./Components/WeatherApp/ChatWidget";

const App = () => {
  const [query, setQuery] = useState({ q: "Bungoma" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [unitSign, setUnitSign] = useState("C");
  const [wind_speed_sign, setWindSpeedSign] = useState("km/hr");

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getFormattedWeatherData({ ...query, units }).then(
        (data) => {
          setWeather(data);
        }
      );
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
      {weather && (
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
