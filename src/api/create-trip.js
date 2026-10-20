import { GoogleGenerativeAI } from "@google/generative-ai";
import { account, config, tableDB } from "../appwrite/config";
import { ID } from "appwrite";
import { generateTrip } from "../appwrite/trip";

export const createTrip = async (formData) => {
  const { country, group, duration, travel, interests, budget } = formData;

  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const unsplashAccessKey = config.unsplashAccessKey;

  try {
    const prompt = `Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travel}'
        GroupType: '${group}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${duration},
        "budget": "${budget}",
        "travelStyle": "${travel}",
        "country": "${country}",
        "interests": ${interests},
        "groupType": "${group}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const textResult = await model.generateContent(prompt);
    const responseText = textResult.response.text();

    const trip = JSON.parse(
      responseText.replace(/^```(?:json)?\s*|\s*```$/g, "").trim(),
    );

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        `${country} ${travel} travel destinations`,
      )}&per_page=3&client_id=${unsplashAccessKey}`,
    );

    if (!imageResponse.ok) {
      throw new Error("Failed to fetch Unsplash images");
    }

    const imageData = await imageResponse.json();

    const imageUrls = imageData.results
      .slice(0, 3)
      .map((image) => image.urls.regular);

    const result = await generateTrip({ trip, imageUrls })

    return result;
  } catch (error) {
    console.error("Error generating trip:", error);
    throw error;
  }
};
