const apiKey = "76e70a32d1ff628637baf7d440ed48ce";
const baseUrl = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(baseurl + infoType); //can be used to get either type of url and api calls

  url.search = new URLSearchParams({ ...searchParams, appid: apiKey });

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data);
};
export default getWeatherData;
