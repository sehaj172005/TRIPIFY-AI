import { GoogleGenAI } from '@google/genai';

const example = `
{
  "hotelOptions": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string",
      "hotelImageUrl": "string",
      "geoCoordinates": {
        "latitude": 0,
        "longitude": 0
      },
      "rating": 0,
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "plan": [
        {
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "string",
          "geoCoordinates": {
            "latitude": 0,
            "longitude": 0
          },
          "ticketPricing": "string",
          "rating": 0,
          "timeTravel": "string",
          "bestTimeToVisit": "string"
        }
      ]
    }
  ],
  "bestTimeToVisit": "string"
}
`.trim();


// Load API Key
const apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Gemini API key missing! Set it in your .env file");
}

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey });

/**
 * Get AI-generated travel plan.
 */
export async function getTravelPlan({ location, days, budget, traveler }) {
  // Final Prompt
  const prompt = `
Your task is to return a valid JSON object that matches this format:

${example}

Generate Travel plan for Location : ${location}, for ${days} for ${traveler }with a ${budget} budget , Give me a Hotel Options (the hotels must be best according to given ${budget}) list with hotelName , hotelAddress , Price , HotelImageurl , geoCoordinates , rating (out of 5) and description and suggest itinerary with PlaceName , PlaceDetails , PlaceImageUrl  , geoCoordinates , ticketPricing , rating , timeTravel each of the location for ${days} with each day plan with best time to visit ( just say morning  afternoon or evening ).
in Json format , no extra commentary not even a single word  only JSON data, don't add any [3,7] or website reference like this i need to use this response no need for this.
Output strictly valid JSON with no markdown, no commentary, and no \`\`\`json fences.
`.trim();

  console.log("PROMPT SENT TO GEMINI ↓↓↓↓↓↓↓↓");
  console.log(prompt);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Switch to gemini-1.5-pro if available
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0, // Avoid hallucination
        topK: 1,
        topP: 1,
        maxOutputTokens: 4096
      }
    });

    let text = response.text.trim();

    // If it includes code fences, remove them
    text = text.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(text);

    // Optional: post-validate hotel addresses
    for (const hotel of parsed.hotelOptions) {
      if (!hotel.hotelAddress.toLowerCase().includes(location.toLowerCase())) {
        console.warn("Hotel may not be in correct location:", hotel.hotelAddress);
      }
    }

    // Basic schema validation
    if (
      !Array.isArray(parsed.hotelOptions) ||
      typeof parsed.itinerary !== 'object' ||
      typeof parsed.bestTimeToVisit !== 'string'
    ) {
      throw new Error('Invalid JSON structure returned by Gemini.');
    }

    return parsed;

  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    throw new Error("Failed to generate travel plan. Please try again later.");
  }
}

export default getTravelPlan;
