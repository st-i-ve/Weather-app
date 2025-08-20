# Weather App with AI Chat

A React-based weather application with AI-powered chat functionality that seamlessly works in both local development and Vercel production environments.

## Features

- 🌤️ Real-time weather data from OpenWeatherMap API
- 🤖 AI-powered chat using Google Gemini API
- 🔄 Automatic environment detection (local vs production)
- 🔒 Secure server-side API key handling
- 📱 Responsive design with modern UI

## Architecture

### Serverless Fallback Mechanism

This project implements a hybrid approach that allows serverless functions to work seamlessly in both local development and Vercel production:

- **Production (Vercel)**: Uses native Vercel serverless functions in `/api` directory
- **Local Development**: Uses Express server that wraps the same serverless functions
- **Automatic Detection**: Environment-aware configuration switches between endpoints automatically

### Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── ai-chat.js         # AI chat endpoint
│   └── weather.js         # Weather data endpoint
├── server/                # Local development server
│   └── local-api.js       # Express server wrapping API functions
├── src/
│   ├── Service/           # API service layer
│   │   ├── AIservice.js   # AI chat service
│   │   └── weatherService.js # Weather service
│   ├── utils/
│   │   └── apiConfig.js   # Environment detection utility
│   └── Components/        # React components
└── .env.example          # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   WEATHER_API_KEY=your_weather_api_key_here
   NODE_ENV=development
   LOCAL_API_PORT=3001
   ```

4. **Get API Keys**
   - **OpenWeatherMap**: Sign up at [openweathermap.org](https://openweathermap.org/api)
   - **Google Gemini**: Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Development

**Start both servers simultaneously:**
```bash
npm run dev
```

This command runs:
- React development server on `http://localhost:3000`
- Local API server on `http://localhost:3001`

**Alternative commands:**
```bash
# Start only React app (requires Vercel deployment for APIs)
npm start

# Start only local API server
npm run dev:api

# Build for production
npm run build

# Run tests
npm test
```

### Deployment

**Deploy to Vercel:**

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `WEATHER_API_KEY`
3. Deploy - no code changes needed!

The application automatically detects the Vercel environment and uses the appropriate API endpoints.

## How It Works

### Environment Detection

The `src/utils/apiConfig.js` utility automatically detects the environment:

```javascript
// Detects if running locally vs on Vercel
const isLocal = !process.env.VERCEL && process.env.NODE_ENV === 'development';
const API_BASE_URL = isLocal ? 'http://localhost:3001' : '';
```

### API Services

Both weather and AI services use the same `apiRequest` wrapper that handles:
- Automatic endpoint routing
- Error handling
- JSON parsing
- CORS headers

### Local Development Server

The Express server (`server/local-api.js`) dynamically imports and wraps your Vercel API functions:

```javascript
// Dynamically imports api/weather.js and serves it locally
const weatherHandler = await import('../api/weather.js');
app.post('/api/weather', (req, res) => {
  weatherHandler.default(req, res);
});
```

## API Endpoints

### Weather API
- **Endpoint**: `POST /api/weather`
- **Purpose**: Fetch weather data from OpenWeatherMap
- **Security**: API key handled server-side

### AI Chat API
- **Endpoint**: `POST /api/ai-chat`
- **Purpose**: Generate AI responses using Google Gemini
- **Security**: API key handled server-side

## Security Features

- ✅ API keys never exposed to client-side code
- ✅ Server-side validation and error handling
- ✅ CORS protection in local development
- ✅ Environment-based configuration

## Troubleshooting

### Common Issues

1. **API calls failing locally**
   - Ensure local API server is running (`npm run dev:api`)
   - Check `.env.local` file exists with correct API keys
   - Verify `NODE_ENV=development` in `.env.local`

2. **CORS errors**
   - Make sure you're using `npm run dev` (not just `npm start`)
   - Check that local API server is running on port 3001

3. **Environment variables not loading**
   - File must be named `.env.local` (not `.env`)
   - Restart development servers after changing environment variables

### Development vs Production

| Environment | React App | API Server | API Endpoint |
|-------------|-----------|------------|-------------|
| Local | localhost:3000 | localhost:3001 | http://localhost:3001/api/* |
| Vercel | your-app.vercel.app | Serverless | /api/* |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in both local and production environments
5. Submit a pull request

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
