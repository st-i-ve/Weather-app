
const weatherAPI = process.env.REACT_APP_GEMINI_API_KEY;

const getdataThroughai = async (chatMessages, deriveddata, units) => {
  try {
    // i check if gemini api key is available
    if (!weatherAPI) {
      throw new Error("Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your environment variables.");
    }

    chatMessages = chatMessages ?? [];

    // i build the conversation history for gemini
    let conversationHistory = "";
    chatMessages.forEach((messageObject) => {
      if (messageObject.sender === "AI") {
        conversationHistory += `Assistant: ${messageObject.text}\n`;
      } else {
        conversationHistory += `User: ${messageObject.text}\n`;
      }
    });

    // i create the system context and combine it with conversation history
    const systemContext = `i live in ${deriveddata.name} and tomorrow is ${deriveddata.daily[0].title} .The units used are ${units}.The weather today is : temoerature ${deriveddata.temp} ,humidity ${deriveddata.humidity},wind speed ${deriveddata.speed} overall detail ${deriveddata.details} cloudcover ${deriveddata.unformattedCurrentWeather.clouds.all} description ${deriveddata.unformattedCurrentWeather.weather[0].description}.The weather forecast today of the following hours are hour1:${deriveddata.hourly[0].title},temp${deriveddata.hourly[0].temp},humidty ${deriveddata.unformattedForecastWeather.hourly[0].humidity}
      hour2: ${deriveddata.hourly[1].title}, temp${deriveddata.hourly[1].temp}, humidity ${deriveddata.unformattedForecastWeather.hourly[1].humidity},
      hour3: ${deriveddata.hourly[2].title}, temp${deriveddata.hourly[2].temp}, humidity ${deriveddata.unformattedForecastWeather.hourly[2].humidity},
      hour4: ${deriveddata.hourly[3].title}, temp${deriveddata.hourly[3].temp}, humidity ${deriveddata.unformattedForecastWeather.hourly[3].humidity},
      hour5: ${deriveddata.hourly[4].title}, temp${deriveddata.hourly[4].temp}, humidity ${deriveddata.unformattedForecastWeather.hourly[4].humidity}
      .The forecast from tommorow is as follows day1: clouds ${deriveddata.unformattedForecastWeather.daily[0].clouds}, humidity ${deriveddata.unformattedForecastWeather.daily[0].humidity}, temp ${deriveddata.unformattedForecastWeather.daily[0].temp.day}, description ${deriveddata.unformattedForecastWeather.daily[0].weather[0].description}, rain ${deriveddata.unformattedForecastWeather.daily[0].rain}
      day2: clouds ${deriveddata.unformattedForecastWeather.daily[1].clouds}, humidity ${deriveddata.unformattedForecastWeather.daily[1].humidity}, temp ${deriveddata.unformattedForecastWeather.daily[1].temp.day}, description ${deriveddata.unformattedForecastWeather.daily[1].weather[0].description}, rain ${deriveddata.unformattedForecastWeather.daily[1].rain}
      day3: clouds ${deriveddata.unformattedForecastWeather.daily[2].clouds}, humidity ${deriveddata.unformattedForecastWeather.daily[2].humidity}, temp ${deriveddata.unformattedForecastWeather.daily[2].temp.day}, description ${deriveddata.unformattedForecastWeather.daily[2].weather[0].description}, rain ${deriveddata.unformattedForecastWeather.daily[2].rain}
      day4: clouds ${deriveddata.unformattedForecastWeather.daily[3].clouds}, humidity ${deriveddata.unformattedForecastWeather.daily[3].humidity}, temp ${deriveddata.unformattedForecastWeather.daily[3].temp.day}, description ${deriveddata.unformattedForecastWeather.daily[3].weather[0].description}, rain ${deriveddata.unformattedForecastWeather.daily[3].rain}
      day5: clouds ${deriveddata.unformattedForecastWeather.daily[4].clouds}, humidity ${deriveddata.unformattedForecastWeather.daily[4].humidity}, temp ${deriveddata.unformattedForecastWeather.daily[4].temp.day}, description ${deriveddata.unformattedForecastWeather.daily[4].weather[0].description}, rain ${deriveddata.unformattedForecastWeather.daily[4].rain}
      day6: clouds ${deriveddata.unformattedForecastWeather.daily[5].clouds}, humidity ${deriveddata.unformattedForecastWeather.daily[5].humidity}, temp ${deriveddata.unformattedForecastWeather.daily[5].temp.day}, description ${deriveddata.unformattedForecastWeather.daily[5].weather[0].description}, rain ${deriveddata.unformattedForecastWeather.daily[5].rain}
      day7: clouds ${deriveddata.unformattedForecastWeather.daily[6].clouds}, humidity ${deriveddata.unformattedForecastWeather.daily[6].humidity}, temp ${deriveddata.unformattedForecastWeather.daily[6].temp.day}, description ${deriveddata.unformattedForecastWeather.daily[6].weather[0].description}, rain ${deriveddata.unformattedForecastWeather.daily[6].rain}.After comprehending all of the above data i want you to sound like an agricultural officer explaining the details and advising the farmers according to the data provided.Make description consise where necessary.

${conversationHistory ? `Previous conversation:\n${conversationHistory}` : ''}

Please respond as an agricultural officer providing weather-based farming advice.`;

    // i use gemini's api structure
    const apiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: systemContext
            }
          ]
        }
      ]
    };

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": weatherAPI,
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || 'Failed to fetch response'}`);
    }

    const data = await response.json();
    // i extract the response from gemini's format
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    // Handle errors, e.g., logging or throwing
    console.error("Error fetching chat completions:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
export default getdataThroughai;
