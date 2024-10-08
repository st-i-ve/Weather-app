import { DateTime } from "luxon";
const apiKey = "49cc8c821cd2aff9af04c9f98c36eb74";
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
    sys: { country },

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
    country,
  };
};

const formatForcastWeather = (data) => {
  let { timezone, daily, hourly } = data;
  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTIme(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].main,
    };
  });
  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTIme(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].main,
    };
  });
  return { timezone, daily, hourly };
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

  return { ...formattedCurrentWeather, ...formattedForecastWeather,unformattedForecastWeather,unformattedCurrentWeather};
};

const formatToLocalTIme = (
  secs,
  zone,
  format = "cccc,dd LLL yyy'|Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);


export default getFormattedWeatherData;
export { formatToLocalTIme };
