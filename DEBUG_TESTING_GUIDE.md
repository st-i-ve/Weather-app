# API Debugging & Testing Guide

## Overview
I created comprehensive debugging mechanisms to test both AI and Weather services after migrating from client-side API keys to secure server-side implementation.

## What Was Fixed

### Original Problem
- Weather app was returning "Unexpected token '<', '<!DOCTYPE'..." error
- API keys were exposed on client-side (security risk)
- Serverless functions weren't working in local development

### Solution Implemented
1. **Created Local API Server** (`local-api-server.js`)
   - Runs on `http://localhost:3002`
   - Handles both `/api/weather` and `/api/ai-chat` endpoints
   - Securely manages API keys server-side
   - Provides detailed logging for debugging

2. **Updated Service Files**
   - Modified `src/Service/weatherService.js` to call local server
   - Modified `src/Service/AIservice.js` to call local server
   - Removed client-side luxon dependency

3. **Created Testing Tools**
   - `test-both-apis.js` - Comprehensive API testing script
   - `test-apis.html` - Web-based debugging interface
   - Detailed logging and error handling

## How to Use the Debugging Tools

### 1. Start the Local API Server
```bash
node local-api-server.js
```
**Expected Output:**
```
🚀 Local API server running on http://localhost:3002
📋 Available endpoints:
  POST /api/weather - Weather data
  POST /api/ai-chat - AI chat responses

🔧 Environment variables:
  WEATHER_API_KEY: ✅ Set
  GEMINI_API_KEY: ✅ Set
```

### 2. Start the React Development Server
```bash
npm start
```
**Expected Output:**
```
Local: http://localhost:3001
webpack compiled successfully
```

### 3. Run the Comprehensive Test Script
```bash
node test-both-apis.js
```
**Expected Output:**
```
🚀 Starting API Tests
🔗 API Base URL: http://localhost:3002

🌤️ Testing Weather API...
==================================================
📤 Sending request: {
  "q": "London",
  "units": "metric"
}
📥 Response status: 200
✅ Weather data received successfully!
📊 Current weather: {
  location: 'London, GB',
  temperature: '23°C',
  condition: 'Clouds',
  humidity: '33%',
  windSpeed: '4.83 m/s'
}

🤖 Testing AI API...
==================================================
📤 Sending AI request with weather context for: London
✅ AI response received successfully!
🤖 AI Response:
----------------------------------------
Given the cloudy skies, 23°C temperature, and 33% humidity...
----------------------------------------

🎉 All tests completed successfully!
✅ Weather API: Working
✅ AI API: Working
✅ Integration: Working
```

### 4. Use Web-Based Testing Interface
Open: `http://localhost:3001/test-apis.html`

- Click "Test Weather API" to test weather service
- Click "Test AI API" to test AI chat service
- View detailed logs in browser console

## API Server Logs

The local API server provides detailed logging:

**Weather API Call:**
```
🌤️ Weather API called: { searchParams: { q: 'London', units: 'metric' } }
✅ Weather data fetched successfully
```

**AI API Call:**
```
🤖 AI Chat API called: {
  chatMessages: [...],
  deriveddata: {...},
  units: 'metric'
}
✅ AI response generated successfully
```

## Environment Variables Required

Create `.env.local` file with:
```
WEATHER_API_KEY=your_openweather_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Troubleshooting

### Common Issues

1. **"Cannot connect to local server"**
   - Ensure `local-api-server.js` is running on port 3002
   - Check if environment variables are set

2. **"API key missing" errors**
   - Verify `.env.local` file exists and contains valid keys
   - Restart the local API server after adding keys

3. **CORS errors**
   - Local API server includes CORS headers
   - Ensure React app is running on port 3001

4. **Module import errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that luxon is removed from client-side imports

## Files Created/Modified

### New Files:
- `local-api-server.js` - Local development API server
- `test-both-apis.js` - Comprehensive testing script
- `test-apis.html` - Web-based testing interface
- `DEBUG_TESTING_GUIDE.md` - This guide

### Modified Files:
- `src/Service/weatherService.js` - Updated to use local server
- `src/Service/AIservice.js` - Updated to use local server

## Success Indicators

✅ **Weather API Working:**
- Returns current weather data with temperature, humidity, wind
- Includes 5-day daily forecast
- Includes 5-hour hourly forecast

✅ **AI API Working:**
- Accepts chat messages and weather context
- Returns relevant farming advice
- Maintains conversation history

✅ **Integration Working:**
- Weather data flows to AI for contextual responses
- No CORS or authentication errors
- Proper error handling and logging

## Next Steps for Production

For Vercel deployment:
1. Use the `/api` folder serverless functions
2. Set environment variables in Vercel dashboard
3. Update service files to use relative `/api/` paths
4. Remove local server references

The debugging tools created here ensure both services work perfectly in development and can be easily deployed to production.