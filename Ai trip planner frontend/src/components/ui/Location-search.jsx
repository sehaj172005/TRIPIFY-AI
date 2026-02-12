import React, { useState } from "react";

const LocationSearch = ({ onPlaceSelect }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=8`,
      );
      const data = await response.json();
      setSuggestions(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (location) => {
    setSearch(location.display_name);

    // Create a place object similar to Google Places format
    const placeObject = {
      formatted_address: location.display_name,
      geometry: {
        location: {
          lat: () => parseFloat(location.lat),
          lng: () => parseFloat(location.lon),
        },
      },
    };

    onPlaceSelect("location", placeObject);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search destination..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
          <div className="p-3 text-gray-500 text-center">Searching...</div>
        </div>
      )}

      {isOpen && suggestions.length > 0 && !loading && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors"
            >
              <p className="text-sm font-medium text-gray-800">
                {suggestion.display_name}
              </p>
              {suggestion.type && (
                <p className="text-xs text-gray-500 mt-1">
                  Type: {suggestion.type}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && suggestions.length === 0 && !loading && search.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
          <div className="p-3 text-gray-500 text-center">
            No locations found
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
