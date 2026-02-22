import axios from "axios";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_APP_UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_APP_PEXELS_API_KEY;

// ─── Unsplash (Primary) ───────────────────────────────────────────────────────

/**
 * Fetch a location-accurate image from Unsplash.
 * @param {string} query  - Search term (place name, hotel name, etc.)
 * @param {Object} options - { location, type: "hotel"|"landmark"|"place"|"attraction" }
 * @returns {string} image URL or ""
 */
const fetchFromUnsplash = async (query, options = {}) => {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY_HERE") return null;

  const buildQueries = () => {
    const { location, type } = options;
    if (type === "hotel") {
      return location
        ? [`${query} ${location} hotel`, `${query} hotel`, `${location} luxury hotel`]
        : [`${query} hotel`, `${query}`];
    }
    if (["landmark", "attraction", "place"].includes(type)) {
      return location
        ? [`${query} ${location}`, `${query} landmark`, `${query}`]
        : [`${query} landmark`, `${query}`];
    }
    return location ? [`${query} ${location}`, `${query}`] : [`${query}`];
  };

  for (const q of buildQueries()) {
    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: { query: q, per_page: 5, orientation: "landscape" },
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      });

      const photos = res.data?.results;
      if (photos && photos.length > 0) {
        const best = photos.sort(
          (a, b) => b.width * b.height - a.width * a.height
        )[0];
        const url = best.urls.regular;
        return url;
      }
    } catch (err) {
      // silently continue to next query
    }
  }
  return null;
};

// ─── Pexels (Fallback) ────────────────────────────────────────────────────────

/**
 * Fallback to Pexels if Unsplash fails or has no key.
 */
const fetchFromPexels = async (query, options = {}) => {
  if (!PEXELS_API_KEY) return null;

  const buildQueries = () => {
    const { location, type } = options;
    if (type === "hotel") {
      return location
        ? [`${query} ${location}`, `${query} luxury hotel`, `${location} luxury hotel`, query]
        : [`${query} luxury hotel`, query];
    }
    if (["landmark", "attraction", "place"].includes(type)) {
      return location
        ? [`${query} ${location}`, `${query} attraction`, query]
        : [`${query} landmark`, query];
    }
    return location ? [`${query} ${location}`, query] : [query];
  };

  for (const q of buildQueries()) {
    try {
      const res = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: PEXELS_API_KEY } }
      );

      const photos = res.data?.photos;
      if (photos && photos.length > 0) {
        const best = photos.sort((a, b) => b.width * b.height - a.width * a.height)[0];
        return best.src.large;
      }
    } catch (err) {
      // silently continue to next query
    }
  }
  return null;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch a single location-accurate image.
 * Tries Unsplash first (better quality & accuracy), falls back to Pexels.
 *
 * @param {string} query  - Search term
 * @param {Object} options - { location, type }
 * @returns {Promise<string>} Image URL or ""
 */
export const getUnsplashImage = async (query, options = {}) => {
  if (!query) return "";

  const unsplashUrl = await fetchFromUnsplash(query, options);
  if (unsplashUrl) return unsplashUrl;

  const pexelsUrl = await fetchFromPexels(query, options);
  if (pexelsUrl) return pexelsUrl;

  return "";
};

/**
 * Fetch images for multiple queries in parallel.
 * Returns a map of query => imageUrl.
 *
 * @param {string[]} queries - Array of search terms
 * @param {Object}   options - { location, type }
 * @returns {Promise<Object>}
 */
export const getUnsplashImages = async (queries = [], options = {}) => {
  const normalized = Array.isArray(queries) ? queries : [queries];
  if (normalized.length === 0) return {};

  const imageMap = {};
  await Promise.all(
    normalized.map(async (query) => {
      imageMap[query] = await getUnsplashImage(query, options);
    })
  );
  return imageMap;
};
