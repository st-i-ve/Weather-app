// i created this local development server to mimic vercel's api structure
// it automatically serves the same endpoints locally during development

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.LOCAL_API_PORT || 3001;

// i enable cors and json parsing for the local api server
app.use(cors());
app.use(express.json());

// i dynamically import and wrap the vercel api functions for local use
const createLocalHandler = (apiFunction) => {
  return async (req, res) => {
    try {
      // i create a mock vercel request/response object
      const mockReq = {
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers
      };
      
      const mockRes = {
        status: (code) => {
          res.status(code);
          return mockRes;
        },
        json: (data) => {
          res.json(data);
          return mockRes;
        },
        send: (data) => {
          res.send(data);
          return mockRes;
        }
      };
      
      await apiFunction.default(mockReq, mockRes);
    } catch (error) {
      console.error('Local API Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// i dynamically load the api functions
const loadApiRoutes = async () => {
  try {
    // i import the weather api function
    const weatherApi = await import('../api/weather.js');
    app.post('/api/weather', createLocalHandler(weatherApi));
    
    // i import the ai chat api function
    const aiChatApi = await import('../api/ai-chat.js');
    app.post('/api/ai-chat', createLocalHandler(aiChatApi));
    
    console.log('✅ API routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading API routes:', error);
    process.exit(1);
  }
};

// i start the server and load routes
const startServer = async () => {
  await loadApiRoutes();
  
  app.listen(PORT, () => {
    console.log(`🚀 Local API server running on http://localhost:${PORT}`);
    console.log(`📡 Weather API: http://localhost:${PORT}/api/weather`);
    console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/ai-chat`);
  });
};

startServer();

// i handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down local API server...');
  process.exit(0);
});