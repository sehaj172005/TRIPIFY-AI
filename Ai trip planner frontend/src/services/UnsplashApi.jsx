import axios from "axios";

const PEXELS_API_KEY = import.meta.env.VITE_APP_PEXELS_API_KEY;

console.log("🔑 Pexels API Key available:", !!PEXELS_API_KEY);

/**
 * Fetch image URL from Pexels for a given query
 * @param {string} query - Search query (hotel name, place name, etc.)
 * @param {Object} options - Optional configuration
 * @param {string} options.location - Location/city context (e.g., "Delhi")
 * @param {string} options.type - Type of search (e.g., "landmark", "hotel", "attraction")
 * @returns {string} Image URL or empty string if not found
 */
export const getUnsplashImage = async (query, options = {}) => {
  if (!PEXELS_API_KEY) {
    console.warn("⚠️ Pexels API key not configured in .env");
    return "";
  }

  if (!query) {
    console.warn("⚠️ No query provided to getUnsplashImage");
    return "";
  }

  // Build multiple search strategies with increasing specificity
  const searchStrategies = [];

  if (options.type === "hotel") {
    // For hotels, try more specific searches to differentiate between hotels
    if (options.location) {
      searchStrategies.push(`${query} ${options.location}`);
      searchStrategies.push(`${query} luxury hotel`);
      searchStrategies.push(`${query} 5 star`);
      searchStrategies.push(`${options.location} luxury hotel`);
      searchStrategies.push(`${query}`);
    } else {
      searchStrategies.push(`${query} luxury hotel`);
      searchStrategies.push(`${query}`);
    }
  } else if (
    options.type === "landmark" ||
    options.type === "attraction" ||
    options.type === "place"
  ) {
    // For landmarks/attractions, be more specific
    if (options.location) {
      searchStrategies.push(`${query} ${options.location}`);
      searchStrategies.push(`${query} attraction`);
      searchStrategies.push(`${query}`);
    } else {
      searchStrategies.push(`${query} landmark`);
      searchStrategies.push(`${query}`);
    }
  } else {
    // Default strategy
    if (options.location) {
      searchStrategies.push(`${query} ${options.location}`);
      searchStrategies.push(`${query}`);
    } else {
      searchStrategies.push(`${query}`);
    }
  }

  // Try each search strategy until we find results
  for (const searchQuery of searchStrategies) {
    try {
      console.log(`🔍 Trying: "${searchQuery}"`);

      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        },
      );

      if (response.data.photos && response.data.photos.length > 0) {
        // For hotels, randomize selection to get different images
        let selectedPhoto = response.data.photos[0];
        if (options.type === "hotel" && response.data.photos.length > 1) {
          // Vary the selection to avoid similar images
          const randomIndex = Math.floor(
            Math.random() * Math.min(3, response.data.photos.length),
          );
          selectedPhoto = response.data.photos[randomIndex];
        } else {
          // Pick the best image (prefer higher quality/resolution)
          selectedPhoto = response.data.photos.sort(
            (a, b) => b.width * b.height - a.width * a.height,
          )[0];
        }
        const imageUrl = selectedPhoto.src.large;
        console.log("✅ Image found with query:", searchQuery);
        return imageUrl;
      }
    } catch (error) {
      console.error(`❌ Error with query "${searchQuery}":`, error.message);
      continue;
    }
  }

  console.warn(`⚠️ No results found for any strategy for: "${query}"`);
  return "";
};

/**
 * Fetch images for multiple queries in parallel
 * @param {string[]} queries - Array of search queries
 * @param {Object} options - Optional configuration (location, type)
 * @returns {Promise<Object>} Map of query => imageUrl
 */
export const getUnsplashImages = async (queries = [], options = {}) => {
  if (!PEXELS_API_KEY) {
    console.warn("⚠️ Pexels API key not configured");
    return {};
  }

  const normalizedQueries = Array.isArray(queries) ? queries : [queries];
  if (normalizedQueries.length === 0) {
    console.warn("⚠️ No queries provided to getUnsplashImages");
    return {};
  }

  const imageMap = {};

  // Fetch all images in parallel
  const promises = normalizedQueries.map(async (query) => {
    const url = await getUnsplashImage(query, options);
    imageMap[query] = url;
  });

  await Promise.all(promises);
  return imageMap;
};
