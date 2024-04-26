import React, { useEffect, useState } from "react";

import "./currentweather.css";

function Forecast({ title, items, icon }) {
  return (
    <div className="forecastcontainer">
      <div className="dailyforecast">
        <div className="forecasthead">
          <h2>{title}</h2>
        </div>
        <hr />
        <div className="dailyelements">
          {items.map((item) => (
            <div className="f_element" key={item.title}>
              <div className="day">{item.title}</div>
              <div className="w-day-img">
                <img
                  src={require(`../Assets/${item.icon.toLowerCase()}.png`)}
                />
              </div>
              <div className="day-temp">{item.temp.toFixed()}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forecast;
