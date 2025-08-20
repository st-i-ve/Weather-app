
// i updated this to use the automatic api configuration for local/production environments
// this ensures api keys stay secure and works both locally and on vercel

import { apiRequest } from '../utils/apiConfig';

const getdataThroughai = async (chatMessages, deriveddata, units) => {
  try {
    const data = await apiRequest('/api/ai-chat', {
      method: 'POST',
      body: JSON.stringify({
        chatMessages,
        deriveddata,
        units
      })
    });
    
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};

export default getdataThroughai;
