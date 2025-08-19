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
            <img src={search_icon} alt="Search" />
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
            className={units === 'metric' ? 'active' : ''}
          >
            °C
          </button>
          <span className="unit-separator">|</span>
          <button 
            name="imperial" 
            onClick={unitChange}
            className={units === 'imperial' ? 'active' : ''}
          >
            °F
          </button>
        </div>
      </div>
    </div>
  );
}
