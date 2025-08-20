import { DateTime } from "luxon";
const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const oneCallBaseUrl = "https://api.openweathermap.org/data/3.0/";

// i added error handling to validate API responses and provide meaningful error messages
const getWeatherData = (infoType, searchParams) => {
  // i check if API key exists before making the request
  if (!apiKey) {
    return Promise.reject(new Error("Weather API key is missing. Please add REACT_APP_WEATHER_API_KEY to your environment variables."));
  }

  // i use different base URLs for different endpoints
  const isOneCall = infoType === "onecall";
  const url = new URL((isOneCall ? oneCallBaseUrl : baseUrl) + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: apiKey });

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // i validate the API response structure before returning
      if (data.cod && data.cod !== 200) {
        throw new Error(data.message || `API Error: ${data.cod}`);
      }
      return data;
    })
    .catch((error) => {
      console.error("Weather API Error:", error);
      throw error;
    });
};

const formatCurrentWeather = (data) => {
  // I validate the data structure before attempting to destructure
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

  // I ensure weather array has at least one element
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

const formatForcastWeather = (data) => {
  // I validate the forecast data structure before processing
  if (!data || !data.daily || !data.hourly) {
    throw new Error("Invalid forecast data structure received from API");
  }

  let { timezone, daily, hourly } = data;
  
  daily = daily.slice(1, 6).map((d) => {
    // I ensure each daily forecast has required properties
    if (!d.temp || !d.weather || d.weather.length === 0) {
      throw new Error("Invalid daily forecast data");
    }
    return {
      title: formatToLocalTIme(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].main,
    };
  });
  
  hourly = hourly.slice(1, 6).map((d) => {
    // I ensure each hourly forecast has required properties
    if (!d.weather || d.weather.length === 0) {
      throw new Error("Invalid hourly forecast data");
    }
    return {
      title: formatToLocalTIme(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].main,
    };
  });
  
  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  try {
    // I added comprehensive error handling for the entire weather data fetching process
    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    ).then(formatCurrentWeather);

    const { lat, lon } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData("onecall", {
      lat,
      lon,
      exclude: "current,minutely,alerts",
      units: searchParams.units,
    }).then(formatForcastWeather);

    const unformattedForecastWeather = await getWeatherData("onecall", {
      lat,
      lon,
      exclude: "current,minutely,alerts",
      units: searchParams.units,
    });
    
    const unformattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    );

    return { 
      ...formattedCurrentWeather, 
      ...formattedForecastWeather,
      unformattedForecastWeather,
      unformattedCurrentWeather
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // I return a proper Error object that the UI can handle gracefully
    const weatherError = new Error(error.message || "Failed to fetch weather data");
    weatherError.type = error.name || "WeatherError";
    throw weatherError;
  }
};

const formatToLocalTIme = (
  secs,
  zone,
  format = "cccc,dd LLL yyy'|Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);


export default getFormattedWeatherData;
export { formatToLocalTIme };
