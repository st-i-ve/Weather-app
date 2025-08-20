// i created this test script to debug the ai service with detailed logging
// this helps identify exactly where the issue occurs

const testAI = async () => {
  console.log('🧪 Testing AI Service...');
  
  try {
    // i simulate the data that would normally come from the weather service
    const mockWeatherData = {
      name: 'Test City',
      details: 'Clear',
      temp: 25,
      humidity: 60,
      speed: 10
    };
    
    const mockMessages = [
      { text: 'Hello, what should I plant today?', sender: 'user' }
    ];
    
    console.log('📤 Sending request to /api/ai-chat...');
    console.log('Data:', { mockMessages, mockWeatherData, units: 'metric' });
    
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatMessages: mockMessages,
        deriveddata: mockWeatherData,
        units: 'metric'
      })
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ AI Response:', data.response);
    
  } catch (error) {
    console.error('❌ AI Test Failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
};

// i run the test when this script is executed
testAI();