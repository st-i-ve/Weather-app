// i created this simple local API server to test the services without needing Vercel
// this helps debug the API issues in local development

const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3002;

// i enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// i import the DateTime utility for weather formatting
const { DateTime } = require('luxon');

// i recreate the weather service functions locally
const formatToLocalTime = (
  secs,
  zone,
  format = "cccc,dd LLL yyy'|Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const getWeatherData = async (infoType, searchParams, apiKey) => {
  if (!apiKey) {
    throw new Error("Weather API key is missing. Please add WEATHER_API_KEY to your environment variables.");
  }

  const baseUrl = "https://api.openweathermap.org/data/2.5/";
  const oneCallBaseUrl = "https://api.openweathermap.org/data/3.0/";
  
  const isOneCall = infoType === "onecall";
  const url = new URL((isOneCall ? oneCallBaseUrl : baseUrl) + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: apiKey });

  const response = await fetch(url);
  const data = await response.json();
  
  if (data.cod && data.cod !== 200) {
    throw new Error(data.message || `API Error: ${data.cod}`);
  }
  return data;
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    pressure,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
    timezone,
    formattedLocalTime: formatToLocalTime(dt, timezone),
  };
};

const formatForecastWeather = (data) => {
  let { timezone, daily, hourly } = data;
  
  if (!daily || !Array.isArray(daily)) {
    console.warn("Daily forecast data is missing or invalid");
    daily = [];
  }
  
  if (!hourly || !Array.isArray(hourly)) {
    console.warn("Hourly forecast data is missing or invalid");
    hourly = [];
  }

  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].icon,
    };
  });

  return { timezone, daily, hourly };
};

// i create the weather API endpoint
app.post('/api/weather', async (req, res) => {
  console.log('🌤️ Weather API called:', req.body);
  
  try {
    const { searchParams } = req.body;
    
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Weather API key is missing. Please add WEATHER_API_KEY to your environment variables.");
    }

    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams,
      apiKey
    ).then(formatCurrentWeather);

    const { lat, lon } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData("onecall", {
      lat,
      lon,
      exclude: "current,minutely,alerts",
      units: searchParams.units,
    }, apiKey).then(formatForecastWeather);

    const unformattedForecastWeather = await getWeatherData("onecall", {
      lat,
      lon,
      exclude: "current,minutely,alerts",
      units: searchParams.units,
    }, apiKey);
    
    const unformattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams,
      apiKey
    );

    const result = { 
      ...formattedCurrentWeather, 
      ...formattedForecastWeather,
      unformattedForecastWeather,
      unformattedCurrentWeather
    };
    
    console.log('✅ Weather data fetched successfully');
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error in weather endpoint:", error);
    res.status(500).json({ error: error.message || "Failed to fetch weather data" });
  }
});

// i create the AI chat API endpoint
app.post('/api/ai-chat', async (req, res) => {
  console.log('🤖 AI Chat API called:', req.body);
  
  try {
    const { chatMessages, deriveddata, units } = req.body;
    
    const geminiAPI = process.env.GEMINI_API_KEY;
    
    if (!geminiAPI) {
      throw new Error("Gemini API key not found. Please set GEMINI_API_KEY in your environment variables.");
    }

    const messages = chatMessages ?? [];

    const contents = [];
    
    const systemPrompt = `You are a friendly agricultural assistant helping farmers in ${deriveddata.name}. Current weather conditions: ${deriveddata.details}, ${Math.round(deriveddata.temp)}°${units === 'metric' ? 'C' : 'F'}, humidity ${deriveddata.humidity}%.

IMPORTANT CONTEXT RULES:
- Remember our entire conversation history
- Don't repeat information you've already shared
- Build on previous responses naturally
- Keep responses conversational and brief (4-5 sentences max)
- Only provide detailed forecasts when specifically asked
- Focus on practical farming advice based on current and upcoming weather

Weather Data Available:
${JSON.stringify(deriveddata, null, 2)}

Provide helpful, contextual farming advice based on the current weather conditions and user questions.`;

    contents.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });

    messages.forEach((message, index) => {
      if (message.sender === "user") {
        contents.push({
          role: "user",
          parts: [{ text: message.text }]
        });
      } else if (message.sender === "responder") {
        contents.push({
          role: "model",
          parts: [{ text: message.text }]
        });
      }
    });

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiAPI}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || 'Failed to fetch response'}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    console.log('✅ AI response generated successfully');
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("❌ Error in AI chat endpoint:", error);
    res.status(500).json({ error: error.message || "Failed to process AI request" });
  }
});

// i start the server
app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('  POST /api/weather - Weather data');
  console.log('  POST /api/ai-chat - AI chat responses');
  console.log('');
  console.log('🔧 Environment variables:');
  console.log(`  WEATHER_API_KEY: ${process.env.WEATHER_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}`);
});