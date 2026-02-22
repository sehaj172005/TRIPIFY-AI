import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LocationSearch = ({ onPlaceSelect }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (value) => {
    setLoading(true);
    try {
      // Photon (by Komoot) — OpenStreetMap data, no CORS, no API key needed
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=7&lang=en`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
      setIsOpen((data.features || []).length > 0);
    } catch (err) {
      console.error("Location search error:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (value) => {
    setSearch(value);
    setSelected(false);

    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      if (value.length === 0) {
        onPlaceSelect("location", { formatted_address: "" });
      }
      return;
    }

    // Debounce — wait 400ms after user stops typing
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 400);
  };

  const handleSelect = (feature) => {
    const props = feature.properties || {};
    const parts = [props.name, props.city || props.town || props.village, props.state, props.country].filter(Boolean);
    const label = parts.join(", ") || props.name || "Unknown location";

    setSearch(label);
    setSelected(true);
    setIsOpen(false);
    setSuggestions([]);

    const [lng, lat] = feature.geometry?.coordinates || [0, 0];
    const placeObject = {
      formatted_address: label,
      geometry: {
        location: {
          lat: () => lat,
          lng: () => lng,
        },
      },
    };
    onPlaceSelect("location", placeObject);
  };

  const handleClear = () => {
    setSearch("");
    setSelected(false);
    setSuggestions([]);
    setIsOpen(false);
    onPlaceSelect("location", { formatted_address: "" });
  };

  // Format a readable short label from Photon GeoJSON properties
  const getShortLabel = (feature) => {
    const p = feature.properties || {};
    const parts = [p.name, p.city || p.town || p.village, p.state, p.country].filter(Boolean);
    return parts.join(", ") || "Unknown";
  };

  const getSubLabel = (feature) => {
    const p = feature.properties || {};
    return [p.street, p.postcode, p.country].filter(Boolean).join(", ");
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search for a city or destination..."
          value={search}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {/* Right icon: spinner or clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-gray-400 text-base" />
          ) : search.length > 0 ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              title="Clear"
            >
              <FaTimes />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && !loading && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl max-h-72 overflow-y-auto">
          {suggestions.map((feature, i) => (
            <button
              key={i}
              onClick={() => handleSelect(feature)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors flex items-start gap-3"
            >
              <FaMapMarkerAlt className="text-blue-400 mt-1 shrink-0 text-sm" />
              <div>
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {getShortLabel(feature)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                  {getSubLabel(feature)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && suggestions.length === 0 && !loading && search.length >= 2 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl p-4 text-center text-sm text-gray-400">
          No destinations found for "<span className="font-medium">{search}</span>"
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
