// i updated this to use the automatic api configuration for local/production environments
// this ensures weather api keys stay secure and works both locally and on vercel

import { DateTime } from "luxon";
import { apiRequest } from '../utils/apiConfig';

const getFormattedWeatherData = async (searchParams) => {
  try {
    const data = await apiRequest('/api/weather', {
      method: 'POST',
      body: JSON.stringify({
        searchParams
      })
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // i return a proper Error object that the UI can handle gracefully
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
