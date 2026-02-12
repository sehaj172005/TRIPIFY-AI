const example = `
{
  "hotelOptions": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string",
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

/**
 * Get AI-generated travel plan using Puter.js SDK
 */
export async function getTravelPlan({ location, days, budget, traveler }) {
  const prompt = `
You are an expert travel planner. Generate a detailed travel plan in VALID JSON format ONLY (no markdown, no extra text).

The JSON must match this exact structure:
${example}

Requirements:
- Location: ${location}
- Duration: ${days} days
- Budget: ${budget}
- Travelers: ${traveler}
- Return ONLY valid JSON, no markdown, no code fences, no commentary
- MUST include AT LEAST 3 hotel recommendations (minimum 3, maximum 5)
- Hotel prices and ratings must be realistic
- Each hotel must have unique pricing and characteristics (budget, mid-range, luxury)
- Each day must have 3-4 places to visit
- Best time to visit should be specific (morning/afternoon/evening)

Generate the travel plan now in JSON format only:
`.trim();

  console.log("🚀 GENERATING TRIP WITH PUTER.JS...");
  console.log("Location:", location, "| Days:", days, "| Budget:", budget);

  try {
    // Use Puter.js SDK directly (no HTTP calls, no API keys)
    const response = await window.puter.ai.chat(prompt, {
      model: "gpt-4o-mini",
    });

    console.log("✅ Puter.js Response received");

    const text = typeof response === "string" ? response : response.toString();

    // Remove any markdown code fences if present
    const cleanedText = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleanedText);

    // Validate schema
    if (
      !Array.isArray(parsed.hotelOptions) ||
      typeof parsed.itinerary !== "object" ||
      typeof parsed.bestTimeToVisit !== "string"
    ) {
      throw new Error("Invalid JSON structure returned by AI.");
    }

    console.log("✨ Trip plan generated successfully!");
    return parsed;
  } catch (err) {
    console.error("❌ Trip Generation Error:", err.message);
    throw new Error("Failed to generate travel plan. Please try again later.");
  }
}

export default getTravelPlan;
