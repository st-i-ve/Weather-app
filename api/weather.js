// i created this serverless function to handle weather API requests securely
// weather api keys stay server-side and aren't exposed in the client bundle

import { DateTime } from "luxon";

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc,dd LLL yyy'|Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const getWeatherData = async (infoType, searchParams, apiKey) => {
  // i check if API key exists before making the request
  if (!apiKey) {
    throw new Error("Weather API key is missing. Please add WEATHER_API_KEY to your environment variables.");
  }

  const baseUrl = "https://api.openweathermap.org/data/2.5/";
  const oneCallBaseUrl = "https://api.openweathermap.org/data/3.0/";
  
  // i use different base URLs for different endpoints
  const isOneCall = infoType === "onecall";
  const url = new URL((isOneCall ? oneCallBaseUrl : baseUrl) + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: apiKey });

  const response = await fetch(url);
  const data = await response.json();
  
  // i validate the API response structure before returning
  if (data.cod && data.cod !== 200) {
    throw new Error(data.message || `API Error: ${data.cod}`);
  }
  return data;
};

const formatCurrentWeather = (data) => {
  // i validate the data structure before attempting to destructure
  if (!data || !data.coord || !data.main || !data.weather || !data.wind || !data.sys) {
    throw new Error("Invalid weather data structure received from API");
  }

  const {
    coord: { lat, lon },
    main: { temp, humidity, feels_like },
    name,
    dt,
    weather,
    wind: { speed },
    sys: { country },
  } = data;

  // i ensure weather array has at least one element
  if (!weather || weather.length === 0) {
    throw new Error("Weather details are missing from API response");
  }

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    humidity,
    feels_like,
    name,
    details,
    icon,
    dt,
    speed,
    country,
  };
};

const formatForecastWeather = (data) => {
  // i validate the forecast data structure before processing
  if (!data || !data.daily || !data.hourly) {
    throw new Error("Invalid forecast data structure received from API");
  }

  let { timezone, daily, hourly } = data;
  
  daily = daily.slice(1, 6).map((d) => {
    // i ensure each daily forecast has required properties
    if (!d.temp || !d.weather || d.weather.length === 0) {
      throw new Error("Invalid daily forecast data");
    }
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].main,
    };
  });
  
  hourly = hourly.slice(1, 6).map((d) => {
    // i ensure each hourly forecast has required properties
    if (!d.weather || d.weather.length === 0) {
      throw new Error("Invalid hourly forecast data");
    }
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].main,
    };
  });
  
  return { timezone, daily, hourly };
};

export default async function handler(req, res) {
  // i only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { searchParams } = req.body;
    
    // i get the weather api key from server environment variables
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Weather API key is missing. Please add WEATHER_API_KEY to your environment variables.");
    }

    // i added comprehensive error handling for the entire weather data fetching process
    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams,
      apiKey
    ).then(formatCurrentWeather);

    const { lat, lon } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData("onecall", {
      lat,
      lon,
      exclude: "current,minutely,alerts",
      units: searchParams.units,
    }, apiKey).then(formatForecastWeather);

    const unformattedForecastWeather = await getWeatherData("onecall", {
      lat,
      lon,
      exclude: "current,minutely,alerts",
      units: searchParams.units,
    }, apiKey);
    
    const unformattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams,
      apiKey
    );

    const result = { 
      ...formattedCurrentWeather, 
      ...formattedForecastWeather,
      unformattedForecastWeather,
      unformattedCurrentWeather
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in weather endpoint:", error);
    res.status(500).json({ error: error.message || "Failed to fetch weather data" });
  }
}