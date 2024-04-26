import React, { useState } from "react";
import pin from "../Assets/location-pin.png";
import search_icon from "../Assets/search.png";
import "./currentweather.css";

export default function TopBar({ setQuery, units, setUnits }) {
  const [city, setCity] = useState("");

  const search = () => {
    if (city !== "") {
      setQuery({ q: city });
    }
  };

  const location = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        setQuery({
          lat,
          lon,
        });
      });
    }
  };
  const unitChange = (e) => {
    const selectedunit = e.currentTarget.name;
    if (units !== selectedunit) {
      setUnits(selectedunit);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    <div>
      <div className="utilitybar">
        <div className="top-bar">
          <input
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
            type="text"
            className="cityInput"
            placeholder="Search"
            onKeyDown={handleKeyPress}
          />
          <div className="searchIcon" onClick={search}>
            <img src={search_icon} alt="" />
          </div>
        </div>
        <div className="locationpin" onClick={location}>
          <img src={pin} />
        </div>
        <div className="units">
          <button name="metric" onClick={unitChange}>
            °C
          </button>
          <p>|</p>
          <button name="imperial" onClick={unitChange}>
            °F
          </button>
        </div>
      </div>
    </div>
  );
}
