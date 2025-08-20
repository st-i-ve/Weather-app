// i updated this to call the serverless function instead of directly using API keys
// this ensures weather api keys stay secure on the server side

import { DateTime } from "luxon";

const getFormattedWeatherData = async (searchParams) => {
  try {
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchParams
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch weather data');
    }

    const data = await response.json();
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
