import React, { useEffect, useState } from "react";
import clear_icon from "../Assets/clear.png";

import cloud_icon from "../Assets/clouds.png";
import wind_icon from "../Assets/wind.png";
import drizzle_icon from "../Assets/drizzle.png";
import humidity_icon from "../Assets/humidity.png";
import mist_icon from "../Assets/mist.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import "./currentweather.css";

export default function CurrentWeather({
  weather: { name, temp, details, humidity, speed, country },
  unitSign,
  windspeed,
}) {
  const [wicon, setWicon] = useState(cloud_icon);

  useEffect(() => {
    if (details === "Clouds") {
      setWicon(cloud_icon);
    } else if (details === "Clear") {
      setWicon(clear_icon);
    } else if (details === "Rain") {
      setWicon(rain_icon);
    } else if (details === "Drizzle") {
      setWicon(drizzle_icon);
    } else if (details === "Mist") {
      setWicon(mist_icon);
    } else {
      setWicon(snow_icon);
    }
  }, [details]);

  /*const [tempUnits, setTempUnits] = useState("c");
  const [windSpeedUnits, setWindSpeedUnits] = useState("m/s");

  useEffect(() => {
    if (units === "imperial") {
      setTempUnits("c");
      setWindSpeedUnits("m/s");
    } else if (units === "metric") {
      setTempUnits("f");
      setWindSpeedUnits("m/h");
    } else {
      setTempUnits("null");
      setWindSpeedUnits("null");
    }
  }, [units]);*/

  return (
    <div className="cuurent-weather">
      <div className="weather-image">
        <img src={wicon} />
      </div>
      <div className="weather-temp">
        {Math.round(`${temp}`)}°{`${unitSign}`}
      </div>
      <div className="city-name">
        <p>{`${name},${country}`}</p>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} className="icon" />
          <div className="data">
            <div className="text">Humidity :</div>
            <div className="humidity_percentage">{`${humidity}%`}</div>
          </div>
        </div>
        <p className="divider">|</p>
        <div className="element">
          <img src={wind_icon} className="icon" />
          <div className="data">
            <div className="text">Windspeed :</div>
            <div className="wind_speed">
              {Math.round(`${speed}`)} {`${windspeed}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
