// i created this serverless function to handle AI chat requests securely
// api keys stay server-side and aren't exposed in the client bundle

export default async function handler(req, res) {
  // i only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chatMessages, deriveddata, units } = req.body;
    
    // i get the gemini api key from server environment variables
    const geminiAPI = process.env.GEMINI_API_KEY;
    
    if (!geminiAPI) {
      throw new Error("Gemini API key not found. Please set GEMINI_API_KEY in your environment variables.");
    }

    const messages = chatMessages ?? [];

    // i build proper conversation history for gemini's multi-turn format
    const contents = [];
    
    // i add the system prompt as the first message
    const systemPrompt = `You are a friendly agricultural assistant helping farmers in ${deriveddata.name}. Current weather conditions: ${deriveddata.details}, ${Math.round(deriveddata.temp)}°${units === 'metric' ? 'C' : 'F'}, humidity ${deriveddata.humidity}%.

IMPORTANT CONTEXT RULES:
- Remember our entire conversation history
- Don't repeat information you've already shared
- Build on previous responses naturally
- Keep responses conversational and brief (4-5 sentences max)
- Only provide detailed forecasts when specifically asked
- Focus on practical farming advice based on current and upcoming weather

Weather Data Available:
${JSON.stringify(deriveddata, null, 2)}

Respond as a knowledgeable but casual farming advisor who remembers what we've discussed.`;
    
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    
    contents.push({
      role: "model", 
      parts: [{ text: "Hello! I'm here to help with your farming needs based on the current weather conditions in your area. What would you like to know?" }]
    });
    
    // i add conversation history in proper format, skipping the initial greeting
    messages.slice(1).forEach((messageObject) => {
      if (messageObject.sender === "user") {
        contents.push({
          role: "user",
          parts: [{ text: messageObject.text }]
        });
      } else if (messageObject.sender === "responder") {
        contents.push({
          role: "model",
          parts: [{ text: messageObject.text }]
        });
      }
    });

    // i use gemini's proper multi-turn conversation structure
    const apiRequestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
        topP: 0.8
      }
    };

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": geminiAPI,
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || 'Failed to fetch response'}`);
    }

    const data = await response.json();
    // i extract the response from gemini's format
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Error in AI chat endpoint:", error);
    res.status(500).json({ error: error.message || "Failed to process AI request" });
  }
}