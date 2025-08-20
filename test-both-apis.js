// i created this comprehensive test script to verify both AI and weather services
// this helps confirm everything is working properly with detailed debugging

// i use dynamic import for node-fetch ES module
let fetch;

const API_BASE = 'http://localhost:3002';

// i test the weather API first
async function testWeatherAPI() {
  console.log('\n🌤️ Testing Weather API...');
  console.log('=' .repeat(50));
  
  try {
    const searchParams = {
      q: 'London',
      units: 'metric'
    };
    
    console.log('📤 Sending request:', JSON.stringify(searchParams, null, 2));
    
    const response = await fetch(`${API_BASE}/api/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchParams }),
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Weather data received successfully!');
    console.log('📊 Current weather:', {
      location: `${data.name}, ${data.country}`,
      temperature: `${Math.round(data.temp)}°C`,
      condition: data.details,
      humidity: `${data.humidity}%`,
      windSpeed: `${data.speed} m/s`
    });
    console.log('📊 Forecast data:', {
      dailyForecast: data.daily?.length || 0,
      hourlyForecast: data.hourly?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error('❌ Weather API test failed:', error.message);
    throw error;
  }
}

// i test the AI API with weather context
async function testAIAPI(weatherData) {
  console.log('\n🤖 Testing AI API...');
  console.log('=' .repeat(50));
  
  try {
    const chatMessages = [
      {
        sender: 'user',
        text: 'What farming advice do you have based on current weather?'
      }
    ];
    
    const requestData = {
      chatMessages,
      deriveddata: weatherData,
      units: 'metric'
    };
    
    console.log('📤 Sending AI request with weather context for:', weatherData.name);
    console.log('📤 User message:', chatMessages[0].text);
    
    const response = await fetch(`${API_BASE}/api/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ AI response received successfully!');
    console.log('🤖 AI Response:');
    console.log('-' .repeat(40));
    console.log(data.response);
    console.log('-' .repeat(40));
    
    return data.response;
  } catch (error) {
    console.error('❌ AI API test failed:', error.message);
    throw error;
  }
}

// i run both tests sequentially
async function runAllTests() {
  console.log('🚀 Starting API Tests');
  console.log('🔗 API Base URL:', API_BASE);
  
  try {
    // i test weather API first to get data for AI context
    const weatherData = await testWeatherAPI();
    
    // i test AI API with the weather data as context
    await testAIAPI(weatherData);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Weather API: Working');
    console.log('✅ AI API: Working');
    console.log('✅ Integration: Working');
    
  } catch (error) {
    console.log('\n💥 Test suite failed!');
    console.error('Final error:', error.message);
    process.exit(1);
  }
}

// i check if the local server is running first
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/weather`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchParams: { q: 'test' } })
    });
    return true;
  } catch (error) {
    console.error('❌ Local API server not responding!');
    console.error('💡 Make sure to run: node local-api-server.js');
    return false;
  }
}

// i start the test suite
(async () => {
  // i initialize fetch with dynamic import
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;
  
  console.log('🔍 Checking server health...');
  const serverRunning = await checkServerHealth();
  
  if (serverRunning) {
    await runAllTests();
  } else {
    console.log('\n🛑 Cannot run tests - server not available');
    process.exit(1);
  }
})();