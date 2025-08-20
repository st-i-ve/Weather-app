// i created this test script to debug the weather service with detailed logging
// this helps identify exactly where the issue occurs

const testWeather = async () => {
  console.log('🌤️ Testing Weather Service...');
  
  try {
    // i simulate the search parameters that would normally be used
    const mockSearchParams = {
      q: 'London',
      units: 'metric'
    };
    
    console.log('📤 Sending request to /api/weather...');
    console.log('Data:', { mockSearchParams });
    
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchParams: mockSearchParams
      })
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 Raw response (first 500 chars):', responseText.substring(0, 500));
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ Weather Data Summary:');
    console.log('  City:', data.name);
    console.log('  Temperature:', data.temp + '°C');
    console.log('  Conditions:', data.details);
    console.log('  Humidity:', data.humidity + '%');
    
  } catch (error) {
    console.error('❌ Weather Test Failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
};

// i run the test when this script is executed
testWeather();