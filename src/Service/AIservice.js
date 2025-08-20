
// i updated this to call the serverless function instead of directly using API keys
// this ensures api keys stay secure on the server side

const getdataThroughai = async (chatMessages, deriveddata, units) => {
  try {
    const response = await fetch('/api/ai-chat', {
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};

export default getdataThroughai;
