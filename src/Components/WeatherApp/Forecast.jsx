import React from "react";
import clear_icon from "../Assets/clear.png";
import search_icon from "../Assets/search.png";
import cloud_icon from "../Assets/clouds.png";
import wind_icon from "../Assets/wind.png";
import drizzle_icon from "../Assets/drizzle.png";
import humidity_icon from "../Assets/humidity.png";
import mist_icon from "../Assets/mist.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";

import "./forecast.css";

function Forecast() {
  return (
    <div className="forecastcontainer">
      <div className="hourforecast">
        <div className="forecasthead">
          <h2>Hour forecast</h2></div>
        <hr></hr>
        <div className="hourlyelements">
          <div className="f_element">
            <div className="hour">12:00 PM</div>
            <div className="w-hour-img">
              <img src={snow_icon} />
            </div>
            <div className="hou-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="hour">12:00 PM</div>
            <div className="w-hour-img">
              <img src={snow_icon} />
            </div>
            <div className="hou-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="hour">12:00 PM</div>
            <div className="w-hour-img">
              <img src={snow_icon} />
            </div>
            <div className="hou-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="hour">12:00 PM</div>
            <div className="w-hour-img">
              <img src={snow_icon} />
            </div>
            <div className="hou-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="hour">12:00 PM</div>
            <div className="w-hour-img">
              <img src={snow_icon} />
            </div>
            <div className="hou-temp">22°c</div>
          </div>
        </div>
      </div>
      <div className="dailyforecast">
        <div className="forecasthead">
          <h2>Daily forecast</h2>
          </div>
        <hr></hr>
        <div className="dailyelements">
          <div className="f_element">
            <div className="day">12:00 PM</div>
            <div className="w-day-img">
              <img src={snow_icon} />
            </div>
            <div className="day-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="day">12:00 PM</div>
            <div className="w-day-img">
              <img src={snow_icon} />
            </div>
            <div className="day-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="day">12:00 PM</div>
            <div className="w-day-img">
              <img src={snow_icon} />
            </div>
            <div className="day-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="day">12:00 PM</div>
            <div className="w-day-img">
              <img src={snow_icon} />
            </div>
            <div className="day-temp">22°c</div>
          </div>
          <div className="f_element">
            <div className="day">12:00 PM</div>
            <div className="w-day-img">
              <img src={snow_icon} />
            </div>
            <div className="day-temp">22°c</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forecast;
