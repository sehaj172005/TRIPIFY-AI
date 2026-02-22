// ─────────────────────────────────────────────
//  AI Travel Plan – powered by Groq (FREE tier)
//  Model: llama-3.3-70b-versatile
//  Sign up & get your free key → https://console.groq.com
// ─────────────────────────────────────────────

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// ── Prompt ────────────────────────────────────
function buildPrompt({ location, NoofDays, Budget, traveler }) {
  return `You are an expert travel planner. Generate a detailed travel plan in VALID JSON format ONLY.

STRICT RULES:
- Return ONLY raw JSON — no markdown, no code fences, no comments, no extra text whatsoever.
- The JSON must match the exact schema below — nothing more, nothing less.
- All string values must be non-empty and realistic.
- "rating" must be a number between 1 and 5 (e.g. 4.2).
- "price" should show a realistic per-night cost in USD (e.g. "$80/night").
- "timeTravel" should indicate travel time from the city center (e.g. "10 min by taxi").
- "ticketPricing" should be a realistic cost (e.g. "Free" or "$15/person").
- "bestTimeToVisit" should specify morning/afternoon/evening and a short reason.

TRIP DETAILS:
- Destination: ${location}
- Duration: ${NoofDays} day(s)
- Budget: ${Budget}
- Travelers: ${traveler}

REQUIRED JSON SCHEMA (follow exactly):
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

REQUIREMENTS:
- Include AT LEAST 3 hotel options (budget, mid-range, luxury — different price ranges).
- Include exactly ${NoofDays} day(s) in the itinerary array.
- Each day must have 3–4 places to visit.
- All data must be specific to ${location}.

Output the JSON now:`;
}

// ── JSON Extractor (handles stray markdown) ───
function extractJSON(raw) {
  // 1. Remove markdown fences if accidentally present
  let cleaned = raw
    .replace(/^```(?:json)?/im, "")
    .replace(/```$/im, "")
    .trim();

  // 2. Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // 3. Try to find the outermost { … } block
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch (_) { }
    }
    throw new Error("Could not extract valid JSON from AI response.");
  }
}

// ── Schema Validator ──────────────────────────
function validateSchema(data) {
  if (!Array.isArray(data.hotelOptions) || data.hotelOptions.length < 1) {
    throw new Error("Missing or empty hotelOptions array.");
  }
  if (!Array.isArray(data.itinerary) || data.itinerary.length < 1) {
    throw new Error("Missing or empty itinerary array.");
  }
  if (typeof data.bestTimeToVisit !== "string" || !data.bestTimeToVisit) {
    throw new Error("Missing bestTimeToVisit field.");
  }
  // Validate each hotel
  data.hotelOptions.forEach((hotel, i) => {
    if (!hotel.hotelName || !hotel.hotelAddress || !hotel.price) {
      throw new Error(`Hotel at index ${i} is missing required fields.`);
    }
  });
  // Validate itinerary days
  data.itinerary.forEach((day, i) => {
    if (!Array.isArray(day.plan) || day.plan.length < 1) {
      throw new Error(`Day ${i + 1} has no places in its plan.`);
    }
  });
}

// ── Main Export ───────────────────────────────
export async function getTravelPlan({ location, NoofDays, Budget, traveler }) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    throw new Error(
      "Groq API key is missing. Add VITE_GROQ_API_KEY to your .env file. Get a free key at https://console.groq.com"
    );
  }

  const prompt = buildPrompt({ location, NoofDays, Budget, traveler });

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. You ONLY output raw valid JSON — never markdown, never code fences, never any extra text. Your entire response is always a single valid JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" }, // forces JSON output
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API returned ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("Groq returned an empty response.");
  }

  const parsed = extractJSON(rawText);
  validateSchema(parsed);
  return parsed;
}

export default getTravelPlan;
