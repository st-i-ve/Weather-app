
// i updated this to call the serverless function instead of directly using API keys
// this ensures api keys stay secure on the server side

export const getdataThroughai = async (chatMessages, deriveddata, units) => {
  try {
    // i use the local API server for development
    const response = await fetch('http://localhost:3002/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatMessages,
        deriveddata,
        units
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw error;
  }
};

export default getdataThroughai;
