# API Migration Guide

## Overview
The API folder has been moved outside the `src` directory to prevent API keys from being bundled in the client-side code during Vercel deployment. This improves security by keeping sensitive credentials server-side only.

## Changes Made

### 1. Project Structure
```
Weather-app/
├── api/                    # NEW: Serverless functions (server-side)
│   ├── ai-chat.js         # Handles AI chat requests
│   └── weather.js         # Handles weather API requests
├── src/
│   └── api/               # UPDATED: Client-side service files
│       ├── AIservice.js   # Now calls /api/ai-chat endpoint
│       └── weatherService.js # Now calls /api/weather endpoint
└── vercel.json            # NEW: Vercel configuration
```

### 2. Environment Variables

#### Before (Client-side - INSECURE)
```env
REACT_APP_GEMINI_API_KEY=your_key_here
REACT_APP_WEATHER_API_KEY=your_key_here
```

#### After (Server-side - SECURE)
```env
GEMINI_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
```

### 3. How It Works

1. **Client-side code** (React components) calls internal API endpoints:
   - `/service/ai-chat` for AI responses
   - `/service/weather` for weather data

2. **Serverless functions** handle the actual API calls:
   - API keys are stored securely on the server
   - External API calls are made server-side
   - Responses are returned to the client

## Setup Instructions

### Local Development
1. Copy `.env.example` to `.env.local`
2. Add your actual API keys to `.env.local`
3. The serverless functions will run locally during development

### Vercel Deployment
1. In your Vercel dashboard, go to Project Settings > Environment Variables
2. Add the following variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `WEATHER_API_KEY`: Your OpenWeatherMap API key
3. Deploy your project - API keys will be secure server-side

## Benefits

✅ **Security**: API keys are never exposed in client-side bundles
✅ **Performance**: Smaller client bundle size
✅ **Scalability**: Serverless functions scale automatically
✅ **Monitoring**: Better error tracking and logging server-side
✅ **Rate Limiting**: Can implement server-side rate limiting if needed

## Migration Notes

- All existing functionality remains the same from the user perspective
- Error handling is preserved and improved
- The chat widget and weather features work identically
- No changes needed to component logic or UI