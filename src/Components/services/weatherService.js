import { DateTime } from "luxon";

const apiKey = "1fa9ff4126d95b8db54f3897a208e91c";
const baseUrl = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(baseUrl + infoType); //can be used to get either type of url and api calls

  url.search = new URLSearchParams({ ...searchParams, appid: apiKey });

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data);
};
const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, humidity, feels_like },
    name,
    dt,
    weather,
    wind: { speed },
  } = data;

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
  };
};

const formatForcastWeather = (data) => {
  let { timezone, daily, hourly } = data;
  daily = daily.slice(0, 6).map((d) => {
    return {
      title: formatToLocalTIme(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });
  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTIme(d.dt, timezone, "hh:mm a"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  return timezone, daily;
};

const getFormattedWeatherData = async (searchParams) => {
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

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTIme = (
  secs,
  zone,
  format = "cccc,dd LLL yyy'|Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

export default getFormattedWeatherData;
