import React, { useState } from "react";
import "./WeatherApp.css";

import clear_icon from "../Assets/clear.png";
import search_icon from "../Assets/search.png";
import cloud_icon from "../Assets/clouds.png";
import wind_icon from "../Assets/wind.png";
import drizzle_icon from "../Assets/drizzle.png";
import humidity_icon from "../Assets/humidity.png";
import mist_icon from "../Assets/mist.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import pin from "../Assets/location-pin.png";
import Forecast from "./Forecast";
import getFormattedWeatherData from "../services/weatherService";

function WeatherApp() {
  const apiKey = "76e70a32d1ff628637baf7d440ed48ce";
  const [wicon, setWicon] = useState(cloud_icon);

  const fetchWeather = async () => {
    const data = await getFormattedWeatherData({ q: "kitale" });
    console.log(data);
  };

  fetchWeather();

  return (
    <div className="container">
      <div className="container-inner">
        <div className="current-weather">
        <div className="utilitybar">
            <div className="top-bar">
              <input type="text" className="cityInput" placeholder="Search" />
              <div className="searchIcon">
                <img src={search_icon} alt="" />
              </div>
            </div>
            <div className="locationpin">
              <img src={pin} />
            </div>
            <div className="units">
              <button name="metric">°C</button>
              <p>|</p>
              <button name="imperial">°F</button>
            </div>
          </div>

          <div className="weather-image">
            <img src={wicon} />
          </div>
          <div className="weather-temp">24°c</div>
          <div className="city-name">London</div>
          <div className="data-container">
            <div className="element">
              <img src={humidity_icon} className="icon" />
              <div className="data">
                <div className="text">Humidity :</div>
                <div className="humidity_percentage">54%</div>
              </div>
            </div>
            <p className="divider">|</p>
            <div className="element">
              <img src={wind_icon} className="icon" />
              <div className="data">
                <div className="text">Windspeed :</div>
                <div className="wind_speed">15km/hr</div>
              </div>
            </div>
          </div>
        </div>
          

          <div className="forecast-footer">
      <Forecast />
      </div>

        </div>
          
      
     
    </div>
  );
}

export default WeatherApp;
