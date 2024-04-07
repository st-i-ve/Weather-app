const search = async () => {
  const searchBox = document.getElementsByClassName("cityInput");

  if (searchBox.value === "") {
    return 0;
  } else {
    let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${searchBox[0].value}&appid=${apiKey}`;

    let response = await fetch(url);
    let dataRecieved = await response.json();
    console.log(dataRecieved);

    if (dataRecieved.weather[0].main === "Clouds") {
      setWicon(cloud_icon);
    } else if (dataRecieved.weather[0].main === "Clear") {
      setWicon(clear_icon);
    } else if (dataRecieved.weather[0].main === "Rain") {
      setWicon(rain_icon);
    } else if (dataRecieved.weather[0].main === "Drizzle") {
      setWicon(drizzle_icon);
    } else if (dataRecieved.weather[0].main === "Mist") {
      setWicon(mist_icon);
    } else if (dataRecieved.weather[0].main === "Snow") {
      setWicon(snow_icon);
    }
    document.querySelector(".city-name").innerHTML = dataRecieved.name;
    document.querySelector(".weather-temp").innerHTML =
      Math.round(dataRecieved.main.temp) + "°c";
    document.querySelector(".humidity_percentage").innerHTML =
      dataRecieved.main.humidity + "%";
    document.querySelector(".wind_speed").innerHTML =
      dataRecieved.wind.speed + "km/hr";
  }
};
onClick={() => {
    search();//search

    .then(formatForcastWeather);
    1fa9ff4126d95b8db54f3897a208e91c
    76e70a32d1ff628637baf7d440ed48ce