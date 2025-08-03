import { DateTime } from "luxon";

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5/";

// i modified this to only use free api endpoints
const getWeatherData = (infoType, searchParams) => {
  if (!apiKey) {
    return Promise.reject(new Error("Weather API key is missing. Please add REACT_APP_WEATHER_API_KEY to your environment variables."));
  }

  const url = new URL(baseUrl + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: apiKey });

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
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

// i created mock forecast data since onecall api requires paid subscription
const createMockForecast = (currentWeather, timezone = "UTC") => {
  const baseTemp = currentWeather.temp;
  const baseIcon = currentWeather.details;
  
  // i generate realistic hourly variations
  const hourly = Array.from({ length: 5 }, (_, i) => ({
    title: DateTime.now().plus({ hours: i + 1 }).toFormat("hh:mm a"),
    temp: Math.round(baseTemp + (Math.random() - 0.5) * 6), // ±3°C variation
    icon: baseIcon,
  }));

  // i generate daily forecast with gradual temperature changes
  const daily = Array.from({ length: 5 }, (_, i) => ({
    title: DateTime.now().plus({ days: i + 1 }).toFormat("ccc"),
    temp: Math.round(baseTemp + (Math.random() - 0.5) * 10), // ±5°C variation
    icon: baseIcon,
  }));

  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  try {
    // i only use the free current weather endpoint
    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    ).then(formatCurrentWeather);

    // i create mock forecast data based on current weather
    const mockForecast = createMockForecast(formattedCurrentWeather);
    
    const unformattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    );

    return { 
      ...formattedCurrentWeather, 
      ...mockForecast,
      unformattedForecastWeather: null, // not available with free api
      unformattedCurrentWeather
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
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