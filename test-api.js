// simple test script to verify openweather api key
require('dotenv').config();

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/3.0/";

// i'm using london as a test location since it's reliable
const TEST_LOCATION = "London,UK";

async function testWeatherAPI() {
  console.log('testing openweather api...');
  console.log('api key:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'not found');
  console.log('test location:', TEST_LOCATION);
  console.log('---');

  if (!API_KEY) {
    console.error('❌ api key not found in environment variables');
    console.log('make sure REACT_APP_WEATHER_API_KEY is set in .env file');
    return;
  }

  try {
    // test current weather endpoint
    const weatherUrl = `${BASE_URL}weather?q=${TEST_LOCATION}&appid=${API_KEY}&units=metric`;
    console.log('testing current weather endpoint...');
    
    const response = await fetch(weatherUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ current weather api works!');
      console.log(`location: ${data.name}, ${data.sys.country}`);
      console.log(`temperature: ${data.main.temp}°C`);
      console.log(`weather: ${data.weather[0].description}`);
      console.log('---');
      
      // test onecall 3.0 endpoint with coordinates
      const { lat, lon } = data.coord;
      const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,alerts`;
      
      console.log('testing onecall 3.0 endpoint...');
      const forecastResponse = await fetch(oneCallUrl);
      const forecastData = await forecastResponse.json();
      
      if (forecastResponse.ok) {
        console.log('✅ onecall api works!');
        console.log(`hourly forecasts available: ${forecastData.hourly.length}`);
        console.log(`daily forecasts available: ${forecastData.daily.length}`);
        console.log('---');
        console.log('🎉 all api endpoints working correctly!');
      } else {
        console.error('❌ onecall api failed:', forecastData.message);
        console.log('note: onecall api might require a paid subscription');
      }
      
    } else {
      console.error('❌ current weather api failed');
      console.error('error code:', data.cod);
      console.error('error message:', data.message);
      
      if (data.cod === 401) {
        console.log('this usually means:');
        console.log('- api key is invalid');
        console.log('- api key is not activated yet (can take up to 2 hours)');
        console.log('- api key is not properly formatted');
      }
    }
    
  } catch (error) {
    console.error('❌ network error:', error.message);
    console.log('check your internet connection');
  }
}

// run the test
testWeatherAPI();