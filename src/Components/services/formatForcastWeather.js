import { formatToLocalTIme } from "./weatherService";

export const formatForcastWeather = (data) => {
  let { timezone, daily, hourly } = data;
  daily = daily.slice(0, 6).map((d) => {
    return {
      title: formatToLocalTIme(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  return daily, timezone;
};
