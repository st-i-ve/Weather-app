import React, { useState } from "react";
import pin from "../Assets/location-pin.png";
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
    <div className="unified-dock-container">
      <div className="unified-dock">
        <div className="search-section">
          <input
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
            type="text"
            className="dock-search-input"
            placeholder="Search location..."
            onKeyDown={handleKeyPress}
          />
          <div className="dock-search-icon" onClick={search}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="dock-divider"></div>

        <div className="dock-location" onClick={location}>
          <img src={pin} alt="Use current location" />
        </div>

        <div className="dock-divider"></div>

        <div className="dock-units">
          <button
            name="metric"
            onClick={unitChange}
            className={units === "metric" ? "active" : ""}
          >
            °C
          </button>
          <span className="unit-separator">|</span>
          <button
            name="imperial"
            onClick={unitChange}
            className={units === "imperial" ? "active" : ""}
          >
            °F
          </button>
        </div>
      </div>
    </div>
  );
}
