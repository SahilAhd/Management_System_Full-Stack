// LMS/frontend/src/api/chatApi.js

// This file is responsible for making API calls from your frontend
// to your OWN backend server, NOT directly to Google's Gemini API.

export async function getAiResponse(userPrompt, conversationHistory) {
  try {
    // IMPORTANT: The URL here should point to your backend.
    // If your frontend is served from http://localhost:3000 (React default)
    // and your backend is on http://localhost:5002,
    // and you've set up a proxy in frontend/package.json: "proxy": "http://localhost:5002",
    // then you can just use '/api/chat'.
    // Otherwise, use the full URL: 'http://localhost:5002/api/chat'
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the current user's prompt and the full conversation history
      body: JSON.stringify({ userPrompt, conversationHistory }),
    });

    // Check if the network request was successful (status 2xx)
    if (!response.ok) {
      // If backend sent an error, it will likely be in JSON format
      const errorData = await response.json();
      // Throw an error with a message from the backend for the frontend to catch
      throw new Error(errorData.message || 'Error communicating with the AI service.');
    }

    // Parse the JSON response from your backend (which contains Gemini's text)
    const data = await response.json();
    // Return just the text content from the AI's response
    return data.text;
  } catch (error) {
    console.error("Frontend API call to backend failed:", error);
    // Provide a user-friendly error message if the API call itself fails
    return `Sorry, I'm unable to connect to the AI right now. Please check your internet connection or try again later. (Error: ${error.message})`;
  }
}