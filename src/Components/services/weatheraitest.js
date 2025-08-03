
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

    // i create the system context with raw json data instead of manually formatting everything
    const systemContext = `You are an agricultural officer providing weather-based farming advice. The user lives in ${deriveddata.name} and the units used are ${units}.

Below is the complete weather data in JSON format. Please analyze this data and provide agricultural advice based on current conditions, hourly forecasts, and daily forecasts:

WEATHER DATA:
${JSON.stringify(deriveddata, null, 2)}

${conversationHistory ? `Previous conversation:\n${conversationHistory}` : ''}

Please analyze the weather data and respond as an agricultural officer providing practical farming advice. Focus on:
- Current weather conditions and their impact on farming activities
- Upcoming weather patterns and how farmers should prepare
- Specific recommendations for planting, harvesting, irrigation, or other farm activities
- Any weather-related risks or opportunities for crops

Keep your response concise but informative.`;

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
